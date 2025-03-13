'use client';

import { ScheduleActivity, WorkoutActivityDetails } from '@/lib/types/health';
import { textToArray, formatArrayToText } from '../utils/form-helpers';

interface WorkoutFormProps {
  details: WorkoutActivityDetails;
  onChange: (updates: Partial<ScheduleActivity>) => void;
}

export const WorkoutForm = ({ details, onChange }: WorkoutFormProps) => {
  const updateDetails = (updates: Partial<WorkoutActivityDetails>) => {
    onChange({
      details: {
        ...details,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Intensity
        </label>
        <select
          value={details.intensity}
          onChange={(e) => updateDetails({ 
            intensity: e.target.value as WorkoutActivityDetails['intensity']
          })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        >
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Target Muscle Groups
        </label>
        <textarea
          value={formatArrayToText(details.targetMuscleGroups)}
          onChange={(e) => updateDetails({ 
            targetMuscleGroups: textToArray(e.target.value)
          })}
          placeholder="Enter each muscle group on a new line"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Modifications
        </label>
        <textarea
          value={formatArrayToText(details.modifications)}
          onChange={(e) => updateDetails({ 
            modifications: textToArray(e.target.value)
          })}
          placeholder="Enter each modification on a new line"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>
    </div>
  );
};

export default WorkoutForm;
