import 'dotenv/config';
import { getDB } from '../src/lib/db';
console.log('Using API Key:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');
import { generateHealthInsights } from '../src/lib/gemini/prompts/health-insights';
import { createBulkInsights, clearAllInsights } from '../src/lib/db/health-insights';
import type { InsightGenerationRequest } from '../src/lib/types/insights';
import type {
  BiomarkerData,
  WorkoutData,
  YogaData,
  MentalHealthData,
  MedicationData
} from '../src/lib/types/health';

async function main() {
  const db = getDB();

  try {
    // Clear existing insights first
    console.log('\nClearing existing insights...');
    clearAllInsights();
    console.log('All insights cleared successfully!\n');

    // Get all patients
    const patients = db.prepare(`
      SELECT id FROM users WHERE role = 'patient'
    `).all() as { id: number }[];

    console.log(`Found ${patients.length} patients`);

    for (const patient of patients) {
      console.log(`\nProcessing patient ${patient.id}...`);

      // Get patient's latest data
      const biomarkers = db.prepare(`
        SELECT * FROM biomarkers 
        WHERE user_id = ? 
        ORDER BY date DESC 
        LIMIT 5
      `).all(patient.id) as BiomarkerData[];

      const workouts = db.prepare(`
        SELECT * FROM workouts 
        WHERE user_id = ? 
        ORDER BY date DESC 
        LIMIT 5
      `).all(patient.id) as WorkoutData[];

      const yogaMetrics = db.prepare(`
        SELECT * FROM yoga_metrics 
        WHERE user_id = ? 
        ORDER BY date DESC 
        LIMIT 5
      `).all(patient.id) as YogaData[];

      const mentalHealth = db.prepare(`
        SELECT * FROM mental_health 
        WHERE user_id = ? 
        ORDER BY date DESC 
        LIMIT 5
      `).all(patient.id) as MentalHealthData[];

      const medications = db.prepare(`
        SELECT m.*, mc.type, mc.name
        FROM medications m
        JOIN medication_catalog mc ON m.catalog_id = mc.id
        WHERE m.user_id = ?
      `).all(patient.id) as MedicationData[];

      // Prepare request for LLM
      const request: InsightGenerationRequest = {
        patient_id: patient.id,
        data: {
          biomarkers,
          workout: workouts,
          yoga: yogaMetrics,
          mentalHealth,
          medication: medications
        }
      };

      try {
        // Generate insights using LLM
        console.log('Generating insights...');
        const { insights } = await generateHealthInsights(request);

        // Store insights in database
        console.log('Storing insights...');
        const count = createBulkInsights(insights);
        console.log(`Created ${count} insights for patient ${patient.id}`);

      } catch (error) {
        console.error(`Error processing patient ${patient.id}:`, error);
        continue; // Continue with next patient
      }
    }

    console.log('\nInsight generation completed successfully!');

  } catch (error) {
    console.error('Error during insight generation:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
