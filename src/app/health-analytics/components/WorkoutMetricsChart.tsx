'use client';

import ReactECharts from "echarts-for-react";
import type { TooltipComponentFormatterCallback } from 'echarts';
import { WorkoutData } from "@/lib/types/health";
import HeartRateAnimation from "./HeartRateAnimation";
import CircularGauge from "./CircularGauge";
import { WorkoutInsights } from './workout/WorkoutInsights';
import CardioPerformanceTimeline from './workout/CardioPerformanceTimeline';
import WorkoutMetricsAreaChart from './workout/WorkoutMetricsAreaChart';

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

  const radarOption: echarts.EChartsOption = {
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
          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-[#F8FAFC]">Workout Performance</h2>
            <p className="mt-2 text-[#94A3B8] text-sm">Track your strength, cardio, and overall fitness progress</p>
          </div>

          {/* Strength Metrics Radar Chart */}
          <div className="bg-[#1E293B] rounded-xl p-4 mb-4">
            <h3 className="text-[#F8FAFC] font-semibold mb-2">Strength Metrics</h3>
            <ReactECharts option={radarOption} style={{ height: '300px' }} />
          </div>

          {/* Power Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#1E293B] rounded-xl p-4">
              <h3 className="text-[#F8FAFC] font-semibold mb-2">Power Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Power Index</span>
                  <span className="text-[#F8FAFC]">{data.power_index}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Muscle Balance</span>
                  <span className="text-[#F8FAFC]">{data.muscle_balance}%</span>
                </div>
              </div>
            </div>
            <div className="bg-[#1E293B] rounded-xl p-4">
              <h3 className="text-[#F8FAFC] font-semibold mb-2">Max Lifts</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Bench Press</span>
                  <span className="text-[#F8FAFC]">{data.bench_press}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Squat</span>
                  <span className="text-[#F8FAFC]">{data.squat}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Deadlift</span>
                  <span className="text-[#F8FAFC]">{data.deadlift}kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workout Metrics Area Chart */}
          <WorkoutMetricsAreaChart />

          {/* Heart Rate Monitor */}
          <div className="bg-[#1E293B] rounded-xl p-4 mb-4">
            <HeartRateAnimation
              currentRate={currentHeartRate}
              maxRate={data.max_heart_rate}
              restingRate={data.resting_heart_rate}
            />
          </div>

          {/* Cardio Performance */}
          <div className="bg-[#1E293B] rounded-xl p-4">
            <CardioPerformanceTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}
