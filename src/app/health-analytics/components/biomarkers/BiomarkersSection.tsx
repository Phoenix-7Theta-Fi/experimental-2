'use client';

import React, { useState } from 'react';
import { BiomarkerData, BiomarkerCategory } from '@/lib/types/health';
import BiomarkerCard from './BiomarkerCard';
import { getBiomarkerValue, getBiomarkerRange } from '@/lib/utils/chart-helpers';

interface BiomarkersSectionProps {
  data: BiomarkerData[];
  patientId: number;
}

interface BiomarkerTarget {
  min: number;
  max: number;
  goal: number;
}

const defaultCategories: BiomarkerCategory[] = ['glucose', 'lipids', 'thyroid'];

// Add this object to store patient-specific goals
const biomarkerGoals: Record<string, Record<string, number>> = {
  glucose: {
    fasting: 85,
    postPrandial: 140,
    hba1c: 5.7
  },
  lipids: {
    totalCholesterol: 180,
    hdl: 60,
    ldl: 100,
    triglycerides: 150
  },
  // ... add other categories and their goals
};

const BiomarkersSection: React.FC<BiomarkersSectionProps> = ({ data }) => {
  const [selectedCategories, setSelectedCategories] = useState<BiomarkerCategory[]>(defaultCategories);

  // Get the latest data point
  const latestData = data[0];
  const previousData = data[1];

  // Create historical data structure
  const createHistoricalData = (category: BiomarkerCategory, metric: string) => {
    return data.map(record => ({
      date: record.date,
      value: getBiomarkerValue(record, category, metric) || 0
    })).filter(item => item.value !== 0); // Filter out null/0 values
  };

  // Function to calculate trend
  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return undefined;
    const percentage = ((current - previous) / previous) * 100;
    return {
      direction: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'stable',
      percentage: Math.abs(Math.round(percentage))
    };
  };

  const biomarkerMetrics = {
    glucose: ['fasting', 'postPrandial', 'hba1c'],
    lipids: ['totalCholesterol', 'hdl', 'ldl', 'triglycerides'],
    thyroid: ['tsh', 't3', 't4'],
    vitamins: ['d', 'b12'],
    inflammation: ['crp', 'esr'],
    liver: ['alt', 'ast', 'albumin'],
    kidney: ['creatinine', 'urea', 'uricAcid']
  };

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(biomarkerMetrics) as BiomarkerCategory[]).map(category => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategories(prev =>
                prev.includes(category)
                  ? prev.filter(c => c !== category)
                  : [...prev, category]
              );
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
              selectedCategories.includes(category)
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Biomarker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {selectedCategories.map(category =>
          biomarkerMetrics[category].map(metric => {
            const currentValue = getBiomarkerValue(latestData, category, metric);
            const previousValue = getBiomarkerValue(previousData, category, metric);
            const range = getBiomarkerRange(category, metric);
            const goal = biomarkerGoals[category]?.[metric];

            if (currentValue === null) return null;

            return (
              <BiomarkerCard
                key={`${category}-${metric}`}
                category={category}
                name={metric.charAt(0).toUpperCase() + metric.slice(1)}
                value={currentValue}
                unit={category === 'thyroid' && metric === 'tsh' ? 'mU/L' : 'mg/dL'}
                target={{
                  ...range,
                  goal: goal || range.max // fallback to range max if no specific goal
                }}
                trend={previousValue ? calculateTrend(currentValue, previousValue) : undefined}
                historicalData={createHistoricalData(category, metric)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default BiomarkersSection;
