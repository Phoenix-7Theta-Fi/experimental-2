'use client';

import { InsightsList } from '../insights/InsightsList';

interface NutritionInsightsProps {
  patientId: number;
  className?: string;
}

export function NutritionInsights({ patientId, className }: NutritionInsightsProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-100">Nutrition & Medication Insights</h3>
        <p className="text-slate-400 text-sm">
          AI-generated insights based on your diet and medication patterns
        </p>
      </div>
      <InsightsList 
        patientId={patientId} 
        section="diet_medication"
      />
    </div>
  );
}
