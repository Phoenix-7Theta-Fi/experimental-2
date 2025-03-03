import fs from 'fs';
import { join } from 'path';
import sqlite from 'better-sqlite3';

const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

type LogType = 'info' | 'success' | 'error' | 'warning';

export function log(message: string, type: LogType = 'info') {
  const color = {
    info: colors.cyan,
    success: colors.green,
    error: colors.red,
    warning: colors.yellow
  }[type];
  
  console.log(`${color}[Database] ${message}${colors.reset}`);
}

export function checkDatabaseHealth(dbPath: string): { healthy: boolean; details: string } {
  try {
    // Check if file exists
    if (!fs.existsSync(dbPath)) {
      return { healthy: false, details: 'Database file does not exist' };
    }

    // Check file permissions
    try {
      fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);
    } catch {
      return { healthy: false, details: 'Database file permission issues' };
    }

    // Try to open and perform a simple query
    const tempDb = new sqlite(dbPath, { fileMustExist: true });
    try {
      tempDb.prepare('SELECT 1').get();
      tempDb.prepare('PRAGMA integrity_check').get();
      tempDb.close();
      return { healthy: true, details: 'Database is healthy' };
    } catch (error) {
      tempDb.close();
      return { 
        healthy: false, 
        details: `Database is corrupted: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  } catch (error) {
    return { 
      healthy: false, 
      details: `Database check failed: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

export function getDatabaseStats(dbPath: string): Record<string, any> {
  try {
    const stats = fs.statSync(dbPath);
    const tempDb = new sqlite(dbPath, { fileMustExist: true });
    
    const tableCount = tempDb.prepare(`
      SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'
    `).get() as { count: number };

    const pageSize = tempDb.prepare('PRAGMA page_size').get() as { page_size: number };
    const pageCount = tempDb.prepare('PRAGMA page_count').get() as { page_count: number };
    
    tempDb.close();

    return {
      size: `${(stats.size / 1024 / 1024).toFixed(2)}MB`,
      tables: tableCount.count,
      lastModified: stats.mtime,
      created: stats.birthtime,
      pageSize: pageSize.page_size,
      totalPages: pageCount.page_count
    };
  } catch (error) {
    return {
      error: `Could not get database stats: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
