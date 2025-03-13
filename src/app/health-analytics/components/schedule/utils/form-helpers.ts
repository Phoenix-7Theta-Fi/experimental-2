import { ScheduleActivity } from '@/lib/types/health';

export const validateActivityForm = (activity: Partial<ScheduleActivity>): string[] => {
  const errors: string[] = [];

  if (!activity.title?.trim()) {
    errors.push('Title is required');
  }

  if (!activity.time) {
    errors.push('Time is required');
  }

  if (!activity.duration || activity.duration < 5 || activity.duration > 240) {
    errors.push('Duration must be between 5 and 240 minutes');
  }

  return errors;
};

export const formatArrayToText = (arr: string[]): string => {
  return arr.join('\n');
};

export const textToArray = (text: string): string[] => {
  return text.split('\n').filter(line => line.trim());
};

export const parseNumber = (value: string, fallback: number = 0): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};
