import { createClient } from '@/lib/supabase/server';
import { type UserProfile } from '@/lib/types';

const supabase = createClient();

export const getMember = async (id: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase.from('members').select('*').eq('id', id).single();
    if (error) {
        console.error('Error fetching member:', error);
        return null;
    }
    return data as UserProfile;
}

export const getProfiles = async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase.from('members').select('*');
    if (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }
    return data as UserProfile[];
}

export const updateMember = async (id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    const { data, error } = await supabase.from('members').update(updates).eq('id', id).single();
    if (error) {
        console.error('Error updating member:', error);
        return null;
    }
    return data as UserProfile;
}
