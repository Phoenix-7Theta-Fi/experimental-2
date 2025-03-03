'use client';

import ReactECharts from 'echarts-for-react';
import { MedicationTracking } from '@/lib/types/health';

interface AdherenceCalendarProps {
  adherenceData: MedicationTracking['adherenceData'];
}

export default function AdherenceCalendar({ adherenceData }: AdherenceCalendarProps) {
  // Generate dates for the current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create data array for the calendar
  const data = Array.from({ length: daysInMonth }, (_, index) => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`;
    return [date, adherenceData[date] || 0];
  });

  const option = {
    title: {
      text: 'Medication Adherence',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#F8FAFC',
      },
    },
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const value = params.value[1];
        return `${params.value[0]}<br/>Adherence: ${value}%`;
      },
      backgroundColor: '#1E293B',
      borderColor: '#475569',
      textStyle: {
        color: '#F8FAFC',
      },
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      text: ['High', 'Low'],
      textStyle: {
        color: '#F8FAFC',
      },
      inRange: {
        color: ['#EF4444', '#FB923C', '#F59E0B', '#84CC16', '#22C55E'],
      },
    },
    calendar: {
      top: 80,
      left: 30,
      right: 30,
      cellSize: ['auto', 25],
      range: `${year}-${String(month + 1).padStart(2, '0')}`,
      itemStyle: {
        borderWidth: 0.5,
        borderColor: '#475569',
      },
      yearLabel: { show: false },
      dayLabel: {
        firstDay: 1,
        nameMap: 'en',
        color: '#F8FAFC',
      },
      monthLabel: {
        show: true,
        color: '#F8FAFC',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#475569',
          width: 1,
          type: 'solid',
        },
      },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: data,
    },
  };

  return (
    <div className="w-full bg-[#334155] rounded-lg shadow-lg shadow-black/20 border border-[#475569] overflow-hidden">
      <div className="p-4">
        <ReactECharts 
          option={option} 
          style={{ height: '400px' }}
          className="w-full"
          theme="dark"
        />
      </div>
    </div>
  );
}
