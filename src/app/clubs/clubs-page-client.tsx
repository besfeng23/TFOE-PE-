
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ClubsTable from '@/components/clubs/clubs-table';
import { ClubFormDialog } from '@/components/clubs/club-form-dialog';

export default function ClubsPageClient({ clubs: initialClubs }: { clubs: any[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clubs</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add New Club</Button>
      </div>
      <ClubsTable clubs={initialClubs} />
      <ClubFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        club={null}
      />
    </div>
  );
}
