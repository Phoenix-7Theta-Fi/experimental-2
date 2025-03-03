require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } });
const { getDB } = require('../src/lib/db');
const { seedUsers } = require('../src/lib/db/users');
const { seedTweets } = require('../src/lib/db/tweets');
const { seedYoga } = require('../src/lib/db/yoga');
const { seedNutrition } = require('../src/lib/db/nutrition');
const { seedWorkouts } = require('../src/lib/db/workouts');
const { seedMentalHealthData } = require('../src/lib/db/mental-health');
const { seedMedicationData } = require('../src/lib/db/medication');
const { seedBiomarkerData } = require('../src/lib/db/biomarkers');
const { seedProducts } = require('../src/lib/db/products');

async function seedDb() {
  console.log('Seeding database...');
  try {
    // Ensure database and tables exist
    const db = getDB();

    console.log('Seeding core data...');
    // Core data (users must be first as other data depends on them)
    seedUsers();
    seedTweets();
    seedProducts();

    console.log('Seeding health analytics data...');
    // Health analytics data
    seedNutrition();
    seedWorkouts();
    seedYoga();
    seedMentalHealthData();
    seedMedicationData();
    seedBiomarkerData();

    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDb().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seedDb;