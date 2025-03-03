import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

// Setup require for CommonJS modules
const require = createRequire(import.meta.url);

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  try {
    // Load the compiled JavaScript modules
    const { initializeDatabase } = await import('../src/lib/db/index.js');
    const { setupHealthTables } = await import('../src/lib/db/setup.js');

    console.log('Initializing database...');

    // Initialize core database tables
    initializeDatabase();
    console.log('Core tables initialized successfully');

    // Initialize health-related tables
    setupHealthTables();
    console.log('Health tables initialized successfully');

    console.log('\nDatabase initialization complete! ✨');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

main().catch(console.error);