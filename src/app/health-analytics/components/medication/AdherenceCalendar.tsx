'use client';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { MedicationTracking } from '@/lib/types/health';

interface AdherenceCalendarProps {
  adherenceData: MedicationTracking['adherence'];
}

export default function AdherenceCalendar({ adherenceData }: AdherenceCalendarProps) {
  // Combine adherence data from all medications into a single percentage per day
  // Generate dates for the current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create data array for the calendar
  const data = Array.from({ length: daysInMonth }, (_, index) => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`;
    
    // Calculate adherence percentage for this date across all medications
    let totalTaken = 0;
    let totalMedications = 0;
    
    Object.values(adherenceData).forEach(medicationAdherence => {
      const dayAdherence = medicationAdherence.find(a => a.date === date);
      if (dayAdherence) {
        totalMedications++;
        if (dayAdherence.taken) totalTaken++;
      }
    });

    const percentage = totalMedications > 0 ? Math.round((totalTaken / totalMedications) * 100) : 0;
    return [date, percentage];
  });

  const option: EChartsOption = {
    title: {
      text: 'Medication Adherence Calendar',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#F8FAFC',
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      position: 'top' as const,
      formatter: (params: any) => {
        const value = params.value[1];
        return `<div style="font-weight: bold; margin-bottom: 4px;">${params.value[0]}</div>
                <div>Adherence Rate: <span style="color: ${value > 75 ? '#22C55E' : value > 50 ? '#F59E0B' : '#EF4444'}; font-weight: bold;">${value}%</span></div>`;
      },
      backgroundColor: '#1E293B',
      borderColor: '#475569',
      textStyle: {
        color: '#F8FAFC',
      },
      padding: [8, 12],
      extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 4px;',
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      text: ['Low Adherence', 'High Adherence'],
      textStyle: {
        color: '#F8FAFC',
        fontSize: 12,
        fontWeight: 'bold',
      },
      itemWidth: 15,
      itemHeight: 120,
      inRange: {
        color: ['#EF4444', '#FB923C', '#F59E0B', '#84CC16', '#22C55E'],
      },
      backgroundColor: '#1E293B',
      borderColor: '#475569',
      borderWidth: 1,
      padding: [10, 15],
    },
    calendar: {
      top: 70,
      left: 30,
      right: 30,
      bottom: 80,
      cellSize: ['auto' as const, 30],
      range: `${year}-${String(month + 1).padStart(2, '0')}`,
      itemStyle: {
        borderWidth: 1,
        borderColor: '#475569',
        borderRadius: 2,
      },
      yearLabel: { show: false },
      dayLabel: {
        firstDay: 1,
        nameMap: 'en',
        color: '#F8FAFC',
        fontSize: 12,
        fontWeight: 'bold',
      },
      monthLabel: {
        show: true,
        color: '#F8FAFC',
        fontSize: 14,
        fontWeight: 'bold',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#475569',
          width: 1.5,
          type: 'solid' as const,
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
    <div className="w-full">
      <ReactECharts
        option={option}
        style={{ height: '360px' }}
        className="w-full"
        theme="dark"
      />
    </div>
  );
}
