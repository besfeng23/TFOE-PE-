import { createClient } from '@/lib/supabase/server';
import { Transaction } from '@/domain/entities/transaction.entity';

export interface IFinanceRepository {
  findById(id: string): Promise<Transaction | null>;
  listByMember(memberId: string): Promise<Transaction[]>;
  create(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction>;
}

export class SupabaseFinanceRepository implements IFinanceRepository {
  async findById(id: string): Promise<Transaction | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async listByMember(memberId: string): Promise<Transaction[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to list transactions: ${error.message}`);
    return data.map(this.mapToEntity);
  }

  async create(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        member_id: transaction.memberId,
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        reference_id: transaction.referenceId,
        metadata: transaction.metadata,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create transaction: ${error.message}`);
    return this.mapToEntity(data);
  }

  private mapToEntity(data: any): Transaction {
    return {
      id: data.id,
      memberId: data.member_id,
      type: data.type,
      amount: Number(data.amount),
      currency: data.currency,
      status: data.status,
      referenceId: data.reference_id,
      metadata: data.metadata,
      createdAt: new Date(data.created_at),
    };
  }
}
