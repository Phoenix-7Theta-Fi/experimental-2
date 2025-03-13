'use client';

import { WorkoutActivityDetails } from '@/lib/types/health';

interface WorkoutDetailsProps {
  details: WorkoutActivityDetails;
}

export const WorkoutDetails = ({ details }: WorkoutDetailsProps) => {
  return (
    <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
      <h4 className="font-medium text-primary">Workout Details</h4>
      <div className="space-y-2">
        <p className="text-gray-300">Intensity: {details.intensity}</p>
        <div>
          <p className="text-gray-400 mb-1">Target Muscle Groups:</p>
          <ul className="list-disc list-inside text-gray-300">
            {details.targetMuscleGroups.map((group, idx) => (
              <li key={idx}>{group}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-gray-400 mb-1">Modifications:</p>
          <ul className="list-disc list-inside text-gray-300">
            {details.modifications.map((mod, idx) => (
              <li key={idx}>{mod}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetails;
