import { DB, open } from '@op-engineering/op-sqlite';

import { runMigrations } from '@src/services/database/migrations';

const DATABASE_NAME = 'reminder-app.sqlite';

let database: DB | null = null;
let initialization: Promise<void> | null = null;

/** Opens the database once and applies pending migrations. Safe to call repeatedly. */
export const initDatabase = (): Promise<void> => {
  if (!initialization) {
    initialization = (async () => {
      const db = open({ name: DATABASE_NAME });
      await db.execute('PRAGMA foreign_keys = ON');
      await runMigrations(db);
      database = db;
    })().catch(error => {
      initialization = null;
      throw error;
    });
  }
  return initialization;
};

export const getDatabase = (): DB => {
  if (!database) {
    throw new Error('Database used before initDatabase() completed.');
  }
  return database;
};
