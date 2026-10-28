import CoreLocation
import Foundation
import UIKit
import UserNotifications

/// A reminder as the native layer needs it to watch its area and alert.
struct GeofenceReminder: Codable {
  let id: String
  let title: String
  let body: String
  /// Local due date, "yyyy-MM-dd".
  let dueDay: String
  let latitude: Double
  let longitude: Double
  let radius: Double
}

/// Watches reminder areas with iOS region monitoring. iOS delivers entries
/// even when the app is not running, relaunching it in the background, so
/// this must be started at launch. An entry alerts only on the reminder's due
/// date, at most once per reminder and due date.
final class GeofenceMonitor: NSObject, CLLocationManagerDelegate, UNUserNotificationCenterDelegate {
  static let shared = GeofenceMonitor()

  /// iOS monitors at most 20 regions per app.
  private static let maxRegions = 20
  private static let remindersKey = "reminderGeofences.reminders"
  private static let notifiedKey = "reminderGeofences.notified"
  static let soundName = UNNotificationSoundName("reminder_alert.wav")

  private let locationManager = CLLocationManager()
  private let defaults = UserDefaults.standard
  private var authorizationWaiters: [(CLAuthorizationStatus) -> Void] = []

  private override init() {
    super.init()
    locationManager.delegate = self
  }

  /// Call from `application(_:didFinishLaunchingWithOptions:)`.
  func start() {
    UNUserNotificationCenter.current().delegate = self
    registerStored()
  }

  // MARK: - Storage

  static func today() -> String {
    let formatter = DateFormatter()
    formatter.calendar = Calendar(identifier: .gregorian)
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter.string(from: Date())
  }

  private func loadReminders() -> [GeofenceReminder] {
    guard let data = defaults.data(forKey: Self.remindersKey) else { return [] }
    return (try? JSONDecoder().decode([GeofenceReminder].self, from: data)) ?? []
  }

  private func notified() -> Set<String> {
    Set(defaults.stringArray(forKey: Self.notifiedKey) ?? [])
  }

  private func key(for reminder: GeofenceReminder) -> String {
    "\(reminder.id)|\(reminder.dueDay)"
  }

  // MARK: - Watching

  /// Stores the reminders, then watches those that can still alert.
  func sync(_ reminders: [GeofenceReminder]) -> (watching: Int, error: String?) {
    defaults.set(try? JSONEncoder().encode(reminders), forKey: Self.remindersKey)
    let today = Self.today()
    // Alerts for past days can no longer happen.
    let current = notified().filter { ($0.split(separator: "|").last.map(String.init) ?? "") >= today }
    defaults.set(Array(current), forKey: Self.notifiedKey)
    return registerStored()
  }

  @discardableResult
  private func registerStored() -> (watching: Int, error: String?) {
    let today = Self.today()
    let watchable = loadReminders()
      .filter { $0.dueDay >= today }
      .sorted { $0.dueDay < $1.dueDay }
      .prefix(Self.maxRegions)
    let wantedIds = Set(watchable.map(\.id))

    for region in locationManager.monitoredRegions where !wantedIds.contains(region.identifier) {
      locationManager.stopMonitoring(for: region)
    }
    guard !watchable.isEmpty else { return (0, nil) }
    guard CLLocationManager.isMonitoringAvailable(for: CLCircularRegion.self) else {
      return (0, "region_monitoring_unavailable")
    }
    for reminder in watchable {
      let region = CLCircularRegion(
        center: CLLocationCoordinate2D(latitude: reminder.latitude, longitude: reminder.longitude),
        radius: min(reminder.radius, locationManager.maximumRegionMonitoringDistance),
        identifier: reminder.id
      )
      region.notifyOnEntry = true
      region.notifyOnExit = false
      // Re-adding an identifier replaces the old region (e.g. after an edit).
      locationManager.startMonitoring(for: region)
    }
    let error = locationManager.authorizationStatus == .authorizedAlways
      ? nil : "background_location_permission_missing"
    return (watchable.count, error)
  }

