require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } });
const { getDB } = require('../src/lib/db');

async function initDb() {
  console.log('Initializing database...');
  try {
    const db = getDB(); // This will initialize connection and create tables
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exitCode = 1;
    throw error;
  }
}

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

module.exports = initDb;
