'use client';

import { YogaData } from "@/lib/types/health";
import ReactECharts from "echarts-for-react";
import YogaSunburstChart from './yoga/YogaSunburstChart';
import YogaImpactCorrelationMatrix from './yoga/YogaImpactCorrelationMatrix';

interface YogaMetricsChartProps {
  data: YogaData;
  patientId: number;
}

export default function YogaMetricsChart({ data, patientId }: YogaMetricsChartProps) {
  const flexibilityOption = {
    radar: {
      indicator: [
        { name: 'Spine', max: 100 },
        { name: 'Hips', max: 100 },
        { name: 'Shoulders', max: 100 },
        { name: 'Balance', max: 100 },
        { name: 'Overall', max: 100 },
      ],
      splitArea: {
        areaStyle: {
          color: ['rgba(30, 41, 59, 0.1)'],
        },
      },
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          data.flexibility.spine,
          data.flexibility.hips,
          data.flexibility.shoulders,
          data.flexibility.balance,
          data.flexibility.overall,
        ],
        name: 'Flexibility',
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: '#60A5FA',
        },
        itemStyle: {
          color: '#60A5FA',
        },
        areaStyle: {
          color: 'rgba(96, 165, 250, 0.2)',
        },
      }],
    }],
  };

  return (
    <div className="space-y-8">
      {/* Top section with 5-column grid */}
      <div className="grid grid-cols-5 gap-8">
        {/* Left side - Flexibility Matrix */}
        <div className="col-span-3">
          <div className="bg-[#334155] rounded-lg border-[#475569] p-4 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-[#F8FAFC]">Yoga Progress</h2>
              <p className="text-sm text-[#94A3B8] mt-1">Track your flexibility and practice</p>
            </div>
            
            {/* Flexibility Radar Chart */}
            <div className="bg-[#1E293B] rounded-lg p-4">
              <ReactECharts 
                option={flexibilityOption}
                style={{ height: "280px" }}
                theme="dark"
              />
            </div>
          </div>
        </div>

        {/* Right side - Sunburst only */}
        <div className="col-span-2 space-y-4">
          <YogaSunburstChart />
        </div>
      </div>

      {/* Bottom section - Full width Impact Correlation Matrix */}
      <div className="w-full">
        <YogaImpactCorrelationMatrix />
      </div>
    </div>
  );
}
