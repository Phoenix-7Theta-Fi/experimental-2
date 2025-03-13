import { BiomarkerData, WorkoutData, YogaData, MentalHealthData, MedicationData } from './health';

export type HealthSection = 'biomarkers' | 'workout' | 'yoga' | 'mental' | 'diet_medication';

export interface MetricData {
  name: string;
  current: number;
  previous: number | null;
  change: string;
  unit: string;
  target?: {
    min: number;
    max: number;
  };
}

export interface HealthInsight {
  id: number;
  patient_id: number;
  section: HealthSection;
  insight_data: {
    title: string;
    metrics: MetricData[];
    analysis: string;
    recommendations: string[];
    status: 'improving' | 'declining' | 'stable';
    priority: 'high' | 'medium' | 'low';
  };
  created_at: string;
}

// Types for generating insights
export interface InsightGenerationData {
  biomarkers?: BiomarkerData[];
  workout?: WorkoutData[];
  yoga?: YogaData[];
  mentalHealth?: MentalHealthData[];
  medication?: MedicationData[];
}

export interface InsightGenerationRequest {
  patient_id: number;
  data: InsightGenerationData;
  timeframe?: {
    start: string;
    end: string;
  };
}

export interface InsightGenerationResponse {
  insights: HealthInsight[];
  generated_at: string;
}

// Utility type for insight database operations
export type InsightCreateData = Omit<HealthInsight, 'id' | 'created_at'>;
