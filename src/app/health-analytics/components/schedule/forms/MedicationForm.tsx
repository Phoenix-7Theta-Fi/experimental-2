'use client';

import { ScheduleActivity, MedicationActivityDetails } from '@/lib/types/health';
import { MedicationTiming } from '../utils/activity-types';
import { textToArray, formatArrayToText } from '../utils/form-helpers';

interface MedicationFormProps {
  details: MedicationActivityDetails;
  onChange: (updates: Partial<ScheduleActivity>) => void;
}

export const MedicationForm = ({ details, onChange }: MedicationFormProps) => {
  const updateDetails = (updates: Partial<MedicationActivityDetails>) => {
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
          Timing
        </label>
        <select
          value={details.timing}
          onChange={(e) => updateDetails({ timing: e.target.value as MedicationTiming })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        >
          <option value="before_meal">Before Meal</option>
          <option value="after_meal">After Meal</option>
          <option value="empty_stomach">Empty Stomach</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Side Effects
        </label>
        <textarea
          value={formatArrayToText(details.sideEffects)}
          onChange={(e) => updateDetails({ 
            sideEffects: textToArray(e.target.value)
          })}
          placeholder="Enter each side effect on a new line"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Interactions
        </label>
        <textarea
          value={formatArrayToText(details.interactions)}
          onChange={(e) => updateDetails({ 
            interactions: textToArray(e.target.value)
          })}
          placeholder="Enter each interaction on a new line"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>
    </div>
  );
};

export default MedicationForm;
