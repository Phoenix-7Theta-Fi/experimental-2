'use client';

import React from 'react';
import { TreatmentPlan } from '@/lib/types/health';

interface ProblemOverviewProps {
  data: TreatmentPlan['problemOverview'];
  readOnly: boolean;
  onUpdate?: (updates: TreatmentPlan['problemOverview']) => void;
}

export default function ProblemOverview({ data, readOnly, onUpdate }: ProblemOverviewProps) {
  // These handler functions will only be used if the component is editable
  const handleStatusUpdate = (updates: Partial<typeof data.currentStatus>) => {
    if (onUpdate && !readOnly) {
      onUpdate({
        ...data,
        currentStatus: {
          ...data.currentStatus,
          ...updates
        }
      });
    }
  };

  const handleBiomarkerUpdate = (index: number, updates: Partial<typeof data.keyBiomarkers[0]>) => {
    if (onUpdate && !readOnly) {
      const updatedBiomarkers = [...data.keyBiomarkers];
      updatedBiomarkers[index] = {
        ...updatedBiomarkers[index],
        ...updates
      };
      onUpdate({
        ...data,
        keyBiomarkers: updatedBiomarkers
      });
    }
  };

  const handleRiskFactorUpdate = (index: number, value: string) => {
    if (onUpdate && !readOnly) {
      const updatedFactors = [...data.riskFactors];
      updatedFactors[index] = value;
      onUpdate({
        ...data,
        riskFactors: updatedFactors
      });
    }
  };

  // Read-only render for display purposes
  if (readOnly) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Problem Overview</h2>
        
        {/* Current Status */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-200">Current Status</h3>
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-medium text-gray-400">Primary Condition</p>
              <p className="text-lg text-gray-200">{data.currentStatus.primaryCondition}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-400">Severity</p>
              <p className="text-lg text-gray-200 capitalize">{data.currentStatus.severity}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-400">Symptoms</p>
              <ul className="list-disc list-inside text-gray-200 pl-2">
                {data.currentStatus.symptoms.map((symptom, index) => (
                  <li key={index} className="text-gray-200">{symptom}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Key Biomarkers */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-200">Key Biomarkers</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Biomarker</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Current</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Target</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {data.keyBiomarkers.map((biomarker, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-gray-200">{biomarker.name}</td>
                    <td className="px-4 py-3 text-gray-200">{biomarker.current}</td>
                    <td className="px-4 py-3 text-gray-200">{biomarker.target}</td>
                    <td className="px-4 py-3 text-gray-200">{biomarker.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-200">Risk Factors</h3>
          <ul className="list-disc list-inside text-gray-200 pl-2">
            {data.riskFactors.map((factor, index) => (
              <li key={index} className="text-gray-200">{factor}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Original editable version (keeping this for backward compatibility if needed)
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-blue-400">Problem Overview</h2>
      
      {/* Current Status */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-gray-200">Current Status</h3>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Primary Condition
            </label>
            <input
              type="text"
              value={data.currentStatus.primaryCondition}
              onChange={(e) => handleStatusUpdate({ primaryCondition: e.target.value })}
              className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Severity
            </label>
            <select
              value={data.currentStatus.severity}
              onChange={(e) => handleStatusUpdate({ 
                severity: e.target.value as 'mild' | 'moderate' | 'severe' 
              })}
              className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Symptoms
            </label>
            <div className="space-y-2">
              {data.currentStatus.symptoms.map((symptom, index) => (
                <input
                  key={index}
                  type="text"
                  value={symptom}
                  onChange={(e) => {
                    const newSymptoms = [...data.currentStatus.symptoms];
                    newSymptoms[index] = e.target.value;
                    handleStatusUpdate({ symptoms: newSymptoms });
                  }}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                />
              ))}
              <button
                onClick={() => handleStatusUpdate({ 
                  symptoms: [...data.currentStatus.symptoms, ''] 
                })}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                + Add Symptom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Biomarkers */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-gray-200">Key Biomarkers</h3>
        <div className="grid gap-4">
          {data.keyBiomarkers.map((biomarker, index) => (
            <div key={index} className="grid grid-cols-4 gap-4">
              <input
                type="text"
                value={biomarker.name}
                onChange={(e) => handleBiomarkerUpdate(index, { name: e.target.value })}
                className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                placeholder="Biomarker name"
              />
              <input
                type="number"
                value={biomarker.current}
                onChange={(e) => handleBiomarkerUpdate(index, { current: parseFloat(e.target.value) })}
                className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                placeholder="Current value"
              />
              <input
                type="number"
                value={biomarker.target}
                onChange={(e) => handleBiomarkerUpdate(index, { target: parseFloat(e.target.value) })}
                className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                placeholder="Target value"
              />
              <input
                type="text"
                value={biomarker.unit}
                onChange={(e) => handleBiomarkerUpdate(index, { unit: e.target.value })}
                className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                placeholder="Unit"
              />
            </div>
          ))}
          <button
            onClick={() => onUpdate?.({
              ...data,
              keyBiomarkers: [...data.keyBiomarkers, { name: '', current: 0, target: 0, unit: '' }]
            })}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            + Add Biomarker
          </button>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-gray-200">Risk Factors</h3>
        <div className="space-y-2">
          {data.riskFactors.map((factor, index) => (
            <input
              key={index}
              type="text"
              value={factor}
              onChange={(e) => handleRiskFactorUpdate(index, e.target.value)}
              className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
              placeholder="Risk factor"
            />
          ))}
          <button
            onClick={() => onUpdate?.({
              ...data,
              riskFactors: [...data.riskFactors, '']
            })}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            + Add Risk Factor
          </button>
        </div>
      </div>
    </div>
  );
}
