import { getDB } from '../src/lib/db';
import { seedUsers } from '../src/lib/db/users';
import { seedTweets } from '../src/lib/db/tweets';
import { seedYoga } from '../src/lib/db/yoga';
import { seedNutrition } from '../src/lib/db/nutrition';
import { seedWorkouts } from '../src/lib/db/workouts';
import { seedMentalHealthData } from '../src/lib/db/mental-health';
import { seedMedicationData } from '../src/lib/db/medication';
import { seedBiomarkerData } from '../src/lib/db/biomarkers';
import { seedProducts } from '../src/lib/db/products';

async function seedDb() {
  console.log('\nSeeding database...');
  try {
    // Ensure database and tables exist
    const db = getDB();

    console.log('\nSeeding core data...');
    // Core data (users must be first as other data depends on them)
    seedUsers();
    console.log('✓ Users seeded');
    
    seedTweets();
    console.log('✓ Tweets seeded');
    
    seedProducts();
    console.log('✓ Products seeded');

    console.log('\nSeeding health analytics data...');
    // Health analytics data
    seedNutrition();
    console.log('✓ Nutrition data seeded');
    
    seedWorkouts();
    console.log('✓ Workouts data seeded');
    
    seedYoga();
    console.log('✓ Yoga data seeded');
    
    seedMentalHealthData();
    console.log('✓ Mental health data seeded');
    
    seedMedicationData();
    console.log('✓ Medication data seeded');
    
    seedBiomarkerData();
    console.log('✓ Biomarker data seeded');

    console.log('\nDatabase seeded successfully\n');
    return true;
  } catch (error) {
    console.error('\nFailed to seed database:', error);
    throw error;
  }
}

// Run if this is the main module
if (require.main === module) {
  seedDb()
    .then(() => {
      console.log('Database seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Database seeding failed:', error);
      process.exit(1);
    });
}

export default seedDb;