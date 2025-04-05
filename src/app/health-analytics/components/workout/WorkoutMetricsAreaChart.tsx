'use client';

import ReactECharts from "echarts-for-react";
import { useState } from "react";

// More realistic mock data for workout metrics over 30 days
const generateMockData = () => {
  const dates: string[] = [];
  const volume: number[] = [];
  const frequency: number[] = [];
  const strength: number[] = [];
  const intensity: number[] = [];

  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  let vol = 2000;
  let str = 70;

  for (let i = 0; i < 30; i++) {
    const dayOfWeek = new Date(dates[i]).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const weekCycle = Math.sin((i / 7) * 2 * Math.PI) * 100;

    // Volume
    vol += Math.random() * 50 - 25 + 5;
    if (Math.random() < 0.05) vol -= 300;
    let volVal = vol + weekCycle + (isWeekend ? -300 : 0) + (Math.random() * 200 - 100);
    volVal = Math.max(1000, volVal);
    volume.push(volVal);

    // Frequency
    let freqVal = 3.5 + Math.sin((i / 7) * 2 * Math.PI) * 1 + (isWeekend ? -1 : 1) * 0.5 + (Math.random() - 0.5);
    freqVal = Math.max(2, Math.min(6, freqVal));
    frequency.push(freqVal);

    // Strength
    if (Math.random() < 0.1) str += Math.random() * 1;
    else str += Math.random() * 0.2 - 0.1;
    let strVal = str + Math.sin(i / 10) * 2 + (Math.random() - 0.5) * 2;
    strVal = Math.max(60, Math.min(100, strVal));
    strength.push(strVal);

    // Intensity
    let intenVal = 65 + Math.sin(i / 5) * 10 + (Math.random() - 0.5) * 10;
    intenVal = Math.max(50, Math.min(90, intenVal));
    intensity.push(intenVal);
  }

  return { dates, volume, frequency, strength, intensity };
};

const mockData = generateMockData();

export default function WorkoutMetricsAreaChart() {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d');

  const filterData = (days: number) => {
    const startIndex = mockData.dates.length - days;
    return {
      dates: mockData.dates.slice(startIndex),
      volume: mockData.volume.slice(startIndex),
      frequency: mockData.frequency.slice(startIndex),
      strength: mockData.strength.slice(startIndex),
      intensity: mockData.intensity.slice(startIndex)
    };
  };

  const filteredData = filterData(timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30);

  const scaleValues = (values: number[], scaleFactor: number) => values.map(v => v * scaleFactor);

  const volumeScaleFactor = 0.03;
  const frequencyScaleFactor = 15;

  const option: echarts.EChartsOption = {
    title: {
      text: 'Workout Metrics Relationship',
      left: 'center',
      textStyle: { color: '#F8FAFC' },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1E293B',
      borderColor: '#475569',
      textStyle: { color: '#F8FAFC' },
      formatter: function (params: any) {
        const date = params[0].axisValue;
        let result = `<div style="font-weight: bold; margin-bottom: 5px;">${date}</div>`;
        params.forEach((param: any) => {
          let value = param.value;
          let unit = '';
          if (param.seriesName === 'Volume') {
            value = Math.round(value / volumeScaleFactor);
            unit = ' kg';
          } else if (param.seriesName === 'Frequency') {
            value = (value / frequencyScaleFactor).toFixed(1);
            unit = ' sessions/week';
          } else {
            unit = '%';
          }
          const color = param.color;
          result += `<div style="display: flex; justify-content: space-between; align-items: center; margin: 3px 0;">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${color}; border-radius: 50%; margin-right: 5px;"></span>
            <span style="margin-right: 15px;">${param.seriesName}:</span>
            <span style="font-weight: bold;">${value}${unit}</span>
          </div>`;
        });
        return result;
      }
    },
    legend: {
      data: ['Volume', 'Frequency', 'Strength', 'Intensity'],
      textStyle: { color: '#94A3B8' },
      top: 30,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '80px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: filteredData.dates,
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: {
        color: '#94A3B8',
        formatter: (value: string) => {
          const date = new Date(value);
          return `${date.getDate()}/${date.getMonth() + 1}`;
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#475569' } },
      splitLine: { lineStyle: { color: '#334155', type: 'dashed' } },
      axisLabel: { color: '#94A3B8' },
    },
    series: [
      {
        name: 'Volume',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: { width: 0 },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(249, 115, 22, 0.6)' },
              { offset: 1, color: 'rgba(249, 115, 22, 0.1)' },
            ],
          },
        },
        emphasis: { focus: 'series' },
        data: scaleValues(filteredData.volume, volumeScaleFactor),
      },
      {
        name: 'Frequency',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: { width: 0 },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.6)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.1)' },
            ],
          },
        },
        emphasis: { focus: 'series' },
        data: scaleValues(filteredData.frequency, frequencyScaleFactor),
      },
      {
        name: 'Strength',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: { width: 0 },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.6)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.1)' },
            ],
          },
        },
        emphasis: { focus: 'series' },
        data: filteredData.strength,
      },
      {
        name: 'Intensity',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: { width: 0 },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(139, 92, 246, 0.6)' },
              { offset: 1, color: 'rgba(139, 92, 246, 0.1)' },
            ],
          },
        },
        emphasis: { focus: 'series' },
        data: filteredData.intensity,
      }
    ],
  };

  return (
    <div className="bg-[#1E293B] rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#F8FAFC] font-semibold">Workout Metrics Relationship</h3>
        <div className="flex space-x-2">
          {(['7d', '14d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#334155] text-[#94A3B8] hover:bg-[#475569]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="text-[#94A3B8] text-xs mb-2">
        Visualizing the relationship between volume, frequency, strength, and intensity
      </div>
      <ReactECharts option={option} style={{ height: '300px' }} />
    </div>
  );
}
