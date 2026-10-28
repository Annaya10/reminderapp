package com.reminderapp.geofence

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Android forgets geofences on reboot and app update, so register them again. */
class GeofenceBootReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    when (intent.action) {
      Intent.ACTION_BOOT_COMPLETED,
      Intent.ACTION_MY_PACKAGE_REPLACED -> {
        val pending = goAsync()
        GeofenceRegistrar.registerStored(context.applicationContext) { _, _ -> pending.finish() }
      }
    }
  }
}
