'use client';

import { InsightsList } from '../insights/InsightsList';

interface BiomarkerInsightsProps {
  patientId: number;
  className?: string;
}

export function BiomarkerInsights({ patientId, className }: BiomarkerInsightsProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-100">Key Insights</h3>
        <p className="text-slate-400 text-sm">
          AI-generated insights based on your biomarker trends
        </p>
      </div>
      <InsightsList 
        patientId={patientId} 
        section="biomarkers"
      />
    </div>
  );
}
