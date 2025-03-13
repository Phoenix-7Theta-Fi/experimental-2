'use client';

import { ScheduleActivity, MealActivityDetails } from '@/lib/types/health';
import { textToArray, formatArrayToText, parseNumber } from '../utils/form-helpers';

interface MealFormProps {
  details: MealActivityDetails;
  onChange: (updates: Partial<ScheduleActivity>) => void;
}

export const MealForm = ({ details, onChange }: MealFormProps) => {
  const updateDetails = (updates: Partial<MealActivityDetails>) => {
    onChange({
      details: {
        ...details,
        ...updates
      }
    });
  };

  const updateNutrients = (key: keyof MealActivityDetails['nutrients'], value: string) => {
    updateDetails({
      nutrients: {
        ...details.nutrients,
        [key]: parseNumber(value)
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Protein (g)
          </label>
          <input
            type="number"
            value={details.nutrients.protein}
            onChange={(e) => updateNutrients('protein', e.target.value)}
            min="0"
            step="0.1"
            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Carbs (g)
          </label>
          <input
            type="number"
            value={details.nutrients.carbs}
            onChange={(e) => updateNutrients('carbs', e.target.value)}
            min="0"
            step="0.1"
            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Fats (g)
          </label>
          <input
            type="number"
            value={details.nutrients.fats}
            onChange={(e) => updateNutrients('fats', e.target.value)}
            min="0"
            step="0.1"
            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Portions
        </label>
        <input
          type="text"
          value={details.portions}
          onChange={(e) => updateDetails({ portions: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
          placeholder="e.g., 2 servings"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Food Combinations
        </label>
        <textarea
          value={formatArrayToText(details.foodCombinations)}
          onChange={(e) => updateDetails({ 
            foodCombinations: textToArray(e.target.value)
          })}
          placeholder="Enter each food combination on a new line"
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Hydration Tips
        </label>
        <textarea
          value={details.hydrationTips}
          onChange={(e) => updateDetails({ hydrationTips: e.target.value })}
          rows={2}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
          placeholder="Enter hydration recommendations"
        />
      </div>
    </div>
  );
};

export default MealForm;