  func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) {
    // Gives the work time to finish when iOS launched the app for this event.
    let task = UIApplication.shared.beginBackgroundTask(withName: "ReminderArrival")
    handleEntered(reminderId: region.identifier) {
      UIApplication.shared.endBackgroundTask(task)
    }
  }

  func locationManager(_ manager: CLLocationManager, monitoringDidFailFor region: CLRegion?,
                       withError error: Error) {
    NSLog("[GeofenceMonitor] monitoring failed for %@: %@", region?.identifier ?? "?", "\(error)")
  }

  private func handleEntered(reminderId: String, completion: @escaping () -> Void) {
    guard let reminder = loadReminders().first(where: { $0.id == reminderId }) else {
      NSLog("[GeofenceMonitor] entered %@: no longer watched", reminderId)
      return completion()
    }
    guard reminder.dueDay == Self.today() else {
      NSLog("[GeofenceMonitor] entered %@: due %@, not today", reminderId, reminder.dueDay)
      return completion()
    }
    guard !notified().contains(key(for: reminder)) else {
      NSLog("[GeofenceMonitor] entered %@: already alerted today", reminderId)
      return completion()
    }
    show(title: reminder.title, body: reminder.body, identifier: "reminder-\(key(for: reminder))") {
      [weak self] delivered in
      if delivered, let self {
        self.defaults.set(Array(self.notified().union([self.key(for: reminder)])),
                          forKey: Self.notifiedKey)
      }
      completion()
    }
  }

  // MARK: - Notifications

  /// Delivers immediately; arrival alerts are never scheduled by time.
  func show(title: String, body: String, identifier: String,
            completion: @escaping (Bool) -> Void = { _ in }) {
    let content = UNMutableNotificationContent()
    content.title = title
    content.body = body.isEmpty ? "You've arrived at this reminder's place." : body
    content.sound = UNNotificationSound(named: Self.soundName)
    let request = UNNotificationRequest(identifier: identifier, content: content, trigger: nil)
    UNUserNotificationCenter.current().add(request) { error in
      if let error { NSLog("[GeofenceMonitor] notification failed: %@", "\(error)") }
      completion(error == nil)
    }
  }

  /// Shows alerts while the app is open too.
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification,
                              withCompletionHandler completionHandler:
                              @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.banner, .list, .sound])
  }

  // MARK: - Permissions

  func status(completion: @escaping ([String: Any]) -> Void) {
    UNUserNotificationCenter.current().getNotificationSettings { settings in
      let location: String
      switch self.locationManager.authorizationStatus {
      case .authorizedAlways: location = "always"
      case .authorizedWhenInUse: location = "whenInUse"
      default: location = "denied"
      }
      completion([
        "notifications": settings.authorizationStatus == .authorized
          || settings.authorizationStatus == .provisional,
        "location": location,
      ])
    }
  }

  /// Asks for notifications, then for "Always" location access.
  func requestPermissions(completion: @escaping ([String: Any]) -> Void) {
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in
      DispatchQueue.main.async {
        self.requestAlwaysLocation {
          self.status(completion: completion)
        }
      }
    }
  }

  private func requestAlwaysLocation(completion: @escaping () -> Void) {
    switch locationManager.authorizationStatus {
    case .notDetermined:
      // iOS asks for "While Using" first; "Always" is offered afterwards.
      authorizationWaiters.append { [weak self] _ in self?.requestAlwaysLocation(completion: completion) }
      locationManager.requestWhenInUseAuthorization()
    case .authorizedWhenInUse:
      var finished = false
      let finish = { if !finished { finished = true; completion() } }
      authorizationWaiters.append { _ in finish() }
      locationManager.requestAlwaysAuthorization()
      // iOS shows the upgrade prompt at most once; if it is not shown,
      // no authorization change arrives.
      DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
        if UIApplication.shared.applicationState == .active { finish() }
      }
    default:
      completion()
    }
  }

  func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
    let status = manager.authorizationStatus
    guard status != .notDetermined else { return }
    let waiters = authorizationWaiters
    authorizationWaiters.removeAll()
    waiters.forEach { $0(status) }
    registerStored()
  }
}
