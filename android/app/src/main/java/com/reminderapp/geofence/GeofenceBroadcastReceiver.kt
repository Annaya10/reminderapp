package com.reminderapp.geofence

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.google.android.gms.location.Geofence
import com.google.android.gms.location.GeofenceStatusCodes
import com.google.android.gms.location.GeofencingEvent

/**
 * Receives geofence transitions from Play services. Runs whether the app is
 * in the foreground, in the background or not running.
 */
class GeofenceBroadcastReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val event = GeofencingEvent.fromIntent(intent) ?: return
    if (event.hasError()) {
      val message = GeofenceStatusCodes.getStatusCodeString(event.errorCode)
      Log.w("GeofenceReceiver", "Geofence error: $message")
      return
    }
    if (event.geofenceTransition != Geofence.GEOFENCE_TRANSITION_ENTER) {
      return
    }
    val ids = event.triggeringGeofences.orEmpty().map { it.requestId }
    ReminderNotifier.handleEntered(context, ids)
  }
}
