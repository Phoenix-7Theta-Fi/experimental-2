'use client';

import { format } from 'date-fns';
import { getTypeTextColor } from './utils/activity-colors';
import { ScheduleActivity } from '@/lib/types/health';

interface ActivityHeaderProps {
  activity: ScheduleActivity;
  isEditing: boolean;
  isExpanded: boolean;
  isPractitioner: boolean;
  isEditMode: boolean;
  dragHandleProps?: {
    attributes: any;
    listeners: any;
  };
  onExpand: () => void;
  onEdit: () => void;
  onAIEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  onCompletedChange: (completed: boolean) => void;
}

export const ActivityHeader = ({
  activity,
  isEditing,
  isExpanded,
  isPractitioner,
  isEditMode,
  dragHandleProps,
  onExpand,
  onEdit,
  onAIEdit,
  onDelete,
  onSave,
  onCancel,
  onCompletedChange,
}: ActivityHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      {isPractitioner && isEditMode && dragHandleProps && (
        <div
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
          className="cursor-grab active:cursor-grabbing mr-2 text-gray-400 hover:text-gray-300"
        >
          ⋮⋮
        </div>
      )}

      <div className="flex-1">
        <div 
          className="cursor-pointer"
          onClick={() => !isEditing && onExpand()}
        >
          <h3 className={`font-semibold text-lg ${getTypeTextColor(activity.type)}`}>
            {activity.title}
          </h3>
          <p className="text-sm text-gray-400">
            {format(new Date(`2000-01-01T${activity.time}`), 'h:mm a')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isPractitioner && isEditMode && (
          <>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  className="text-green-500 hover:text-green-400 px-2 py-1"
                >
                  Save
                </button>
                <button
                  onClick={onCancel}
                  className="text-gray-400 hover:text-gray-300 px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={onAIEdit}
                  className="text-purple-500 hover:text-purple-400 px-2 py-1"
                  title="AI Edit Assistant"
                >
                  🤖
                </button>
                <button
                  onClick={onEdit}
                  className="text-blue-500 hover:text-blue-400 px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="text-red-500 hover:text-red-400 px-2 py-1"
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
        <input
          type="checkbox"
          checked={activity.completed}
          onChange={(e) => {
            e.stopPropagation();
            onCompletedChange(e.target.checked);
          }}
          className="h-6 w-6 rounded border-gray-600 bg-gray-700 checked:bg-primary checked:border-primary
                     focus:ring-primary focus:ring-offset-gray-900 transition-colors cursor-pointer"
        />
      </div>
    </div>
  );
};
