'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// --- Data Types (Defined locally for easy future transition) ---
interface SleepStage {
  stage_type: 'deep' | 'rem' | 'light' | 'awake';
  duration: number; // in minutes
  quality: 'good' | 'neutral' | 'poor';
}

interface SleepFactor {
  factor_name: string;
  impact_value: number; // Represents duration/impact, needs clarification but using as is for now
  factor_category: string; // e.g., 'activity', 'lifestyle', 'routine', 'mental', 'environment', 'diet'
  associated_stage: 'deep' | 'rem' | 'light' | 'awake';
}

// Renamed to avoid conflicts with other potential SleepData types
export interface SunburstSleepData {
  stages: SleepStage[];
  factors: SleepFactor[];
  total_duration: number; // Total sleep duration in minutes
}

// --- Mock Data Snippet ---
const MOCK_SLEEP_DATA: SunburstSleepData = {
  stages: [
    { stage_type: 'deep', duration: 90, quality: 'good' },
    { stage_type: 'rem', duration: 120, quality: 'good' },
    { stage_type: 'light', duration: 240, quality: 'neutral' },
    { stage_type: 'awake', duration: 30, quality: 'poor' },
  ],
  factors: [
    { factor_name: 'Exercise (Morning)', impact_value: 50, factor_category: 'activity', associated_stage: 'deep' },
    { factor_name: 'No Alcohol', impact_value: 40, factor_category: 'lifestyle', associated_stage: 'deep' },
    { factor_name: 'Regular Sleep Schedule', impact_value: 70, factor_category: 'routine', associated_stage: 'rem' },
    { factor_name: 'Low Stress', impact_value: 50, factor_category: 'mental', associated_stage: 'rem' },
    { factor_name: 'Comfortable Temperature', impact_value: 80, factor_category: 'environment', associated_stage: 'light' },
    { factor_name: 'Late Caffeine', impact_value: 80, factor_category: 'diet', associated_stage: 'light' },
    { factor_name: 'Evening Exercise', impact_value: 80, factor_category: 'activity', associated_stage: 'light' },
    { factor_name: 'Screen Time', impact_value: 15, factor_category: 'lifestyle', associated_stage: 'awake' },
    { factor_name: 'Noise Disruption', impact_value: 15, factor_category: 'environment', associated_stage: 'awake' },
  ],
  total_duration: 480
};

// --- Component Props ---
interface SleepQualitySunburstProps {
  sleep?: SunburstSleepData; // Use the renamed interface
}

// --- Color Logic ---
const STAGE_COLORS = {
  deep: '#3949AB', // Cool blue for good deep sleep
  rem: '#5E97F6',  // Lighter blue for REM
  light: '#90CAF9', // Very light blue for light sleep
  awake: '#FFB74D'  // Warm orange for awake time (less desirable)
};

// Function to generate shades for factors based on the associated stage color
const getFactorColor = (stage: string, index: number, total: number) => {
  const baseColor = STAGE_COLORS[stage as keyof typeof STAGE_COLORS];
  // Create slightly lighter/darker shades for factors within the same stage color family
  // Start lighter for the first factor, get slightly darker
  const shadeFactor = 0.8 + (0.4 * (index / Math.max(1, total -1))); // Avoid division by zero if total is 1
  return adjustColor(baseColor, shadeFactor);
};

// Helper function to adjust color brightness (simple multiplier)
const adjustColor = (hex: string, factor: number) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  r = Math.min(255, Math.max(0, Math.round(r * factor)));
  g = Math.min(255, Math.max(0, Math.round(g * factor)));
  b = Math.min(255, Math.max(0, Math.round(b * factor)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// --- Custom Tooltip Component ---
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload.payload; // Access the actual data payload
    const value = payload[0].value; // Get the value directly from payload

    return (
      <div className="bg-[#1E293B] p-2 border border-[#475569] rounded shadow text-sm">
        <p className="font-bold text-[#F8FAFC]">{data.name}</p>
        {data.parentName && (
          <p className="text-[#94A3B8]">Stage: {data.parentName}</p>
        )}
         {/* Display duration for stages, impact for factors */}
        <p className="text-[#F8FAFC]">
          {data.parentName ? `Impact: ${value}` : `Duration: ${value} min`}
        </p>
      </div>
    );
  }
  return null;
};

