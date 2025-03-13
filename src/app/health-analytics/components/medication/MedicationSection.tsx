'use client';

import { MedicationTracking } from '@/lib/types/health';
import MedicationTypeChart from './MedicationTypeChart';
import AdherenceCalendar from './AdherenceCalendar';

interface MedicationSectionProps {
  data: MedicationTracking;
}

export default function MedicationSection({ data }: MedicationSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-100 mb-4">Medication Tracking</h2>

      <div className="space-y-6">
        <div className="w-full bg-[#334155] rounded-lg border border-[#475569] p-4 shadow-md">
          <MedicationTypeChart medications={data.medications} />
        </div>
        <div className="w-full bg-[#334155] rounded-lg border border-[#475569] p-4 shadow-md">
          <AdherenceCalendar adherenceData={data.adherence} />
        </div>
      </div>
    </section>
  );
}
