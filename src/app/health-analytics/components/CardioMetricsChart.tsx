'use client';

import { WorkoutData } from "@/lib/types/health";
import HeartRateAnimation from "./HeartRateAnimation";
import CircularGauge from "./CircularGauge";

interface CardioMetricsChartProps {
  data: WorkoutData;
}

export default function CardioMetricsChart({ data }: CardioMetricsChartProps) {
  // Calculate current heart rate (simulated as midway between resting and max)
  const currentHeartRate = Math.round(
    data.cardio.heartRate.resting + 
    (data.cardio.heartRate.max - data.cardio.heartRate.resting) * 0.7
  );

  // Format pace to show minutes:seconds
  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // For pace, we invert the value for the gauge since lower is better
  const paceGaugeValue = 12 - data.cardio.pace; // Invert the value for visual representation

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#334155] rounded-lg shadow-lg shadow-black/20 border border-[#475569] overflow-hidden">
      <div className="p-6">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-[#F8FAFC]">Cardio Performance</h2>
          <p className="text-sm text-[#94A3B8] mt-1">Real-time heart rate and performance metrics</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Heart Rate and Zones */}
          <div className="space-y-6">
            {/* Heart Rate Monitor */}
            <div className="bg-[#1E293B] rounded-lg p-6">
              <HeartRateAnimation 
                currentRate={currentHeartRate}
                maxRate={data.cardio.heartRate.max}
                restingRate={data.cardio.heartRate.resting}
              />
            </div>

            {/* Heart Rate Zones */}
            <div className="bg-[#1E293B] rounded-lg p-6">
              <h3 className="text-[#F8FAFC] font-semibold mb-4">Heart Rate Zones</h3>
              {[
                { name: "Maximum", color: "#8B5CF6", percentage: 5 },
                { name: "Peak", color: "#EF4444", percentage: 15 },
                { name: "Cardio", color: "#F97316", percentage: 30 },
                { name: "Fat Burn", color: "#10B981", percentage: 35 },
                { name: "Rest", color: "#3B82F6", percentage: 15 },
              ].map((zone) => (
                <div key={zone.name} className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <div 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: zone.color }}
                      ></div>
                      <span className="text-[#94A3B8]">{zone.name}</span>
                    </div>
                    <span className="text-[#F8FAFC]">{zone.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${zone.percentage}%`,
                        backgroundColor: zone.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Metrics and Insights */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="bg-[#1E293B] rounded-lg p-6">
              <h3 className="text-[#F8FAFC] font-semibold mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <CircularGauge
                  value={data.cardio.vo2Max}
                  minValue={30}
                  maxValue={60}
                  color="#10B981"
                  label="VO2 Max"
                  unit="mL/kg/min"
                  size={110}
                />
                <CircularGauge
                  value={data.cardio.endurance}
                  minValue={0}
                  maxValue={100}
                  color="#3B82F6"
                  label="Endurance"
                  unit="score"
                  size={110}
                />
                <CircularGauge
                  value={paceGaugeValue}
                  minValue={0}
                  maxValue={8}
                  color="#F97316"
                  label=""
                  unit=""
                  size={110}
                  showValue={false}
                  customValue={
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-[#F8FAFC] text-xs font-medium">Average Pace</div>
                      <div className="text-[#F97316] text-2xl font-bold mt-1">{formatPace(data.cardio.pace)}</div>
                      <div className="text-[#94A3B8] text-xs mt-0.5">min/km</div>
                    </div>
                  }
                />
                <CircularGauge
                  value={85}
                  minValue={0}
                  maxValue={100}
                  color="#8B5CF6"
                  label="Recovery"
                  unit="%"
                  size={110}
                />
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-[#1E293B] rounded-lg p-6">
              <h3 className="text-[#F8FAFC] font-semibold mb-4">Quick Insights</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0F172A] rounded-lg p-4">
                  <span className="text-[#94A3B8] text-sm">Fitness Age</span>
                  <div className="flex items-baseline mt-1">
                    <span className="text-[#F8FAFC] text-2xl font-bold">28</span>
                    <span className="text-[#94A3B8] text-sm ml-1">years</span>
                  </div>
                </div>
                <div className="bg-[#0F172A] rounded-lg p-4">
                  <span className="text-[#94A3B8] text-sm">Training Load</span>
                  <div className="text-[#10B981] text-2xl font-bold mt-1">Optimal</div>
                </div>
                <div className="bg-[#0F172A] rounded-lg p-4">
                  <span className="text-[#94A3B8] text-sm">Weekly Progress</span>
                  <div className="text-[#10B981] text-2xl font-bold mt-1">+3.2%</div>
                </div>
                <div className="bg-[#0F172A] rounded-lg p-4">
                  <span className="text-[#94A3B8] text-sm">Recovery Time</span>
                  <div className="flex items-baseline mt-1">
                    <span className="text-[#F8FAFC] text-2xl font-bold">12</span>
                    <span className="text-[#94A3B8] text-sm ml-1">hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
