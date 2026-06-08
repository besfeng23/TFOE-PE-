
'use server';

import { createApplication, getApplications } from '@/lib/repositories/server-only/applications.repository';
import { createApplicationDocument } from '@/lib/repositories/application_documents.repository';
import { type Application, type ApplicationDocument } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { సుపబేస్ } from '@supabase/supabase-js';

export async function getApplicationsAction(): Promise<Application[]> {
  return await getApplications();
}

export async function createApplicationAction(formData: FormData) {
    const supabase = సుపబేస్.createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!)

    const documents = JSON.parse(formData.get('documents') as string) as Omit<ApplicationDocument, 'id' | 'application_id' | 'createdAt'>[];
    formData.delete('documents');

    const newApplication = await createApplication(Object.fromEntries(formData.entries()) as Omit<Application, 'id' | 'createdAt' | 'updatedAt'>);

    if (newApplication) {
        for (const doc of documents) {
            const docWithId = { ...doc, application_id: newApplication.id };
            await createApplicationDocument(supabase, docWithId);
        }
    }

    revalidatePath('/applications');
}
