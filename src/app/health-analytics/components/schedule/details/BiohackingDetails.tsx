'use client';

import { BiohackingActivityDetails } from '@/lib/types/health';

interface BiohackingDetailsProps {
  details: BiohackingActivityDetails;
  type: 'biohacking' | 'treatment';
}

export const BiohackingDetails = ({ details, type }: BiohackingDetailsProps) => {
  return (
    <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
      <h4 className="font-medium text-primary">Protocol Details</h4>
      <div className="space-y-2">
        <p className="text-gray-300">Protocol: {details.protocol}</p>
        <p className="text-gray-300">Timing: {details.timing}</p>
        <p className="text-gray-300">Scientific Basis: {details.scientificBasis}</p>
        <div>
          <p className="text-gray-400 mb-1">Precautions:</p>
          <ul className="list-disc list-inside text-gray-300">
            {details.precautions.map((precaution, idx) => (
              <li key={idx}>{precaution}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BiohackingDetails;
