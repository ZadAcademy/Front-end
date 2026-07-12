export const EXPERIENCE_OPTIONS = [
  'Student',
  'Graduate',
  'From0To2',
  'From2To5',
  'From5To10',
  'MoreThan10',
] as const;

export const EXPERIENCE_MAPPING: Record<string, number> = {
  Student: 0,
  Graduate: 1,
  From0To2: 2,
  From2To5: 3,
  From5To10: 4,
  MoreThan10: 5,
};

export const SPECIALIZATION_OPTIONS = [
  'siteEngineer',
  'constructionEngineer',
  'qcInspector',
  'qaEngineer',
  'pipingEngineer',
  'designEngineer',
  'maintenanceEngineer',
  'projectEngineer',
  'planningEngineer',
  'freelancer',
  'other',
] as const;
