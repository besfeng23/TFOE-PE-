import { z } from 'zod';

export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  actorId: z.string().uuid(),
  action: z.string(),
  targetId: z.string().uuid(),
  details: z.record(z.any()),
  createdAt: z.date(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
