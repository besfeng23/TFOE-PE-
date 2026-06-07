
import { createClient } from '@/lib/supabase/client';
import { Club } from '@/lib/types';

const supabase = createClient();

export const getClubs = async (): Promise<Club[]> => {
    const { data, error } = await supabase.from('clubs').select('*');
    if (error) {
        throw error;
    }
    return data as Club[];
};

export const getClub = async (id: string): Promise<Club> => {
    const { data, error } = await supabase.from('clubs').select('*').eq('id', id).single();
    if (error) {
        throw error;
    }
    return data as Club;
};

export const createClub = async (club: Omit<Club, 'id'>): Promise<Club> => {
    const { data, error } = await supabase.from('clubs').insert(club).select().single();
    if (error) {
        throw error;
    }
    return data as Club;
};

export const updateClub = async (id: string, club: Partial<Club>): Promise<Club> => {
    const { data, error } = await supabase.from('clubs').update(club).eq('id', id).select().single();
    if (error) {
        throw error;
    }
    return data as Club;
};

export const deleteClub = async (id: string): Promise<void> => {
    const { error } = await supabase.from('clubs').delete().eq('id', id);
    if (error) {
        throw error;
    }
};
