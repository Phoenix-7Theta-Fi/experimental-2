'use client';

import { MentalHealthData } from "@/lib/types/health";
import SleepCyclesChart from "./charts/SleepCyclesChart";
import MeditationInsightsChart from "./charts/MeditationInsightsChart";
import MoodStressTimeline from "./charts/MoodStressTimeline";
import WellbeingMetrics from "./charts/WellbeingMetrics";
import { MentalHealthInsights } from './mental/MentalHealthInsights';

interface MentalHealthChartProps {
  data: MentalHealthData;
  patientId: number;
}

export default function MentalHealthChart({ data, patientId }: MentalHealthChartProps) {
  return (
    <div className="grid grid-cols-5 gap-8">
      <div className="col-span-3 space-y-4">
        <div className="w-full bg-[#334155] rounded-lg border-[#475569] p-4">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-[#F8FAFC]">Mental Health Overview</h2>
            <p className="text-sm text-[#94A3B8] mt-1">Track your emotional wellbeing, sleep, and mindfulness</p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#1E293B] rounded-lg p-4">
              <SleepCyclesChart sleep={data.sleep} />
            </div>
            
            <div className="bg-[#1E293B] rounded-lg p-4">
              <MeditationInsightsChart meditation={data.meditation} />
            </div>

            <div className="bg-[#1E293B] rounded-lg p-4">
              <MoodStressTimeline mood={data.mood} wellbeing={data.wellbeing} />
            </div>

            <div className="bg-[#1E293B] rounded-lg p-4">
              <WellbeingMetrics
                overallScore={data.wellbeing.overallScore}
                recoveryScore={data.wellbeing.recoveryScore}
                stressLevel={data.wellbeing.stressLevel}
                meditationProgress={data.meditation.progress}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="col-span-2">
        <div className="sticky top-4 bg-[#334155] rounded-lg border-[#475569] overflow-auto max-h-[calc(100vh-2rem)] p-2">
          <MentalHealthInsights patientId={patientId} className="h-full" />
        </div>
      </div>
    </div>
  );
}
