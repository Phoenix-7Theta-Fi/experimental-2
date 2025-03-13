'use client';

import { ScheduleActivity, ActivityBenefits } from '@/lib/types/health';
import { textToArray } from '../utils/form-helpers';

interface BenefitsEditProps {
  benefits: ActivityBenefits;
  onChange: (updates: Partial<ScheduleActivity>) => void;
}

export const BenefitsEdit = ({ benefits, onChange }: BenefitsEditProps) => {
  const updateBenefits = (updates: Partial<ActivityBenefits>) => {
    onChange({
      details: {
        benefits: {
          ...benefits,
          ...updates
        }
      }
    } as Partial<ScheduleActivity>);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Treatment Goals
        </label>
        <textarea
          value={benefits.treatmentGoals.join('\n')}
          onChange={(e) => updateBenefits({ 
            treatmentGoals: textToArray(e.target.value)
          })}
          placeholder="Enter each goal on a new line"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Condition-Specific Benefits
        </label>
        <textarea
          value={benefits.conditionSpecific.join('\n')}
          onChange={(e) => updateBenefits({ 
            conditionSpecific: textToArray(e.target.value)
          })}
          placeholder="Enter each benefit on a new line"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Personal Tips
        </label>
        <textarea
          value={benefits.personalizedTips.join('\n')}
          onChange={(e) => updateBenefits({ 
            personalizedTips: textToArray(e.target.value)
          })}
          placeholder="Enter each tip on a new line"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>
    </div>
  );
};

export default BenefitsEdit;