// --- Main Component ---
export default function SleepQualitySunburst({ sleep }: SleepQualitySunburstProps) {
  // Use provided data or fallback to mock data
  const isMockData = !sleep || !sleep.stages || !sleep.factors;
  const dataToUse = isMockData ? MOCK_SLEEP_DATA : sleep;

  // Transform stages data for the inner ring
  const stagesData = dataToUse.stages.map(stage => ({
    name: stage.stage_type.charAt(0).toUpperCase() + stage.stage_type.slice(1),
    value: stage.duration, // Use duration for the size of the slice
    color: STAGE_COLORS[stage.stage_type as keyof typeof STAGE_COLORS]
  }));

  // Transform factors data for the outer ring
  const factorsData = dataToUse.factors.map((factor) => {
    // Group factors by stage to calculate index within the stage group for color variation
    const stageFactors = dataToUse.factors.filter(f => f.associated_stage === factor.associated_stage);
    const stageIndex = stageFactors.findIndex(f => f.factor_name === factor.factor_name); // Find index within the group
    const totalInStage = stageFactors.length;

    return {
      name: factor.factor_name,
      value: factor.impact_value, // Use impact_value for the size of the slice
      parentName: factor.associated_stage.charAt(0).toUpperCase() + factor.associated_stage.slice(1),
      color: getFactorColor(factor.associated_stage, stageIndex, totalInStage)
    };
  });

  // Calculate total sleep time for display
  const totalMinutes = dataToUse.total_duration;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Prepare data for the legend (only show sleep stages)
  // Ensure the 'type' conforms to Recharts LegendType
  const legendData = stagesData.map(stage => ({
    value: stage.name,
    type: 'circle' as const, // Use 'as const' or import LegendType if needed
    color: stage.color,
    id: stage.name // Add an id for uniqueness if required by Legend payload
  }));

  return (
    <div className="bg-[#1E293B] rounded-lg p-6">
      <div className="text-center mb-4">
        <h3 className="text-[#F8FAFC] font-semibold">Sleep Quality Analysis</h3>
        <div className="text-sm text-[#94A3B8]">
          Total Sleep: {hours}h {minutes}m
          {isMockData && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
              Sample Data
            </span>
          )}
        </div>
      </div>

      <div className="h-[400px]"> {/* Increased height for better visibility */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Inner ring - Sleep Stages */}
            <Pie
              data={stagesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="40%" // Inner ring takes up 40% of the radius
              innerRadius="0%"   // Starts from the center
              fill="#8884d8" // Default fill, overridden by Cells
              paddingAngle={1}
              startAngle={90} // Start from the top
              endAngle={-270} // Go clockwise
              legendType="none" // Hide default legend for this pie
            >
              {stagesData.map((entry, index) => (
                <Cell key={`cell-inner-${index}`} fill={entry.color} stroke={entry.color} /> // Use defined stage colors
              ))}
            </Pie>

            {/* Outer ring - Factors affecting sleep */}
            <Pie
              data={factorsData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="45%" // Start slightly outside the inner ring
              outerRadius="75%" // Outer ring extends further
              fill="#82ca9d" // Default fill, overridden by Cells
              paddingAngle={1}
              startAngle={90} // Align start angle with inner ring
              endAngle={-270} // Align end angle
              legendType="none" // Hide default legend for this pie
            >
              {factorsData.map((entry, index) => (
                <Cell key={`cell-outer-${index}`} fill={entry.color} stroke={entry.color} /> // Use calculated factor colors
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
            {/* Custom Legend for Stages */}
            <Legend
              payload={legendData} // Use the prepared legend data
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconSize={10} // Adjust icon size if needed
              wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} // Style the legend text
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Optional: Keep or remove the summary sections based on preference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-[#1E293B] p-3 rounded border border-[#475569]">
          <h4 className="text-[#F8FAFC] font-medium text-sm">Factors Improving Sleep</h4>
          <ul className="text-xs text-[#94A3B8] mt-1 space-y-1">
            {dataToUse.factors.filter(f => ['deep', 'rem'].includes(f.associated_stage)).slice(0, 4).map(f => (
              <li key={f.factor_name}>• {f.factor_name}</li>
            ))}
             {dataToUse.factors.filter(f => ['deep', 'rem'].includes(f.associated_stage)).length > 4 && <li>...</li>}
          </ul>
        </div>

        <div className="bg-[#1E293B] p-3 rounded border border-[#475569]">
          <h4 className="text-[#F8FAFC] font-medium text-sm">Factors Impacting Sleep</h4>
           <ul className="text-xs text-[#94A3B8] mt-1 space-y-1">
            {dataToUse.factors.filter(f => ['light', 'awake'].includes(f.associated_stage)).slice(0, 4).map(f => (
              <li key={f.factor_name}>• {f.factor_name}</li>
            ))}
            {dataToUse.factors.filter(f => ['light', 'awake'].includes(f.associated_stage)).length > 4 && <li>...</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
