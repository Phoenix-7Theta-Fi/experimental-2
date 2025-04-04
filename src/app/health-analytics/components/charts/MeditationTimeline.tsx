'use client';

import ReactECharts from 'echarts-for-react';
import { format, subDays } from 'date-fns';

// Mock data structure for meditation sessions
interface MeditationSession {
  date: string;
  type: 'mindfulness' | 'breathing' | 'body-scan' | 'loving-kindness';
  duration: number;
  quality: number; // 0-100
  streak?: number;
}

// Color mapping for meditation types
const MEDITATION_COLORS = {
  'mindfulness': '#8B5CF6',   // Purple
  'breathing': '#3B82F6',     // Blue
  'body-scan': '#10B981',     // Green
  'loving-kindness': '#EC4899' // Pink
};

// Generate mock data for the last 14 days
const generateMockData = (): MeditationSession[] => {
  const data: MeditationSession[] = [];
  const types: (keyof typeof MEDITATION_COLORS)[] = ['mindfulness', 'breathing', 'body-scan', 'loving-kindness'];
  let currentStreak = 0;

  for (let i = 13; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const hasMeditation = Math.random() > 0.2; // 80% chance of having meditation

    if (hasMeditation) {
      currentStreak++;
      data.push({
        date: format(date, 'yyyy-MM-dd'),
        type: types[Math.floor(Math.random() * types.length)],
        duration: Math.floor(Math.random() * 30) + 10, // 10-40 minutes
        quality: Math.floor(Math.random() * 40) + 60,  // 60-100 quality score
        streak: currentStreak >= 3 ? currentStreak : undefined // Only show streak if ≥ 3
      });
    } else {
      currentStreak = 0;
    }
  }

  return data;
};

const MOCK_DATA = generateMockData();

export default function MeditationTimeline() {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const data = params.data;
        return `
          <div class="font-sans p-1">
            <div class="font-semibold">${format(new Date(data.date), 'MMM d, yyyy')}</div>
            <div>Type: ${data.type}</div>
            <div>Duration: ${data.duration} min</div>
            <div>Quality: ${data.quality}%</div>
            ${data.streak ? `<div>🔥 ${data.streak} day streak!</div>` : ''}
          </div>
        `;
      }
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: (value: string) => format(new Date(value), 'MMM d'),
        color: '#94A3B8'
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        color: '#94A3B8'
      },
      splitLine: {
        lineStyle: {
          color: '#334155'
        }
      }
    },
    series: [
      {
        type: 'scatter',
        data: MOCK_DATA.map(session => ({
          ...session,
          value: [session.date, session.quality],
          itemStyle: {
            color: MEDITATION_COLORS[session.type]
          },
          symbolSize: session.duration / 2 + 10 // Scale circle size based on duration
        })),
        symbol: 'circle',
        symbolSize: 20,
        label: {
          show: true,
          formatter: (params: any) => {
            return params.data.streak ? '🔥' : '';
          },
          position: 'top',
          distance: 10
        }
      }
    ],
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '10%',
      containLabel: true
    }
  };

  return (
    <div className="bg-[#1E293B] rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-[#F8FAFC] font-semibold">Meditation Timeline</h3>
        <div className="flex gap-4 mt-2">
          {Object.entries(MEDITATION_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-[#94A3B8] text-sm capitalize">
                {type.replace('-', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[300px]">
        <ReactECharts 
          option={option}
          style={{ height: '100%' }}
          theme="dark"
        />
      </div>
    </div>
  );
}