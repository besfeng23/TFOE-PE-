
import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  idPhotoUrl: z.string().url().optional(),
  contactInfo: z.string().optional(),
  assignedGovernmentPosition: z.string().optional(),
  governmentBranch: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Profile = z.infer<typeof ProfileSchema>;
