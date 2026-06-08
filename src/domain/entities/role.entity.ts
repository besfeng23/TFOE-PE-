import { z } from 'zod';

export const RoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
});

export type Role = z.infer<typeof RoleSchema>;

export const PermissionSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
});

export type Permission = z.infer<typeof PermissionSchema>;

export const UserRoleSchema = z.object({
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
