export interface MacroNutrient {
  name: string;
  value: number;
  color: string;
}

export interface MedicationTracking {
  medications: MedicationData[];
  adherence: {
    [medicationId: number]: {
      date: string;
      taken: boolean;
    }[];
  };
}

export interface NutritionData {
  id: number;
  user_id: number;
  date: string;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  vitamin_a: number;
  vitamin_b12: number;
  vitamin_c: number;
  vitamin_d: number;
  iron: number;
  calcium: number;
  zinc: number;
}

export interface WorkoutData {
  id: number;
  user_id: number;
  date: string;
  power_index: number;
  bench_press: number;
  squat: number;
  deadlift: number;
  muscle_balance: number;
  vo2_max: number;
  resting_heart_rate: number;
  max_heart_rate: number;
  endurance: number;
  pace: number;
}

export interface YogaData {
  id: number;
  user_id: number;
  date: string;
  flexibility: {
    spine: number;
    hips: number;
    shoulders: number;
    balance: number;
    overall: number;
  };
  practice: {
    weeklyCompletion: number;
    streak: number;
    duration: number;
  };
  poses: {
    beginner: { completed: number; total: number };
    intermediate: { completed: number; total: number };
    advanced: { completed: number; total: number };
  };
}

export interface MentalHealthData {
  id: number;
  user_id: number;
  date: string;
  meditation: {
    minutes: number;
    streak: number;
    goal: number;
    progress: number;
  };
  sleep: {
    hours: number;
    quality: number;
    deep: number;
    light: number;
    rem: number;
    consistency: number;
  };
  mood: {
    category: string;
    intensity: number;
  };
  wellbeing: {
    stressLevel: number;
    recoveryScore: number;
    overallScore: number;
  };
}

export interface MedicationData {
  id: number;
  user_id: number;
  type: 'ayurvedic' | 'modern' | 'supplement';
  name: string;
  dosage: string;
  frequency: string;
  timing: 'morning' | 'afternoon' | 'evening' | 'night';
  with_food: boolean;
  adherence?: {
    date: string;
    taken: boolean;
  }[];
}

export interface BiomarkerData {
  id: number;
  user_id: number;
  date: string;
  glucose: {
    fasting: number | null;
    postPrandial: number | null;
    hba1c: number | null;
  };
  lipids: {
    totalCholesterol: number | null;
    hdl: number | null;
    ldl: number | null;
    triglycerides: number | null;
  };
  thyroid: {
    tsh: number | null;
    t3: number | null;
    t4: number | null;
  };
  vitamins: {
    d: number | null;
    b12: number | null;
  };
  inflammation: {
    crp: number | null;
    esr: number | null;
  };
  liver: {
    alt: number | null;
    ast: number | null;
    albumin: number | null;
  };
  kidney: {
    creatinine: number | null;
    urea: number | null;
    uricAcid: number | null;
  };
}

export interface TreatmentPlan {
  id: number;
  user_id: number;
  problemOverview: {
    currentStatus: {
      primaryCondition: string;
      symptoms: string[];
      severity: 'mild' | 'moderate' | 'severe';
    };
    keyBiomarkers: Array<{
      name: string;
      current: number;
      target: number;
      unit: string;
    }>;
    riskFactors: string[];
  };
  
  treatmentStrategy: {
    ayurvedic: {
      herbs: Array<{
        name: string;
        dosage: string;
        timing: string;
        duration: string;
      }>;
      yoga: Array<{
        asana: string;
        duration: string;
        frequency: string;
        notes: string;
      }>;
      diet: Array<{
        recommendation: string;
        reason: string;
        restrictions: string[];
      }>;
    };
    modern: {
      exercise: {
        type: string;
        intensity: string;
        frequency: string;
        duration: string;
      };
      sleep: {
        targetHours: number;
        optimizations: string[];
      };
      biohacking: Array<{
        intervention: string;
        protocol: string;
        frequency: string;
      }>;
    };
    lifestyle: string[];
  };
  
  goals: {
    shortTerm: Array<{
      description: string;
      targetDate: string;
      metrics: Array<{
        name: string;
        target: number;
        unit: string;
      }>;
    }>;
    longTerm: Array<{
      description: string;
      targetDate: string;
      milestones: string[];
    }>;
  };
}

