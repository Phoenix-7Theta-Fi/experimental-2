import { ActivityType } from './activity-types';

export const getTypeColor = (type: ActivityType): string => {
  const colors = {
    meal: 'border-blue-500/50 bg-blue-900/20',
    workout: 'border-orange-500/50 bg-orange-900/20',
    meditation: 'border-green-500/50 bg-green-900/20',
    medication: 'border-purple-500/50 bg-purple-900/20',
    yoga: 'border-indigo-500/50 bg-indigo-900/20',
    biohacking: 'border-cyan-500/50 bg-cyan-900/20',
    treatment: 'border-rose-500/50 bg-rose-900/20'
  };
  return colors[type];
};

export const getTypeTextColor = (type: ActivityType): string => {
  const colors = {
    meal: 'text-blue-400',
    workout: 'text-orange-400',
    meditation: 'text-green-400',
    medication: 'text-purple-400',
    yoga: 'text-indigo-400',
    biohacking: 'text-cyan-400',
    treatment: 'text-rose-400'
  };
  return colors[type];
};
