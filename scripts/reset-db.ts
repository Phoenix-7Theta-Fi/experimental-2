import fs from 'fs';
import path from 'path';
import initDb from './init-db';
import seedDb from './seed-db';

async function resetDb() {
  console.log('\nStarting database reset...');
  try {
    const dbPath = path.join(process.cwd(), 'tangerine.db');
    
    // Remove existing database files
    if (fs.existsSync(dbPath)) {
      console.log('\nRemoving existing database files...');
      fs.unlinkSync(dbPath);
      ['-wal', '-shm'].forEach(suffix => {
        const filePath = `${dbPath}${suffix}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`✓ Removed ${path.basename(filePath)}`);
        }
      });
      console.log('✓ Removed main database file');
    }

    // Initialize new database with tables
    console.log('\nInitializing new database...');
    await initDb();

    // Seed with initial data
    console.log('\nSeeding database with initial data...');
    await seedDb();

    console.log('\nDatabase reset completed successfully\n');
    return true;
  } catch (error) {
    console.error('\nFailed to reset database:', error);
    throw error;
  }
}

// Run if this is the main module
if (require.main === module) {
  resetDb()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\nDatabase reset failed:', error);
      process.exit(1);
    });
}

export default resetDb;