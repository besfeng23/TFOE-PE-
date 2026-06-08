
import { SupabaseClient } from '@supabase/supabase-js';
import { Conversation, Message } from '@/lib/types';

export const getConversations = async (supabase: SupabaseClient, userId: string): Promise<Conversation[] | null> => {
    const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [userId]);

    if (error) {
        console.error('Error fetching conversations:', error);
        return null;
    }

    return data as Conversation[];
};

export const createMessage = async (supabase: SupabaseClient, message: Omit<Message, 'id' | 'timestamp'>): Promise<Message | null> => {
    const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();

    if (error) {
        console.error('Error creating message:', error);
        return null;
    }

    return data as Message;
};
