
import { SupabaseClient } from '@supabase/supabase-js';
import { Region, Club, Council } from '@/lib/types';

export const getRegions = async (supabase: SupabaseClient): Promise<Region[] | null> => {
    const { data, error } = await supabase.from('regions').select('*');
    if (error) {
        console.error('Error fetching regions:', error);
        return null;
    }
    return data as Region[];
};

export const getCouncilsByRegion = async (supabase: SupabaseClient, regionId: string): Promise<Council[] | null> => {
    const { data, error } = await supabase.from('councils').select('*').eq('region_id', regionId);
    if (error) {
        console.error('Error fetching councils:', error);
        return null;
    }
    return data as Council[];
};

export const getClubsByCouncil = async (supabase: SupabaseClient, councilId: string): Promise<Club[] | null> => {
    const { data, error } = await supabase.from('clubs').select('*').eq('council_id', councilId);
    if (error) {
        console.error('Error fetching clubs:', error);
        return null;
    }
    return data as Club[];
};
