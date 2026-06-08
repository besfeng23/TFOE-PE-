import { z } from 'zod';

export const TransactionTypeSchema = z.enum([
  'DUES',
  'DONATION',
  'ALALAYAN_AGILA_DEBIT',
  'ALALAYAN_AGILA_PAYOUT',
  'ASSESSMENT',
  'REVERSAL',
]);

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  memberId: z.string().uuid(),
  type: TransactionTypeSchema,
  amount: z.number().positive(),
  currency: z.string().default('PHP'),
  status: z.string(),
  referenceId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionType = z.infer<typeof TransactionTypeSchema>;
