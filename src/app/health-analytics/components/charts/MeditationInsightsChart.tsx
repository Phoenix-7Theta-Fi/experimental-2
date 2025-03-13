'use client';

import { MentalHealthData } from "@/lib/types/health";
import CircularGauge from "../CircularGauge";

interface MeditationInsightsChartProps {
  meditation: MentalHealthData['meditation'];
}

export default function MeditationInsightsChart({ meditation }: MeditationInsightsChartProps) {
  return (
    <div className="bg-[#1E293B] rounded-lg p-6">
      <h3 className="text-[#F8FAFC] font-semibold mb-4">Meditation Practice</h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <CircularGauge
            value={meditation.progress}
            minValue={0}
            maxValue={100}
            color="#8B5CF6"
            label="Goal Progress"
            unit="%"
            size={120}
          />
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-[#94A3B8] text-sm mb-1">Daily Minutes</div>
            <div className="text-[#F8FAFC] text-xl font-bold">{meditation.minutes} min</div>
          </div>
          <div>
            <div className="text-[#94A3B8] text-sm mb-1">Current Streak</div>
            <div className="text-[#F8FAFC] text-xl font-bold">{meditation.streak} days</div>
          </div>
          <div>
            <div className="text-[#94A3B8] text-sm mb-1">Daily Goal</div>
            <div className="text-[#F8FAFC] text-xl font-bold">{meditation.goal} min</div>
          </div>
        </div>
      </div>
    </div>
  );
}
