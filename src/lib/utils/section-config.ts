import { Section } from "./sections";

interface SectionConfig {
  name: string;
  description: string;
  color: string;
}

export const sectionConfig: Record<Section, SectionConfig> = {
  nutrition: {
    name: 'Diet and Medication',
    description: 'Track your nutrition and medication adherence',
    color: '#60A5FA',
  },
  strength: {
    name: 'Strength',
    description: 'Monitor your strength progress and muscle balance',
    color: '#F97316',
  },
  cardio: {
    name: 'Cardio',
    description: 'Track your cardiovascular fitness metrics',
    color: '#EF4444',
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
