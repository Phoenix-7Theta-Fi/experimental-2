import { 
  ScheduleActivity,
  MedicationActivityDetails,
  WorkoutActivityDetails,
  MeditationYogaActivityDetails,
  MealActivityDetails,
  BiohackingActivityDetails
} from '@/lib/types/health';

export type ActivityType = ScheduleActivity['type'];

export interface ActivityTypeDetails {
  medication: MedicationActivityDetails;
  workout: WorkoutActivityDetails;
  meditation: MeditationYogaActivityDetails;
  yoga: MeditationYogaActivityDetails;
  meal: MealActivityDetails;
  biohacking: BiohackingActivityDetails;
  treatment: BiohackingActivityDetails;
}

export type ActivityDetails = ActivityTypeDetails[keyof ActivityTypeDetails];

export type MedicationTiming = 'before_meal' | 'after_meal' | 'empty_stomach';
