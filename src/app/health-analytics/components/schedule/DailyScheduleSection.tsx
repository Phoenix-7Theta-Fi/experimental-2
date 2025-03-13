'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  DailyScheduleData, 
  ScheduleActivity,
  TreatmentPlan
} from '@/lib/types/health';
import { format } from 'date-fns';
import { getUserSession } from '@/lib/auth';
import WeekNavigator from './WeekNavigator';
import ActivityLoggerSheet from './ActivityLoggerSheet';

import ActivityCard from './ActivityCard';
import DraggableActivityList from './DraggableActivityList';
import NewActivityForm from './NewActivityForm';

interface ScheduleTimelineProps {
  activities: ScheduleActivity[];
  isPractitioner?: boolean;
  isEditMode?: boolean;
}

const ScheduleTimeline = ({ activities }: ScheduleTimelineProps) => {
  return (
    <div className="relative">
      <div className="absolute left-0 w-px h-full bg-gray-700/50"></div>
      {activities.map((activity) => (
        <div key={activity.id} className="flex ml-6 mb-4 group">
          <div className={`absolute left-0 w-3 h-3 rounded-full bg-primary
                          transform -translate-x-1.5 group-hover:scale-125 transition-transform`}>
          </div>
          <div className="text-sm text-gray-400 w-20">
            {format(new Date(`2000-01-01T${activity.time}`), 'h:mm a')}
          </div>
          <div className="ml-4 text-sm text-gray-300 group-hover:text-gray-200">
            {activity.title}
          </div>
        </div>
      ))}
    </div>
  );
};

interface DailyScheduleSectionProps {
  currentUserId?: number;
  patientId?: number;
  isPractitioner?: boolean;
  treatmentPlan: TreatmentPlan;
}

