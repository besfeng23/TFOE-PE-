
'use server';

import { getMembers } from '@/lib/repositories/server-only/members.repository';
import { type UserProfile } from '@/lib/types';

export async function getMembersAction(): Promise<UserProfile[]> {
  const { data, error } = await getMembers();
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}
