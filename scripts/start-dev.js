const { spawn } = require('child_process');
const path = require('path');

async function main() {
  try {
    // First run database initialization
    const initDb = require('./init-db.js');
    
    const success = await initDb();
    
    if (!success) {
      console.error('Database initialization failed, cannot start server');
      process.exit(1);
    }

    console.log('\nStarting Next.js development server...');

    // Then start Next.js dev server
    const nextDev = spawn('npx', ['next', 'dev'], {
      stdio: 'inherit',
      shell: true,
      windowsHide: true
    });

    nextDev.on('error', (error) => {
      console.error('Failed to start Next.js dev server:', error);
      process.exit(1);
    });

    // Keep the process running
    process.on('SIGINT', () => {
      nextDev.kill('SIGINT');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
}

main().catch(console.error);
