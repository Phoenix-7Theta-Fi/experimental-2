'use client';

import { MedicationTracking } from '@/lib/types/health';
import MedicationCorrelationChart from './MedicationCorrelationChart';
import AdherenceCalendar from './AdherenceCalendar';

interface MedicationSectionProps {
  data: MedicationTracking;
}

export default function MedicationSection({ data }: MedicationSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-slate-100">Medication Tracking</h2>

      <div className="space-y-3">
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-md p-3">
          <MedicationCorrelationChart />
        </div>
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-md p-3">
          <AdherenceCalendar adherenceData={data.adherence} />
        </div>
      </div>
    </section>
  );
}
