import { getDB } from ".";
import { TreatmentPlan } from "../types/health";

export function getUserTreatmentPlan(userId: number): TreatmentPlan | undefined {
  const db = getDB();
  interface DbTreatmentPlan {
    id: number;
    user_id: number;
    problemOverview: string;
    treatmentStrategy: string;
    goals: string;
  }

  const result = db.prepare(`
    SELECT * FROM treatment_plans 
    WHERE user_id = ? 
    ORDER BY id DESC 
    LIMIT 1
  `).get(userId) as DbTreatmentPlan | undefined;

  if (!result) {
    return undefined;
  }

  return {
    id: result.id,
    user_id: result.user_id,
    problemOverview: JSON.parse(result.problemOverview),
    treatmentStrategy: JSON.parse(result.treatmentStrategy),
    goals: JSON.parse(result.goals)
  } as TreatmentPlan;
}

export function createTreatmentPlan(plan: Omit<TreatmentPlan, "id">): number {
  const db = getDB();
  const result = db.prepare(`
    INSERT INTO treatment_plans (
      user_id,
      problemOverview,
      treatmentStrategy,
      goals
    ) VALUES (?, ?, ?, ?)
  `).run(
    plan.user_id,
    JSON.stringify(plan.problemOverview),
    JSON.stringify(plan.treatmentStrategy),
    JSON.stringify(plan.goals)
  );

  return result.lastInsertRowid as number;
}

export function updateTreatmentPlan(plan: TreatmentPlan): void {
  const db = getDB();
  db.prepare(`
    UPDATE treatment_plans 
    SET 
      problemOverview = ?,
      treatmentStrategy = ?,
      goals = ?
    WHERE id = ? AND user_id = ?
  `).run(
    JSON.stringify(plan.problemOverview),
    JSON.stringify(plan.treatmentStrategy),
    JSON.stringify(plan.goals),
    plan.id,
    plan.user_id
  );
}

export function deleteTreatmentPlan(id: number, userId: number): void {
  const db = getDB();
  db.prepare('DELETE FROM treatment_plans WHERE id = ? AND user_id = ?').run(id, userId);
}

export function seedTreatmentPlans() {
  const db = getDB();
  const patients = db.prepare("SELECT id FROM users WHERE role = 'patient'").all() as { id: number }[];

  patients.forEach(patient => {
    const existingPlan = getUserTreatmentPlan(patient.id);
    if (!existingPlan) {
      createTreatmentPlan({
        user_id: patient.id,
        problemOverview: {
          currentStatus: {
            primaryCondition: "Stress-induced Health Issues",
            symptoms: ["Fatigue", "Digestive issues", "Sleep disturbance"],
            severity: "moderate"
          },
          keyBiomarkers: [
            { name: "Cortisol", current: 25, target: 15, unit: "μg/dL" },
            { name: "Vitamin D", current: 20, target: 40, unit: "ng/mL" }
          ],
          riskFactors: ["Sedentary lifestyle", "Irregular sleep", "Work stress"]
        },
        treatmentStrategy: {
          ayurvedic: {
            herbs: [
              {
                name: "Ashwagandha",
                dosage: "500mg",
                timing: "twice daily",
                duration: "3 months"
              }
            ],
            yoga: [
              {
                asana: "Surya Namaskar",
                duration: "20 minutes",
                frequency: "daily",
                notes: "Morning practice recommended"
              }
            ],
            diet: [
              {
                recommendation: "Anti-inflammatory diet",
                reason: "Reduce stress-induced inflammation",
                restrictions: ["Processed foods", "Excessive caffeine"]
              }
            ]
          },
          modern: {
            exercise: {
              type: "Mixed cardio and strength",
              intensity: "moderate",
              frequency: "4 times per week",
              duration: "45 minutes"
            },
            sleep: {
              targetHours: 8,
              optimizations: ["Regular schedule", "No screens before bed"]
            },
            biohacking: [
              {
                intervention: "Light therapy",
                protocol: "Morning sunlight exposure",
                frequency: "daily"
              }
            ]
          },
          lifestyle: ["Regular exercise", "Meditation practice", "Sleep hygiene"]
        },
        goals: {
          shortTerm: [
            {
              description: "Improve sleep quality",
              targetDate: "2024-06-01",
              metrics: [
                { name: "Sleep duration", target: 8, unit: "hours" },
                { name: "Sleep efficiency", target: 90, unit: "%" }
              ]
            }
          ],
          longTerm: [
            {
              description: "Build stress resilience",
              targetDate: "2024-12-01",
              milestones: [
                "Establish meditation practice",
                "Regular exercise routine",
                "Optimal biomarker levels"
              ]
            }
          ]
        }
      });
    }
  });

  console.log('Treatment plans seeded successfully');
}
