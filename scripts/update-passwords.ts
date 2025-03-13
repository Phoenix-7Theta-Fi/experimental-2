const { getDB } = require('../src/lib/db');
const { hashPassword } = require('../src/lib/auth');

async function updatePasswords() {
  const db = getDB();
  const DEFAULT_PASSWORD = 'password123';
  
  try {
    // Get all users
    const users = db.prepare('SELECT id FROM users').all() as { id: number }[];
    
    // Hash the default password
    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
    
    // Update all users with the same hashed password
    const updateStmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
    
    for (const user of users) {
      updateStmt.run(hashedPassword, user.id);
    }
    
    console.log('Successfully updated passwords for all users');
  } catch (error) {
    console.error('Error updating passwords:', error);
    process.exit(1);
  }
}

updatePasswords().catch(console.error);
