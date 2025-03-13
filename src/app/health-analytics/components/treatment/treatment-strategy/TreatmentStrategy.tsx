'use client';

import React, { useState } from 'react';
import { TreatmentPlan } from '@/lib/types/health';

interface TreatmentStrategyProps {
  data: TreatmentPlan['treatmentStrategy'];
  readOnly: boolean;
  onUpdate?: (updates: TreatmentPlan['treatmentStrategy']) => void;
}

export default function TreatmentStrategy({ data, readOnly, onUpdate }: TreatmentStrategyProps) {
  const [activeTab, setActiveTab] = useState<'ayurvedic' | 'modern' | 'lifestyle'>('ayurvedic');

  const updateAyurvedic = (updates: Partial<typeof data.ayurvedic>) => {
    if (onUpdate && !readOnly) {
      onUpdate({
        ...data,
        ayurvedic: {
          ...data.ayurvedic,
          ...updates
        }
      });
    }
  };

  const updateModern = (updates: Partial<typeof data.modern>) => {
    if (onUpdate && !readOnly) {
      onUpdate({
        ...data,
        modern: {
          ...data.modern,
          ...updates
        }
      });
    }
  };

  const updateLifestyle = (lifestyle: string[]) => {
    if (onUpdate && !readOnly) {
      onUpdate({
        ...data,
        lifestyle
      });
    }
  };

  // Read-only Render
  if (readOnly) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-blue-400">Treatment Strategy</h2>

        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b border-gray-700">
          {(['ayurvedic', 'modern', 'lifestyle'] as const).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Ayurvedic Section */}
        {activeTab === 'ayurvedic' && (
          <div className="space-y-6">
            {/* Herbs/Supplements */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-200">Herbs & Supplements</h3>
              {data.ayurvedic.herbs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Dosage</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Timing</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {data.ayurvedic.herbs.map((herb, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-gray-200">{herb.name}</td>
                          <td className="px-4 py-3 text-gray-200">{herb.dosage}</td>
                          <td className="px-4 py-3 text-gray-200">{herb.timing}</td>
                          <td className="px-4 py-3 text-gray-200">{herb.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No herbs or supplements prescribed.</p>
              )}
            </div>

            {/* Yoga Practices */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-200">Yoga Practices</h3>
              {data.ayurvedic.yoga.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Asana</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Duration</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Frequency</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {data.ayurvedic.yoga.map((practice, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-gray-200">{practice.asana}</td>
                          <td className="px-4 py-3 text-gray-200">{practice.duration}</td>
                          <td className="px-4 py-3 text-gray-200">{practice.frequency}</td>
                          <td className="px-4 py-3 text-gray-200">{practice.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No yoga practices prescribed.</p>
              )}
            </div>

            {/* Diet Recommendations */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-200">Diet Recommendations</h3>
              {data.ayurvedic.diet.length > 0 ? (
                <div className="space-y-6">
                  {data.ayurvedic.diet.map((diet, index) => (
                    <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                      <h4 className="text-lg font-medium text-blue-300 mb-2">{diet.recommendation}</h4>
                      <p className="text-gray-300 mb-3"><span className="text-gray-400">Reason:</span> {diet.reason}</p>
                      {diet.restrictions.length > 0 && (
                        <div>
                          <p className="text-gray-400 mb-1">Restrictions:</p>
                          <ul className="list-disc list-inside text-gray-300 pl-2">
                            {diet.restrictions.map((restriction, rIndex) => (
                              <li key={rIndex}>{restriction}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No diet recommendations prescribed.</p>
              )}
            </div>
          </div>
        )}

        {/* Modern Medicine Section */}
        {activeTab === 'modern' && (
          <div className="space-y-6">
            {/* Exercise Regimen */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-200">Exercise Regimen</h3>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Type</p>
                    <p className="text-gray-200">{data.modern.exercise.type || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Intensity</p>
                    <p className="text-gray-200">{data.modern.exercise.intensity || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Frequency</p>
                    <p className="text-gray-200">{data.modern.exercise.frequency || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Duration</p>
                    <p className="text-gray-200">{data.modern.exercise.duration || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sleep Optimization */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-200">Sleep Optimization</h3>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-400">Target Hours</p>
                  <p className="text-gray-200">{data.modern.sleep.targetHours} hours</p>
                </div>
                {data.modern.sleep.optimizations.length > 0 ? (
                  <div>
                    <p className="text-sm font-medium text-gray-400">Optimizations</p>
                    <ul className="list-disc list-inside text-gray-300 pl-2 mt-2">
                      {data.modern.sleep.optimizations.map((opt, index) => (
                        <li key={index}>{opt}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-400">No sleep optimizations specified.</p>
                )}
              </div>
            </div>

            {/* Biohacking */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-200">Biohacking Interventions</h3>
              {data.modern.biohacking.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Intervention</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Protocol</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Frequency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {data.modern.biohacking.map((hack, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-gray-200">{hack.intervention}</td>
                          <td className="px-4 py-3 text-gray-200">{hack.protocol}</td>
                          <td className="px-4 py-3 text-gray-200">{hack.frequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No biohacking interventions prescribed.</p>
              )}
            </div>
          </div>
        )}

        {/* Lifestyle Changes */}
        {activeTab === 'lifestyle' && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-200">Lifestyle Modifications</h3>
            {data.lifestyle.length > 0 ? (
              <ul className="list-disc list-inside text-gray-200 pl-2 space-y-2">
                {data.lifestyle.map((item, index) => (
                  <li key={index} className="text-gray-200">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No lifestyle modifications specified.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Original editable version
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-blue-400">Treatment Strategy</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-700">
        {(['ayurvedic', 'modern', 'lifestyle'] as const).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Ayurvedic Section */}
      {activeTab === 'ayurvedic' && (
        <div className="space-y-6">
          {/* Herbs/Supplements */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-200">Herbs & Supplements</h3>
            <div className="space-y-4">
              {data.ayurvedic.herbs.map((herb, index) => (
                <div key={index} className="grid grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={herb.name}
                    onChange={(e) => {
                      const updatedHerbs = [...data.ayurvedic.herbs];
                      updatedHerbs[index] = { ...herb, name: e.target.value };
                      updateAyurvedic({ herbs: updatedHerbs });
                    }}
                    className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Herb name"
                  />
                  <input
                    type="text"
                    value={herb.dosage}
                    onChange={(e) => {
                      const updatedHerbs = [...data.ayurvedic.herbs];
                      updatedHerbs[index] = { ...herb, dosage: e.target.value };
                      updateAyurvedic({ herbs: updatedHerbs });
                    }}
                    className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Dosage"
                  />
                  <input
                    type="text"
                    value={herb.timing}
                    onChange={(e) => {
                      const updatedHerbs = [...data.ayurvedic.herbs];
                      updatedHerbs[index] = { ...herb, timing: e.target.value };
                      updateAyurvedic({ herbs: updatedHerbs });
                    }}
                    className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Timing"
                  />
                  <input
                    type="text"
                    value={herb.duration}
                    onChange={(e) => {
                      const updatedHerbs = [...data.ayurvedic.herbs];
                      updatedHerbs[index] = { ...herb, duration: e.target.value };
                      updateAyurvedic({ herbs: updatedHerbs });
                    }}
                    className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Duration"
                  />
                </div>
              ))}
              <button
                onClick={() => updateAyurvedic({
                  herbs: [...data.ayurvedic.herbs, { name: '', dosage: '', timing: '', duration: '' }]
                })}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                + Add Herb/Supplement
              </button>
            </div>
          </div>

          {/* Yoga Practices */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-200">Yoga Practices</h3>
            <div className="space-y-4">
              {data.ayurvedic.yoga.map((practice, index) => (
                <div key={index} className="grid grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={practice.asana}
                    onChange={(e) => {
                      const updatedYoga = [...data.ayurvedic.yoga];
                      updatedYoga[index] = { ...practice, asana: e.target.value };
                      updateAyurvedic({ yoga: updatedYoga });
                    }}
                    className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Asana"
                  />
                  <input
                    type="text"
                    value={practice.duration}
                    onChange={(e) => {
                      const updatedYoga = [...data.ayurvedic.yoga];
                      updatedYoga[index] = { ...practice, duration: e.target.value };
                      updateAyurvedic({ yoga: updatedYoga });
                    }}
                    className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Duration"
                  />
                  <input
                    type="text"
                    value={practice.frequency}
                    onChange={(e) => {
                      const updatedYoga = [...data.ayurvedic.yoga];
                      updatedYoga[index] = { ...practice, frequency: e.target.value };
                      updateAyurvedic({ yoga: updatedYoga });
                    }}
                    className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Frequency"
                  />
                  <input
                    type="text"
                    value={practice.notes}
                    onChange={(e) => {
                      const updatedYoga = [...data.ayurvedic.yoga];
                      updatedYoga[index] = { ...practice, notes: e.target.value };
                      updateAyurvedic({ yoga: updatedYoga });
                    }}
                    className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Notes"
                  />
                </div>
              ))}
              <button
                onClick={() => updateAyurvedic({
                  yoga: [...data.ayurvedic.yoga, { asana: '', duration: '', frequency: '', notes: '' }]
                })}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                + Add Yoga Practice
              </button>
            </div>
          </div>

          {/* Diet Recommendations */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-200">Diet Recommendations</h3>
            <div className="space-y-4">
              {data.ayurvedic.diet.map((diet, index) => (
                <div key={index} className="space-y-2">
                  <input
                    type="text"
                    value={diet.recommendation}
                    onChange={(e) => {
                      const updatedDiet = [...data.ayurvedic.diet];
                      updatedDiet[index] = { ...diet, recommendation: e.target.value };
                      updateAyurvedic({ diet: updatedDiet });
                    }}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Recommendation"
                  />
                  <input
                    type="text"
                    value={diet.reason}
                    onChange={(e) => {
                      const updatedDiet = [...data.ayurvedic.diet];
                      updatedDiet[index] = { ...diet, reason: e.target.value };
                      updateAyurvedic({ diet: updatedDiet });
                    }}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Reason"
                  />
                  {diet.restrictions.map((restriction, rIndex) => (
                    <input
                      key={rIndex}
                      type="text"
                      value={restriction}
                      onChange={(e) => {
                        const updatedDiet = [...data.ayurvedic.diet];
                        updatedDiet[index].restrictions[rIndex] = e.target.value;
                        updateAyurvedic({ diet: updatedDiet });
                      }}
                      className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                      placeholder="Restriction"
                    />
                  ))}
                  <button
                    onClick={() => {
                      const updatedDiet = [...data.ayurvedic.diet];
                      updatedDiet[index].restrictions.push('');
                      updateAyurvedic({ diet: updatedDiet });
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Add Restriction
                  </button>
                </div>
              ))}
              <button
                onClick={() => updateAyurvedic({
                  diet: [...data.ayurvedic.diet, { recommendation: '', reason: '', restrictions: [] }]
                })}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                + Add Diet Recommendation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Section */}
      {activeTab === 'modern' && (
        <div className="space-y-6">
          {/* Exercise Protocol */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-200">Exercise Protocol</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type
                </label>
                <input
                  type="text"
                  value={data.modern.exercise.type}
                  onChange={(e) => updateModern({
                    exercise: { ...data.modern.exercise, type: e.target.value }
                  })}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Intensity
                </label>
                <input
                  type="text"
                  value={data.modern.exercise.intensity}
                  onChange={(e) => updateModern({
                    exercise: { ...data.modern.exercise, intensity: e.target.value }
                  })}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Frequency
                </label>
                <input
                  type="text"
                  value={data.modern.exercise.frequency}
                  onChange={(e) => updateModern({
                    exercise: { ...data.modern.exercise, frequency: e.target.value }
                  })}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={data.modern.exercise.duration}
                  onChange={(e) => updateModern({
                    exercise: { ...data.modern.exercise, duration: e.target.value }
                  })}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Sleep Optimization */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-200">Sleep Optimization</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Target Hours
                </label>
                <input
                  type="number"
                  value={data.modern.sleep.targetHours}
                  onChange={(e) => updateModern({
                    sleep: { ...data.modern.sleep, targetHours: parseInt(e.target.value) }
                  })}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                />
              </div>
              {data.modern.sleep.optimizations.map((optimization, index) => (
                <input
                  key={index}
                  type="text"
                  value={optimization}
                  onChange={(e) => {
                    const updatedOptimizations = [...data.modern.sleep.optimizations];
                    updatedOptimizations[index] = e.target.value;
                    updateModern({
                      sleep: { ...data.modern.sleep, optimizations: updatedOptimizations }
                    });
                  }}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                  placeholder="Sleep optimization"
                />
              ))}
              <button
                onClick={() => updateModern({
                  sleep: {
                    ...data.modern.sleep,
                    optimizations: [...data.modern.sleep.optimizations, '']
                  }
                })}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                + Add Optimization
              </button>
            </div>
          </div>

          {/* Biohacking */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-200">Biohacking Interventions</h3>
            <div className="space-y-4">
              {data.modern.biohacking.map((intervention, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={intervention.intervention}
                    onChange={(e) => {
                      const updatedInterventions = [...data.modern.biohacking];
                      updatedInterventions[index] = { ...intervention, intervention: e.target.value };
                      updateModern({ biohacking: updatedInterventions });
                    }}
                    className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Intervention"
                  />
                  <input
                    type="text"
                    value={intervention.protocol}
                    onChange={(e) => {
                      const updatedInterventions = [...data.modern.biohacking];
                      updatedInterventions[index] = { ...intervention, protocol: e.target.value };
                      updateModern({ biohacking: updatedInterventions });
                    }}
                    className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Protocol"
                  />
                  <input
                    type="text"
                    value={intervention.frequency}
                    onChange={(e) => {
                      const updatedInterventions = [...data.modern.biohacking];
                      updatedInterventions[index] = { ...intervention, frequency: e.target.value };
                      updateModern({ biohacking: updatedInterventions });
                    }}
                    className="col-span-1 bg-gray-700 rounded px-3 py-2 text-gray-200"
                    placeholder="Frequency"
                  />
                </div>
              ))}
              <button
                onClick={() => updateModern({
                  biohacking: [...data.modern.biohacking, { intervention: '', protocol: '', frequency: '' }]
                })}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                + Add Intervention
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lifestyle Section */}
      {activeTab === 'lifestyle' && (
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-200">Lifestyle Modifications</h3>
          <div className="space-y-2">
            {data.lifestyle.map((modification, index) => (
              <input
                key={index}
                type="text"
                value={modification}
                onChange={(e) => {
                  const updatedLifestyle = [...data.lifestyle];
                  updatedLifestyle[index] = e.target.value;
                  updateLifestyle(updatedLifestyle);
                }}
                className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200"
                placeholder="Lifestyle modification"
              />
            ))}
            <button
              onClick={() => updateLifestyle([...data.lifestyle, ''])}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              + Add Modification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
