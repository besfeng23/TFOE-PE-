
import getSupabaseServerClient from '../supabase/server';

const TABLE_NAME = 'clubs';

export async function getClubs() {
    const client = getSupabaseServerClient();
    const { data, error } = await client.from(TABLE_NAME).select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getClub(id: string) {
    const client = getSupabaseServerClient();
    const { data, error } = await client.from(TABLE_NAME).select('*').eq('id', id).single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createClub(club: any) {
    const client = getSupabaseServerClient();
    const { data, error } = await client.from(TABLE_NAME).insert(club).select().single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function updateClub(id: string, club: any) {
    const client = getSupabaseServerClient();
    const { data, error } = await client.from(TABLE_NAME).update(club).eq('id', id).select().single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function deleteClub(id: string) {
    const client = getSupabaseServerClient();
    const { error } = await client.from(TABLE_NAME).delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return true;
}
