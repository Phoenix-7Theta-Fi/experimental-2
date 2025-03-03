'use client';

import { MedicationTracking } from '@/lib/types/health';
import MedicationTypeChart from './MedicationTypeChart';
import AdherenceCalendar from './AdherenceCalendar';

interface MedicationSectionProps {
  data: MedicationTracking;
}

export default function MedicationSection({ data }: MedicationSectionProps) {
  return (
    <section className="mt-6 space-y-6">
      <h2 className="text-xl font-bold text-slate-100 mb-4">Medication Tracking</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <MedicationTypeChart medications={data.medications} />
        </div>
        <div className="w-full">
          <AdherenceCalendar adherenceData={data.adherenceData} />
        </div>
      </div>
    </section>
  );
}
