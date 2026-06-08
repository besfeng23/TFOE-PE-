import { z } from 'zod';

// Member Entity
export const MembershipStatusSchema = z.enum([
  'APPLICANT',
  'INCUBATING',
  'INDOCTRINATING',
  'INDUCTED',
  'SUSPENDED',
  'EXPELLED',
]);

export const MemberSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: MembershipStatusSchema,
  clubId: z.string().uuid(),
  regionId: z.string().uuid(),
  councilId: z.string().uuid(), // Added councilId to the domain entity
  councilName: z.string().optional(),
  clubName: z.string().optional(),
  membershipNumber: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Member = z.infer<typeof MemberSchema>;
export type MembershipStatus = z.infer<typeof MembershipStatusSchema>;

// User Entity
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Profile Entity
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
