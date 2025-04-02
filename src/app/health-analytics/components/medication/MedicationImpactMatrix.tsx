'use client';

import { useState } from 'react';
import { Tooltip } from '@/components/ui/tooltip';

interface ImpactData {
  impact: number; // 0-1
  details: string;
  synergies?: string[];
  contraindications?: string[];
  biomarkerEffects?: {
    marker: string;
    effect: string;
    magnitude: number;
  }[];
}

interface MatrixData {
  [medicationName: string]: {
    [parameter: string]: ImpactData;
  };
}

// Mock data - in production this would come from your treatment plan and medication data
const mockMatrixData: MatrixData = {
  'Gymnema Sylvestre': {
    'Blood Glucose': {
      impact: 0.8,
      details: 'Strong glucose-lowering effect',
      biomarkerEffects: [
        { marker: 'Fasting Glucose', effect: 'decrease', magnitude: 0.7 },
        { marker: 'HbA1c', effect: 'decrease', magnitude: 0.6 }
      ]
    },
    'Insulin Sensitivity': {
      impact: 0.7,
      details: 'Improves insulin response',
      synergies: ['Turmeric', 'Berberine']
    },
    'Metabolic Health': {
      impact: 0.6,
      details: 'Supports overall metabolic function'
    }
  },
  'Turmeric': {
    'Inflammation': {
      impact: 0.9,
      details: 'Potent anti-inflammatory effects',
      synergies: ['Gymnema Sylvestre']
    },
    'Blood Glucose': {
      impact: 0.4,
      details: 'Moderate glucose regulation support',
      biomarkerEffects: [
        { marker: 'Fasting Glucose', effect: 'decrease', magnitude: 0.3 }
      ]
    },
    'Metabolic Health': {
      impact: 0.5,
      details: 'General metabolic support'
    }
  },
  'Berberine': {
    'Blood Glucose': {
      impact: 0.85,
      details: 'Strong glucose regulation',
      contraindications: ['Metformin'],
      biomarkerEffects: [
        { marker: 'Fasting Glucose', effect: 'decrease', magnitude: 0.8 },
        { marker: 'HbA1c', effect: 'decrease', magnitude: 0.7 }
      ]
    },
    'Insulin Sensitivity': {
      impact: 0.8,
      details: 'Significant improvement in insulin sensitivity',
      synergies: ['Gymnema Sylvestre']
    },
    'Metabolic Health': {
      impact: 0.7,
      details: 'Comprehensive metabolic benefits'
    }
  }
};

const parameters = ['Blood Glucose', 'Insulin Sensitivity', 'Inflammation', 'Metabolic Health'];
const medications = Object.keys(mockMatrixData);

export default function MedicationImpactMatrix() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const getImpactColor = (impact: number) => {
    const baseColor = '#60A5FA'; // blue-400
    const alpha = 0.2 + (impact * 0.8); // Scale opacity from 20% to 100%
    return `${baseColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
  };

  const getCellContent = (medication: string, parameter: string) => {
    const data = mockMatrixData[medication]?.[parameter];
    if (!data) return null;

    const tooltipContent = (
      <div className="p-2 max-w-xs">
        <p className="font-bold mb-2">{`${medication} → ${parameter}`}</p>
        <p className="text-sm mb-2">{data.details}</p>
        {data.synergies && (
          <div className="mb-2">
            <p className="text-xs font-semibold">Synergies:</p>
            <ul className="text-xs list-disc list-inside">
              {data.synergies.map(syn => <li key={syn}>{syn}</li>)}
            </ul>
          </div>
        )}
        {data.biomarkerEffects && (
          <div className="mb-2">
            <p className="text-xs font-semibold">Biomarker Effects:</p>
            <ul className="text-xs list-disc list-inside">
              {data.biomarkerEffects.map(effect => (
                <li key={effect.marker}>
                  {`${effect.marker}: ${effect.effect} (${Math.round(effect.magnitude * 100)}%)`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );

    return (
      <Tooltip content={tooltipContent}>
        <div
          className="w-full h-full cursor-pointer transition-colors duration-200"
          style={{ backgroundColor: getImpactColor(data.impact) }}
          onMouseEnter={() => setHoveredCell(`${medication}-${parameter}`)}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <span className="text-xs font-medium">
            {Math.round(data.impact * 100)}%
          </span>
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="w-full bg-[#334155] rounded-lg border border-[#475569] p-6">
      <h3 className="text-lg font-bold text-slate-100 mb-4">
        Medication Impact Matrix
      </h3>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header row */}
          <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(100px,1fr))] gap-2 mb-2">
            <div className="text-slate-400 font-medium">Parameters</div>
            {medications.map(med => (
              <div key={med} className="text-slate-200 font-medium text-sm px-2">
                {med}
              </div>
            ))}
          </div>
          
          {/* Matrix rows */}
          {parameters.map(parameter => (
            <div
              key={parameter}
              className="grid grid-cols-[200px_repeat(auto-fill,minmax(100px,1fr))] gap-2 mb-2"
            >
              <div className="text-slate-300 text-sm">{parameter}</div>
              {medications.map(medication => (
                <div
                  key={`${medication}-${parameter}`}
                  className="h-12 rounded flex items-center justify-center"
                >
                  {getCellContent(medication, parameter)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
