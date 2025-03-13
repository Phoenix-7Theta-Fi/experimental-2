import { getDB } from '../src/lib/db';
import { seedNutrition } from '../src/lib/db/nutrition';
import { seedWorkouts } from '../src/lib/db/workouts';
import { seedYoga } from '../src/lib/db/yoga';
import { seedMentalHealthData } from '../src/lib/db/mental-health';
import { seedMedicationData } from '../src/lib/db/medication';
import { seedBiomarkerData } from '../src/lib/db/biomarkers';
import { createTreatmentPlan } from '../src/lib/db/treatment-plans';
import { seedDailySchedule } from '../src/lib/db/daily-schedule';

type HealthDataCheck = {
  nutrition: boolean;
  workouts: boolean;
  yoga: boolean;
  mentalHealth: boolean;
  medication: boolean;
  biomarker: boolean;
  treatment: boolean;
  schedule: boolean;
};

function checkUserHealthData(userId: number): HealthDataCheck {
  const db = getDB();
  
  return {
    nutrition: Boolean(db.prepare('SELECT 1 FROM nutrition WHERE user_id = ? LIMIT 1').get(userId)),
    workouts: Boolean(db.prepare('SELECT 1 FROM workouts WHERE user_id = ? LIMIT 1').get(userId)),
    yoga: Boolean(db.prepare('SELECT 1 FROM yoga_metrics WHERE user_id = ? LIMIT 1').get(userId)),
    mentalHealth: Boolean(db.prepare('SELECT 1 FROM mental_health WHERE user_id = ? LIMIT 1').get(userId)),
    medication: Boolean(db.prepare('SELECT 1 FROM medications WHERE user_id = ? LIMIT 1').get(userId)),
    biomarker: Boolean(db.prepare('SELECT 1 FROM biomarkers WHERE user_id = ? LIMIT 1').get(userId)),
    treatment: Boolean(db.prepare('SELECT 1 FROM treatment_plans WHERE user_id = ? LIMIT 1').get(userId)),
    schedule: Boolean(db.prepare('SELECT 1 FROM daily_schedules WHERE user_id = ? LIMIT 1').get(userId))
  };
}

function generateSampleTreatmentPlan(userId: number) {
  const samplePlan = {
    user_id: userId,
    problemOverview: {
      currentStatus: {
        primaryCondition: "Type 2 Diabetes",
        symptoms: ["Frequent urination", "Increased thirst", "Fatigue"],
        severity: "moderate" as const
      },
      keyBiomarkers: [
        {
          name: "Fasting Blood Glucose",
          current: 140,
          target: 100,
          unit: "mg/dL"
        },
        {
          name: "HbA1c",
          current: 7.2,
          target: 6.5,
          unit: "%"
        }
      ],
      riskFactors: ["Family history", "Sedentary lifestyle", "Poor diet"]
    },
    treatmentStrategy: {
      ayurvedic: {
        herbs: [
          {
            name: "Gymnema Sylvestre",
            dosage: "500mg",
            timing: "Before meals",
            duration: "3 months"
          },
          {
            name: "Turmeric",
            dosage: "1000mg",
            timing: "With meals",
            duration: "Ongoing"
          }
        ],
        yoga: [
          {
            asana: "Sun Salutation",
            duration: "15 minutes",
            frequency: "Daily",
            notes: "Morning practice"
          },
          {
            asana: "Pranayama",
            duration: "10 minutes",
            frequency: "Twice daily",
            notes: "Focus on deep breathing"
          }
        ],
        diet: [
          {
            recommendation: "Low Glycemic Diet",
            reason: "Blood sugar control",
            restrictions: ["Refined sugars", "White rice", "Processed foods"]
          }
        ]
      },
      modern: {
        exercise: {
          type: "Mixed cardio and strength",
          intensity: "Moderate",
          frequency: "5 times per week",
          duration: "45 minutes"
        },
        sleep: {
          targetHours: 8,
          optimizations: [
            "Regular sleep schedule",
            "No screens before bed",
            "Cool room temperature"
          ]
        },
        biohacking: [
          {
            intervention: "CGM monitoring",
            protocol: "Continuous tracking",
            frequency: "24/7"
          },
          {
            intervention: "Cold exposure",
            protocol: "Cold showers",
            frequency: "3 times per week"
          }
        ]
      },
      lifestyle: [
        "Regular meal timing",
        "Stress management through meditation",
        "Regular blood sugar monitoring"
      ]
    },
    goals: {
      shortTerm: [
        {
          description: "Reduce fasting blood glucose",
          targetDate: "2025-06-05",
          metrics: [
            {
              name: "Morning glucose",
              target: 110,
              unit: "mg/dL"
            }
          ]
        }
      ],
      longTerm: [
        {
          description: "Achieve HbA1c target",
          targetDate: "2025-09-05",
          milestones: [
            "Reduce HbA1c to 7.0% by month 1",
            "Reduce HbA1c to 6.8% by month 2",
            "Reach target HbA1c of 6.5% by month 3"
          ]
        }
      ]
    }
  };
  
  createTreatmentPlan(samplePlan);
}

