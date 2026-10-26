import { getDatabase } from '@src/services/database/database';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

type Row = Record<string, unknown>;

const toUser = (row: Row): UserRecord => ({
  id: String(row.id),
  name: String(row.name),
  email: String(row.email),
  passwordHash: String(row.password_hash),
  passwordSalt: String(row.password_salt),
  createdAt: String(row.created_at),
});

export const findUserByEmail = async (
  email: string,
): Promise<UserRecord | null> => {
  const { rows } = await getDatabase().execute(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email],
  );
  return rows[0] ? toUser(rows[0]) : null;
};

export const findUserById = async (id: string): Promise<UserRecord | null> => {
  const { rows } = await getDatabase().execute(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [id],
  );
  return rows[0] ? toUser(rows[0]) : null;
};

export const insertUser = async (user: UserRecord): Promise<void> => {
  await getDatabase().execute(
    `INSERT INTO users (id, name, email, password_hash, password_salt, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      user.name,
      user.email,
      user.passwordHash,
      user.passwordSalt,
      user.createdAt,
    ],
  );
};
