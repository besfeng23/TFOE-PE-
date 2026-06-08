
import { SupabaseClient } from '@supabase/supabase-js';
import { Transaction } from '@/lib/types';

export const getTransactionsByUserId = async (supabase: SupabaseClient, userId: string): Promise<Transaction[] | null> => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('userId', userId);

    if (error) {
        console.error('Error fetching transactions:', error);
        return null;
    }

    return data as Transaction[];
};

export const createTransaction = async (supabase: SupabaseClient, transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction | null> => {
    const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

    if (error) {
        console.error('Error creating transaction:', error);
        return null;
    }

    return data as Transaction;
};
