
import { createClient } from '@/lib/supabase/client'
import { type Member } from '@/lib/types'

const supabase = createClient()

export const getMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase.from('members').select('*')
  if (error) {
    console.error('Error fetching members:', error)
    return []
  }
  return data as Member[]
}

export const getMember = async (id: string): Promise<Member | null> => {
  const { data, error } = await supabase.from('members').select('*').eq('id', id).single()
  if (error) {
    console.error(`Error fetching member with id ${id}:`, error)
    return null
  }
  return data as Member
}

export const createMember = async (member: Omit<Member, 'id'>): Promise<Member | null> => {
  const { data, error } = await supabase.from('members').insert(member).single()
  if (error) {
    console.error('Error creating member:', error)
    return null
  }
  return data as Member
}

export const updateMember = async (id: string, member: Partial<Member>): Promise<Member | null> => {
  const { data, error } = await supabase.from('members').update(member).eq('id', id).single()
  if (error) {
    console.error(`Error updating member with id ${id}:`, error)
    return null
  }
  return data as Member
}

export const deleteMember = async (id: string): Promise<void> => {
  const { error } = await supabase.from('members').delete().eq('id', id)
  if (error) {
    console.error(`Error deleting member with id ${id}:`, error)
  }
}
