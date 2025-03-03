import sqlite from 'better-sqlite3';
import { join } from 'path';
import { setupTables } from './setup';
import { log, checkDatabaseHealth, getDatabaseStats } from './debug';
import fs from 'fs';

// Global singleton pattern
declare global {
  var _db: ReturnType<typeof sqlite> | undefined;
}

function initializeConnection() {
  const dbPath = join(process.cwd(), 'tangerine.db');
  log('Starting database initialization...', 'info');

  // Check database health and recreate if necessary
  if (fs.existsSync(dbPath)) {
    const health = checkDatabaseHealth(dbPath);
    log(health.details, health.healthy ? 'success' : 'warning');
    if (!health.healthy) {
      log('Deleting corrupted database...', 'warning');
      fs.unlinkSync(dbPath);
      ['-wal', '-shm'].forEach(suffix => {
        const path = `${dbPath}${suffix}`;
        if (fs.existsSync(path)) fs.unlinkSync(path);
      });
    }
  } else {
    log('No existing database found, creating new one', 'info');
  }

  const db = new sqlite(dbPath, {
    fileMustExist: false,
    timeout: 5000,
    verbose: process.env.NODE_ENV === 'development' ? (sql) => log(`SQL: ${sql}`, 'info') : undefined
  });

  log('Configuring database...', 'info');
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create all tables
  setupTables(db);

  log('Database initialized successfully', 'success');
  return db;
}

export function getDB() {
  if (!global._db) {
    global._db = initializeConnection();
  }
  return global._db;
}

export function withDB<T>(operation: () => T): T {
  const db = getDB();
  return operation();
}

const database = new Proxy({} as ReturnType<typeof sqlite>, {
  get(_, prop) {
    const db = getDB();
    return db[prop as keyof ReturnType<typeof sqlite>];
  }
});

export default database;

export function logDatabaseStats(): void {
  const dbPath = join(process.cwd(), 'tangerine.db');
  const stats = getDatabaseStats(dbPath);
  if (!('error' in stats)) {
    log('Database Statistics:', 'info');
    log(`- Size: ${stats.size}`, 'info');
    log(`- Tables: ${stats.tables}`, 'info');
    log(`- Last modified: ${stats.lastModified.toLocaleString()}`, 'info');
  } else {
    log('Could not get database stats: ' + String(stats.error), 'error');
  }
}
