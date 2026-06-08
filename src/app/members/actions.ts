
'use server';

import { getMembers } from '@/lib/repositories/members.repository';
import { type UserProfile } from '@/lib/types';

export async function getMembersAction(): Promise<UserProfile[]> {
  try {
    const members = await getMembers();
    return members as UserProfile[];
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}
