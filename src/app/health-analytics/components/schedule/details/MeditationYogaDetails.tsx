'use client';

import { MeditationYogaActivityDetails } from '@/lib/types/health';

interface MeditationYogaDetailsProps {
  details: MeditationYogaActivityDetails;
  type: 'meditation' | 'yoga';
}

export const MeditationYogaDetails = ({ details, type }: MeditationYogaDetailsProps) => {
  return (
    <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
      <h4 className="font-medium text-primary">Practice Details</h4>
      <div className="space-y-2">
        <p className="text-gray-300">Technique: {details.technique}</p>
        <p className="text-gray-300">Posture: {details.posture}</p>
        <p className="text-gray-300">Breathing: {details.breathingPattern}</p>
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

export default MeditationYogaDetails;
