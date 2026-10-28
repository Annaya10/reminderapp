package com.reminderapp.geofence

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.ContentResolver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.reminderapp.MainActivity
import com.reminderapp.R

object ReminderNotifier {
  private const val TAG = "ReminderNotifier"

  /** Channel sound and importance are fixed once created, so the id is versioned. */
  const val CHANNEL_ID = "reminder_alerts_v1"

  private fun soundUri(context: Context): Uri =
    Uri.parse(
      "${ContentResolver.SCHEME_ANDROID_RESOURCE}://${context.packageName}/${R.raw.reminder_alert}",
    )

  fun ensureChannel(context: Context) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }
    val manager = context.getSystemService(NotificationManager::class.java)
    if (manager.getNotificationChannel(CHANNEL_ID) != null) {
      return
    }
    val channel =
      NotificationChannel(CHANNEL_ID, "Location reminders", NotificationManager.IMPORTANCE_HIGH)
        .apply {
          description = "Alerts when you arrive at a reminder's place on its due date"
          enableVibration(true)
          setSound(
            soundUri(context),
            AudioAttributes.Builder()
              .setUsage(AudioAttributes.USAGE_NOTIFICATION)
              .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
              .build(),
          )
        }
    manager.createNotificationChannel(channel)
  }

  fun canNotify(context: Context): Boolean {
    val manager = NotificationManagerCompat.from(context)
    val granted =
      Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU ||
        ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) ==
          PackageManager.PERMISSION_GRANTED
    return granted && manager.areNotificationsEnabled()
  }

  /**
   * Called when the device enters reminder areas. Alerts only on the
   * reminder's due date, and at most once per reminder and due date.
   */
  fun handleEntered(context: Context, reminderIds: List<String>) {
    val today = GeofenceStore.today()
    for (id in reminderIds) {
      val reminder = GeofenceStore.findReminder(context, id)
      when {
        reminder == null -> Log.i(TAG, "Entered $id: reminder no longer watched")
        reminder.dueDay != today -> Log.i(TAG, "Entered $id: due ${reminder.dueDay}, not today")
        GeofenceStore.wasNotified(context, reminder) -> Log.i(TAG, "Entered $id: already alerted today")
        !canNotify(context) -> Log.w(TAG, "Entered $id: notifications are not allowed")
        else -> {
          show(context, reminder.id.hashCode(), reminder.title, reminder.body, reminder.id)
          GeofenceStore.markNotified(context, reminder)
          Log.i(TAG, "Entered $id: alert shown")
        }
      }
    }
  }

  fun show(context: Context, notificationId: Int, title: String, body: String, reminderId: String?) {
    if (!canNotify(context)) {
      return
    }
    ensureChannel(context)
    val openApp =
      Intent(context, MainActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        reminderId?.let { putExtra("reminderId", it) }
      }
    val contentIntent =
      PendingIntent.getActivity(
        context,
        notificationId,
        openApp,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
      )
    val text = body.ifBlank { "You've arrived at this reminder's place." }
    val notification =
      NotificationCompat.Builder(context, CHANNEL_ID)
        .setSmallIcon(R.drawable.ic_stat_reminder)
        .setColor(ContextCompat.getColor(context, R.color.notification_accent))
        .setContentTitle(title)
        .setContentText(text)
        .setStyle(NotificationCompat.BigTextStyle().bigText(text))
        .setPriority(NotificationCompat.PRIORITY_HIGH)
        .setCategory(NotificationCompat.CATEGORY_REMINDER)
        // Used before Android 8; newer versions take the sound from the channel.
        .setSound(soundUri(context))
        .setDefaults(NotificationCompat.DEFAULT_VIBRATE)
        .setAutoCancel(true)
        .setContentIntent(contentIntent)
        .build()
    try {
      NotificationManagerCompat.from(context).notify(notificationId, notification)
    } catch (error: SecurityException) {
      Log.w(TAG, "Notification permission was revoked", error)
    }
  }
}
