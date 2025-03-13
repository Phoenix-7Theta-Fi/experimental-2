'use client';

import { YogaData } from "@/lib/types/health";
import CircularGauge from "./CircularGauge";
import { YogaInsights } from './yoga/YogaInsights';
import ReactECharts from "echarts-for-react";

interface YogaMetricsChartProps {
  data: YogaData;
  patientId: number;
}

export default function YogaMetricsChart({ data, patientId }: YogaMetricsChartProps) {
  // Flexibility Radar Chart Options
  const flexibilityOption: echarts.EChartsOption = {
    title: {
      text: "Flexibility Metrics",
      left: "center",
      top: 20,
      textStyle: {
        color: "#F8FAFC",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}%",
      backgroundColor: "#1E293B",
      borderColor: "#475569",
      textStyle: {
        color: "#F8FAFC",
      },
    },
    radar: {
      shape: 'circle' as const,
      indicator: [
        { name: 'Spine', max: 100 },
        { name: 'Hips', max: 100 },
        { name: 'Shoulders', max: 100 },
        { name: 'Balance', max: 100 },
        { name: 'Overall', max: 100 },
      ],
      splitLine: {
        lineStyle: {
          color: '#475569',
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['#1E293B', '#1E293B'],
        },
      },
      axisLine: {
        lineStyle: {
          color: '#475569',
        },
      },
      axisName: {
        color: '#94A3B8',
        fontSize: 12,
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

  // Calculate pose completion percentages
  const getPoseCompletion = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="grid grid-cols-5 gap-8">
      <div className="col-span-3 space-y-4">
        <div className="w-full bg-[#334155] rounded-lg border-[#475569] p-4">
          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-[#F8FAFC]">Yoga Progress</h2>
            <p className="text-sm text-[#94A3B8] mt-1">Track your flexibility, practice, and pose mastery</p>
          </div>

          {/* Main Content Stack */}
          <div className="space-y-4">
            {/* Flexibility Radar */}
            <div className="bg-[#1E293B] rounded-lg p-4">
            <ReactECharts 
              option={flexibilityOption}
              style={{ height: "280px" }}
              theme="dark"
            />
          </div>

            {/* Practice Stats */}
            <div className="bg-[#1E293B] rounded-lg p-4">
              <h3 className="text-[#F8FAFC] font-semibold mb-3">Practice Stats</h3>
              <div className="flex items-center justify-between space-x-3">
                <CircularGauge
                  value={data.practice.weeklyCompletion}
                  minValue={0}
                  maxValue={100}
                  color="#10B981"
                  label="Weekly"
                  unit="%"
                  size={100}
                />
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8]">Current Streak</span>
                    <span className="text-[#F8FAFC] font-bold">{data.practice.streak} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8]">Session Duration</span>
                    <span className="text-[#F8FAFC] font-bold">{data.practice.duration} mins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pose Mastery */}
            <div className="bg-[#1E293B] rounded-lg p-4">
              <h3 className="text-[#F8FAFC] font-semibold mb-3">Pose Mastery</h3>
              <div className="space-y-4">
                {[
                  { 
                    label: "Beginner",
                    completed: data.poses.beginner.completed,
                    total: data.poses.beginner.total,
                    color: "#10B981"
                  },
                  { 
                    label: "Intermediate", 
                    completed: data.poses.intermediate.completed,
                    total: data.poses.intermediate.total,
                    color: "#F97316"
                  },
                  { 
                    label: "Advanced",
                    completed: data.poses.advanced.completed,
                    total: data.poses.advanced.total,
                    color: "#8B5CF6"
                  },
                ].map((level) => (
                  <div key={level.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#94A3B8] text-sm">{level.label}</span>
                      <span className="text-[#F8FAFC] text-sm">
                        {level.completed}/{level.total}
                      </span>
                    </div>
                    <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${getPoseCompletion(level.completed, level.total)}%`,
                          backgroundColor: level.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="col-span-2">
        <div className="sticky top-4 bg-[#334155] rounded-lg border-[#475569] overflow-auto max-h-[calc(100vh-2rem)] p-2">
          <YogaInsights patientId={patientId} className="h-full" />
        </div>
      </div>
    </div>
  );
}
