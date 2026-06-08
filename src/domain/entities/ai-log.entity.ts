import { z } from 'zod';

export const AIServiceLogSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().optional(),
  prompt: z.string(),
  response: z.string(),
  model: z.string(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
});

export type AIServiceLog = z.infer<typeof AIServiceLogSchema>;

export interface IAILogRepository {
  log(entry: Omit<AIServiceLog, 'id' | 'createdAt'>): Promise<void>;
}
