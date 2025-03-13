'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { BiomarkerData, BIOMARKER_RANGES } from '@/lib/types/health';

interface BiomarkerTrendsChartProps {
  data: BiomarkerData[];
}

const BiomarkerTrendsChart: React.FC<BiomarkerTrendsChartProps> = ({ data }) => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const dates = sortedData.map(d => d.date);

  // Function to get data series for a specific biomarker
  const getBiomarkerSeries = (
    path: string[],
    name: string,
    ranges: { min: number; max: number }
  ) => {
    const values = sortedData.map(d => {
      let value: any = d;
      for (const key of path) {
        value = value[key];
      }
      return value;
    });

    return [
      {
        name: `${name} (Range)`,
        type: 'line',
        data: Array(dates.length).fill(ranges.max),
        lineStyle: { opacity: 0 },
        stack: name,
        stackStrategy: 'all',
        areaStyle: {
          color: '#22C55E20',
          opacity: 0.2
        },
        symbol: 'none',
      },
      {
        name,
        type: 'line',
        data: values,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
        },
      }
    ];
  };

  const option = {
    title: {
      text: 'Biomarker Trends',
      left: 'center',
      top: 0,
      textStyle: {
        color: '#F8FAFC',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1E293B',
      borderColor: '#475569',
      textStyle: {
        color: '#F8FAFC',
      },
      formatter: (params: any[]) => {
        const date = new Date(params[0].axisValue).toLocaleDateString();
        const items = params
          .filter(param => !param.seriesName.includes('Range'))
          .map(param => {
            let unit = '';
            if (param.seriesName.includes('Glucose')) unit = 'mg/dL';
            if (param.seriesName.includes('TSH')) unit = 'mU/L';
            if (param.seriesName.includes('Vitamin D')) unit = 'ng/mL';
            if (param.value === null) return `${param.seriesName}: N/A`;
            return `${param.seriesName}: ${param.value}${unit}`;
          });
        return `${date}<br/>${items.join('<br/>')}`;
      }
    },
    legend: {
      top: 30,
      textStyle: {
        color: '#F8FAFC',
      },
      selected: {
        'Fasting Glucose (Range)': false,
        'TSH (Range)': false,
        'Vitamin D (Range)': false,
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 100,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        color: '#F8FAFC',
        formatter: (value: string) => {
          const date = new Date(value);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Values',
        axisLabel: { color: '#F8FAFC' },
        nameTextStyle: { color: '#F8FAFC' },
      },
    ],
    series: [
      ...getBiomarkerSeries(
        ['glucose', 'fasting'],
        'Fasting Glucose',
        BIOMARKER_RANGES.glucose.fasting
      ),
      ...getBiomarkerSeries(
        ['thyroid', 'tsh'],
        'TSH',
        BIOMARKER_RANGES.thyroid.tsh
      ),
      ...getBiomarkerSeries(
        ['vitamins', 'd'],
        'Vitamin D',
        BIOMARKER_RANGES.vitamins.d
      ),
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
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
};

export default BiomarkerTrendsChart;
