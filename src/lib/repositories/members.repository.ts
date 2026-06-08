
import { createClient } from '@/lib/supabase/server';
import { type UserProfile } from '@/lib/types';

export async function getMembers(): Promise<UserProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  return data as UserProfile[];
}

export async function getMember(id: string): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) {
    console.error(`Error fetching member with id ${id}:`, error);
    return null;
  }
  return data as UserProfile;
}

export async function createMember(memberData: Partial<UserProfile>): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').insert([memberData]).select().single();
  if (error) {
    console.error('Error creating member:', error);
    return null;
  }
  return data as UserProfile;
}

export async function updateMember(id: string, memberData: Partial<UserProfile>): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').update(memberData).eq('id', id).select().single();
  if (error) {
    console.error(`Error updating member with id ${id}:`, error);
    return null;
  }
  return data as UserProfile;
}

export async function deleteMember(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) {
    console.error(`Error deleting member with id ${id}:`, error);
  }
}
