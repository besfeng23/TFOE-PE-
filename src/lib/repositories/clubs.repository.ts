
import { SupabaseClient } from '@supabase/supabase-js';

const TABLE_NAME = 'clubs';

export async function getClubs(client: SupabaseClient) {
    const { data, error } = await client.from(TABLE_NAME).select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getClub(client: SupabaseClient, id: string) {
    const { data, error } = await client.from(TABLE_NAME).select('*').eq('id', id).single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createClub(client: SupabaseClient, club: any) {
    const { data, error } = await client.from(TABLE_NAME).insert(club).select().single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function updateClub(client: SupabaseClient, id: string, club: any) {
    const { data, error } = await client.from(TABLE_NAME).update(club).eq('id', id).select().single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function deleteClub(client: SupabaseClient, id: string) {
    const { error } = await client.from(TABLE_NAME).delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return true;
}
