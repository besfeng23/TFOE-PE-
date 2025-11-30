'use client';

import React, { useMemo } from 'react';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface MembersTableProps {
  searchTerm: string;
}

export default function MembersTable({ searchTerm }: MembersTableProps) {
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'userProfiles'), orderBy('lastName', 'asc'));
  }, [firestore]);

  const { data: profiles, isLoading, error } = useCollection<UserProfile>(usersQuery);
  
  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    if (!searchTerm) return profiles;

    return profiles.filter(profile => 
        (profile.firstName && profile.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (profile.lastName && profile.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (profile.email && profile.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (profile.roleId && profile.roleId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  }, [profiles, searchTerm])

  if (isLoading) {
    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <div className='flex items-center gap-3'>
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell className="text-right">
                                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
  }

  if (error) {
    return <div className='text-destructive bg-destructive/10 p-4 rounded-md'>Error loading members: {error.message}</div>
  }

  return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                        <span>{profile.firstName} {profile.lastName}</span>
                    </div>
                </TableCell>
                <TableCell>
                  {profile.email}
                </TableCell>
                 <TableCell>
                  <Badge variant={profile.roleId === 'Admin' ? 'destructive' : 'secondary'}>{profile.roleId}</Badge>
                </TableCell>
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
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Member</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-destructive focus:bg-destructive/10 focus:text-destructive'>Delete Member</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
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
  );
}