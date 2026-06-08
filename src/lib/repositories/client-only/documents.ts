
import { createClient } from '@/lib/supabase/client';
import { type Document } from '@/lib/types';

const supabase = createClient();

export const uploadDocument = async (document: Omit<Document, 'id' | 'uploadDate' | 'version'>): Promise<Document | null> => {
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

export const getDocuments = async (): Promise<Document[] | null> => {
    const { data, error } = await supabase
        .from('documents')
        .select('*');

    if (error) {
        console.error('Error fetching documents:', error);
        return null;
    }

    return data as Document[];
};


export const getDocumentsByCategoryId = async (categoryId: string): Promise<Document[] | null> => {
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
