'use client';

import { ScheduleActivity, MeditationYogaActivityDetails } from '@/lib/types/health';
import { textToArray, formatArrayToText } from '../utils/form-helpers';

interface MeditationYogaFormProps {
  details: MeditationYogaActivityDetails;
  type: 'meditation' | 'yoga';
  onChange: (updates: Partial<ScheduleActivity>) => void;
}

export const MeditationYogaForm = ({ 
  details, 
  type, 
  onChange 
}: MeditationYogaFormProps) => {
  const updateDetails = (updates: Partial<MeditationYogaActivityDetails>) => {
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
          Technique
        </label>
        <input
          type="text"
          value={details.technique}
          onChange={(e) => updateDetails({ technique: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
          placeholder={`Enter ${type} technique`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Posture
        </label>
        <input
          type="text"
          value={details.posture}
          onChange={(e) => updateDetails({ posture: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
          placeholder={`Enter ${type} posture`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Breathing Pattern
        </label>
        <input
          type="text"
          value={details.breathingPattern}
          onChange={(e) => updateDetails({ breathingPattern: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
          placeholder="Enter breathing pattern"
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

export default MeditationYogaForm;
