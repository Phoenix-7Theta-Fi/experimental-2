'use client';

import { MentalHealthMetrics } from "@/lib/types/health";
import ReactECharts from "echarts-for-react";

interface MoodStressTimelineProps {
  mood: MentalHealthMetrics['mood'];
  stress: MentalHealthMetrics['stress'];
}

export default function MoodStressTimeline({ mood, stress }: MoodStressTimelineProps) {
  const moodHistoryOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any[]) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        
        const timestamp = params[0].axisValue;
        const moodValue = params[0]?.data ?? 'N/A';
        const stressValue = params[1]?.data ?? 'N/A';
        
        return `${new Date(timestamp).toLocaleTimeString()}<br/>
                Mood: ${moodValue}<br/>
                Stress: ${stressValue}`;
      }
    },
    grid: {
      top: 30,
      right: 20,
      bottom: 30,
      left: 50,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: mood.history.map(h => h.timestamp),
      axisLabel: {
        formatter: (value: string) => new Date(value).toLocaleTimeString(),
        color: '#94A3B8'
      }
    },
    yAxis: {
      type: 'value',
      max: 10,
      axisLabel: { color: '#94A3B8' }
    },
    series: [
      {
        name: 'Mood',
        type: 'line',
        smooth: true,
        data: mood.history.map(h => h.intensity),
        itemStyle: { color: '#10B981' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.2)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0)' }
            ]
          }
        }
      },
      {
        name: 'Stress',
        type: 'line',
        smooth: true,
        data: stress.triggers.map(t => t.intensity),
        itemStyle: { color: '#EF4444' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(239, 68, 68, 0.2)' },
              { offset: 1, color: 'rgba(239, 68, 68, 0)' }
            ]
          }
        }
      }
    ]
  };

  return (
    <div className="bg-[#1E293B] rounded-lg p-6">
      <h3 className="text-[#F8FAFC] font-semibold mb-4">Mood & Stress Levels</h3>
      <div className="h-[250px]">
        <ReactECharts 
          option={moodHistoryOption}
          style={{ height: '100%' }}
          theme="dark"
        />
      </div>
    </div>
  );
}
