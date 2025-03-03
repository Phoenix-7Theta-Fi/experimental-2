'use client';

import { MentalHealthMetrics } from "@/lib/types/health";
import ReactECharts from "echarts-for-react";

interface SleepCyclesChartProps {
  sleep: MentalHealthMetrics['sleep'];
}

export default function SleepCyclesChart({ sleep }: SleepCyclesChartProps) {
  const sleepCyclesOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} mins ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '85%'],
        itemStyle: {
          borderRadius: 5,
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{d}%',
          fontSize: 12,
          color: '#fff'
        },
        data: [
          { 
            value: sleep.cycles.deep, 
            name: 'Deep',
            itemStyle: { color: '#3B82F6' }
          },
          { 
            value: sleep.cycles.light, 
            name: 'Light',
            itemStyle: { color: '#60A5FA' }
          },
          { 
            value: sleep.cycles.rem, 
            name: 'REM',
            itemStyle: { color: '#93C5FD' }
          },
        ],
      }
    ]
  };

  return (
    <div className="bg-[#1E293B] rounded-lg p-6">
      <h3 className="text-[#F8FAFC] font-semibold mb-4">Sleep Cycles</h3>
      <div className="h-[250px]">
        <ReactECharts 
          option={sleepCyclesOption}
          style={{ height: '100%' }}
          theme="dark"
        />
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <div className="text-[#94A3B8]">
          Quality: <span className="text-[#F8FAFC]">{sleep.quality}%</span>
        </div>
        <div className="text-[#94A3B8]">
          Hours: <span className="text-[#F8FAFC]">{sleep.averageHours.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
