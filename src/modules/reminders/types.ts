import type { Position } from 'geojson';

export interface Geofence {
  /** [longitude, latitude] */
  coordinate: Position;
  /** Radius in meters. */
  radius: number;
}

export interface Reminder extends Geofence {
  id: string;
  title: string;
  description: string;
  /** When the reminder is due, as an ISO 8601 string. */
  remindAt: string;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
  isCompleted: boolean;
}

/** The user-editable fields of a reminder. */
export type ReminderDraft = Pick<
  Reminder,
  'title' | 'description' | 'coordinate' | 'radius' | 'remindAt'
>;

export type ReminderFilter = 'today' | 'upcoming';