export default function DailyScheduleSection({ 
  currentUserId, 
  patientId,
  isPractitioner = false,
  treatmentPlan
}: DailyScheduleSectionProps) {
  const [schedule, setSchedule] = useState<DailyScheduleData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ScheduleActivity | null>(null);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  const effectiveUserId = patientId ?? currentUserId;

  useEffect(() => {
    if (!effectiveUserId) return;

    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/daily-schedule?userId=${effectiveUserId}&date=${formattedDate}`);
        if (res.ok) {
          const data = await res.json();
          setSchedule(data);
        } else {
          setSchedule(null);
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setSchedule(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, [formattedDate, effectiveUserId]);

  // Base headers for all requests
  const baseHeaders = {
    'Content-Type': 'application/json',
    'X-Request-Time': new Date().toISOString()
  };

  const handleActivityUpdate = async (activityId: number, updates: Partial<ScheduleActivity>) => {
    if (!schedule) return;

    try {
      console.log('🔵 Updating activity:', { activityId, updates });
      
      // First update the UI state immediately for better user feedback
      setSchedule(prev => {
        if (!prev) return prev;
        const activity = prev.activities.find(a => a.id === activityId);
        if (!activity) return prev;
        
        // Prepare the update with proper detail merging
        const updatedActivity = {
          ...activity,
          ...updates,
          details: updates.details ? {
            ...activity.details,
            ...updates.details,
            benefits: updates.details.benefits ? {
              ...activity.details.benefits,
              ...updates.details.benefits
            } : activity.details.benefits
          } : activity.details
        };

        return {
          ...prev,
          activities: prev.activities.map(a =>
            a.id === activityId ? updatedActivity : a
          )
        };
      });
      
      // Then send the update to the backend
      const res = await fetch('/api/daily-schedule', {
        method: 'PATCH',
        headers: baseHeaders,
        body: JSON.stringify({
          scheduleId: schedule.id,
          activityId,
          userId: effectiveUserId,
          date: formattedDate,
          updates
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to update activity:', { status: res.status, error: errorText });
        
        // Revert the UI state if backend update fails
        setSchedule(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            activities: prev.activities.map(a =>
              a.id === activityId ? { ...a, completed: !updates.completed } : a
            )
          };
        });
        
        throw new Error(errorText);
      }

      console.log('✅ Activity updated successfully:', { activityId });
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const renderContent = () => {
    // Loading state
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800/30 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-100">Timeline</h2>
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-3 w-3 bg-gray-700 rounded-full"></div>
                  <div className="h-4 w-16 bg-gray-700 rounded"></div>
                  <div className="h-4 flex-1 max-w-[200px] bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-100">Activities</h2>
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[72px] bg-gray-700/30 rounded-lg border border-gray-700/50"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // No schedule state
    if (!schedule) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800/30 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-100">Timeline</h2>
            <div className="text-center py-8">
              <p className="text-gray-400">No schedule available for this date</p>
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-100">Activities</h2>
            <div className="text-center py-8">
              <p className="text-gray-400">No activities scheduled</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-end items-center gap-4">
          {isPractitioner && (
            <>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isEditMode 
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                {isEditMode ? 'Exit Edit Mode' : 'Edit Schedule'}
              </button>
              {isEditMode && (
                <button
                  onClick={() => setShowNewActivityForm(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md font-medium transition-colors"
                >
                  Add Activity
                </button>
              )}
            </>
          )}
        </div>

        {showNewActivityForm && (
          <div className="bg-gray-800/30 rounded-lg p-6">
            <NewActivityForm
              onAdd={async (newActivity) => {
                try {
                  const res = await fetch('/api/daily-schedule', {
                    method: 'POST',
                    headers: baseHeaders,
                    body: JSON.stringify({
                      scheduleId: schedule.id,
                      activity: {
                        ...newActivity,
                        user_id: effectiveUserId,
                        completed: false
                      }
                    })
                  });

                  if (!res.ok) throw new Error('Failed to add activity');

                  const { activity } = await res.json();
                  setSchedule(prev => ({
                    ...prev!,
                    activities: [...prev!.activities, activity]
                  }));
                  setShowNewActivityForm(false);
                } catch (error) {
                  console.error('Error adding activity:', error);
                }
              }}
              onCancel={() => setShowNewActivityForm(false)}
              treatmentPlan={treatmentPlan}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800/30 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-100">Timeline</h2>
            <ScheduleTimeline 
              activities={schedule.activities}
              isPractitioner={isPractitioner}
              isEditMode={isEditMode}
            />
          </div>
          <div className="bg-gray-800/30 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-100">Activities</h2>
            <div className="space-y-4">
              {isEditMode ? (
                <DraggableActivityList
                  activities={schedule.activities}
                  onActivitiesReorder={async (reorderedActivities) => {
                    try {
                      const res = await fetch('/api/daily-schedule', {
                        method: 'PATCH',
                        headers: baseHeaders,
                        body: JSON.stringify({
                          scheduleId: schedule.id,
                          reorder: true,
                          activities: reorderedActivities
                        })
                      });

                      if (!res.ok) throw new Error('Failed to reorder activities');

                      setSchedule(prev => ({
                        ...prev!,
                        activities: reorderedActivities
                      }));
                    } catch (error) {
                      console.error('Error reordering activities:', error);
                    }
                  }}
                  onActivityUpdate={handleActivityUpdate}
                  onActivityDelete={async (activityId) => {
                    if (!confirm('Are you sure you want to delete this activity?')) return;

                    try {
                      const res = await fetch('/api/daily-schedule', {
                        method: 'DELETE',
                        headers: baseHeaders,
                        body: JSON.stringify({
                          scheduleId: schedule.id,
                          activityId
                        })
                      });

                      if (!res.ok) throw new Error('Failed to delete activity');

                      setSchedule(prev => ({
                        ...prev!,
                        activities: prev!.activities.filter(a => a.id !== activityId)
                      }));
                    } catch (error) {
                      console.error('Error deleting activity:', error);
                    }
                  }}
                  isPractitioner={isPractitioner}
                  isEditMode={isEditMode}
                />
              ) : (
                schedule.activities
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(activity => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onActivityUpdate={async (updates) => {
                        if ('completed' in updates && updates.completed && !activity.completed) {
                          setSelectedActivity(activity);
                          setIsLoggerOpen(true);
                        } else {
                          await handleActivityUpdate(activity.id, updates);
                        }
                      }}
                      isPractitioner={isPractitioner}
                      isEditMode={isEditMode}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <WeekNavigator 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      <div className="my-6 text-center border-b border-gray-700/50 pb-6">
        <h2 className="text-xl font-medium text-gray-200">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>
      {renderContent()}
      {selectedActivity && schedule && (
        <ActivityLoggerSheet
          scheduleId={schedule.id}
          isOpen={isLoggerOpen}
          onClose={async () => {
            console.log('🔵 Closing activity logger:', { activityId: selectedActivity.id });
            try {
              // Use new unified endpoint for ending session
              await fetch('/api/activity-log', {
                method: 'POST',
                headers: {
                  ...baseHeaders,
                  'X-Session-ID': `activity-${selectedActivity.id}`
                },
                body: JSON.stringify({
                  action: 'end'
                })
              });
            } catch (error) {
              console.error('Error ending activity log session:', error);
            } finally {
              setIsLoggerOpen(false);
              setSelectedActivity(null);
            }
          }}
          onComplete={async (activityId) => {
            console.log('🔵 Activity completed:', { activityId });
            await handleActivityUpdate(activityId, { completed: true });
            // Small delay before closing to show completion state
            setTimeout(() => {
              setIsLoggerOpen(false);
              setSelectedActivity(null);
            }, 1500);
          }}
          activity={selectedActivity}
        />
      )}
    </div>
  );
}
