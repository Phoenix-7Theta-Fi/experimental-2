'use client';

import ReactECharts from "echarts-for-react";
import type { TooltipComponentFormatterCallback } from 'echarts';
import { WorkoutData } from "@/lib/types/health";
import HeartRateAnimation from "./HeartRateAnimation";
import CircularGauge from "./CircularGauge";
import { WorkoutInsights } from './workout/WorkoutInsights';

interface WorkoutMetricsChartProps {
  data: WorkoutData;
  patientId: number;
}

type MetricUnits = {
  [key: string]: string;
};

export default function WorkoutMetricsChart({ data, patientId }: WorkoutMetricsChartProps) {
  // Calculate current heart rate (simulated as midway between resting and max)
  const currentHeartRate = Math.round(
    data.resting_heart_rate + 
    (data.max_heart_rate - data.resting_heart_rate) * 0.7
  );

  // Format pace to show minutes:seconds
  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // For pace, we invert the value for the gauge since lower is better
  const paceGaugeValue = 12 - data.pace;

  const strengthChartOption: echarts.EChartsOption = {
    title: {
      text: "Strength Metrics",
      left: "center",
      textStyle: {
        color: "#F8FAFC",
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "#1E293B",
      borderColor: "#475569",
      textStyle: {
        color: "#F8FAFC",
      },
      formatter: (params: any) => {
        const units: MetricUnits = {
          "Power Index": "%",
          "Bench Press": "kg",
          "Squat": "kg",
          "Deadlift": "kg",
          "Muscle Balance": "%",
        };
        return `${params.name}: ${params.value}${units[params.name] || ''}`;
      }
    },
    radar: {
      shape: 'circle' as const,
      splitNumber: 5,
      radius: '65%',
      splitLine: {
        lineStyle: {
          color: '#475569',
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['#1E293B', '#1E293B'],
        },
      },
      axisLine: {
        lineStyle: {
          color: '#475569',
        },
      },
      axisLabel: {
        color: '#F8FAFC',
        fontSize: 12,
      },
      indicator: [
        { name: "Power Index", max: 100 },
        { name: "Bench Press", max: 150 },
        { name: "Squat", max: 200 },
        { name: "Deadlift", max: 220 },
        { name: "Muscle Balance", max: 100 },
      ],
    },
    series: [
      {
        type: 'radar',
        lineStyle: {
          width: 2,
          color: '#F97316',
        },
        data: [
          {
            value: [
              data.power_index,
              data.bench_press,
              data.squat,
              data.deadlift,
              data.muscle_balance,
            ],
            name: 'Strength Metrics',
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#F97316',
            },
            areaStyle: {
              color: 'rgba(249, 115, 22, 0.2)',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="grid grid-cols-5 gap-8">
      <div className="col-span-3 space-y-4">
        <div className="w-full bg-[#334155] rounded-lg border-[#475569] p-4">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-[#F8FAFC]">Workout Performance</h2>
            <p className="mt-2 text-[#94A3B8] text-sm">Track your strength, cardio, and overall fitness progress</p>
          </div>
          
          <div className="space-y-4">
            {/* Left Column - Strength Metrics */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#1E293B] rounded-xl p-4 flex-1">
                <ReactECharts 
                  option={strengthChartOption} 
                  style={{ height: "280px" }}
                  className="w-full"
                  theme="dark"
                />
              </div>
              
              <div className="bg-[#1E293B] rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-[#94A3B8] text-sm font-medium mb-4">Power Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#F8FAFC] text-sm">Power Index</span>
                        <span className="text-[#F97316] font-medium">{data.power_index}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#F8FAFC] text-sm">Muscle Balance</span>
                        <span className="text-[#F97316] font-medium">{data.muscle_balance}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-[#94A3B8] text-sm font-medium mb-4">Max Lifts</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#F8FAFC] text-sm">Bench Press</span>
                        <span className="text-[#F97316] font-medium">{data.bench_press}kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#F8FAFC] text-sm">Squat</span>
                        <span className="text-[#F97316] font-medium">{data.squat}kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#F8FAFC] text-sm">Deadlift</span>
                        <span className="text-[#F97316] font-medium">{data.deadlift}kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Cardio Metrics */}
            <div className="flex flex-col gap-4">
              {/* Heart Rate Monitor */}
              <div className="bg-[#1E293B] rounded-xl p-4 flex-1">
                <HeartRateAnimation 
                  currentRate={currentHeartRate}
                  maxRate={data.max_heart_rate}
                  restingRate={data.resting_heart_rate}
                />
              </div>

              {/* Performance Metrics */}
              <div className="bg-[#1E293B] rounded-xl p-4">
                <h3 className="text-[#F8FAFC] font-semibold mb-3">Cardio Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <CircularGauge
                    value={data.vo2_max}
                    minValue={30}
                    maxValue={60}
                    color="#10B981"
                    label="VO2 Max"
                    unit="mL/kg/min"
                    size={100}
                  />
                  <CircularGauge
                    value={data.endurance}
                    minValue={0}
                    maxValue={100}
                    color="#3B82F6"
                    label="Endurance"
                    unit="score"
                    size={100}
                  />
                  <CircularGauge
                    value={paceGaugeValue}
                    minValue={0}
                    maxValue={8}
                    color="#F97316"
                    label=""
                    unit=""
                    size={100}
                    showValue={false}
                    customValue={
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-[#F8FAFC] text-xs font-medium">Average Pace</div>
                        <div className="text-[#F97316] text-2xl font-bold mt-1">{formatPace(data.pace)}</div>
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
                    size={100}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Insights Section */}
      <div className="col-span-2">
        <div className="sticky top-4 bg-[#334155] rounded-lg border-[#475569] overflow-auto max-h-[calc(100vh-2rem)] p-2">
          <WorkoutInsights patientId={patientId} className="h-full" />
        </div>
      </div>
    </div>
  );
}
