
import { SupabaseClient } from '@supabase/supabase-js';
import { Document } from '@/lib/types';

export const uploadDocument = async (supabase: SupabaseClient, document: Omit<Document, 'id' | 'uploadDate' | 'version'>): Promise<Document | null> => {
    const { data, error } = await supabase
        .from('documents')
        .insert(document)
        .select()
        .single();

    if (error) {
        console.error('Error uploading document:', error);
        return null;
    }

    return data as Document;
};

export const getDocumentsByCategoryId = async (supabase: SupabaseClient, categoryId: string): Promise<Document[] | null> => {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('categoryId', categoryId);

    if (error) {
        console.error('Error fetching documents:', error);
        return null;
    }

    return data as Document[];
};
