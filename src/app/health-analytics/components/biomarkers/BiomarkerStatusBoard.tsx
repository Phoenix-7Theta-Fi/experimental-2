'use client';

import React from 'react';
import { BiomarkerData } from '@/lib/types/health';

interface BiomarkerStatusBoardProps {
  data: BiomarkerData;
}

const BiomarkerStatusBoard: React.FC<BiomarkerStatusBoardProps> = ({ data }) => {
  const getStatusColor = (value: number | null, range: { min: number; max: number }) => {
    if (!value) return '#94A3B8';  // gray for null values
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

  // Helper to display values with units
  const displayValue = (value: number | null, unit: string) => {
    if (value === null) return 'N/A';
    return `${value} ${unit}`;
  };

  return (
    <div className="w-full bg-[#334155] rounded-lg shadow-lg shadow-black/20 border border-[#475569] overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-100 mb-4">Latest Biomarker Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Glucose Metrics */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Glucose</h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">Fasting</span>
                <span className="font-mono" style={{ color: getStatusColor(data.glucose.fasting, { min: 70, max: 100 }) }}>
                  {displayValue(data.glucose.fasting, 'mg/dL')}
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">Post Prandial</span>
                <span className="font-mono" style={{ color: getStatusColor(data.glucose.postPrandial, { min: 80, max: 140 }) }}>
                  {displayValue(data.glucose.postPrandial, 'mg/dL')}
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">HbA1c</span>
                <span className="font-mono" style={{ color: getStatusColor(data.glucose.hba1c, { min: 4, max: 5.7 }) }}>
                  {displayValue(data.glucose.hba1c, '%')}
                </span>
              </div>
            </div>
          </div>

          {/* Lipid Profile */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Lipid Profile</h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">Total Cholesterol</span>
                <span className="font-mono" style={{ color: getStatusColor(data.lipids.totalCholesterol, { min: 125, max: 200 }) }}>
                  {displayValue(data.lipids.totalCholesterol, 'mg/dL')}
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">HDL</span>
                <span className="font-mono" style={{ color: getStatusColor(data.lipids.hdl, { min: 40, max: 60 }) }}>
                  {displayValue(data.lipids.hdl, 'mg/dL')}
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">LDL</span>
                <span className="font-mono" style={{ color: getStatusColor(data.lipids.ldl, { min: 0, max: 100 }) }}>
                  {displayValue(data.lipids.ldl, 'mg/dL')}
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">Triglycerides</span>
                <span className="font-mono" style={{ color: getStatusColor(data.lipids.triglycerides, { min: 0, max: 150 }) }}>
                  {displayValue(data.lipids.triglycerides, 'mg/dL')}
                </span>
              </div>
            </div>
          </div>

          {/* Thyroid Function */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Thyroid Function</h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">TSH</span>
                <span className="font-mono" style={{ color: getStatusColor(data.thyroid.tsh, { min: 0.4, max: 4.0 }) }}>
                  {displayValue(data.thyroid.tsh, 'mU/L')}
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">T3</span>
                <span className="font-mono" style={{ color: getStatusColor(data.thyroid.t3, { min: 80, max: 200 }) }}>
                  {displayValue(data.thyroid.t3, 'ng/dL')}
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">T4</span>
                <span className="font-mono" style={{ color: getStatusColor(data.thyroid.t4, { min: 5.0, max: 12.0 }) }}>
                  {displayValue(data.thyroid.t4, 'µg/dL')}
                </span>
              </div>
            </div>
          </div>

          {/* Vitamins */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Vitamins</h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">Vitamin D</span>
                <span className="font-mono" style={{ color: getStatusColor(data.vitamins.d, { min: 20, max: 50 }) }}>
                  {displayValue(data.vitamins.d, 'ng/mL')}
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">Vitamin B12</span>
                <span className="font-mono" style={{ color: getStatusColor(data.vitamins.b12, { min: 200, max: 900 }) }}>
                  {displayValue(data.vitamins.b12, 'pg/mL')}
                </span>
              </div>
            </div>
          </div>

          {/* Inflammation Markers */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Inflammation Markers</h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">CRP</span>
                <span className="font-mono" style={{ color: getStatusColor(data.inflammation.crp, { min: 0, max: 3.0 }) }}>
                  {displayValue(data.inflammation.crp, 'mg/L')}
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                <span className="text-slate-300">ESR</span>
                <span className="font-mono" style={{ color: getStatusColor(data.inflammation.esr, { min: 0, max: 20 }) }}>
                  {displayValue(data.inflammation.esr, 'mm/hr')}
                </span>
              </div>
            </div>
          </div>

          {/* Liver and Kidney Function */}
          <div className="space-y-4">
            {/* Liver Function */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200">Liver Function</h4>
              <div className="space-y-1">
                <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                  <span className="text-slate-300">ALT</span>
                  <span className="font-mono" style={{ color: getStatusColor(data.liver.alt, { min: 7, max: 56 }) }}>
                    {displayValue(data.liver.alt, 'U/L')}
                  </span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                  <span className="text-slate-300">AST</span>
                  <span className="font-mono" style={{ color: getStatusColor(data.liver.ast, { min: 10, max: 40 }) }}>
                    {displayValue(data.liver.ast, 'U/L')}
                  </span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Albumin</span>
                  <span className="font-mono" style={{ color: getStatusColor(data.liver.albumin, { min: 3.5, max: 5.0 }) }}>
                    {displayValue(data.liver.albumin, 'g/dL')}
                  </span>
                </div>
              </div>
            </div>

            {/* Kidney Function */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200">Kidney Function</h4>
              <div className="space-y-1">
                <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Creatinine</span>
                  <span className="font-mono" style={{ color: getStatusColor(data.kidney.creatinine, { min: 0.6, max: 1.2 }) }}>
                    {displayValue(data.kidney.creatinine, 'mg/dL')}
                  </span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Urea</span>
                  <span className="font-mono" style={{ color: getStatusColor(data.kidney.urea, { min: 7, max: 20 }) }}>
                    {displayValue(data.kidney.urea, 'mg/dL')}
                  </span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-slate-700/50 rounded">
                  <span className="text-slate-300">Uric Acid</span>
                  <span className="font-mono" style={{ color: getStatusColor(data.kidney.uricAcid, { min: 2.4, max: 6.0 }) }}>
                    {displayValue(data.kidney.uricAcid, 'mg/dL')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiomarkerStatusBoard;
