
import { createClient } from '@/lib/supabase/client';
import { type Conversation } from '@/lib/types';

const supabase = createClient();

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, conversation_participants!inner(*)')
    .eq('conversation_participants.userId', userId)

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
  return data as Conversation[];
};

export const createConversation = async (): Promise<Conversation | null> => {
    const { data, error } = await supabase.from('conversations').insert({}).select().single();
    if (error) {
        console.error('Error creating conversation:', error);
        return null;
    }
    return data as Conversation;
}
