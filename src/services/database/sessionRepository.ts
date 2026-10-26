import { getDatabase } from '@src/services/database/database';

/** A single-row table holding the signed-in user, if any. */

export const getSessionUserId = async (): Promise<string | null> => {
  const { rows } = await getDatabase().execute(
    'SELECT user_id FROM session WHERE id = 1',
  );
  return rows[0] ? String(rows[0].user_id) : null;
};

export const saveSession = async (userId: string): Promise<void> => {
  await getDatabase().execute(
    `INSERT OR REPLACE INTO session (id, user_id, created_at)
     VALUES (1, ?, ?)`,
    [userId, new Date().toISOString()],
  );
};

export const clearSession = async (): Promise<void> => {
  await getDatabase().execute('DELETE FROM session WHERE id = 1');
};
