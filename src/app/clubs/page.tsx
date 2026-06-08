
import React from 'react';
import { getClubs } from '@/lib/repositories/clubs.repository';
import ClubsPageClient from './clubs-page-client';
import getSupabaseServerClient from '@/lib/supabase/server';

export default async function ClubsPage() {
    const supabase = getSupabaseServerClient();
    const clubs = await getClubs(supabase);

    return <ClubsPageClient clubs={clubs} />;
}
