
import { SupabaseClient } from '@supabase/supabase-js';
import { Event, Attendance } from '@/lib/types';

export const createEvent = async (supabase: SupabaseClient, event: Omit<Event, 'id'>): Promise<Event | null> => {
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

export const getEvents = async (supabase: SupabaseClient): Promise<Event[] | null> => {
    const { data, error } = await supabase.from('events').select('*');
    if (error) {
        console.error('Error fetching events:', error);
        return null;
    }
    return data as Event[];
};

export const trackAttendance = async (supabase: SupabaseClient, attendance: Omit<Attendance, 'id'>): Promise<Attendance | null> => {
    const { data, error } = await supabase
        .from('attendance')
        .insert(attendance)
        .select()
        .single();

    if (error) {
        console.error('Error tracking attendance:', error);
        return null;
    }

    return data as Attendance;
};
