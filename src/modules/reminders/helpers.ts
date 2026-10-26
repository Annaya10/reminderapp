import { isSameDay, startOfDay } from '@src/helpers/date';
import {
  GEOFENCE_RADIUS_STEP,
  MAX_GEOFENCE_RADIUS,
  MIN_GEOFENCE_RADIUS,
} from '@src/modules/reminders/constants';
import { Reminder, ReminderFilter } from '@src/modules/reminders/types';

/** Rounds a dragged radius to the step size and keeps it within limits. */
export const normalizeRadius = (meters: number): number => {
  const stepped =
    Math.round(meters / GEOFENCE_RADIUS_STEP) * GEOFENCE_RADIUS_STEP;
  return Math.min(MAX_GEOFENCE_RADIUS, Math.max(MIN_GEOFENCE_RADIUS, stepped));
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Today: due any time today. Upcoming: due on a later day.
 * Reminders due on earlier days belong to neither list.
 */
export const matchesFilter = (
  reminder: Reminder,
  filter: ReminderFilter,
  now: Date = new Date(),
): boolean => {
  const remindAt = new Date(reminder.remindAt);
  if (filter === 'today') {
    return isSameDay(remindAt, now);
  }
  return remindAt.getTime() >= startOfDay(now).getTime() + MS_PER_DAY;
};

export const sortByRemindAt = (reminders: Reminder[]): Reminder[] =>
  [...reminders].sort((a, b) => a.remindAt.localeCompare(b.remindAt));

export const isOverdue = (reminder: Reminder, now: Date = new Date()) =>
  !reminder.isCompleted && new Date(reminder.remindAt) < now;
