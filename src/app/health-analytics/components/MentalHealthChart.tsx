'use client';

import { MentalHealthData } from "@/lib/types/health";
import SleepCyclesChart from "./charts/SleepCyclesChart";
import MeditationInsightsChart from "./charts/MeditationInsightsChart";
import MoodStressTimeline from "./charts/MoodStressTimeline";
import WellbeingMetrics from "./charts/WellbeingMetrics";

interface MentalHealthChartProps {
  data: MentalHealthData;
}

export default function MentalHealthChart({ data }: MentalHealthChartProps) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-[#334155] rounded-lg shadow-lg shadow-black/20 border border-[#475569] overflow-hidden">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Sleep and Meditation */}
          <div className="space-y-6">
            <SleepCyclesChart sleep={data.sleep} />
            <MeditationInsightsChart meditation={data.meditation} />
          </div>

          {/* Right Column - Mood and Stress */}
          <div className="space-y-6">
            <MoodStressTimeline mood={data.mood} stress={data.stress} />
            <WellbeingMetrics
              wellbeingScore={data.mood.wellbeingScore}
              recoveryScore={data.stress.recoveryScore}
              resilienceScore={data.stress.resilience.score}
              meditationProgress={data.meditation.progress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
