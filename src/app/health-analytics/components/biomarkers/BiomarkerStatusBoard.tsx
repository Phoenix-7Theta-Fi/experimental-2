'use client';

import React from 'react';
import { BiomarkerData, BIOMARKER_RANGES } from '@/lib/types/health';

interface BiomarkerStatusBoardProps {
  data: BiomarkerData;
}

const BiomarkerStatusBoard: React.FC<BiomarkerStatusBoardProps> = ({ data }) => {
  const getStatusColor = (value: number, range: { min: number; max: number }) => {
    if (value < range.min) return '#EF4444';  // red
    if (value > range.max) return '#EF4444';  // red
    
    // Calculate how far from the ideal middle the value is
    const middle = (range.max + range.min) / 2;
    const maxDistance = (range.max - range.min) / 2;
    const distance = Math.abs(value - middle);
    const percentage = distance / maxDistance;

    if (percentage < 0.25) return '#22C55E';  // green
    return '#F59E0B';  // amber
  };

  return (
    <div className="w-full bg-[#334155] rounded-lg shadow-lg shadow-black/20 border border-[#475569] overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-100 mb-4">Latest Biomarker Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Blood Sugar */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Blood Sugar</h4>
            <div className="space-y-1">
              {Object.entries(data.biomarkers.bloodSugar).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                  <span className="text-slate-300 capitalize">{key}</span>
                  <span 
                    className="font-mono"
                    style={{ color: getStatusColor(value, BIOMARKER_RANGES.bloodSugar[key as keyof typeof BIOMARKER_RANGES.bloodSugar]) }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lipid Profile */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Lipid Profile</h4>
            <div className="space-y-1">
              {Object.entries(data.biomarkers.lipidProfile).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                  <span className="text-slate-300 capitalize">{key}</span>
                  <span 
                    className="font-mono"
                    style={{ color: getStatusColor(value, BIOMARKER_RANGES.lipidProfile[key as keyof typeof BIOMARKER_RANGES.lipidProfile]) }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Thyroid Function */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Thyroid Function</h4>
            <div className="space-y-1">
              {Object.entries(data.biomarkers.thyroidFunction).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                  <span className="text-slate-300 uppercase">{key}</span>
                  <span 
                    className="font-mono"
                    style={{ color: getStatusColor(value, BIOMARKER_RANGES.thyroidFunction[key as keyof typeof BIOMARKER_RANGES.thyroidFunction]) }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vitamin Levels */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Vitamin Levels</h4>
            <div className="space-y-1">
              {Object.entries(data.biomarkers.vitaminLevels).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Vitamin {key.slice(-2)}</span>
                  <span 
                    className="font-mono"
                    style={{ color: getStatusColor(value, BIOMARKER_RANGES.vitaminLevels[key as keyof typeof BIOMARKER_RANGES.vitaminLevels]) }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Inflammation Markers */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Inflammation Markers</h4>
            <div className="space-y-1">
              {Object.entries(data.biomarkers.inflammationMarkers).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                  <span className="text-slate-300 uppercase">{key}</span>
                  <span 
                    className="font-mono"
                    style={{ color: getStatusColor(value, BIOMARKER_RANGES.inflammationMarkers[key as keyof typeof BIOMARKER_RANGES.inflammationMarkers]) }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Organ Function */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Organ Function</h4>
            <div className="space-y-1">
              {/* Liver */}
              <div className="space-y-1">
                <h5 className="text-sm text-slate-400 ml-1">Liver</h5>
                {Object.entries(data.biomarkers.liverFunction).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                    <span className="text-slate-300 uppercase">{key}</span>
                    <span 
                      className="font-mono"
                      style={{ color: getStatusColor(value, BIOMARKER_RANGES.liverFunction[key as keyof typeof BIOMARKER_RANGES.liverFunction]) }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              {/* Kidney */}
              <div className="space-y-1 mt-2">
                <h5 className="text-sm text-slate-400 ml-1">Kidney</h5>
                {Object.entries(data.biomarkers.kidneyFunction).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                    <span className="text-slate-300 capitalize">{key}</span>
                    <span 
                      className="font-mono"
                      style={{ color: getStatusColor(value, BIOMARKER_RANGES.kidneyFunction[key as keyof typeof BIOMARKER_RANGES.kidneyFunction]) }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiomarkerStatusBoard;
