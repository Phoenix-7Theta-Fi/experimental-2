'use client';

import { useState } from 'react';
import { 
  ScheduleActivity, 
  TreatmentPlan,
  ActivityBenefits,
  MedicationActivityDetails,
  WorkoutActivityDetails,
  MeditationYogaActivityDetails,
  MealActivityDetails,
  BiohackingActivityDetails
} from '@/lib/types/health';
import { generateActivityDetails } from '@/lib/utils/activity-benefits';

const initializeActivityDetails = (type: ActivityType): ScheduleActivity['details'] => {
  const emptyBenefits: ActivityBenefits = {
    treatmentGoals: [],
    conditionSpecific: [],
    personalizedTips: [],
    keyMetrics: []
  };

  switch (type) {
    case 'medication':
      return {
        timing: 'before_meal',
        sideEffects: [],
        interactions: [],
        benefits: emptyBenefits
      } as MedicationActivityDetails;
    case 'workout':
      return {
        intensity: 'moderate',
        targetMuscleGroups: [],
        modifications: [],
        benefits: emptyBenefits
      } as WorkoutActivityDetails;
    case 'meditation':
    case 'yoga':
      return {
        technique: '',
        posture: '',
        breathingPattern: '',
        modifications: [],
        benefits: emptyBenefits
      } as MeditationYogaActivityDetails;
    case 'meal':
      return {
        nutrients: { protein: 0, carbs: 0, fats: 0 },
        portions: '',
        foodCombinations: [],
        hydrationTips: '',
        benefits: emptyBenefits
      } as MealActivityDetails;
    case 'biohacking':
      return {
        protocol: '',
        timing: '',
        scientificBasis: '',
        precautions: [],
        benefits: emptyBenefits
      } as BiohackingActivityDetails;
    case 'treatment':
      return {
        protocol: '',
        timing: '',
        scientificBasis: '',
        precautions: [],
        benefits: emptyBenefits
      } as BiohackingActivityDetails;
    default:
      throw new Error(`Unsupported activity type: ${type}`);
  }
};

type ActivityType = ScheduleActivity['type'];

const activityTypes: { value: ActivityType; label: string }[] = [
  { value: 'medication', label: 'Medication' },
  { value: 'meal', label: 'Meal' },
  { value: 'workout', label: 'Workout' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'biohacking', label: 'Biohacking' },
  { value: 'treatment', label: 'Treatment' }
];

interface NewActivityFormProps {
  onAdd: (activity: Omit<ScheduleActivity, 'id'>) => void;
  onCancel: () => void;
  treatmentPlan: TreatmentPlan;
}

export const NewActivityForm = ({ onAdd, onCancel, treatmentPlan }: NewActivityFormProps) => {
  const [type, setType] = useState<ActivityType>('medication');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState(30);
  const [description, setDescription] = useState('');

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a temporary activity object for details generation
    const tempActivity: ScheduleActivity = {
      id: -1, // Temporary ID
      type,
      title,
      time,
      duration,
      description,
      completed: false,
      activityLog: {
        notes: ''
      },
      // Initialize with basic details structure based on activity type
      details: initializeActivityDetails(type)
    };

    // Generate proper details based on activity type and cast to the correct type
    const newDetails = generateActivityDetails(tempActivity, treatmentPlan) as ScheduleActivity['details'];

    const newActivity: Omit<ScheduleActivity, 'id'> = {
      type,
      title,
      time,
      duration,
      description,
      completed: false,
      activityLog: {
        notes: ''
      },
      details: newDetails
    };

    onAdd(newActivity);
  };

  return (
    <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold text-gray-200 mb-4">Add New Activity</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Activity Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ActivityType)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white 
                     focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {activityTypes.map((activityType) => (
              <option key={activityType.value} value={activityType.value}>
                {activityType.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Activity title"
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white 
                     focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white 
                     focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min="5"
            max="240"
            step="5"
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white 
                     focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Activity description"
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white 
                     focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white 
                     bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary 
                     hover:bg-primary/90 rounded-md transition-colors"
          >
            Add Activity
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewActivityForm;