function generateDataForUser(userId: number, healthDataStatus: HealthDataCheck) {
  console.log(`Generating missing health data for user ${userId}...`);

  const generateAll = Object.values(healthDataStatus).every(exists => !exists);
  console.log(generateAll ? 'No existing data found, generating all data...' : 'Generating missing data...');

  if (generateAll || !healthDataStatus.nutrition) {
    console.log('Generating nutrition data...');
    seedNutrition([userId]);
  }

  if (generateAll || !healthDataStatus.workouts) {
    console.log('Generating workout data...');
    seedWorkouts([userId]);
  }

  if (generateAll || !healthDataStatus.yoga) {
    console.log('Generating yoga data...');
    seedYoga([userId]);
  }

  if (generateAll || !healthDataStatus.mentalHealth) {
    console.log('Generating mental health data...');
    seedMentalHealthData([userId]);
  }

  if (generateAll || !healthDataStatus.medication) {
    console.log('Generating medication data...');
    seedMedicationData([userId]);
  }

  if (generateAll || !healthDataStatus.biomarker) {
    console.log('Generating biomarker data...');
    seedBiomarkerData([userId]);
  }

  if (generateAll || !healthDataStatus.treatment) {
    console.log('Generating treatment plan data...');
    generateSampleTreatmentPlan(userId);
  }

  if (generateAll || !healthDataStatus.schedule) {
    console.log('Generating daily schedule data...');
    seedDailySchedule([userId]);
  }

  console.log(`Health data generation complete for user ${userId}`);
}

async function generateHealthData() {
  console.log('\nChecking user health data...');
  const db = getDB();
  
  // Get all patient users
  const patients = db.prepare("SELECT id FROM users WHERE role = 'patient'").all() as { id: number }[];
  console.log(`Found ${patients.length} patients`);

  // Check and generate data for each patient
  for (const patient of patients) {
    console.log(`\nChecking health data for user ${patient.id}...`);
    const healthDataStatus = checkUserHealthData(patient.id);
    
    const missingData = Object.entries(healthDataStatus)
      .filter(([_, exists]) => !exists)
      .map(([type]) => type);

    if (missingData.length > 0) {
      console.log(`Missing data types for user ${patient.id}:`, missingData.join(', '));
      generateDataForUser(patient.id, healthDataStatus);
    } else {
      console.log(`All health data exists for user ${patient.id}`);
    }
  }

  console.log('\nHealth data check and generation complete!\n');
}

// Add command line argument support for specific user
const args = process.argv.slice(2);
const userIdArg = args.indexOf('--user');
const forceArg = args.indexOf('--force');

// Run if this is the main module
if (require.main === module) {
  if (userIdArg !== -1 && args[userIdArg + 1]) {
    // Generate for specific user
    const userId = parseInt(args[userIdArg + 1]);
    const db = getDB();
    const user = db.prepare("SELECT id, role FROM users WHERE id = ?").get(userId) as { id: number; role: string } | undefined;
    
    if (user && user.role === 'patient') {
      const status = checkUserHealthData(userId);
      if (forceArg !== -1) {
        console.log('Force flag detected, regenerating all data...');
        generateDataForUser(userId, { 
          nutrition: false, 
          workouts: false, 
          yoga: false, 
          mentalHealth: false, 
          medication: false, 
          biomarker: false, 
          treatment: false,
          schedule: false 
        });
      } else if (Object.values(status).some(exists => !exists)) {
        generateDataForUser(userId, status);
      } else {
        console.log(`All health data already exists for user ${userId}`);
      }
    } else {
      console.error('User not found or not a patient');
      process.exit(1);
    }
  } else {
    // Generate for all patients
    generateHealthData()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('\nScript failed:', error);
        process.exit(1);
      });
  }
}

export { generateHealthData, checkUserHealthData, generateDataForUser };
