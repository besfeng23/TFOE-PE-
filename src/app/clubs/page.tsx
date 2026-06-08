
import React from 'react';
import { getClubs } from '@/lib/repositories/clubs.repository';
import ClubsTable from '@/components/clubs/clubs-table';
import { Button } from '@/components/ui/button';

export default async function ClubsPage() {
    const clubs = await getClubs();

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Clubs</h1>
                <Button>Add New Club</Button>
            </div>
            <ClubsTable clubs={clubs} />
        </div>
    );
}
