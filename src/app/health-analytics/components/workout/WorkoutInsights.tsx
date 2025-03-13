'use client';

import { InsightsList } from '../insights/InsightsList';

interface WorkoutInsightsProps {
  patientId: number;
  className?: string;
}

export function WorkoutInsights({ patientId, className }: WorkoutInsightsProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-100">Workout Insights</h3>
        <p className="text-[#94A3B8] text-sm">
          AI-generated insights based on your training performance
        </p>
      </div>
      <InsightsList 
        patientId={patientId} 
        section="workout"
      />
    </div>
  );
}
