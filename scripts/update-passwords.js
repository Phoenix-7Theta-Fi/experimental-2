const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const db = new Database('tangerine.db');

async function updatePasswords() {
  const newPassword = 'test123';
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update all patient passwords
  const updateQuery = db.prepare(`
    UPDATE users 
    SET password = ? 
    WHERE role = 'patient'
  `);
  
  updateQuery.run(hashedPassword);
  console.log('Updated passwords for all patient accounts');
  console.log('New password for all patients: test123');
}

updatePasswords().catch(console.error);
