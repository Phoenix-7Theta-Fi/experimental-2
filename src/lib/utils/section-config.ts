import { Section } from "./sections";

interface SectionConfig {
  name: string;
  description: string;
  color: string;
}

export const sectionConfig: Record<Section, SectionConfig> = {
  schedule: {
    name: 'Daily Schedule',
    description: 'View and manage your daily activities and routines',
    color: '#A855F7',
  },
  treatment: {
    name: 'Treatment Plan',
    description: 'View and manage your holistic treatment plan',
    color: '#14B8A6',
  },
  nutrition: {
    name: 'Diet and Medication',
    description: 'Track your nutrition and medication adherence',
    color: '#60A5FA',
  },
  workout: {
    name: 'Workout',
    description: 'Track your strength and cardio fitness metrics',
    color: '#F97316',
  },
  yoga: {
    name: 'Yoga',
    description: 'Monitor your flexibility and practice progress',
    color: '#8B5CF6',
  },
  mental: {
    name: 'Mental Health',
    description: 'Track meditation, sleep, mood, and stress levels',
    color: '#059669',
  },
  biomarkers: {
    name: 'Biomarkers',
    description: 'Monitor blood work, thyroid, vitamins and other health markers',
    color: '#DC2626',
  }
};
