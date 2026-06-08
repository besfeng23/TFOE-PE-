
import { createClient } from '@/lib/supabase/server';
import { type Message } from '@/lib/types';

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversationId', conversationId)
    .order('createdAt', { ascending: true });

  if (error) {
    console.error(`Error fetching messages for conversation ${conversationId}:`, error);
    return [];
  }
  return data as Message[];
};

export const createMessage = async (message: Omit<Message, 'id'>): Promise<Message | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('messages').insert(message).single();
    if (error) {
        console.error('Error creating message:', error);
        return null;
    }
    return data as Message;
}
