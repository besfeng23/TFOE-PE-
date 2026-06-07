
'use server';

import { getMembers } from '@/lib/repositories/server-only/members.repository';
import { type UserProfile } from '@/lib/types';

export async function getMembersAction(): Promise<UserProfile[]> {
  return await getMembers();
}
