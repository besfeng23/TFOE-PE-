import { IFinanceRepository } from '@/infrastructure/repositories/finance.repository';
import { Transaction, TransactionType } from '@/domain/entities/transaction.entity';

export class FinanceService {
  constructor(private financeRepository: IFinanceRepository) {}

  async recordPayment(memberId: string, amount: number, type: TransactionType, referenceId?: string): Promise<Transaction> {
    // Immutable transactions: Only allow creation, no updates or deletes from the service layer
    // Any correction must be a new REVERSAL transaction.
    
    return this.financeRepository.create({
      memberId,
      amount,
      type,
      currency: 'PHP',
      status: 'COMPLETED',
      referenceId,
      metadata: {},
    });
  }

  async reverseTransaction(transactionId: string, reason: string, actorId: string): Promise<Transaction> {
    const original = await this.financeRepository.findById(transactionId);
    if (!original) throw new Error('Transaction not found');
    if (original.type === 'REVERSAL') throw new Error('Cannot reverse a reversal');

    return this.financeRepository.create({
      memberId: original.memberId,
      amount: original.amount * -1,
      type: 'REVERSAL',
      currency: original.currency,
      status: 'COMPLETED',
      referenceId: `REV-${original.id}`,
      metadata: { originalTransactionId: original.id, reason, reversedBy: actorId },
    });
  }

  async getMemberFinancialHistory(memberId: string): Promise<Transaction[]> {
    return this.financeRepository.listByMember(memberId);
  }
}
