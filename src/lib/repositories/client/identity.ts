
import { createClient } from '@/lib/supabase/client';
import { type UserProfile } from '@/lib/types';

const supabase = createClient();

export const getProfile = async (userId: string): Promise<UserProfile | null> => {
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

export const getProfiles = async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }
    return data as UserProfile[];
};

export const updateProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
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
