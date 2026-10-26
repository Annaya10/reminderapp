import { DB } from '@op-engineering/op-sqlite';

/**
 * Ordered schema migrations. Each entry upgrades the schema by one version;
 * never edit a released entry, append a new one instead.
 */
const MIGRATIONS: string[][] = [
  [
    `CREATE TABLE users (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE session (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE reminders (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      radius REAL NOT NULL,
      remind_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      is_completed INTEGER NOT NULL DEFAULT 0
    )`,
    'CREATE INDEX idx_reminders_user_remind_at ON reminders (user_id, remind_at)',
  ],
];

export const runMigrations = async (db: DB): Promise<void> => {
  const result = await db.execute('PRAGMA user_version');
  const currentVersion = Number(result.rows[0]?.user_version ?? 0);

  for (let version = currentVersion; version < MIGRATIONS.length; version++) {
    await db.transaction(async tx => {
      for (const statement of MIGRATIONS[version]) {
        await tx.execute(statement);
      }
      await tx.execute(`PRAGMA user_version = ${version + 1}`);
    });
  }
};
