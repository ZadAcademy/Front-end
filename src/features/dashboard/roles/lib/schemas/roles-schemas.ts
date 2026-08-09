import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string().min(1, 'roleNameRequired'),
  description: z.string().nullable().optional(),
  isDefault: z.boolean().default(false).optional(),
  permissions: z.array(z.string()).min(1, 'atLeastOnePermissionRequired'),
});

export type RoleFormData = z.infer<typeof roleSchema>;

export const userRolesSchema = z.object({
  roles: z.array(z.string()),
});

export type UserRolesFormData = z.infer<typeof userRolesSchema>;
