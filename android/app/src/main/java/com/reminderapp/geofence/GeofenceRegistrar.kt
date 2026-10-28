package com.reminderapp.geofence

import android.Manifest
import android.annotation.SuppressLint
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.core.content.ContextCompat
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.location.Geofence
import com.google.android.gms.location.GeofenceStatusCodes
import com.google.android.gms.location.GeofencingRequest
import com.google.android.gms.location.LocationServices

/** Registers the stored reminders' areas with Google Play services. */
object GeofenceRegistrar {
  private const val TAG = "GeofenceRegistrar"

  /** Play services allows at most 100 geofences per app. */
  private const val MAX_GEOFENCES = 100

  private fun pendingIntent(context: Context): PendingIntent =
    PendingIntent.getBroadcast(
      context,
      0,
      Intent(context, GeofenceBroadcastReceiver::class.java),
      // Play services fills in the event, so the intent must be mutable.
      PendingIntent.FLAG_UPDATE_CURRENT or
        (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) PendingIntent.FLAG_MUTABLE else 0),
    )

  fun hasLocationPermission(context: Context): Boolean =
    granted(context, Manifest.permission.ACCESS_FINE_LOCATION)

  /** Events while the app is not in use need background access from Android 10. */
  fun hasBackgroundLocationPermission(context: Context): Boolean =
    hasLocationPermission(context) &&
      (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q ||
        granted(context, Manifest.permission.ACCESS_BACKGROUND_LOCATION))

  private fun granted(context: Context, permission: String) =
    ContextCompat.checkSelfPermission(context, permission) == PackageManager.PERMISSION_GRANTED

  /**
   * Replaces all registered areas with the stored reminders that can still
   * alert (due today or later), soonest first.
   */
  @SuppressLint("MissingPermission")
  fun registerStored(context: Context, onDone: (registered: Int, error: String?) -> Unit = { _, _ -> }) {
    val client = LocationServices.getGeofencingClient(context)
    val intent = pendingIntent(context)
    val today = GeofenceStore.today()
    val watchable =
      GeofenceStore.loadReminders(context)
        .filter { it.dueDay >= today }
        .sortedBy { it.dueDay }
        .take(MAX_GEOFENCES)

    client.removeGeofences(intent).addOnCompleteListener {
      if (watchable.isEmpty()) {
        onDone(0, null)
        return@addOnCompleteListener
      }
      if (!hasLocationPermission(context)) {
        onDone(0, "location_permission_missing")
        return@addOnCompleteListener
      }
      val request =
        GeofencingRequest.Builder()
          // Only real entries alert; being inside when an area is added does not.
          .setInitialTrigger(0)
          .addGeofences(
            watchable.map {
              Geofence.Builder()
                .setRequestId(it.id)
                .setCircularRegion(it.latitude, it.longitude, it.radius)
                .setExpirationDuration(Geofence.NEVER_EXPIRE)
                .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_ENTER)
                .build()
            },
          )
          .build()
      client
        .addGeofences(request, intent)
        .addOnSuccessListener {
          Log.i(TAG, "Watching ${watchable.size} reminder area(s)")
          onDone(watchable.size, null)
        }
        .addOnFailureListener { error ->
          val code = (error as? ApiException)?.statusCode
          val reason =
            when (code) {
              GeofenceStatusCodes.GEOFENCE_INSUFFICIENT_LOCATION_PERMISSION ->
                "background_location_permission_missing"
              GeofenceStatusCodes.GEOFENCE_NOT_AVAILABLE -> "location_services_off"
              else -> error.message ?: "geofence_error"
            }
          Log.w(TAG, "Could not watch reminder areas: $reason", error)
          onDone(0, reason)
        }
    }
  }
}
