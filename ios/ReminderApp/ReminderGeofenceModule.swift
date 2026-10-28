import Foundation
import React

/// JS entry point: keeps the native watch list in sync with the app's reminders.
@objc(ReminderGeofence)
final class ReminderGeofenceModule: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool { true }

  /// CLLocationManager must be used from the main thread.
  @objc var methodQueue: DispatchQueue { .main }

  @objc func sync(_ reminders: [[String: Any]],
                  resolver resolve: @escaping RCTPromiseResolveBlock,
                  rejecter reject: @escaping RCTPromiseRejectBlock) {
    let parsed: [GeofenceReminder] = reminders.compactMap { item in
      guard let id = item["id"] as? String,
            let dueDay = item["dueDay"] as? String,
            let latitude = item["latitude"] as? Double,
            let longitude = item["longitude"] as? Double,
            let radius = item["radius"] as? Double else { return nil }
      return GeofenceReminder(id: id, title: item["title"] as? String ?? "",
                              body: item["body"] as? String ?? "", dueDay: dueDay,
                              latitude: latitude, longitude: longitude, radius: radius)
    }
    let result = GeofenceMonitor.shared.sync(parsed)
    resolve(["watching": result.watching, "error": result.error ?? NSNull()])
  }

  @objc func getStatus(_ resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
    GeofenceMonitor.shared.status { resolve($0) }
  }

  @objc func requestPermissions(_ resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) {
    GeofenceMonitor.shared.requestPermissions { resolve($0) }
  }

  @objc func displayNotification(_ title: String, body: String,
                                 resolver resolve: @escaping RCTPromiseResolveBlock,
                                 rejecter reject: @escaping RCTPromiseRejectBlock) {
    GeofenceMonitor.shared.show(title: title, body: body, identifier: UUID().uuidString) { _ in
      resolve(nil)
    }
  }
}
