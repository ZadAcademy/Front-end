/** Public ambassador program returned by GET /api/v1/ambassadors/programs */
export interface AmbassadorProgram {
  type: 1 | 2 | 3 | 4;
  typeName: string;
  percent: number;
  minItems: number | null;
  maxItems: number | null;
}
