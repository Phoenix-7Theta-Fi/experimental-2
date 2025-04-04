'use client';

import { useState } from 'react';
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
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// Generate mock data for the entire month
const generateMonthlyData = () => {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return daysInMonth.map(date => ({
    date: format(date, 'yyyy-MM-dd'),
    medications: {
      'Ashwagandha': Math.random() > 0.1 ? 500 : 0, // 90% adherence
      'Triphala': Math.random() > 0.15 ? 1000 : 0, // 85% adherence
      'Brahmi': Math.random() > 0.2 ? 350 : 0, // 80% adherence
      'Metformin': Math.random() > 0.05 ? 850 : 0, // 95% adherence
      'Lisinopril': Math.random() > 0.1 ? 10 : 0, // 90% adherence
      'Vitamin D3': Math.random() > 0.2 ? 2000 : 0, // 80% adherence
      'Omega-3': Math.random() > 0.15 ? 1000 : 0, // 85% adherence
      'Magnesium': Math.random() > 0.25 ? 400 : 0, // 75% adherence
    },
    metrics: {
      sleepScore: 60 + Math.random() * 40,
      mentalScore: 65 + Math.random() * 35,
      workoutScore: 55 + Math.random() * 45,
      recoveryScore: 70 + Math.random() * 30,
    },
  }));
};

const monthlyData = generateMonthlyData();

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

  return (
    <div className="w-full h-full">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">
            Monthly Medication Impact Analysis
          </h3>
          <div className="text-sm text-slate-400">
            {format(new Date(), 'MMMM yyyy')}
          </div>
        </div>

        <div className="w-full bg-[#1E293B] rounded-lg border border-[#475569] p-6">
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={monthlyData}
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
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickLine={{ stroke: '#475569' }}
                  label={{
                    value: 'Medication Dosage (mg)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#94A3B8',
                    fontSize: 12,
                  }}
                />
                
                <YAxis
                  yAxisId="metrics"
                  orientation="right"
                  domain={[0, 100]}
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickLine={{ stroke: '#475569' }}
                  label={{
                    value: 'Health Metrics Score',
                    angle: 90,
                    position: 'insideRight',
                    fill: '#94A3B8',
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#F8FAFC' }}
                  itemStyle={{ color: '#E2E8F0' }}
                  labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
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
