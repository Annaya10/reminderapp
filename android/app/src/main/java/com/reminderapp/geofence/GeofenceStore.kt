package com.reminderapp.geofence

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/** A reminder as the native layer needs it to watch its area and alert. */
data class GeofenceReminder(
  val id: String,
  val title: String,
  val body: String,
  /** Local due date, "yyyy-MM-dd". */
  val dueDay: String,
  val latitude: Double,
  val longitude: Double,
  val radius: Float,
) {
  fun toJson(): JSONObject =
    JSONObject()
      .put("id", id)
      .put("title", title)
      .put("body", body)
      .put("dueDay", dueDay)
      .put("latitude", latitude)
      .put("longitude", longitude)
      .put("radius", radius.toDouble())

  companion object {
    fun fromJson(json: JSONObject) =
      GeofenceReminder(
        id = json.getString("id"),
        title = json.getString("title"),
        body = json.optString("body"),
        dueDay = json.getString("dueDay"),
        latitude = json.getDouble("latitude"),
        longitude = json.getDouble("longitude"),
        radius = json.getDouble("radius").toFloat(),
      )
  }
}

/**
 * Persists the watched reminders and which ones have already alerted, so
 * geofence events can be handled without the JS app running.
 */
object GeofenceStore {
  private const val PREFS = "reminder_geofences"
  private const val KEY_REMINDERS = "reminders"
  private const val KEY_NOTIFIED = "notified"

  fun today(): String = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

  private fun prefs(context: Context) =
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

  fun saveReminders(context: Context, reminders: List<GeofenceReminder>) {
    val json = JSONArray(reminders.map { it.toJson() }).toString()
    prefs(context).edit().putString(KEY_REMINDERS, json).apply()
    pruneNotified(context)
  }

  fun loadReminders(context: Context): List<GeofenceReminder> {
    val raw = prefs(context).getString(KEY_REMINDERS, null) ?: return emptyList()
    val array = JSONArray(raw)
    return (0 until array.length()).map { GeofenceReminder.fromJson(array.getJSONObject(it)) }
  }

  fun findReminder(context: Context, id: String): GeofenceReminder? =
    loadReminders(context).firstOrNull { it.id == id }

  private fun notifiedKey(reminder: GeofenceReminder) = "${reminder.id}|${reminder.dueDay}"

  fun wasNotified(context: Context, reminder: GeofenceReminder): Boolean =
    prefs(context).getStringSet(KEY_NOTIFIED, emptySet())!!.contains(notifiedKey(reminder))

  fun markNotified(context: Context, reminder: GeofenceReminder) {
    val current = prefs(context).getStringSet(KEY_NOTIFIED, emptySet())!!
    prefs(context).edit().putStringSet(KEY_NOTIFIED, current + notifiedKey(reminder)).apply()
  }

  /** Forgets alerts for past days; their reminders can no longer fire. */
  private fun pruneNotified(context: Context) {
    val today = today()
    val current = prefs(context).getStringSet(KEY_NOTIFIED, emptySet())!!
    val kept = current.filter { it.substringAfterLast('|') >= today }.toSet()
    if (kept.size != current.size) {
      prefs(context).edit().putStringSet(KEY_NOTIFIED, kept).apply()
    }
  }
}
