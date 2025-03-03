'use client';

import CircularGauge from "../CircularGauge";

interface WellbeingMetricsProps {
  wellbeingScore: number;
  recoveryScore: number;
  resilienceScore: number;
  meditationProgress: number;
}

export default function WellbeingMetrics({
  wellbeingScore,
  recoveryScore,
  resilienceScore,
  meditationProgress
}: WellbeingMetricsProps) {
  return (
    <div className="bg-[#1E293B] rounded-lg p-6">
      <h3 className="text-[#F8FAFC] font-semibold mb-4">Wellbeing Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        <CircularGauge
          value={wellbeingScore}
          minValue={0}
          maxValue={100}
          color="#10B981"
          label="Wellbeing"
          unit="%"
          size={100}
        />
        <CircularGauge
          value={recoveryScore}
          minValue={0}
          maxValue={100}
          color="#8B5CF6"
          label="Recovery"
          unit="%"
          size={100}
        />
        <CircularGauge
          value={resilienceScore}
          minValue={0}
          maxValue={100}
          color="#3B82F6"
          label="Resilience"
          unit="%"
          size={100}
        />
        <CircularGauge
          value={meditationProgress}
          minValue={0}
          maxValue={100}
          color="#F59E0B"
          label="Progress"
          unit="%"
          size={100}
        />
      </div>
    </div>
  );
}
