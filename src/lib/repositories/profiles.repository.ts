
import { SupabaseClient } from '@supabase/supabase-js';
import { getMembers } from './members.repository';

export async function getProfiles(client: SupabaseClient) {
    return await getMembers(client);
}
