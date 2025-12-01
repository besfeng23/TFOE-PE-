
'use client';

import React, { useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useAuthUser, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import type { Partnership } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { PartnershipFormDialog } from './partnership-form-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { EndorsementLetterDialog } from './endorsement-letter-dialog';

interface PartnershipsTableProps {
  searchTerm: string;
}

export default function PartnershipsTable({ searchTerm }: PartnershipsTableProps) {
  const firestore = useFirestore();
  const { profile: currentUserProfile } = useAuthUser();
  const isAdmin = currentUserProfile?.roleId === 'Admin';
  
  const [selectedPartner, setSelectedPartner] = useState<Partnership | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEndorsementDialogOpen, setIsEndorsementDialogOpen] = useState(false);


  const partnersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'partnerships'), orderBy('name', 'asc'));
  }, [firestore]);

  const { data: partnerships, isLoading, error } = useCollection<Partnership>(partnersQuery);
  
  const filteredPartnerships = useMemo(() => {
    if (!partnerships) return [];
    if (!searchTerm) return partnerships;
    
    const lowercasedTerm = searchTerm.toLowerCase();

    return partnerships.filter(partner => 
        (partner.name && partner.name.toLowerCase().includes(lowercasedTerm)) ||
        (partner.contactPerson && partner.contactPerson.toLowerCase().includes(lowercasedTerm)) ||
        (partner.partnershipType && partner.partnershipType.toLowerCase().includes(lowercasedTerm))
    );

  }, [partnerships, searchTerm])

  const handleEdit = (partner: Partnership) => {
    setSelectedPartner(partner);
    setIsFormOpen(true);
  }

  const handleDelete = (partner: Partnership) => {
    setSelectedPartner(partner);
    setIsDeleteDialogOpen(true);
  }
  
  const handleGenerateEndorsement = (partner: Partnership) => {
    setSelectedPartner(partner);
    setIsEndorsementDialogOpen(true);
  }
  
  const confirmDelete = () => {
    if (!selectedPartner || !firestore) return;

    const partnerRef = doc(firestore, 'partnerships', selectedPartner.id);
    deleteDocumentNonBlocking(partnerRef);

    toast({
        title: "Partner Deleted",
        description: `${selectedPartner.name} has been removed.`,
    });

    setIsDeleteDialogOpen(false);
    setSelectedPartner(null);
  }
  
  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedPartner(null);
  }

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
        case 'Active': return 'default';
        case 'Inactive': return 'destructive';
        default: return 'outline';
    }
  }


  if (isLoading) {
    return (
        <div className="rounded-lg border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Contact</TableHead>
                        <TableHead className="hidden md:table-cell">Type</TableHead>
                        <TableHead className="hidden lg:table-cell">Status</TableHead>
                        {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                             {isAdmin && <TableCell className="text-right">
                                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                            </TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
  }

  if (error) {
    return <div className='text-destructive bg-destructive/10 p-4 rounded-md'>Error loading partnerships: {error.message}</div>
  }

  return (
      <>
        <div className="rounded-lg border overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Partner Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Contact Person</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredPartnerships && filteredPartnerships.map((partner) => (
                <TableRow key={partner.id}>
                    <TableCell className="font-medium">
                        {partner.name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                        <div className="flex flex-col">
                            <span>{partner.contactPerson}</span>
                            <span className="text-xs text-muted-foreground">{partner.email}</span>
                        </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{partner.partnershipType || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                        <Badge variant={getStatusBadgeVariant(partner.status)}>{partner.status}</Badge>
                    </TableCell>
                    {isAdmin && (
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleEdit(partner)}>Edit Partner</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleGenerateEndorsement(partner)}>Generate Endorsement</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className='text-destructive focus:bg-destructive/10 focus:text-destructive' onClick={() => handleDelete(partner)}>Delete Partner</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    )}
                </TableRow>
                ))}
            </TableBody>
            </Table>
            {filteredPartnerships && filteredPartnerships.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    {searchTerm ? `No partners found for "${searchTerm}"` : "No partners found."}
                </div>
            )}
        </div>

        {isAdmin && <PartnershipFormDialog isOpen={isFormOpen} onClose={closeForm} partner={selectedPartner} />}
        
        {isAdmin && selectedPartner && (
            <EndorsementLetterDialog
                isOpen={isEndorsementDialogOpen}
                onClose={() => {
                    setIsEndorsementDialogOpen(false);
                    setSelectedPartner(null);
                }}
                partner={selectedPartner}
            />
        )}

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the partner
                    and remove their data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedPartner(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </>
  );
}
