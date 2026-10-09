/**
 * Ambassador (سفراء زاد) discount types.
 * Mirrors the backend `AmbassadorType` enum.
 *
 * Implemented as a const object (not a TS enum) so it stays erasable
 * and works cleanly with `isolatedModules`.
 */
export const AmbassadorType = {
  GroupEnrollment: 1,
  EngineerLeads: 2,
  ReturningStudent: 3,
  GroupLinks: 4,
} as const;

export type AmbassadorType = (typeof AmbassadorType)[keyof typeof AmbassadorType];

/**
 * Discount Policy — API Response Model
 * GET /api/v1/admin/ambassadors/policies
 */
export interface DiscountPolicyResponse {
  id: string;                       // Guid
  type: AmbassadorType;             // 1..4
  typeName: string;                 // Backend enum name (e.g. "GroupEnrollment")
  percent: number;                  // Discount percentage (0 - 100)
  isActive: boolean;
  minItems: number | null;          // Minimum items/participants required (null = no minimum)
  maxItems: number | null;          // Maximum items/participants allowed (null = no maximum)
  grantExpiryDays: number | null;   // Days before a granted discount expires (null = never)
  createdAt: string;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  lastUpdatedByName: string | null;
}

/**
 * Payload for updating a discount policy
 * PUT /api/v1/admin/ambassadors/policies/{type}
 */
export interface UpdateDiscountPolicyPayload {
  percent: number;
  isActive: boolean;
  minItems: number | null;
  maxItems: number | null;
  grantExpiryDays: number | null;
}
