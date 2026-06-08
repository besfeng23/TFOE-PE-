
import { SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '@/lib/types';

export const getProfile = async (supabase: SupabaseClient, userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data as UserProfile;
};

export const updateProfile = async (supabase: SupabaseClient, userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error);
        return null;
    }

    return data as UserProfile;
};
