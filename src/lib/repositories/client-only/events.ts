
import { createClient } from '@/lib/supabase/client';
import { type Event } from '@/lib/types';

const supabase = createClient();

export const getEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase.from('events').select('*');
    if (error) {
        console.error('Error fetching events:', error);
        return [];
    }
    return data as Event[];
};

export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event | null> => {
    const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();

    if (error) {
        console.error('Error creating event:', error);
        return null;
    }

    return data as Event;
};
