
'use server';

import { createApplication, getApplications } from '@/lib/repositories/applications.repository';
import { createApplicationDocument } from '@/lib/repositories/application_documents.repository';
import { type Application, type ApplicationDocument } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getApplicationsAction(): Promise<Application[]> {
  return await getApplications();
}

export async function createApplicationAction(formData: FormData) {
    const documents = JSON.parse(formData.get('documents') as string) as Omit<ApplicationDocument, 'id' | 'application_id' | 'createdAt'>[];
    formData.delete('documents');

    const newApplication = await createApplication(Object.fromEntries(formData.entries()) as unknown as Omit<Application, 'id'>);

    if (newApplication) {
        for (const doc of documents) {
            const docWithId = { ...doc, application_id: newApplication.id };
            await createApplicationDocument(docWithId);
        }
    }

    revalidatePath('/applications');
}
