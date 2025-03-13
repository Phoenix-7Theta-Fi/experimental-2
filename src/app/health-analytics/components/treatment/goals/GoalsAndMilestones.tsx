'use client';

import React from 'react';
import { TreatmentPlan } from '@/lib/types/health';

interface GoalsAndMilestonesProps {
  data: TreatmentPlan['goals'];
  readOnly: boolean;
  onUpdate?: (updates: TreatmentPlan['goals']) => void;
}

export default function GoalsAndMilestones({ data, readOnly, onUpdate }: GoalsAndMilestonesProps) {
  const handleShortTermUpdate = (index: number, updates: Partial<typeof data.shortTerm[0]>) => {
    if (onUpdate && !readOnly) {
      const updatedGoals = [...data.shortTerm];
      updatedGoals[index] = {
        ...updatedGoals[index],
        ...updates
      };
      onUpdate({
        ...data,
        shortTerm: updatedGoals
      });
    }
  };

  const handleLongTermUpdate = (index: number, updates: Partial<typeof data.longTerm[0]>) => {
    if (onUpdate && !readOnly) {
      const updatedGoals = [...data.longTerm];
      updatedGoals[index] = {
        ...updatedGoals[index],
        ...updates
      };
      onUpdate({
        ...data,
        longTerm: updatedGoals
      });
    }
  };

  const handleMetricUpdate = (goalIndex: number, metricIndex: number, updates: Partial<typeof data.shortTerm[0]['metrics'][0]>) => {
    if (onUpdate && !readOnly) {
      const updatedGoals = [...data.shortTerm];
      updatedGoals[goalIndex].metrics[metricIndex] = {
        ...updatedGoals[goalIndex].metrics[metricIndex],
        ...updates
      };
      onUpdate({
        ...data,
        shortTerm: updatedGoals
      });
    }
  };

  const handleMilestoneUpdate = (goalIndex: number, milestoneIndex: number, value: string) => {
    if (onUpdate && !readOnly) {
      const updatedGoals = [...data.longTerm];
      updatedGoals[goalIndex].milestones[milestoneIndex] = value;
      onUpdate({
        ...data,
        longTerm: updatedGoals
      });
    }
  };

  // Read-only render for display purposes
  if (readOnly) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Goals & Milestones</h2>

        {/* Short-term Goals */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-200">Short-term Goals</h3>
          {data.shortTerm.length > 0 ? (
            <div className="space-y-6">
              {data.shortTerm.map((goal, index) => (
                <div key={index} className="bg-gray-800/30 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Description</p>
                      <p className="text-lg text-gray-200">{goal.description}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Target Date</p>
                      <p className="text-lg text-gray-200">
                        {new Date(goal.targetDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  {goal.metrics.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-400 mb-2">Metrics</p>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Metric</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Target</th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Unit</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {goal.metrics.map((metric, mIndex) => (
                              <tr key={mIndex}>
                                <td className="px-4 py-3 text-gray-200">{metric.name}</td>
                                <td className="px-4 py-3 text-gray-200">{metric.target}</td>
                                <td className="px-4 py-3 text-gray-200">{metric.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No short-term goals defined.</p>
          )}
        </div>

        {/* Long-term Goals */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-200">Long-term Goals</h3>
          {data.longTerm.length > 0 ? (
            <div className="space-y-6">
              {data.longTerm.map((goal, index) => (
                <div key={index} className="bg-gray-800/30 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Description</p>
                      <p className="text-lg text-gray-200">{goal.description}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Target Date</p>
                      <p className="text-lg text-gray-200">
                        {new Date(goal.targetDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Milestones */}
                  {goal.milestones.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-400 mb-2">Milestones</p>
                      <ul className="list-disc list-inside text-gray-200 pl-2 space-y-1">
                        {goal.milestones.map((milestone, mIndex) => (
                          <li key={mIndex}>{milestone}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No long-term goals defined.</p>
          )}
        </div>
      </div>
    );
  }

  // Original editable version
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-blue-400">Goals & Milestones</h2>

      {/* Short-term Goals */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-gray-200">Short-term Goals</h3>
        <div className="space-y-6">
          {data.shortTerm.map((goal, index) => (
            <div key={index} className="bg-gray-800/30 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={goal.description}
                    onChange={(e) => handleShortTermUpdate(index, { description: e.target.value })}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Goal description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={goal.targetDate}
                    onChange={(e) => handleShortTermUpdate(index, { targetDate: e.target.value })}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Metrics</label>
                {goal.metrics.map((metric, mIndex) => (
                  <div key={mIndex} className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={metric.name}
                      onChange={(e) => handleMetricUpdate(index, mIndex, { name: e.target.value })}
                      className="bg-gray-700 rounded px-3 py-2 text-gray-200"
                      placeholder="Metric name"
                    />
                    <input
                      type="number"
                      value={metric.target}
                      onChange={(e) => handleMetricUpdate(index, mIndex, { target: parseFloat(e.target.value) })}
                      className="bg-gray-700 rounded px-3 py-2 text-gray-200"
                      placeholder="Target value"
                    />
                    <input
                      type="text"
                      value={metric.unit}
                      onChange={(e) => handleMetricUpdate(index, mIndex, { unit: e.target.value })}
                      className="bg-gray-700 rounded px-3 py-2 text-gray-200"
                      placeholder="Unit"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const updatedGoals = [...data.shortTerm];
                    updatedGoals[index].metrics.push({ name: '', target: 0, unit: '' });
                    onUpdate?.({
                      ...data,
                      shortTerm: updatedGoals
                    });
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + Add Metric
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => onUpdate?.({
              ...data,
              shortTerm: [...data.shortTerm, { description: '', targetDate: '', metrics: [] }]
            })}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            + Add Short-term Goal
          </button>
        </div>
      </div>

      {/* Long-term Goals */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-gray-200">Long-term Goals</h3>
        <div className="space-y-6">
          {data.longTerm.map((goal, index) => (
            <div key={index} className="bg-gray-800/30 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={goal.description}
                    onChange={(e) => handleLongTermUpdate(index, { description: e.target.value })}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Goal description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={goal.targetDate}
                    onChange={(e) => handleLongTermUpdate(index, { targetDate: e.target.value })}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Milestones</label>
                {goal.milestones.map((milestone, mIndex) => (
                  <input
                    key={mIndex}
                    type="text"
                    value={milestone}
                    onChange={(e) => handleMilestoneUpdate(index, mIndex, e.target.value)}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Milestone description"
                  />
                ))}
                <button
                  onClick={() => {
                    const updatedGoals = [...data.longTerm];
                    updatedGoals[index].milestones.push('');
                    onUpdate?.({
                      ...data,
                      longTerm: updatedGoals
                    });
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + Add Milestone
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => onUpdate?.({
              ...data,
              longTerm: [...data.longTerm, { description: '', targetDate: '', milestones: [] }]
            })}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            + Add Long-term Goal
          </button>
        </div>
      </div>
    </div>
  );
}
