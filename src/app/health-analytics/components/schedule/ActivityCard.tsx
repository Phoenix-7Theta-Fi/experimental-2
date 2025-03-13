'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Types
import { 
  ScheduleActivity,
  MedicationActivityDetails,
  WorkoutActivityDetails,
  MeditationYogaActivityDetails,
  MealActivityDetails,
  BiohackingActivityDetails
} from '@/lib/types/health';

// Utils
import { getTypeColor } from './utils/activity-colors';

// Components
import { ActivityHeader } from './ActivityHeader';
import { ActivityBenefits } from './ActivityBenefits';
import { AIEditModal } from './AIEditModal';

// Forms
import { BaseFieldsEdit } from './forms/BaseFieldsEdit';
import BenefitsEdit from './forms/BenefitsEdit';
import MedicationForm from './forms/MedicationForm';
import WorkoutForm from './forms/WorkoutForm';
import MeditationYogaForm from './forms/MeditationYogaForm';
import MealForm from './forms/MealForm';
import BiohackingForm from './forms/BiohackingForm';

// Activity Details
import MedicationDetails from './details/MedicationDetails';
import WorkoutDetails from './details/WorkoutDetails';
import MeditationYogaDetails from './details/MeditationYogaDetails';
import MealDetails from './details/MealDetails';
import BiohackingDetails from './details/BiohackingDetails';

interface ActivityCardProps {
  activity: ScheduleActivity;
  onActivityUpdate: (updates: Partial<ScheduleActivity>) => void;
  onDelete?: (id: number) => void;
  isPractitioner?: boolean;
  isEditMode?: boolean;
}

export const ActivityCard = ({ 
  activity, 
  onActivityUpdate, 
  onDelete,
  isPractitioner = false,
  isEditMode = false 
}: ActivityCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAIEditing, setIsAIEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState(activity);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  const handleSave = () => {
    // Validate required fields
    if (!editedActivity.title || !editedActivity.time || !editedActivity.duration) {
      alert('Please fill in all required fields');
      return;
    }

    // Update the activity with all the changes
    onActivityUpdate({
      ...editedActivity,
      details: {
        ...editedActivity.details,
        benefits: {
          ...editedActivity.details.benefits
        }
      }
    });

    setIsEditing(false);
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setEditedActivity(activity);
    setIsEditing(false);
  };

  const renderActivityDetails = () => {
    switch (activity.type) {
      case 'medication':
        return <MedicationDetails details={activity.details as MedicationActivityDetails} />;
      case 'workout':
        return <WorkoutDetails details={activity.details as WorkoutActivityDetails} />;
      case 'meditation':
      case 'yoga':
        return <MeditationYogaDetails 
          details={activity.details as MeditationYogaActivityDetails} 
          type={activity.type} 
        />;
      case 'meal':
        return <MealDetails details={activity.details as MealActivityDetails} />;
      case 'biohacking':
      case 'treatment':
        return <BiohackingDetails 
          details={activity.details as BiohackingActivityDetails} 
          type={activity.type} 
        />;
      default:
        return null;
    }
  };

  const renderActivitySpecificEditFields = () => {
    const updateActivityDetails = (updates: Partial<ScheduleActivity>) => {
      setEditedActivity({
        ...editedActivity,
        ...updates
      });
    };

    switch (activity.type) {
      case 'medication':
        return <MedicationForm 
          details={editedActivity.details as MedicationActivityDetails} 
          onChange={updateActivityDetails}
        />;
      case 'workout':
        return <WorkoutForm 
          details={editedActivity.details as WorkoutActivityDetails}
          onChange={updateActivityDetails}
        />;
      case 'meditation':
      case 'yoga':
        return <MeditationYogaForm 
          details={editedActivity.details as MeditationYogaActivityDetails}
          type={activity.type}
          onChange={updateActivityDetails}
        />;
      case 'meal':
        return <MealForm 
          details={editedActivity.details as MealActivityDetails}
          onChange={updateActivityDetails}
        />;
      case 'biohacking':
      case 'treatment':
        return <BiohackingForm 
          details={editedActivity.details as BiohackingActivityDetails}
          type={activity.type}
          onChange={updateActivityDetails}
        />;
      default:
        return null;
    }
  };

  const renderEditForm = () => (
    <div className="space-y-6">
      <BaseFieldsEdit 
        activity={editedActivity}
        onChange={(updates: Partial<ScheduleActivity>) => {
          setEditedActivity({
            ...editedActivity,
            ...updates
          });
        }}
      />

      {/* Activity-Specific Fields */}
      <div className="border-t border-gray-700/50 pt-6">
        <h4 className="text-lg font-medium text-gray-200 mb-4">
          Activity Details
        </h4>
        {renderActivitySpecificEditFields()}
      </div>

      {/* Benefits Section */}
      <div className="border-t border-gray-700/50 pt-6">
        <h4 className="text-lg font-medium text-gray-200 mb-4">
          Benefits & Goals
        </h4>
        <BenefitsEdit
          benefits={editedActivity.details.benefits}
          onChange={(updates: Partial<ScheduleActivity>) => setEditedActivity({
            ...editedActivity,
            ...updates
          })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1 text-sm bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`mb-4 rounded-lg border ${getTypeColor(activity.type)} p-4
                  transition-all duration-200 hover:bg-gray-800/30 backdrop-blur-sm
                  ${isExpanded ? 'ring-2 ring-primary/50' : ''}
                  relative`}
    >
      <ActivityHeader
        activity={activity}
        isEditing={isEditing}
        isExpanded={isExpanded}
        isPractitioner={isPractitioner}
        isEditMode={isEditMode}
        dragHandleProps={
          isPractitioner && isEditMode
            ? { attributes, listeners }
            : undefined
        }
        onExpand={() => !isEditing && setIsExpanded(!isExpanded)}
        onEdit={() => setIsEditing(true)}
        onAIEdit={() => setIsAIEditing(true)}
        onDelete={() => onDelete?.(activity.id)}
        onSave={handleSave}
        onCancel={handleCancel}
        onCompletedChange={(completed) => onActivityUpdate({ completed })}
      />

      {/* Main content area */}
      {isExpanded && !isEditing && (
        <div className="mt-4 space-y-4 border-t border-gray-700/50 pt-4">
          <p className="text-gray-300">{activity.description}</p>

          {/* Activity-specific details */}
          {renderActivityDetails()}

          <ActivityBenefits
            treatmentGoals={activity.details.benefits.treatmentGoals}
            conditionSpecific={activity.details.benefits.conditionSpecific}
            personalizedTips={activity.details.benefits.personalizedTips}
          />
        </div>
      )}

      {/* Edit form */}
      {isEditing && (
        <div className="mt-4 border-t border-gray-700/50 pt-4">
          {renderEditForm()}
        </div>
      )}

      {/* AI Edit Modal */}
      <AIEditModal
        activity={activity}
        isOpen={isAIEditing}
        onClose={() => setIsAIEditing(false)}
        onUpdate={(updates) => {
          onActivityUpdate(updates);
          setIsAIEditing(false);
        }}
      />
    </div>
  );
};

export default ActivityCard;
