import { getDB } from '../src/lib/db';

function updateSchema() {
  const db = getDB();
  
  db.exec('BEGIN TRANSACTION');
  try {
    // Check if practitioner_id column exists
    const hasColumn = db.prepare(`
      SELECT COUNT(*) as count 
      FROM pragma_table_info('users') 
      WHERE name='practitioner_id'
    `).get() as { count: number };

    if (!hasColumn.count) {
      // Add practitioner_id column to users table if it doesn't exist
      db.exec(`
        ALTER TABLE users 
        ADD COLUMN practitioner_id INTEGER 
        REFERENCES users(id)
      `);
    }

    // Get Dr. Sarah Jones's ID (seeded as second user)
    const drJones = db.prepare("SELECT id FROM users WHERE email = 'dr.jones@example.com'").get() as { id: number };
    
    // Assign all existing patients to Dr. Sarah Jones
    db.prepare(`
      UPDATE users 
      SET practitioner_id = ? 
      WHERE role = 'patient'
    `).run(drJones.id);

    db.exec('COMMIT');
    console.log('Schema updated successfully');
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('Error updating schema:', error);
    throw error;
  }
}

updateSchema();
