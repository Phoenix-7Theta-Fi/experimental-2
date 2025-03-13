import { getDB } from '../src/lib/db';
import { generateHealthData } from './generate-health-data';
import { setupTables } from '../src/lib/db/setup';
import { seedUsers } from '../src/lib/db/users';
import type { Database } from 'better-sqlite3';

function main() {
  console.log('Resetting database...');

  const db = getDB();

  // Drop tables in correct order (deepest dependencies first)
  const dropOrder = [
    // First layer - tables that depend on other tables
    'meditation_sessions',
    'mood_history',
    'stress_triggers',
    'medication_adherence',
    'cart_items',
    'likes',

    // Second layer - tables that depend only on users
    'biomarkers',
    'medications',
    'nutrition',
    'workouts',
    'yoga_metrics',
    'mental_health',
    'appointments',
    'treatment_plans',
    'daily_schedules',
    'tweets',

    // Last layer - base tables
    'medication_catalog',
    'products',
    'session_store',
    'users'
  ];

  // Start a single transaction for the entire reset process
  db.prepare('BEGIN EXCLUSIVE TRANSACTION').run();

  try {
    // Drop tables in the correct order
    console.log('Dropping existing tables...');
    dropOrder.forEach(tableName => {
      try {
        db.prepare(`DROP TABLE IF EXISTS ${tableName}`).run();
        console.log(`Dropped table: ${tableName}`);
      } catch (error) {
        console.log(`Note: Table ${tableName} may not exist yet`);
      }
    });
    
    // Recreate tables
    console.log('\nRecreating tables...');
    setupTables(db);
    
    // Seed users with predefined accounts
    console.log('\nSeeding users...');
    // Use Promise syntax instead of await
    return seedUsers()
      .then(() => {
        // Everything worked, commit the transaction
        db.prepare('COMMIT').run();
        console.log('Database schema reset complete');
        
        // Generate complete health data for all patients
        console.log('\nGenerating complete health data...');
        return generateHealthData().then(() => {
          console.log('\nHealth data generation complete!');
          console.log('\nAvailable test accounts:');
          console.log('\nPractitioners:');
          console.log('- dr.smith@example.com / password123');
          console.log('- dr.jones@example.com / password123');
          console.log('- dr.patel@example.com / password123');
          console.log('\nPatients:');
          console.log('- alice@example.com / password123');
          console.log('- bob@example.com / password123');
          console.log('- carol@example.com / password123');
          console.log('- david@example.com / password123');
          console.log('- emma@example.com / password123');
          console.log('- frank@example.com / password123');
          console.log('- grace@example.com / password123');

          console.log('\nDatabase reset complete!');
        });
      });

  } catch (error) {
    // If anything goes wrong, roll back all changes
    db.prepare('ROLLBACK').run();
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

// Run the main function and handle any errors
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
