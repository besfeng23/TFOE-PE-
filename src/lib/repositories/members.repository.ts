
import { SupabaseClient } from '@supabase/supabase-js';

const TABLE_NAME = 'members';

export async function getMembers(client: SupabaseClient) {
    const { data, error } = await client.from(TABLE_NAME).select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getMember(client: SupabaseClient, id: string) {
    const { data, error } = await client.from(TABLE_NAME).select('*').eq('id', id).single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createMember(client: SupabaseClient, member: any) {
    const { data, error } = await client.from(TABLE_NAME).insert(member).select().single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function updateMember(client: SupabaseClient, id: string, member: any) {
    const { data, error } = await client.from(TABLE_NAME).update(member).eq('id', id).select().single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function deleteMember(client: SupabaseClient, id: string) {
    const { error } = await client.from(TABLE_NAME).delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return true;
}
