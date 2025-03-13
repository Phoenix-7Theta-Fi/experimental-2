'use client';

import { InsightsList } from '../insights/InsightsList';

interface MentalHealthInsightsProps {
  patientId: number;
  className?: string;
}

export function MentalHealthInsights({ patientId, className }: MentalHealthInsightsProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-100">Mental Health Insights</h3>
        <p className="text-slate-400 text-sm">
          AI-generated insights based on your mood, sleep, and meditation patterns
        </p>
      </div>
      <InsightsList 
        patientId={patientId} 
        section="mental"
      />
    </div>
  );
}
