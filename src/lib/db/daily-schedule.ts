import { getDB } from './index';
import { DailyScheduleData, ScheduleActivity, TreatmentPlan } from '../types/health';
import { generateActivityDetails } from '../utils/activity-benefits';
import { getUserTreatmentPlan } from './treatment-plans';

interface DBSchedule extends Omit<DailyScheduleData, 'activities'> {
  activities: string;
}

export const getDailySchedule = (userId: number, date: string): DailyScheduleData | null => {
  const db = getDB();
  const schedule = db.prepare(`
    SELECT * FROM daily_schedules 
    WHERE user_id = ? AND date = ?
  `).get(userId, date) as DBSchedule | undefined;
  
  if (!schedule) return null;
  
  return {
    ...schedule,
    activities: JSON.parse(schedule.activities)
  };
};

export const createDailySchedule = (schedule: Omit<DailyScheduleData, 'id'>): DailyScheduleData => {
  const db = getDB();
  db.prepare(`
    INSERT INTO daily_schedules (user_id, date, activities) 
    VALUES (?, ?, ?)
  `).run(
    schedule.user_id,
    schedule.date,
    JSON.stringify(schedule.activities)
  );

  // Get the inserted record
  const inserted = db.prepare(`
    SELECT * FROM daily_schedules 
    WHERE user_id = ? AND date = ?
  `).get(schedule.user_id, schedule.date) as DBSchedule;

  return {
    ...inserted,
    activities: JSON.parse(inserted.activities)
  };
};

export const addActivity = (
  scheduleId: number,
  activity: Omit<ScheduleActivity, 'id'>
): ScheduleActivity => {
  const db = getDB();
  const schedule = db.prepare(`
    SELECT * FROM daily_schedules 
    WHERE id = ?
  `).get(scheduleId) as DBSchedule | undefined;

  if (!schedule) throw new Error('Schedule not found');

  const activities = JSON.parse(schedule.activities) as ScheduleActivity[];
  
  // Generate new ID (max id + 1)
  const newId = Math.max(0, ...activities.map(a => a.id)) + 1;
  const newActivity = { ...activity, id: newId } as ScheduleActivity;
  
  activities.push(newActivity);
  
  // Sort activities by time
  activities.sort((a, b) => a.time.localeCompare(b.time));

  db.prepare(`
    UPDATE daily_schedules 
    SET activities = ? 
    WHERE id = ?
  `).run(JSON.stringify(activities), scheduleId);

  return newActivity;
};

export const deleteActivity = (
  scheduleId: number,
  activityId: number
): void => {
  const db = getDB();
  const schedule = db.prepare(`
    SELECT * FROM daily_schedules 
    WHERE id = ?
  `).get(scheduleId) as DBSchedule | undefined;

  if (!schedule) throw new Error('Schedule not found');

  const activities = JSON.parse(schedule.activities) as ScheduleActivity[];
  const filteredActivities = activities.filter(a => a.id !== activityId);

  if (activities.length === filteredActivities.length) {
    throw new Error('Activity not found');
  }

  db.prepare(`
    UPDATE daily_schedules 
    SET activities = ? 
    WHERE id = ?
  `).run(JSON.stringify(filteredActivities), scheduleId);
};

export const reorderActivities = (
  scheduleId: number,
  orderedActivities: ScheduleActivity[]
): void => {
  const db = getDB();
  const schedule = db.prepare(`
    SELECT * FROM daily_schedules 
    WHERE id = ?
  `).get(scheduleId) as DBSchedule | undefined;

  if (!schedule) throw new Error('Schedule not found');

  const currentActivities = JSON.parse(schedule.activities) as ScheduleActivity[];
  
  // Verify all activities exist
  const currentIds = new Set(currentActivities.map(a => a.id));
  const orderedIds = new Set(orderedActivities.map(a => a.id));
  
  if (currentIds.size !== orderedIds.size) {
    throw new Error('Activity mismatch');
  }

  for (const id of currentIds) {
    if (!orderedIds.has(id)) {
      throw new Error('Activity mismatch');
    }
  }

  db.prepare(`
    UPDATE daily_schedules 
    SET activities = ? 
    WHERE id = ?
  `).run(JSON.stringify(orderedActivities), scheduleId);
};

export const updateActivity = (
  scheduleId: number,
  activityId: number,
  updates: Partial<ScheduleActivity>
): void => {
  const db = getDB();
  const schedule = db.prepare(`
    SELECT * FROM daily_schedules 
    WHERE id = ?
  `).get(scheduleId) as DBSchedule | undefined;

  if (!schedule) throw new Error('Schedule not found');

  const activities = JSON.parse(schedule.activities) as ScheduleActivity[];
  const activityIndex = activities.findIndex(a => a.id === activityId);

  if (activityIndex === -1) throw new Error('Activity not found');

  const currentActivity = activities[activityIndex];
  const updatedActivity = {
    ...currentActivity,
    ...updates,
    details: updates.details ? {
      ...currentActivity.details,
      ...updates.details,
      benefits: updates.details.benefits ? {
        ...currentActivity.details.benefits,
        ...updates.details.benefits
      } : currentActivity.details.benefits
    } : currentActivity.details
  };

  activities[activityIndex] = updatedActivity;

  db.prepare(`
    UPDATE daily_schedules 
    SET activities = ? 
    WHERE id = ?
  `).run(JSON.stringify(activities), scheduleId);
};

