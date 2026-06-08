
import { createClient } from '@/lib/supabase/server';
import { type ApplicationDocument } from '@/lib/types';

export const createApplicationDocument = async (document: Omit<ApplicationDocument, 'id'>): Promise<ApplicationDocument | null> => {
    const supabase = createClient();
    const { data, error } = await supabase.from('application_documents').insert(document).single();
    if (error) {
        console.error('Error creating application document:', error);
        return null;
    }
    return data as ApplicationDocument;
}
