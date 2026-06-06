
import { createClient } from '@/lib/supabase/server'
import { type Payment } from '@/lib/types'

const supabase = createClient()

export const getPayments = async (): Promise<Payment[]> => {
  const { data, error } = await supabase.from('payments').select('*')
  if (error) {
    console.error('Error fetching payments:', error)
    return []
  }
  return data as Payment[]
}

export const getPayment = async (id: string): Promise<Payment | null> => {
  const { data, error } = await supabase.from('payments').select('*').eq('id', id).single()
  if (error) {
    console.error(`Error fetching payment with id ${id}:`, error)
    return null
  }
  return data as Payment
}

export const createPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment | null> => {
  const { data, error } = await supabase.from('payments').insert(payment).single()
  if (error) {
    console.error('Error creating payment:', error)
    return null
  }
  return data as Payment
}

export const updatePayment = async (id: string, payment: Partial<Payment>): Promise<Payment | null> => {
  const { data, error } = await supabase.from('payments').update(payment).eq('id', id).single()
  if (error) {
    console.error(`Error updating payment with id ${id}:`, error)
    return null
  }
  return data as Payment
}

export const deletePayment = async (id: string): Promise<void> => {
  const { error } = await supabase.from('payments').delete().eq('id', id)
  if (error) {
    console.error(`Error deleting payment with id ${id}:`, error)
  }
}
