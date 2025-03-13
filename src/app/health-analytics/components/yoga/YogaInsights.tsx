'use client';

import { InsightsList } from '../insights/InsightsList';

interface YogaInsightsProps {
  patientId: number;
  className?: string;
}

export function YogaInsights({ patientId, className }: YogaInsightsProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-100">Yoga Practice Insights</h3>
        <p className="text-slate-400 text-sm">
          AI-generated insights based on your yoga practice patterns
        </p>
      </div>
      <InsightsList 
        patientId={patientId} 
        section="yoga"
      />
    </div>
  );
}
