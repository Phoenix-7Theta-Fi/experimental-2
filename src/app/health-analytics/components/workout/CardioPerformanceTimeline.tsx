'use client';

import ReactECharts from 'echarts-for-react';
import { format, subHours } from 'date-fns';

interface HeartRateZone {
  min: number;
  max: number;
  color: string;
  name: string;
}

const HEART_RATE_ZONES: HeartRateZone[] = [
  { min: 160, max: 180, color: '#EF4444', name: 'Maximum' },
  { min: 140, max: 160, color: '#F97316', name: 'Threshold' },
  { min: 120, max: 140, color: '#10B981', name: 'Aerobic' },
  { min: 100, max: 120, color: '#3B82F6', name: 'Fat Burn' },
  { min: 60, max: 100, color: '#8B5CF6', name: 'Recovery' },
];

// Generate mock timeline data for the last 2 hours
const generateMockTimelineData = () => {
  const data = [];
  const now = new Date();
  const startTime = subHours(now, 2);

  for (let i = 0; i < 120; i++) { // 120 minutes of data
    const time = new Date(startTime.getTime() + i * 60000);
    
    // Simulate a workout pattern
    let heartRate, power, speed, cadence;
    
    if (i < 15) { // Warm-up phase
      heartRate = 90 + i * 2;
      power = 100 + i * 3;
      speed = 8 + i * 0.2;
      cadence = 140 + i;
    } else if (i < 90) { // Main workout phase
      const intensity = Math.sin(i / 15) * 20;
      heartRate = 140 + intensity + Math.random() * 10;
      power = 200 + intensity * 2 + Math.random() * 20;
      speed = 12 + (intensity / 10) + Math.random();
      cadence = 165 + (intensity / 2) + Math.random() * 5;
    } else { // Cool-down phase
      heartRate = 140 - ((i - 90) * 2);
      power = 150 - ((i - 90) * 2);
      speed = 10 - ((i - 90) * 0.1);
      cadence = 150 - ((i - 90));
    }

    data.push({
      time: format(time, 'HH:mm'),
      heartRate: Math.round(heartRate),
      power: Math.round(power),
      speed: Math.round(speed * 10) / 10,
      cadence: Math.round(cadence),
    });
  }

  return data;
};

const timelineData = generateMockTimelineData();

// Achievement markers
const achievements = [
  { time: '14:30', type: 'PR', metric: 'Max Power', value: '320W' },
  { time: '14:45', type: 'Zone', metric: 'Threshold', duration: '20min' },
  { time: '15:15', type: 'Recovery', metric: 'Optimal', score: 95 },
];

export default function CardioPerformanceTimeline() {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      borderColor: '#475569',
      textStyle: { color: '#F8FAFC' },
      formatter: (params: any[]) => {
        const time = params[0].axisValue;
        let html = `<div class="font-medium">${time}</div>`;
        params.forEach((param) => {
          const value = param.value;
          const marker = param.marker;
          let unit = '';
          switch (param.seriesName) {
            case 'Heart Rate': unit = 'bpm'; break;
            case 'Power': unit = 'W'; break;
            case 'Speed': unit = 'km/h'; break;
            case 'Cadence': unit = 'spm'; break;
          }
          html += `${marker} ${param.seriesName}: ${value}${unit}<br/>`;
        });
        return html;
      }
    },
    legend: {
      data: ['Heart Rate', 'Power', 'Speed', 'Cadence'],
      textStyle: { color: '#94A3B8' },
      top: 0,
    },
    grid: {
      top: 30,
      left: 10,
      right: 10,
      bottom: 0,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: timelineData.map(d => d.time),
      axisLabel: { color: '#94A3B8' },
      axisLine: { lineStyle: { color: '#475569' } },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Heart Rate',
        min: 60,
        max: 180,
        interval: 20,
        axisLabel: { color: '#94A3B8' },
        axisLine: { lineStyle: { color: '#475569' } },
        splitLine: { lineStyle: { color: '#334155' } },
      },
      {
        type: 'value',
        name: 'Power',
        min: 0,
        max: 400,
        interval: 50,
        axisLabel: { color: '#94A3B8' },
        axisLine: { lineStyle: { color: '#475569' } },
        splitLine: { show: false },
      }
    ],
    series: [
      {
        name: 'Heart Rate',
        type: 'line',
        smooth: true,
        data: timelineData.map(d => d.heartRate),
        lineStyle: { width: 3 },
        itemStyle: { color: '#F97316' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(249, 115, 22, 0.2)' },
              { offset: 1, color: 'rgba(249, 115, 22, 0)' }
            ]
          }
        },
        markPoint: {
          symbol: 'circle',
          symbolSize: 8,
          data: achievements.map(a => ({
            name: a.type,
            value: a.metric,
            xAxis: a.time,
            yAxis: 160,
            itemStyle: { color: '#10B981' }
          }))
        }
      },
      {
        name: 'Power',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: timelineData.map(d => d.power),
        lineStyle: { width: 2 },
        itemStyle: { color: '#3B82F6' }
      },
      {
        name: 'Speed',
        type: 'line',
        smooth: true,
        data: timelineData.map(d => d.speed),
        lineStyle: { width: 2 },
        itemStyle: { color: '#8B5CF6' }
      },
      {
        name: 'Cadence',
        type: 'line',
        smooth: true,
        data: timelineData.map(d => d.cadence),
        lineStyle: { width: 2 },
        itemStyle: { color: '#10B981' }
      }
    ]
  };

  return (
    <div className="bg-[#1E293B] rounded-xl p-4">
      <h3 className="text-[#F8FAFC] font-semibold mb-3">Cardio Performance</h3>
      <div className="h-[300px]">
        <ReactECharts 
          option={option} 
          style={{ height: '100%', width: '100%' }}
        />
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {HEART_RATE_ZONES.map((zone) => (
          <div 
            key={zone.name}
            className="text-center p-1 rounded"
            style={{ backgroundColor: `${zone.color}20` }}
          >
            <div className="text-xs font-medium" style={{ color: zone.color }}>
              {zone.name}
            </div>
            <div className="text-[#94A3B8] text-xs">
              {zone.min}-{zone.max}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}