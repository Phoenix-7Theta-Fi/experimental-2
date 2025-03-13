'use client';

import { MedicationActivityDetails } from '@/lib/types/health';

interface MedicationDetailsProps {
  details: MedicationActivityDetails;
}

export const MedicationDetails = ({ details }: MedicationDetailsProps) => {
  return (
    <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
      <h4 className="font-medium text-primary">Medication Details</h4>
      <div className="space-y-2">
        <p className="text-gray-300">Timing: {details.timing}</p>
        <div>
          <p className="text-gray-400 mb-1">Side Effects:</p>
          <ul className="list-disc list-inside text-gray-300">
            {details.sideEffects.map((effect, idx) => (
              <li key={idx}>{effect}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-gray-400 mb-1">Interactions:</p>
          <ul className="list-disc list-inside text-gray-300">
            {details.interactions.map((interaction, idx) => (
              <li key={idx}>{interaction}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetails;
