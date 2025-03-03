import { getDB } from '../src/lib/db';

async function initDb() {
  console.log('\nInitializing database...');
  try {
    const db = getDB(); // This will initialize connection and create tables
    console.log('Database initialized successfully\n');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Run if this is the main module
if (require.main === module) {
  initDb()
    .then(() => {
      console.log('Database initialization completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

export default initDb;