
import { SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '@/lib/types';

export const getMembersByClub = async (supabase: SupabaseClient, clubId: string): Promise<UserProfile[] | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clubId', clubId);

    if (error) {
        console.error('Error fetching members by club:', error);
        return null;
    }

    return data as UserProfile[];
};

export const getMember = async (supabase: SupabaseClient, memberId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', memberId)
        .single();

    if (error) {
        console.error('Error fetching member:', error);
        return null;
    }

    return data as UserProfile;
};
