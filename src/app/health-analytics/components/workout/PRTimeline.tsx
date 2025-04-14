'use client';

import ReactECharts from 'echarts-for-react';
import { format, subDays } from 'date-fns';

interface PersonalRecord {
  date: string;
  exercise: string;
  category: 'strength' | 'cardio' | 'olympic';
  value: number;
  unit: string;
  previousBest?: number;
}

// Color scheme matching existing components
const CATEGORY_COLORS = {
  strength: '#F97316',  // Orange from CardioPerformance
  cardio: '#3B82F6',    // Blue from existing charts
  olympic: '#10B981'    // Green from existing components
};

// Mock data for personal records
const MOCK_PRS: PersonalRecord[] = [
  {
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    exercise: 'Bench Press',
    category: 'strength',
    value: 125,
    unit: 'kg',
    previousBest: 120
  },
  {
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    exercise: '5K Run',
    category: 'cardio',
    value: 22.5,
    unit: 'min',
    previousBest: 23.1
  },
  {
    date: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
    exercise: 'Clean & Jerk',
    category: 'olympic',
    value: 95,
    unit: 'kg',
    previousBest: 90
  },
  {
    date: format(subDays(new Date(), 12), 'yyyy-MM-dd'),
    exercise: 'Deadlift',
    category: 'strength',
    value: 180,
    unit: 'kg',
    previousBest: 175
  },
  {
    date: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    exercise: '400m Sprint',
    category: 'cardio',
    value: 52.3,
    unit: 'sec',
    previousBest: 53.1
  }
];

export default function PRTimeline() {
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const pr = MOCK_PRS.find(pr => pr.date === params[0].value[0]);
        if (!pr) return '';
        
        const improvement = pr.previousBest 
          ? `(+${Math.abs(pr.value - pr.previousBest).toFixed(1)} ${pr.unit})`
          : '';

        return `
          <div class="font-sans p-1">
            <div class="font-semibold">${format(new Date(pr.date), 'MMM d, yyyy')}</div>
            <div>${pr.exercise}</div>
            <div>${pr.value} ${pr.unit} ${improvement}</div>
          </div>
        `;
      }
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: (value: string) => format(new Date(value), 'MMM d'),
        color: '#94A3B8'
      },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: ['PRs'],
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { show: false }
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '15%',
      bottom: '10%',
      containLabel: true
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 20,
        data: MOCK_PRS.map(pr => ({
          value: [pr.date, 0],
          itemStyle: {
            color: CATEGORY_COLORS[pr.category],
            borderColor: '#1E293B',
            borderWidth: 2,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 5
          }
        })),
        label: {
          show: true,
          position: 'top',
          distance: 10,
          formatter: (params: any) => {
            const pr = MOCK_PRS.find(pr => pr.date === params.value[0]);
            return pr?.exercise || '';
          },
          color: '#94A3B8',
          fontSize: 12
        }
      }
    ]
  };

  return (
    <div className="bg-[#1E293B] rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#F8FAFC] font-semibold">Personal Records Timeline</h3>
        <div className="flex gap-4">
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-[#94A3B8] text-sm capitalize">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
      <ReactECharts 
        option={option}
        style={{ height: '200px' }}
      />
    </div>
  );
}