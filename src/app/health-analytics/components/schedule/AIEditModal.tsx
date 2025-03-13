'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ScheduleActivity } from '@/lib/types/health';

interface AIEditModalProps {
  activity: ScheduleActivity;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<ScheduleActivity>) => void;
}

export function AIEditModal({ activity, isOpen, onClose, onUpdate }: AIEditModalProps) {
  const [prompt, setPrompt] = useState('');
  const [suggestedChanges, setSuggestedChanges] = useState<Partial<ScheduleActivity> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/activity/ai-edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity,
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI suggestions');
      }

      const data = await response.json();
      console.log('AI Response:', data.changes);
      setSuggestedChanges(data.changes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyChanges = () => {
    if (suggestedChanges) {
      onUpdate(suggestedChanges);
      onClose();
    }
  };

  const modalContent = (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-gray-900 border-l border-gray-800 shadow-xl z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-900">
          <h3 className="text-xl font-semibold text-gray-200">
            AI Edit Assistant
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Describe your desired changes
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Increase the workout intensity and add more stretching exercises"
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !prompt.trim()}
              className={`px-4 py-2 rounded-lg text-white ${
                isLoading || !prompt.trim()
                  ? 'bg-primary/50 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isLoading ? 'Generating...' : 'Generate Changes'}
            </button>
          </div>

          {error && (
            <div className="text-red-400 text-sm p-3 bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}

          {suggestedChanges && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-200">
                Suggested Changes
              </h4>
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                {/* Title */}
                {suggestedChanges.title && (
                  <div>
                    <h5 className="text-primary font-medium mb-1">Title</h5>
                    <p className="text-gray-300">{suggestedChanges.title}</p>
                  </div>
                )}

                {/* Description */}
                {suggestedChanges.description && (
                  <div>
                    <h5 className="text-primary font-medium mb-1">Description</h5>
                    <p className="text-gray-300">{suggestedChanges.description}</p>
                  </div>
                )}

                {/* Activity Details */}
                {suggestedChanges.details && (
                  <div>
                    <h5 className="text-primary font-medium mb-2">Details</h5>
                    <div className="space-y-3">
                      {Object.entries(suggestedChanges.details).map(([key, value]) => {
                        if (key === 'keyMetrics') {
                          console.log('Key Metrics value:', value);
                          return (
                            <div key={key} className="bg-black/20 rounded p-3">
                              <h6 className="text-gray-400 text-sm capitalize mb-2">Key Metrics</h6>
                              <div className="space-y-1">
                                {JSON.stringify(value, null, 2).split('\\n').map((line, idx) => (
                                  <div key={idx} className="text-gray-300 text-sm">
                                    {line.replace(/[{}"]/g, '')}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        if (typeof value === 'object' && value !== null) {
                          return (
                            <div key={key} className="bg-black/20 rounded p-3">
                              <h6 className="text-gray-400 text-sm capitalize mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</h6>
                              {Array.isArray(value) ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {value.map((item, idx) => (
                                    <li key={idx} className="text-gray-300 text-sm">{item}</li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="space-y-2">
                                  {Object.entries(value).map(([subKey, subValue]) => (
                                    <div key={subKey}>
                                      <span className="text-gray-400 text-sm capitalize">{subKey.replace(/([A-Z])/g, ' $1').trim()}: </span>
                                      <span className="text-gray-300 text-sm">
                                        {Array.isArray(subValue) 
                                          ? subValue.join(', ')
                                          : subValue?.toString()}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }
                        return (
                          <div key={key} className="flex items-start">
                            <span className="text-gray-400 text-sm capitalize min-w-[120px]">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-gray-300 text-sm ml-2">
                              {value?.toString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyChanges}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal at the root level
  return createPortal(modalContent, document.body);
}
