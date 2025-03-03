'use client';

import ReactECharts from 'echarts-for-react';
import { MedicationData } from '@/lib/types/health';

interface MedicationTypeChartProps {
  medications: MedicationData[];
}

export default function MedicationTypeChart({ medications }: MedicationTypeChartProps) {
  const medicationTypes = {
    ayurvedic: medications.filter(m => m.type === 'ayurvedic').length,
    modern: medications.filter(m => m.type === 'modern').length,
    supplement: medications.filter(m => m.type === 'supplement').length,
  };

  const option = {
    title: {
      text: 'Medication Types',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#F8FAFC',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: '#1E293B',
      borderColor: '#475569',
      textStyle: {
        color: '#F8FAFC',
      },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      textStyle: {
        color: '#F8FAFC',
      },
    },
    series: [
      {
        name: 'Medication Types',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#334155',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{c} medications',
          color: '#F8FAFC',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#F8FAFC',
          },
        },
        data: [
          {
            value: medicationTypes.ayurvedic,
            name: 'Ayurvedic',
            itemStyle: { color: '#9333EA' },
          },
          {
            value: medicationTypes.modern,
            name: 'Modern',
            itemStyle: { color: '#2563EB' },
          },
          {
            value: medicationTypes.supplement,
            name: 'Supplements',
            itemStyle: { color: '#059669' },
          },
        ],
      },
    ],
  };

  return (
    <div className="w-full bg-[#334155] rounded-lg shadow-lg shadow-black/20 border border-[#475569] overflow-hidden">
      <div className="p-4">
        <ReactECharts 
          option={option} 
          style={{ height: '300px' }}
          className="w-full"
          theme="dark"
        />
      </div>
    </div>
  );
}
