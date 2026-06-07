
import { createClient } from '@/lib/supabase/client'
import { type Event } from '@/lib/types'

const supabase = createClient()

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase.from('events').select('*')
  if (error) {
    console.error('Error fetching events:', error)
    return []
  }
  return data as Event[]
}

export const getEvent = async (id: string): Promise<Event | null> => {
  const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
  if (error) {
    console.error(`Error fetching event with id ${id}:`, error)
    return null
  }
  return data as Event
}

export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event | null> => {
  const { data, error } = await supabase.from('events').insert(event).single()
  if (error) {
    console.error('Error creating event:', error)
    return null
  }
  return data as Event
}

export const updateEvent = async (id: string, event: Partial<Event>): Promise<Event | null> => {
  const { data, error } = await supabase.from('events').update(event).eq('id', id).single()
  if (error) {
    console.error(`Error updating event with id ${id}:`, error)
    return null
  }
  return data as Event
}

export const deleteEvent = async (id: string): Promise<void> => {
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) {
    console.error(`Error deleting event with id ${id}:`, error)
  }
}
