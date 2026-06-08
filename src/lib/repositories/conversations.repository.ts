
import { createClient } from '@/lib/supabase/server';
import { type Conversation } from '@/lib/types';

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  const supabase = await createClient();
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
    const supabase = await createClient();
    const { data, error } = await supabase.from('conversations').insert({}).single();
    if (error) {
        console.error('Error creating conversation:', error);
        return null;
    }
    return data as Conversation;
}
