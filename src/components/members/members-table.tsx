

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
import { useFirestore, useAuthUser, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MemberFormDialog } from './member-form-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

interface MembersTableProps {
  searchTerm: string;
  profiles: UserProfile[] | null;
  isLoading: boolean;
}

export default function MembersTable({ searchTerm, profiles, isLoading }: MembersTableProps) {
  const firestore = useFirestore();
  const { profile: currentUserProfile } = useAuthUser();
  const isAdmin = currentUserProfile?.roleId === 'Admin';
  
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    if (!searchTerm) return profiles;
    
    const lowercasedTerm = searchTerm.toLowerCase();

    return profiles.filter(profile => 
        (profile.firstName && profile.firstName.toLowerCase().includes(lowercasedTerm)) ||
        (profile.lastName && profile.lastName.toLowerCase().includes(lowercasedTerm)) ||
        (profile.email && profile.email.toLowerCase().includes(lowercasedTerm)) ||
        (profile.roleId && profile.roleId.toLowerCase().includes(lowercasedTerm)) ||
        (profile.governmentBranch && profile.governmentBranch.toLowerCase().includes(lowercasedTerm)) ||
        (profile.membershipStatus && profile.membershipStatus.toLowerCase().includes(lowercasedTerm)) ||
        (profile.membershipNumber && profile.membershipNumber.toLowerCase().includes(lowercasedTerm))
    );

  }, [profiles, searchTerm])

  const handleEdit = (member: UserProfile) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  }

  const handleDelete = (member: UserProfile) => {
    if (member.id === 'paolo-calanog-id') {
        toast({ variant: 'destructive', title: 'Action Not Allowed', description: 'This is a sample user and cannot be deleted.' });
        return;
    }
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  }
  
  const confirmDelete = () => {
    if (!selectedMember || !firestore) return;

    const memberRef = doc(firestore, 'userProfiles', selectedMember.id);
    deleteDocumentNonBlocking(memberRef);

    toast({
        title: "Member Deleted",
        description: `${selectedMember.firstName} ${selectedMember.lastName} has been removed.`,
    });

    setIsDeleteDialogOpen(false);
    setSelectedMember(null);
  }
  
  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedMember(null);
  }

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
        case 'Active': return 'default';
        case 'Leadership': return 'secondary';
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
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="hidden lg:table-cell">Role</TableHead>
                        <TableHead className="hidden lg:table-cell">Affiliation</TableHead>
                        {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <div className='flex items-center gap-3'>
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
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

  return (
      <>
        <div className="rounded-lg border overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Role</TableHead>
                <TableHead className="hidden lg:table-cell">Affiliation</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredProfiles && filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={profile.idPhotoUrl} data-ai-hint="person face" />
                                <AvatarFallback>{profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span>{profile.firstName} {profile.lastName}</span>
                                <span className="sm:hidden text-xs text-muted-foreground">{profile.email}</span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                    {profile.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Badge variant={getStatusBadgeVariant(profile.membershipStatus)}>{profile.membershipStatus || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                    <Badge variant={profile.roleId === 'Admin' ? 'destructive' : 'outline'}>{profile.roleId}</Badge>
                    </TableCell>
                     <TableCell className="hidden lg:table-cell">
                        {profile.governmentBranch || 'N/A'}
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
                                    <DropdownMenuItem onClick={() => handleEdit(profile)}>Edit Member</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className='text-destructive focus:bg-destructive/10 focus:text-destructive' onClick={() => handleDelete(profile)}>Delete Member</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    )}
                </TableRow>
                ))}
            </TableBody>
            </Table>
            {filteredProfiles && filteredProfiles.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    {searchTerm ? `No members found for "${searchTerm}"` : "No members found."}
                </div>
            )}
        </div>

        {isAdmin && <MemberFormDialog isOpen={isFormOpen} onClose={closeForm} member={selectedMember} />}
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the member account
                    and remove their data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedMember(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </>
  );
}
