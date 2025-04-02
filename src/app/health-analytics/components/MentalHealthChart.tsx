'use client';

import { MentalHealthData } from "@/lib/types/health";
import SleepQualitySunburst from "./charts/SleepQualitySunburst";
import MeditationInsightsChart from "./charts/MeditationInsightsChart";
import MoodStressTimeline from "./charts/MoodStressTimeline";
import WellbeingMetrics from "./charts/WellbeingMetrics";
import { MentalHealthInsights } from './mental/MentalHealthInsights';
import MoodJourneyMap from './charts/MoodJourneyMap';

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

      {/* Grid for remaining charts and insights */}
      <div className="grid grid-cols-3 gap-8">

        {/* Column for other charts */}
        <div className="col-span-2 space-y-4">
          {/* Container for the remaining charts */}
          <div className="w-full bg-[#334155] rounded-lg border-[#475569] p-4 space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-[#F8FAFC]">Sleep & Mindfulness</h2>
              <p className="text-sm text-[#94A3B8] mt-1">Detailed metrics on sleep patterns and meditation</p>
            </div>

            {/* Other charts remain here */}
            <div className="bg-[#1E293B] rounded-lg p-4">
              {/* Render SleepQualitySunburst without passing incompatible sleep prop */}
              {/* It will use its internal mock data */}
              <SleepQualitySunburst />
            </div>

            <div className="bg-[#1E293B] rounded-lg p-4">
               {/* Ensure data.meditation exists */}
              {data?.meditation && <MeditationInsightsChart meditation={data.meditation} />}
            </div>

            <div className="bg-[#1E293B] rounded-lg p-4">
               {/* Ensure data.mood and data.wellbeing exist */}
              {data?.mood && data?.wellbeing && <MoodStressTimeline mood={data.mood} wellbeing={data.wellbeing} />}
            </div>

            <div className="bg-[#1E293B] rounded-lg p-4">
               {/* Ensure data.wellbeing and data.meditation exist */}
              {data?.wellbeing && data?.meditation && <WellbeingMetrics
                overallScore={data.wellbeing.overallScore}
                recoveryScore={data.wellbeing.recoveryScore}
                stressLevel={data.wellbeing.stressLevel}
                meditationProgress={data.meditation.progress}
              />}
            </div>
          </div>
        </div>

        {/* Insights Section - Now in the new grid */}
        <div className="col-span-1">
          <div className="sticky top-4 bg-[#334155] rounded-lg border-[#475569] overflow-auto max-h-[calc(100vh-2rem)] p-2">
            {/* Added title for insights */}
            <h2 className="text-xl font-semibold text-[#F8FAFC] p-2 text-center mb-2">Mental Health Insights</h2>
            <MentalHealthInsights patientId={patientId} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
