'use client';

interface BenefitsProps {
  treatmentGoals: string[];
  conditionSpecific: string[];
  personalizedTips: string[];
}

export const ActivityBenefits = ({
  treatmentGoals,
  conditionSpecific,
  personalizedTips
}: BenefitsProps) => {
  return (
    <div className="space-y-4">
      {/* Treatment Benefits */}
      <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
        <h4 className="font-medium text-primary">Benefits for Your Treatment</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          {treatmentGoals.map((goal, idx) => (
            <li key={idx}>{goal}</li>
          ))}
        </ul>
      </div>
      
      {/* Condition-Specific Benefits */}
      <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
        <h4 className="font-medium text-primary">How This Helps You</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          {conditionSpecific.map((benefit, idx) => (
            <li key={idx}>{benefit}</li>
          ))}
        </ul>
      </div>
      
      {/* Personal Tips */}
      <div className="space-y-3 bg-gray-800/30 rounded-lg p-4">
        <h4 className="font-medium text-primary">Your Personal Tips</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          {personalizedTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
