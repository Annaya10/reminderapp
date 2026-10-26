import { getDatabase } from '@src/services/database/database';
import { Reminder, ReminderDraft } from '@src/modules/reminders/types';

type Row = Record<string, unknown>;

const toReminder = (row: Row): Reminder => ({
  id: String(row.id),
  title: String(row.title),
  description: String(row.description ?? ''),
  coordinate: [Number(row.longitude), Number(row.latitude)],
  radius: Number(row.radius),
  remindAt: String(row.remind_at),
  createdAt: String(row.created_at),
  isCompleted: Number(row.is_completed) === 1,
});

export const listReminders = async (userId: string): Promise<Reminder[]> => {
  const { rows } = await getDatabase().execute(
    'SELECT * FROM reminders WHERE user_id = ? ORDER BY remind_at ASC',
    [userId],
  );
  return rows.map(toReminder);
};

export const insertReminder = async (
  userId: string,
  reminder: Reminder,
): Promise<void> => {
  const [longitude, latitude] = reminder.coordinate;
  await getDatabase().execute(
    `INSERT INTO reminders (
      id, user_id, title, description, latitude, longitude, radius,
      remind_at, created_at, is_completed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      reminder.id,
      userId,
      reminder.title,
      reminder.description,
      latitude,
      longitude,
      reminder.radius,
      reminder.remindAt,
      reminder.createdAt,
      reminder.isCompleted ? 1 : 0,
    ],
  );
};

export const updateReminder = async (
  userId: string,
  id: string,
  draft: ReminderDraft,
): Promise<void> => {
  const [longitude, latitude] = draft.coordinate;
  await getDatabase().execute(
    `UPDATE reminders
     SET title = ?, description = ?, latitude = ?, longitude = ?, radius = ?,
         remind_at = ?
     WHERE id = ? AND user_id = ?`,
    [
      draft.title,
      draft.description,
      latitude,
      longitude,
      draft.radius,
      draft.remindAt,
      id,
      userId,
    ],
  );
};

export const setReminderCompleted = async (
  userId: string,
  id: string,
  isCompleted: boolean,
): Promise<void> => {
  await getDatabase().execute(
    'UPDATE reminders SET is_completed = ? WHERE id = ? AND user_id = ?',
    [isCompleted ? 1 : 0, id, userId],
  );
};

export const deleteReminder = async (
  userId: string,
  id: string,
): Promise<void> => {
  await getDatabase().execute(
    'DELETE FROM reminders WHERE id = ? AND user_id = ?',
    [id, userId],
  );
};
