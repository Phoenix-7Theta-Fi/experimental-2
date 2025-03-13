'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ScheduleActivity } from '@/lib/types/health';
import ActivityCard from './ActivityCard';

interface DraggableActivityListProps {
  activities: ScheduleActivity[];
  onActivitiesReorder: (activities: ScheduleActivity[]) => void;
  onActivityUpdate: (activityId: number, updates: Partial<ScheduleActivity>) => void;
  onActivityDelete?: (activityId: number) => void;
  isPractitioner?: boolean;
  isEditMode?: boolean;
}

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
};

export const DraggableActivityList = ({
  activities,
  onActivitiesReorder,
  onActivityUpdate,
  onActivityDelete,
  isPractitioner = false,
  isEditMode = false
}: DraggableActivityListProps) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeActivity = activities.find(a => a.id === activeId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = activities.findIndex((item) => item.id === active.id);
      const newIndex = activities.findIndex((item) => item.id === over.id);
      
      const newActivities = arrayMove(activities, oldIndex, newIndex);
      
      // Update the time of activities based on their new order
      const sortedActivities = newActivities.map((activity, index) => {
        if (index === 0) return activity;
        
        const prevActivity = newActivities[index - 1];
        const prevTime = new Date(`2000-01-01T${prevActivity.time}`);
        const minTimeDiff = prevActivity.duration + 15; // 15 minutes buffer
        
        const currentTime = new Date(`2000-01-01T${activity.time}`);
        const timeDiff = (currentTime.getTime() - prevTime.getTime()) / (1000 * 60); // diff in minutes
        
        if (timeDiff < minTimeDiff) {
          // Adjust time to be after previous activity with buffer
          const newTime = new Date(prevTime.getTime() + minTimeDiff * 60 * 1000);
          return {
            ...activity,
            time: newTime.toTimeString().slice(0, 5) // Format as HH:mm
          };
        }
        
        return activity;
      });

      onActivitiesReorder(sortedActivities);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext
        items={activities.map(a => ({ ...a, id: a.id }))}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onActivityUpdate={(updates) => onActivityUpdate(activity.id, updates)}
              onDelete={onActivityDelete}
              isPractitioner={isPractitioner}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeActivity ? (
          <div className="opacity-80">
            <ActivityCard
              activity={activeActivity}
              onActivityUpdate={() => {}}
              isPractitioner={isPractitioner}
              isEditMode={isEditMode}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DraggableActivityList;