export const seedDailySchedule = (userIds: number[]) => {
  const db = getDB();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Get dates for 3 days before and 3 days after today
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - 3 + i);
    return date.toISOString().split('T')[0];
  });

  const generateActivities = (userId: number, date: string) => {
    // Determine if it's a past date
    const isPastDate = date < todayStr;
    
    // Get user's treatment plan
    const plan = getUserTreatmentPlan(userId);
    if (!plan) {
      throw new Error('No treatment plan found for user');
    }
    
    const activities = [
      {
        id: 1,
        type: 'medication' as const,
        title: 'Morning Medication',
        time: '07:00',
        duration: 5,
        description: 'Take morning medicines with water',
        completed: isPastDate,
        details: generateActivityDetails({
          id: 1,
          type: 'medication',
          title: 'Morning Medication',
          time: '07:00',
          duration: 5,
          description: 'Take morning medicines with water',
          completed: isPastDate,
          details: {} as any // Temporary type to satisfy TS
        }, plan)
      },
      {
        id: 2,
        type: 'meal' as const,
        title: 'Breakfast',
        time: '08:00',
        duration: 30,
        description: 'High protein breakfast with fruits',
        completed: isPastDate,
        details: generateActivityDetails({
          id: 2,
          type: 'meal',
          title: 'Breakfast',
          time: '08:00',
          duration: 30,
          description: 'High protein breakfast with fruits',
          completed: isPastDate,
          details: {} as any
        }, plan)
      },
      {
        id: 3,
        type: 'workout' as const,
        title: 'Morning Exercise',
        time: '09:00',
        duration: 60,
        description: 'Cardio and strength training',
        completed: isPastDate,
        details: generateActivityDetails({
          id: 3,
          type: 'workout',
          title: 'Morning Exercise',
          time: '09:00',
          duration: 60,
          description: 'Cardio and strength training',
          completed: isPastDate,
          details: {} as any
        }, plan)
      },
      {
        id: 4,
        type: 'meditation' as const,
        title: 'Mindfulness Session',
        time: '10:30',
        duration: 20,
        description: 'Guided meditation for stress relief',
        completed: isPastDate,
        details: generateActivityDetails({
          id: 4,
          type: 'meditation',
          title: 'Mindfulness Session',
          time: '10:30',
          duration: 20,
          description: 'Guided meditation for stress relief',
          completed: isPastDate,
          details: {} as any
        }, plan)
      },
      {
        id: 5,
        type: 'meal' as const,
        title: 'Lunch',
        time: '13:00',
        duration: 45,
        description: 'Balanced meal with vegetables',
        completed: isPastDate,
        details: generateActivityDetails({
          id: 5,
          type: 'meal',
          title: 'Lunch',
          time: '13:00',
          duration: 45,
          description: 'Balanced meal with vegetables',
          completed: isPastDate,
          details: {} as any
        }, plan)
      },
      {
        id: 6,
        type: 'yoga' as const,
        title: 'Yoga Practice',
        time: '16:00',
        duration: 45,
        description: 'Focus on flexibility and balance',
        completed: isPastDate,
        details: generateActivityDetails({
          id: 6,
          type: 'yoga',
          title: 'Yoga Practice',
          time: '16:00',
          duration: 45,
          description: 'Focus on flexibility and balance',
          completed: isPastDate,
          details: {} as any
        }, plan)
      },
      {
        id: 7,
        type: 'medication' as const,
        title: 'Evening Medication',
        time: '18:00',
        duration: 5,
        description: 'Take evening medicines with water',
        completed: isPastDate,
        details: generateActivityDetails({
          id: 7,
          type: 'medication',
          title: 'Evening Medication',
          time: '18:00',
          duration: 5,
          description: 'Take evening medicines with water',
          completed: isPastDate,
          details: {} as any
        }, plan)
      },
      {
        id: 8,
        type: 'meal' as const,
        title: 'Dinner',
        time: '19:30',
        duration: 45,
        description: 'Light dinner with protein',
        completed: isPastDate,
        details: generateActivityDetails({
          id: 8,
          type: 'meal',
          title: 'Dinner',
          time: '19:30',
          duration: 45,
          description: 'Light dinner with protein',
          completed: isPastDate,
          details: {} as any
        }, plan)
      },
      {
        id: 9,
        type: 'biohacking' as const,
        title: 'Evening Routine',
        time: '21:00',
        duration: 30,
        description: 'Blue light blocking, temperature optimization for sleep',
        completed: isPastDate,
        details: generateActivityDetails({
          id: 9,
          type: 'biohacking',
          title: 'Evening Routine',
          time: '21:00',
          duration: 30,
          description: 'Blue light blocking, temperature optimization for sleep',
          completed: isPastDate,
          details: {} as any
        }, plan)
      }
    ] as ScheduleActivity[];
    return activities;
  };

  // Create schedules for all dates for each user
  userIds.forEach(userId => {
    dates.forEach(date => {
      const existingSchedule = db.prepare(
        'SELECT 1 FROM daily_schedules WHERE user_id = ? AND date = ?'
      ).get(userId, date);

      if (!existingSchedule) {
        createDailySchedule({
          user_id: userId,
          date: date,
          activities: generateActivities(userId, date)
        });
      }
    });
  });

  console.log('Daily schedules seeded successfully');
};

export const getDailySchedulesByDateRange = (
  userId: number,
  startDate: string,
  endDate: string
): DailyScheduleData[] => {
  const db = getDB();
  const schedules = db.prepare(`
    SELECT * FROM daily_schedules 
    WHERE user_id = ? 
    AND date BETWEEN ? AND ? 
    ORDER BY date ASC
  `).all(userId, startDate, endDate) as DBSchedule[];

  return schedules.map(schedule => ({
    ...schedule,
    activities: JSON.parse(schedule.activities)
  }));
}
