
import { createClient } from '@/lib/supabase/client'
import { type Document } from '@/lib/types'

const supabase = createClient()

export const getDocuments = async (): Promise<Document[]> => {
  const { data, error } = await supabase.from('documents').select('*')
  if (error) {
    console.error('Error fetching documents:', error)
    return []
  }
  return data as Document[]
}

export const getDocument = async (id: string): Promise<Document | null> => {
  const { data, error } = await supabase.from('documents').select('*').eq('id', id).single()
  if (error) {
    console.error(`Error fetching document with id ${id}:`, error)
    return null
  }
  return data as Document
}

export const createDocument = async (document: Omit<Document, 'id'>): Promise<Document | null> => {
  const { data, error } = await supabase.from('documents').insert(document).single()
  if (error) {
    console.error('Error creating document:', error)
    return null
  }
  return data as Document
}

export const updateDocument = async (id: string, document: Partial<Document>): Promise<Document | null> => {
  const { data, error } = await supabase.from('documents').update(document).eq('id', id).single()
  if (error) {
    console.error(`Error updating document with id ${id}:`, error)
    return null
  }
  return data as Document
}

export const deleteDocument = async (id: string): Promise<void> => {
  const { error } = await supabase.from('documents').delete().eq('id', id)
  if (error) {
    console.error(`Error deleting document with id ${id}:`, error)
  }
}
