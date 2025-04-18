'use client';

import { MentalHealthData } from "@/lib/types/health";
import SleepQualitySunburst from "./charts/SleepQualitySunburst";
import MeditationInsightsChart from "./charts/MeditationInsightsChart";
import MoodStressTimeline from "./charts/MoodStressTimeline";
import WellbeingMetrics from "./charts/WellbeingMetrics";
import MoodJourneyMap from './charts/MoodJourneyMap';
import MeditationTimeline from "./charts/MeditationTimeline";

interface MentalHealthChartProps {
  data: MentalHealthData;
  patientId: number;
}

export default function MentalHealthChart({ data, patientId }: MentalHealthChartProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Mood Journey Map - Now using real data from mental health data */}
      <div className="w-full bg-[#1E293B] rounded-lg border border-[#475569] p-4">
        <MoodJourneyMap data={data.mood.journey} />
      </div>

      {/* Container for all charts */}
      <div className="w-full bg-[#334155] rounded-lg border-[#475569] p-4 space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-[#F8FAFC]">Sleep & Mindfulness</h2>
          <p className="text-sm text-[#94A3B8] mt-1">Detailed metrics on sleep patterns and meditation</p>
        </div>

        <div className="bg-[#1E293B] rounded-lg p-4">
          <SleepQualitySunburst />
        </div>

        <div className="bg-[#1E293B] rounded-lg p-4">
          <MeditationTimeline />
        </div>

        <div className="bg-[#1E293B] rounded-lg p-4">
          {data?.meditation && <MeditationInsightsChart meditation={data.meditation} />}
        </div>

        <div className="bg-[#1E293B] rounded-lg p-4">
          {data?.mood && data?.wellbeing && <MoodStressTimeline mood={data.mood} wellbeing={data.wellbeing} />}
        </div>

        <div className="bg-[#1E293B] rounded-lg p-4">
          {data?.wellbeing && data?.meditation && <WellbeingMetrics
            overallScore={data.wellbeing.overallScore}
            recoveryScore={data.wellbeing.recoveryScore}
            stressLevel={data.wellbeing.stressLevel}
            meditationProgress={data.meditation.progress}
          />}
        </div>
      </div>
    </div>
  );
}
