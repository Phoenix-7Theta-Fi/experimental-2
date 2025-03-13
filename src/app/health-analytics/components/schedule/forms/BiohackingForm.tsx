'use client';

import { ScheduleActivity, BiohackingActivityDetails } from '@/lib/types/health';
import { textToArray, formatArrayToText } from '../utils/form-helpers';

interface BiohackingFormProps {
  details: BiohackingActivityDetails;
  type: 'biohacking' | 'treatment';
  onChange: (updates: Partial<ScheduleActivity>) => void;
}

export const BiohackingForm = ({ 
  details, 
  type, 
  onChange 
}: BiohackingFormProps) => {
  const updateDetails = (updates: Partial<BiohackingActivityDetails>) => {
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
          Protocol
        </label>
        <textarea
          value={details.protocol}
          onChange={(e) => updateDetails({ protocol: e.target.value })}
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
          placeholder={`Enter ${type} protocol details`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Timing
        </label>
        <input
          type="text"
          value={details.timing}
          onChange={(e) => updateDetails({ timing: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
          placeholder="Enter timing instructions"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Scientific Basis
        </label>
        <textarea
          value={details.scientificBasis}
          onChange={(e) => updateDetails({ scientificBasis: e.target.value })}
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
          placeholder="Enter scientific explanation"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Precautions
        </label>
        <textarea
          value={formatArrayToText(details.precautions)}
          onChange={(e) => updateDetails({ 
            precautions: textToArray(e.target.value)
          })}
          placeholder="Enter each precaution on a new line"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>
    </div>
  );
};

export default BiohackingForm;
