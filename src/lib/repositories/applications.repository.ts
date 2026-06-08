
import { createClient } from '@/lib/supabase/server';
import { type Application } from '@/lib/types';

export const getApplications = async (): Promise<Application[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('applications').select('*');
  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
  return data as Application[];
};

export const getApplication = async (id: string): Promise<Application | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('applications').select('*').eq('id', id).single();
  if (error) {
    console.error(`Error fetching application with id ${id}:`, error);
    return null;
  }
  return data as Application;
};

export const createApplication = async (application: Omit<Application, 'id'>): Promise<Application | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('applications').insert(application).single();
  if (error) {
    console.error('Error creating application:', error);
    return null;
  }
  return data as Application;
};

export const updateApplication = async (id: string, application: Partial<Application>): Promise<Application | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('applications').update(application).eq('id', id).single();
  if (error) {
    console.error(`Error updating application with id ${id}:`, error);
    return null;
  }
  return data as Application;
};

export const deleteApplication = async (id: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.from('applications').delete().eq('id', id);
  if (error) {
    console.error(`Error deleting application with id ${id}:`, error);
  }
};
