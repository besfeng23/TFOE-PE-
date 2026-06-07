
import {createClient} from '@/lib/supabase/server';
import {supabaseAdmin} from '@/lib/supabase/admin';

const db = createClient();

export async function getMembers() {
  return await db.from('members').select('*');
}

export async function getMember(id: string) {
  return await db.from('members').select('*').eq('id', id).single();
}

export async function updateMember(id: string, data: any) {
  return await db.from('members').update(data).eq('id', id);
}

export async function deleteMember(id: string) {
  return await supabaseAdmin.auth.admin.deleteUser(id);
}
