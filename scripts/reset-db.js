require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } });
const fs = require('fs');
const path = require('path');
const initDb = require('./init-db');
const seedDb = require('./seed-db');

async function resetDb() {
  console.log('Resetting database...');
  try {
    const dbPath = path.join(process.cwd(), 'tangerine.db');
    
    // Remove existing database files
    if (fs.existsSync(dbPath)) {
      console.log('Removing existing database files...');
      fs.unlinkSync(dbPath);
      ['-wal', '-shm'].forEach(suffix => {
        const filePath = `${dbPath}${suffix}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Initialize new database with tables
    console.log('Initializing new database...');
    await initDb();

    // Seed with initial data
    console.log('Seeding database with initial data...');
    await seedDb();

    console.log('Database reset successfully');
    return true;
  } catch (error) {
    console.error('Failed to reset database:', error);
    process.exitCode = 1;
    throw error;
  }
}

if (require.main === module) {
  resetDb()
    .then(() => {
      console.log('Database reset completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Database reset failed:', error);
      process.exit(1);
    });
}

module.exports = resetDb;
