'use client';

import { MentalHealthMetrics, MeditationType } from "@/lib/types/health";
import ReactECharts from "echarts-for-react";

interface MeditationInsightsChartProps {
  meditation: MentalHealthMetrics['meditation'];
}

export default function MeditationInsightsChart({ meditation }: MeditationInsightsChartProps) {
  const meditationStats = new Map<MeditationType, { duration: number, count: number }>();
  meditation.sessions.forEach(session => {
    const current = meditationStats.get(session.type) || { duration: 0, count: 0 };
    meditationStats.set(session.type, {
      duration: current.duration + session.duration,
      count: current.count + 1
    });
  });

  const meditationOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} mins'
    },
    series: [
      {
        type: 'pie',
        radius: '85%',
        itemStyle: {
          borderRadius: 5,
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {d}%',
          color: '#94A3B8'
        },
        data: Array.from(meditationStats.entries()).map(([type, stats]) => ({
          name: type,
          value: stats.duration,
          itemStyle: { 
            color: type === 'mindfulness' ? '#8B5CF6' :
                   type === 'focused' ? '#6366F1' :
                   type === 'loving-kindness' ? '#EC4899' :
                   type === 'body-scan' ? '#14B8A6' :
                   type === 'transcendental' ? '#F59E0B' :
                   type === 'zen' ? '#10B981' : '#6366F1'
          }
        }))
      }
    ]
  };

  return (
    <div className="bg-[#1E293B] rounded-lg p-6">
      <h3 className="text-[#F8FAFC] font-semibold mb-4">Meditation Practice</h3>
      <div className="h-[250px]">
        <ReactECharts 
          option={meditationOption}
          style={{ height: '100%' }}
          theme="dark"
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-[#94A3B8] text-sm">Streak</div>
          <div className="text-[#F8FAFC] text-xl font-bold">{meditation.streak} days</div>
        </div>
        <div className="text-center">
          <div className="text-[#94A3B8] text-sm">Focus Score</div>
          <div className="text-[#F8FAFC] text-xl font-bold">{meditation.insights.focusScore}%</div>
        </div>
      </div>
    </div>
  );
}
