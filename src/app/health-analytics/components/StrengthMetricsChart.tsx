'use client';

import ReactECharts from "echarts-for-react";
import { WorkoutData } from "@/lib/types/health";

interface StrengthMetricsChartProps {
  data: WorkoutData;
}

type MetricUnits = {
  [key: string]: string;
};

export default function StrengthMetricsChart({ data }: StrengthMetricsChartProps) {
  const option = {
    title: {
      text: "Strength Metrics",
      left: "center",
      top: 20,
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
      formatter: (params: { name: string; value: number }) => {
        const units: MetricUnits = {
          "Power Index": "%",
          "Bench Press": "kg",
          "Squat": "kg",
          "Deadlift": "kg",
          "Muscle Balance": "%",
        };
        return `${params.name}: ${params.value}${units[params.name] || ''}`;
      },
    },
    radar: {
      shape: 'polygon',
      splitNumber: 5,
      center: ['50%', '55%'],
      radius: '65%',
      nameGap: 10,
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
      name: {
        textStyle: {
          color: '#F8FAFC',
          fontSize: 12,
        },
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
              data.strength.powerIndex,
              data.strength.maxLifts.benchPress,
              data.strength.maxLifts.squat,
              data.strength.maxLifts.deadlift,
              data.strength.muscleBalance,
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
    <div className="w-full max-w-3xl mx-auto bg-[#334155] rounded-lg shadow-lg shadow-black/20 border border-[#475569] overflow-hidden">
      <div className="p-4">
        <ReactECharts 
          option={option} 
          style={{ height: "400px" }}
          className="w-full"
          theme="dark"
        />
      </div>
      
      <div className="p-4 border-t border-[#475569] grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-[#94A3B8] mb-2">Power Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#F8FAFC]">Power Index</span>
              <span className="text-[#F97316]">{data.strength.powerIndex}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#F8FAFC]">Muscle Balance</span>
              <span className="text-[#F97316]">{data.strength.muscleBalance}%</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-[#94A3B8] mb-2">Max Lifts</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#F8FAFC]">Bench Press</span>
              <span className="text-[#F97316]">{data.strength.maxLifts.benchPress}kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#F8FAFC]">Squat</span>
              <span className="text-[#F97316]">{data.strength.maxLifts.squat}kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#F8FAFC]">Deadlift</span>
              <span className="text-[#F97316]">{data.strength.maxLifts.deadlift}kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
