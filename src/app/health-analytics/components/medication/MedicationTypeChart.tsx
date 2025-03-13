'use client';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption, TreemapSeriesOption } from 'echarts';
import { MedicationData } from '@/lib/types/health';

interface MedicationTypeChartProps {
  medications: MedicationData[];
}

export default function MedicationTypeChart({ medications }: MedicationTypeChartProps) {
  // Transform medications into treemap data structure
  const transformMedicationsToTreemap = (medications: MedicationData[]) => {
    const types = ['ayurvedic', 'modern', 'supplement'] as const;
    const colorMap = {
      ayurvedic: ['#9333EA', '#A855F7', '#C084FC'],
      modern: ['#2563EB', '#3B82F6', '#60A5FA'],
      supplement: ['#059669', '#10B981', '#34D399']
    };

    const getColorForIndex = (type: typeof types[number], index: number) => {
      const colors = colorMap[type];
      return colors[index % colors.length];
    };

    return {
      name: 'Medications',
      children: types.map(type => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        children: medications
          .filter(med => med.type === type)
          .map((med, index) => {
            // Extract numeric value from dosage for size calculation
            const dosageMatch = med.dosage.match(/(\d+)/);
            const dosageValue = dosageMatch ? parseInt(dosageMatch[1]) : 100;
            
            return {
              name: med.name,
              value: dosageValue,
              dosage: med.dosage,
              timing: med.timing,
              withFood: med.with_food,
              itemStyle: {
                color: getColorForIndex(type, index)
              }
            };
          })
      }))
    };
  };

  const option: EChartsOption = {
    title: {
      text: 'Medications Overview',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#F8FAFC',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      formatter: (info: any) => {
        if (!info.data.timing) return info.name;

        const timingCapitalized = info.data.timing.charAt(0).toUpperCase() + info.data.timing.slice(1);

        return `
          <div style="padding: 4px 0">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #F8FAFC">${info.data.name}</div>
            <div style="margin-top: 8px; line-height: 1.5">
              <div><span style="color: #94A3B8">Dosage:</span> <span style="font-weight: bold">${info.data.dosage}</span></div>
              <div><span style="color: #94A3B8">Timing:</span> <span style="font-weight: bold">${timingCapitalized}</span></div>
              <div><span style="color: #94A3B8">Instructions:</span> <span style="font-weight: bold">${info.data.withFood ? 'Take with food' : 'Take without food'}</span></div>
            </div>
          </div>
        `;
      },
      backgroundColor: '#1E293B',
      borderColor: '#475569',
      textStyle: {
        color: '#F8FAFC'
      },
      padding: [10, 14],
      extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 4px;'
    },
    series: [{
      type: 'treemap' as const,
      data: transformMedicationsToTreemap(medications).children as TreemapSeriesOption['data'],
      width: '92%',
      height: '80%',
      top: '12%',
      left: '4%',
      squareRatio: 0.85, // Better aspect ratio for boxes
      visualMin: 100, // Minimum box size
      visualDimension: 1, // Use value for box size
      roam: false,
      breadcrumb: { show: false },
      levels: [
        {
          itemStyle: {
            borderWidth: 4,
            borderColor: '#1E293B',
            gapWidth: 4,
            borderRadius: 6
          }
        },
        {
          colorSaturation: [0.4, 0.7],
          itemStyle: {
            borderWidth: 2,
            borderColor: '#1E293B',
            gapWidth: 2,
            borderRadius: 4
          }
        }
      ],
      label: {
        show: true,
        formatter: '{b}',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#F8FAFC',
        position: 'inside'
      },
      upperLabel: {
        show: true,
        height: 30,
        color: '#F8FAFC'
      },
      itemStyle: {
        borderColor: '#1E293B',
        borderWidth: 2,
        gapWidth: 3,
        borderRadius: 4
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        label: {
          show: true,
          formatter: (params: any) => {
            if (!params.data.timing) return params.name;
            return [
              `{name|${params.name}}`,
              `{dosage|${params.data.dosage}}`
            ].join('\n');
          },
          rich: {
            name: {
              fontSize: 16,
              fontWeight: 'bold',
              color: '#F8FAFC'
            },
            dosage: {
              fontSize: 12,
              color: '#CBD5E1'
            }
          }
        }
      }
    }]
  };

  return (
    <div className="w-full">
      <ReactECharts
        option={option}
        style={{ height: '380px' }}
        className="w-full"
        theme="dark"
      />
    </div>
  );
}
