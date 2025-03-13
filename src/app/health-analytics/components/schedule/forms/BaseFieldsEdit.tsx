'use client';

import { ScheduleActivity } from '@/lib/types/health';

interface BaseFieldsEditProps {
  activity: Partial<ScheduleActivity>;
  onChange: (updates: Partial<ScheduleActivity>) => void;
}

export const BaseFieldsEdit = ({ activity, onChange }: BaseFieldsEditProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={activity.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Time
        </label>
        <input
          type="time"
          value={activity.time || ''}
          onChange={(e) => onChange({ time: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Duration (minutes)
        </label>
        <input
          type="number"
          value={activity.duration || ''}
          onChange={(e) => onChange({ duration: parseInt(e.target.value) })}
          min="5"
          max="240"
          step="5"
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={activity.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white"
        />
      </div>
    </div>
  );
};