export interface ActivityBenefits {
  treatmentGoals: string[];
  conditionSpecific: string[];
  personalizedTips: string[];
  keyMetrics: Array<{
    name: string;
    target: number;
    unit: string;
    currentValue?: number;
  }>;
}

export interface MedicationActivityDetails {
  timing: 'before_meal' | 'after_meal' | 'empty_stomach';
  sideEffects: string[];
  interactions: string[];
  benefits: ActivityBenefits;
}

export interface WorkoutActivityDetails {
  intensity: 'low' | 'moderate' | 'high';
  targetMuscleGroups: string[];
  modifications: string[];
  benefits: ActivityBenefits;
}

export interface MeditationYogaActivityDetails {
  technique: string;
  posture: string;
  breathingPattern: string;
  modifications: string[];
  benefits: ActivityBenefits;
}

export interface MealActivityDetails {
  nutrients: {
    protein: number;
    carbs: number;
    fats: number;
  };
  portions: string;
  foodCombinations: string[];
  hydrationTips: string;
  benefits: ActivityBenefits;
}

export interface BiohackingActivityDetails {
  protocol: string;
  timing: string;
  scientificBasis: string;
  precautions: string[];
  benefits: ActivityBenefits;
}

export interface ScheduleActivity {
  id: number;
  type: 'meal' | 'workout' | 'meditation' | 'medication' | 'yoga' | 'biohacking' | 'treatment';
  title: string;
  time: string;
  duration: number;
  description: string;
  completed: boolean;
  activityLog?: {
    notes?: string;
    metrics?: {
      [key: string]: number | string;
    };
  };
  details: MedicationActivityDetails | WorkoutActivityDetails | MeditationYogaActivityDetails | 
          MealActivityDetails | BiohackingActivityDetails;
}

export interface DailyScheduleData {
  id: number;
  user_id: number;
  date: string;
  activities: ScheduleActivity[];
}

// New chart-specific interfaces
export interface TimeRange {
  start: string;
  end: string;
}

export interface ChartDisplayOptions {
  showTargetZones: boolean;
  showTrendlines: boolean;
  showDataLabels: boolean;
}

export interface BiomarkerChartConfig {
  timeRange: TimeRange;
  displayOptions: ChartDisplayOptions;
  selectedCategories: BiomarkerCategory[];
}

export type BiomarkerCategory = 
  | 'glucose'
  | 'lipids'
  | 'thyroid'
  | 'vitamins'
  | 'inflammation'
  | 'liver'
  | 'kidney';

export interface BiomarkerTrend {
  category: BiomarkerCategory;
  name: string;
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
}

export interface CategorySummary {
  category: BiomarkerCategory;
  metrics: Array<{
    name: string;
    value: number;
    target: { min: number; max: number };
    unit: string;
  }>;
}

export const BIOMARKER_RANGES = {
  glucose: {
    fasting: { min: 70, max: 100 },
    postPrandial: { min: 80, max: 140 },
    hba1c: { min: 4, max: 5.7 }
  },
  lipids: {
    totalCholesterol: { min: 125, max: 200 },
    hdl: { min: 40, max: 60 },
    ldl: { min: 0, max: 100 },
    triglycerides: { min: 0, max: 150 }
  },
  thyroid: {
    tsh: { min: 0.4, max: 4.0 },
    t3: { min: 80, max: 200 },
    t4: { min: 5.0, max: 12.0 }
  },
  vitamins: {
    d: { min: 20, max: 50 },
    b12: { min: 200, max: 900 }
  },
  inflammation: {
    crp: { min: 0, max: 3.0 },
    esr: { min: 0, max: 20 }
  },
  liver: {
    alt: { min: 7, max: 56 },
    ast: { min: 10, max: 40 },
    albumin: { min: 3.5, max: 5.0 }
  },
  kidney: {
    creatinine: { min: 0.6, max: 1.2 },
    urea: { min: 7, max: 20 },
    uricAcid: { min: 2.4, max: 6.0 }
  }
};
