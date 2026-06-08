
import { SupabaseClient } from '@supabase/supabase-js';
import { Application } from '@/lib/types';

export const createApplication = async (supabase: SupabaseClient, application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application | null> => {
    const { data, error } = await supabase
        .from('applications')
        .insert(application)
        .select()
        .single();

    if (error) {
        console.error('Error creating application:', error);
        return null;
    }

    return data as Application;
};

export const getApplication = async (supabase: SupabaseClient, applicationId: string): Promise<Application | null> => {
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single();

    if (error) {
        console.error('Error fetching application:', error);
        return null;
    }

    return data as Application;
};

export const updateApplication = async (supabase: SupabaseClient, applicationId: string, updates: Partial<Application>): Promise<Application | null> => {
    const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', applicationId)
        .select()
        .single();

    if (error) {
        console.error('Error updating application:', error);
        return null;
    }

    return data as Application;
};
