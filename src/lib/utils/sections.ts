export const VALID_SECTIONS = [
  'nutrition',
  'workout',
  'yoga',
  'mental',
  'biomarkers',
  'treatment',
  'schedule',
] as const;

export type Section = typeof VALID_SECTIONS[number];

export const validateSection = (section: string | undefined): Section => {
  if (!section || !VALID_SECTIONS.includes(section as Section)) {
    return 'nutrition';
  }
  return section as Section;
};
