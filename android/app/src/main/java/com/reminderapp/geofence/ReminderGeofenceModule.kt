package com.reminderapp.geofence

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray

/** JS entry point: keeps the native watch list in sync with the app's reminders. */
class ReminderGeofenceModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = NAME

  @ReactMethod
  fun sync(reminders: ReadableArray, promise: Promise) {
    val parsed =
      (0 until reminders.size()).mapNotNull { index ->
        val item = reminders.getMap(index) ?: return@mapNotNull null
        GeofenceReminder(
          id = item.getString("id") ?: return@mapNotNull null,
          title = item.getString("title") ?: "",
          body = item.getString("body") ?: "",
          dueDay = item.getString("dueDay") ?: return@mapNotNull null,
          latitude = item.getDouble("latitude"),
          longitude = item.getDouble("longitude"),
          radius = item.getDouble("radius").toFloat(),
        )
      }
    val context = reactApplicationContext
    ReminderNotifier.ensureChannel(context)
    GeofenceStore.saveReminders(context, parsed)
    GeofenceRegistrar.registerStored(context) { registered, error ->
      promise.resolve(
        Arguments.createMap().apply {
          putInt("watching", registered)
          if (error != null) putString("error", error) else putNull("error")
        },
      )
    }
  }

  @ReactMethod
  fun getStatus(promise: Promise) {
    val context = reactApplicationContext
    promise.resolve(
      Arguments.createMap().apply {
        putBoolean("notifications", ReminderNotifier.canNotify(context))
        putString(
          "location",
          when {
            GeofenceRegistrar.hasBackgroundLocationPermission(context) -> "always"
            GeofenceRegistrar.hasLocationPermission(context) -> "whenInUse"
            else -> "denied"
          },
        )
      },
    )
  }

  /** Shows a push message received while the app is open (FCM does not). */
  @ReactMethod
  fun displayNotification(title: String, body: String, promise: Promise) {
    val context = reactApplicationContext
    ReminderNotifier.show(context, (title + body).hashCode(), title, body, null)
    promise.resolve(null)
  }

  // Not needed by this module, but React Native warns without it.
  @ReactMethod
  fun addListener(eventName: String) = Unit

  @ReactMethod
  fun removeListeners(count: Double) = Unit

  companion object {
    const val NAME = "ReminderGeofence"
  }
}
