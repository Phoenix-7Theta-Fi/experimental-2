import { TreatmentPlan, ActivityBenefits, ScheduleActivity } from "../types/health";

function generateMedicationDetails(activity: ScheduleActivity, plan: TreatmentPlan) {
  const condition = plan.problemOverview.currentStatus.primaryCondition;
  const symptoms = plan.problemOverview.currentStatus.symptoms;
  
  return {
    timing: symptoms.includes("Digestive issues") ? "after_meal" : "before_meal",
    sideEffects: [
      "Mild drowsiness initially",
      "May cause temporary dryness",
      "Digestive adjustment period"
    ],
    interactions: [
      "Take separately from other medications",
      "Avoid caffeine within 2 hours",
      "Best absorbed with water"
    ],
    benefits: {
      treatmentGoals: plan.goals.shortTerm.map(goal => 
        `Supports: ${goal.description}`
      ),
      conditionSpecific: [
        `Targeted support for ${condition}`,
        `Helps manage ${symptoms.join(", ")}`,
        "Supports overall treatment plan adherence"
      ],
      personalizedTips: [
        "Take with a full glass of water",
        `Best timing based on your ${symptoms.includes("Digestive issues") ? "digestive patterns" : "daily routine"}`,
        "Track any side effects in notes"
      ],
      keyMetrics: plan.problemOverview.keyBiomarkers
    }
  };
}

function generateWorkoutDetails(activity: ScheduleActivity, plan: TreatmentPlan) {
  const { intensity, frequency } = plan.treatmentStrategy.modern.exercise;
  const severity = plan.problemOverview.currentStatus.severity;
  
  return {
    intensity: severity === "severe" ? "low" : 
              severity === "moderate" ? "moderate" : "high",
    targetMuscleGroups: [
      "Core stabilizers",
      "Lower body",
      "Upper body resistance"
    ],
    modifications: [
      `Adjusted for ${severity} condition level`,
      "Focus on controlled movements",
      "Regular rest intervals"
    ],
    benefits: {
      treatmentGoals: [
        `Building towards ${frequency} consistency`,
        "Improving overall strength",
        "Enhancing metabolic health"
      ],
      conditionSpecific: [
        `Safe exercise protocol for ${plan.problemOverview.currentStatus.primaryCondition}`,
        "Addresses physical deconditioning",
        "Supports stress management"
      ],
      personalizedTips: [
        `Maintain ${intensity} intensity`,
        "Listen to body signals",
        "Stay hydrated throughout"
      ],
      keyMetrics: [
        {
          name: "Heart Rate",
          target: severity === "severe" ? 120 : 140,
          unit: "bpm"
        },
        {
          name: "Perceived Exertion",
          target: severity === "severe" ? 5 : 7,
          unit: "RPE"
        }
      ]
    }
  };
}

function generateMeditationYogaDetails(activity: ScheduleActivity, plan: TreatmentPlan) {
  const yogaAsanas = plan.treatmentStrategy.ayurvedic.yoga;
  
  return {
    technique: activity.type === "yoga" ? 
      "Gentle flow with breathing focus" : 
      "Mindfulness meditation",
    posture: "Comfortable seated position, spine aligned",
    breathingPattern: "Deep diaphragmatic breathing",
    modifications: [
      "Use props for support",
      "Modified poses available",
      "Focus on comfort"
    ],
    benefits: {
      treatmentGoals: plan.goals.longTerm.map(goal => 
        `Supporting: ${goal.description}`
      ),
      conditionSpecific: [
        "Reduces stress response",
        "Improves mind-body awareness",
        "Enhances emotional regulation"
      ],
      personalizedTips: yogaAsanas.map(yoga => yoga.notes),
      keyMetrics: [
        {
          name: "Session Duration",
          target: 20,
          unit: "minutes"
        },
        {
          name: "Weekly Frequency",
          target: 5,
          unit: "sessions"
        }
      ]
    }
  };
}

function generateMealDetails(activity: ScheduleActivity, plan: TreatmentPlan) {
  const dietRecommendations = plan.treatmentStrategy.ayurvedic.diet[0];
  
  return {
    nutrients: {
      protein: 25,
      carbs: 50,
      fats: 25
    },
    portions: "Balanced plate method",
    foodCombinations: [
      "Protein + complex carbs",
      "Healthy fats with vegetables",
      "Seasonal whole foods"
    ],
    hydrationTips: "Sip warm water between bites",
    benefits: {
      treatmentGoals: [
        dietRecommendations.recommendation,
        "Supporting metabolic health",
        "Optimizing nutrient intake"
      ],
      conditionSpecific: [
        dietRecommendations.reason,
        "Addresses nutritional needs",
        "Supports treatment efficacy"
      ],
      personalizedTips: [
        "Eat mindfully",
        "Chew thoroughly",
        ...dietRecommendations.restrictions.map(r => `Avoid: ${r}`)
      ],
      keyMetrics: plan.problemOverview.keyBiomarkers.filter(
        biomarker => ["Glucose", "Cholesterol"].includes(biomarker.name)
      )
    }
  };
}

function generateBiohackingDetails(activity: ScheduleActivity, plan: TreatmentPlan) {
  const biohacking = plan.treatmentStrategy.modern.biohacking[0];
  
  return {
    protocol: biohacking.protocol,
    timing: biohacking.frequency,
    scientificBasis: "Research-backed intervention for optimization",
    precautions: [
      "Monitor response",
      "Adjust based on results",
      "Maintain consistency"
    ],
    benefits: {
      treatmentGoals: [
        `Optimizing: ${biohacking.intervention}`,
        "Enhancing recovery",
        "Supporting adaptation"
      ],
      conditionSpecific: [
        "Targeted biological optimization",
        "Supports cellular health",
        "Enhances natural healing"
      ],
      personalizedTips: [
        `Follow ${biohacking.protocol} protocol`,
        `Maintain ${biohacking.frequency} frequency`,
        "Track response in notes"
      ],
      keyMetrics: plan.problemOverview.keyBiomarkers
    }
  };
}

export function generateActivityDetails(activity: ScheduleActivity, plan: TreatmentPlan) {
  switch (activity.type) {
    case "medication":
      return generateMedicationDetails(activity, plan);
    case "workout":
      return generateWorkoutDetails(activity, plan);
    case "meditation":
    case "yoga":
      return generateMeditationYogaDetails(activity, plan);
    case "meal":
      return generateMealDetails(activity, plan);
    case "biohacking":
      return generateBiohackingDetails(activity, plan);
    default:
      throw new Error(`Unsupported activity type: ${activity.type}`);
  }
}
