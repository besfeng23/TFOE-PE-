
import { createClient } from '@/lib/supabase/server'
import { type Due } from '@/lib/types'

export const getDues = async (): Promise<Due[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('dues').select('*')
  if (error) {
    console.error('Error fetching dues:', error)
    return []
  }
  return data as Due[]
}

export const getDue = async (id: string): Promise<Due | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('dues').select('*').eq('id', id).single()
  if (error) {
    console.error(`Error fetching due with id ${id}:`, error)
    return null
  }
  return data as Due
}

export const createDue = async (due: Omit<Due, 'id'>): Promise<Due | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('dues').insert(due).single()
  if (error) {
    console.error('Error creating due:', error)
    return null
  }
  return data as Due
}

export const updateDue = async (id: string, due: Partial<Due>): Promise<Due | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('dues').update(due).eq('id', id).single()
  if (error) {
    console.error(`Error updating due with id ${id}:`, error)
    return null
  }
  return data as Due
}

export const deleteDue = async (id: string): Promise<void> => {
  const supabase = await createClient()
  const { error } = await supabase.from('dues').delete().eq('id', id)
  if (error) {
    console.error(`Error deleting due with id ${id}:`, error)
  }
}
