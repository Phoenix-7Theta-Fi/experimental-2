const { join } = require('path');
const { log, checkDatabaseHealth, getDatabaseStats } = require('../src/lib/db/debug');
const sqlite = require('better-sqlite3');

// Run the monitor
const dbPath = join(process.cwd(), 'tangerine.db');
const health = checkDatabaseHealth(dbPath);

log('\nDatabase Health Check', 'info');
log('===================', 'info');
log(health.details, health.healthy ? 'success' : 'error');

if (health.healthy) {
  // Show extended stats
  const stats = getDatabaseStats(dbPath);
  if (!('error' in stats)) {
    log('\nDatabase Statistics', 'info');
    log('==================', 'info');
    log(`Size: ${stats.size}`, 'info');
    log(`Tables: ${stats.tables}`, 'info');
    log(`Last Modified: ${stats.lastModified.toLocaleString()}`, 'info');
  }
  
  // Test database connection and show table details
  try {
    const db = new sqlite(dbPath);
    const tables = db.prepare(`
      SELECT 
        name,
        (SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND tbl_name=t.name) as indices,
        (SELECT COUNT(*) FROM pragma_table_info(t.name)) as columns,
        (SELECT COUNT(*) FROM main.[' || t.name || ']) as rows
      FROM sqlite_master t
      WHERE type='table'
      ORDER BY name
    `).all();

    // Get WAL mode and other settings
    const journalMode = db.prepare('PRAGMA journal_mode').get();
    const pageSize = db.prepare('PRAGMA page_size').get();
    const cacheSize = db.prepare('PRAGMA cache_size').get();

    log('\nDatabase Configuration', 'info');
    log('=====================', 'info');
    log(`Journal Mode: ${journalMode.journal_mode}`, 'info');
    log(`Page Size: ${pageSize.page_size} bytes`, 'info');
    log(`Cache Size: ${cacheSize.cache_size} pages`, 'info');

    log('\nTable Details', 'info');
    log('=============', 'info');
    tables.forEach(table => {
      log(`\n${table.name}:`, 'success');
      log(`  Rows: ${table.rows}`, 'info');
      log(`  Columns: ${table.columns}`, 'info');
      log(`  Indices: ${table.indices}`, 'info');
    });

    db.close();
  } catch (error) {
    log(`\nError checking tables: ${error.message}`, 'error');
  }
} else {
  process.exit(1);
}
