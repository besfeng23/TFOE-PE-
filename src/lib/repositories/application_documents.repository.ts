
import { SupabaseClient } from '@supabase/supabase-js';
import { ApplicationDocument } from '@/lib/types';

export const getApplicationDocuments = async (supabase: SupabaseClient, applicationId: string): Promise<ApplicationDocument[] | null> => {
    const { data, error } = await supabase
        .from('application_documents')
        .select('*')
        .eq('application_id', applicationId);

    if (error) {
        console.error('Error fetching application documents:', error);
        return null;
    }

    return data as ApplicationDocument[];
};

export const createApplicationDocument = async (supabase: SupabaseClient, document: Omit<ApplicationDocument, 'id' | 'createdAt'>): Promise<ApplicationDocument | null> => {
    const { data, error } = await supabase
        .from('application_documents')
        .insert(document)
        .select()
        .single();

    if (error) {
        console.error('Error creating application document:', error);
        return null;
    }

    return data as ApplicationDocument;
};

export const deleteApplicationDocument = async (supabase: SupabaseClient, documentId: string): Promise<boolean> => {
    const { error } = await supabase
        .from('application_documents')
        .delete()
        .eq('id', documentId);

    if (error) {
        console.error('Error deleting application document:', error);
        return false;
    }

    return true;
};
