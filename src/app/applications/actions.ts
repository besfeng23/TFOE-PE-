
'use server';

import { getApplications } from '@/lib/repositories/server-only/applications.repository';
import { type Application } from '@/lib/types';

export async function getApplicationsAction(): Promise<Application[]> {
  return await getApplications();
}
