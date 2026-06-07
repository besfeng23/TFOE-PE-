
import { createClient } from '@/lib/supabase/client';
import { Region } from '@/lib/types';

const supabase = createClient();

export const getRegions = async (): Promise<Region[]> => {
    const { data, error } = await supabase.from('regions').select('*');
    if (error) {
        throw error;
    }
    return data as Region[];
};

export const getRegion = async (id: string): Promise<Region> => {
    const { data, error } = await supabase.from('regions').select('*').eq('id', id).single();
    if (error) {
        throw error;
    }
    return data as Region;
};

export const createRegion = async (region: Omit<Region, 'id'>): Promise<Region> => {
    const { data, error } = await supabase.from('regions').insert(region).select().single();
    if (error) {
        throw error;
    }
    return data as Region;
};

export const updateRegion = async (id: string, region: Partial<Region>): Promise<Region> => {
    const { data, error } = await supabase.from('regions').update(region).eq('id', id).select().single();
    if (error) {
        throw error;
    }
    return data as Region;
};

export const deleteRegion = async (id: string): Promise<void> => {
    const { error } = await supabase.from('regions').delete().eq('id', id);
    if (error) {
        throw error;
    }
};
