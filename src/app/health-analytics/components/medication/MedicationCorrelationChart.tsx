'use client';

import { useState, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { useMedicationImpact } from './hooks/useMedicationImpact';

// Mock data for fallback when API fails
const MOCK_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  
  return {
    date: date.toISOString(),
    medications: {
      'Ashwagandha': Math.floor(Math.random() * 300 + 200), // 200-500mg
      'Triphala': Math.floor(Math.random() * 400 + 300), // 300-700mg
      'Brahmi': Math.floor(Math.random() * 200 + 150), // 150-350mg
      'Metformin': Math.floor(Math.random() * 500 + 500), // 500-1000mg
      'Lisinopril': Math.floor(Math.random() * 10 + 5), // 5-15mg
      'Vitamin D3': Math.floor(Math.random() * 2000 + 1000), // 1000-3000IU
      'Omega-3': Math.floor(Math.random() * 1000 + 500), // 500-1500mg
      'Magnesium': Math.floor(Math.random() * 200 + 100), // 100-300mg
    },
    metrics: {
      sleepScore: Math.floor(Math.random() * 30 + 70), // 70-100
      mentalScore: Math.floor(Math.random() * 25 + 75), // 75-100
      workoutScore: Math.floor(Math.random() * 35 + 65), // 65-100
      recoveryScore: Math.floor(Math.random() * 40 + 60), // 60-100
    }
  };
});

// Color palette for medications by category
const MEDICATION_COLORS = {
  // Ayurvedic - Purple spectrum
  'Ashwagandha': '#9333EA',
  'Triphala': '#A855F7',
  'Brahmi': '#C084FC',
  // Modern - Blue spectrum
  'Metformin': '#2563EB',
  'Lisinopril': '#3B82F6',
  // Supplements - Green spectrum
  'Vitamin D3': '#059669',
  'Omega-3': '#10B981',
  'Magnesium': '#34D399',
};

const METRIC_COLORS = {
  sleepScore: '#F59E0B',
  mentalScore: '#EC4899',
  workoutScore: '#14B8A6',
  recoveryScore: '#6366F1',
};

const METRIC_LABELS = {
  sleepScore: 'Sleep Quality',
  mentalScore: 'Mental Health',
  workoutScore: 'Physical Performance',
  recoveryScore: 'Recovery Score',
};

export default function MedicationCorrelationChart() {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const { data: apiData, isLoading, error } = useMedicationImpact();
  
  // Use API data if available, otherwise fallback to mock data
  const data = useMemo(() => {
    if (!error && apiData && apiData.length > 0) {
      return apiData;
    }
    return MOCK_DATA;
  }, [apiData, error]);

  if (isLoading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-slate-800/40 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-400">Loading medication impact data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-slate-800/40 rounded-lg">
        <p className="text-slate-400">No medication impact data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-100">
              Monthly Medication Impact Analysis
            </h3>
            {error && (
              <span className="px-2 py-1 text-xs font-medium rounded bg-amber-900/50 text-amber-400 border border-amber-800">
                Using Mock Data
              </span>
            )}
          </div>
          <div className="text-sm text-slate-400">
            {format(new Date(), 'MMMM yyyy')}
          </div>
        </div>

        <div className="w-full bg-[#1E293B] rounded-lg border border-[#475569] p-6">
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 40, left: 20, bottom: 80 }}
                onMouseMove={(e) => {
                  if (e.activeLabel) {
                    setHoveredDate(e.activeLabel);
                  }
                }}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <XAxis
                  dataKey="date"
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickLine={{ stroke: '#475569' }}
                  tickFormatter={(value) => format(new Date(value), 'd')}
                  interval={2}
                />
                <YAxis
                  yAxisId="medications"
                  orientation="left"
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickLine={{ stroke: '#475569' }}
                  label={{
                    value: 'Dosage (mg)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#94A3B8',
                  }}
                />
                <YAxis
                  yAxisId="metrics"
                  orientation="right"
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickLine={{ stroke: '#475569' }}
                  domain={[0, 100]}
                  label={{
                    value: 'Score',
                    angle: 90,
                    position: 'insideRight',
                    fill: '#94A3B8',
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#94A3B8' }}
                  itemStyle={{ color: '#E2E8F0' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={72}
                  wrapperStyle={{
                    paddingTop: '20px',
                    borderTop: '1px solid #475569',
                  }}
                />

                {Object.entries(MEDICATION_COLORS).map(([medication, color]) => (
                  <Bar
                    key={medication}
                    dataKey={`medications.${medication}`}
                    name={medication}
                    stackId="medications"
                    fill={color}
                    yAxisId="medications"
                    opacity={hoveredDate ? 0.7 : 1}
                  />
                ))}

                {Object.entries(METRIC_COLORS).map(([metric, color]) => (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={`metrics.${metric}`}
                    name={METRIC_LABELS[metric as keyof typeof METRIC_LABELS]}
                    stroke={color}
                    strokeWidth={2}
                    yAxisId="metrics"
                    dot={{ fill: color, r: 3 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
