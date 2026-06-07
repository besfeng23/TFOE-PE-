
import { createClient } from '@/lib/supabase/server';
import { type ConversationParticipant } from '@/lib/types';

const supabase = createClient();

export const addParticipant = async (participant: Omit<ConversationParticipant, 'id'>): Promise<ConversationParticipant | null> => {
    const { data, error } = await supabase.from('conversation_participants').insert(participant).single();
    if (error) {
        console.error('Error adding participant:', error);
        return null;
    }
    return data as ConversationParticipant;
}
