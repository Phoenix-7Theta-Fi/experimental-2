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
