'use client';

import { MealActivityDetails } from '@/lib/types/health';

interface MealDetailsProps {
  details: MealActivityDetails;
}

export const MealDetails = ({ details }: MealDetailsProps) => {
  return (
    <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
      <h4 className="font-medium text-primary">Meal Details</h4>
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Protein</p>
            <p className="text-gray-300">{details.nutrients.protein}g</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Carbs</p>
            <p className="text-gray-300">{details.nutrients.carbs}g</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Fats</p>
            <p className="text-gray-300">{details.nutrients.fats}g</p>
          </div>
        </div>
        <p className="text-gray-300">Portions: {details.portions}</p>
        <div>
          <p className="text-gray-400 mb-1">Food Combinations:</p>
          <ul className="list-disc list-inside text-gray-300">
            {details.foodCombinations.map((combo, idx) => (
              <li key={idx}>{combo}</li>
            ))}
          </ul>
        </div>
        <p className="text-gray-300 mt-2">
          Hydration: {details.hydrationTips}
        </p>
      </div>
    </div>
  );
};

export default MealDetails;
