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
import { useCollection, useFirestore, useMemoFirebase, useAuthUser } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import type { Member } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { format } from 'date-fns';

interface MembersTableProps {
  searchTerm: string;
}

export default function MembersTable({ searchTerm }: MembersTableProps) {
  const firestore = useFirestore();
  const { profile: currentUserProfile, isUserLoading } = useAuthUser();
  const isAdmin = currentUserProfile?.roleId === 'SuperAdmin';
  
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const membersQuery = useMemoFirebase(() => {
    if (!firestore || !currentUserProfile) return null;
    
    let q = collection(firestore, 'members');
    
    // Scoping queries based on role
    if (currentUserProfile.roleId === 'RegionAdmin' && currentUserProfile.regionId) {
        return query(q, where('region', '==', currentUserProfile.regionId));
    }
    if (currentUserProfile.roleId === 'CouncilAdmin' && currentUserProfile.councilName) {
        return query(q, where('councilName', '==', currentUserProfile.councilName));
    }
    if (currentUserProfile.roleId === 'ClubAdmin' && currentUserProfile.clubName) {
        return query(q, where('clubName', '==', currentUserProfile.clubName));
    }
    if (currentUserProfile.roleId === 'Member') {
        // Members see others in their club
        return query(q, where('clubName', '==', currentUserProfile.clubName));
    }

    // SuperAdmin sees all
    return query(q, orderBy('fullName', 'asc'));

  }, [firestore, currentUserProfile]);

  const { data: members, isLoading: membersLoading } = useCollection<Member>(membersQuery);
  
  const isLoading = isUserLoading || membersLoading;

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    if (!searchTerm) return members;
    
    const lowercasedTerm = searchTerm.toLowerCase();

    return members.filter(member => 
        (member.fullName && member.fullName.toLowerCase().includes(lowercasedTerm)) ||
        (member.eagleId && member.eagleId.toLowerCase().includes(lowercasedTerm)) ||
        (member.email && member.email.toLowerCase().includes(lowercasedTerm)) ||
        (member.mobileNumber && member.mobileNumber.toLowerCase().includes(lowercasedTerm))
    );

  }, [members, searchTerm])


  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
        case 'Active': return 'default';
        case 'Inactive': return 'outline';
        case 'Suspended': return 'destructive';
        case 'Expelled': return 'destructive';
        case 'Deceased': return 'secondary';
        default: return 'outline';
    }
  }

  const handleViewProfile = (memberId: string) => {
    // In a real app, you would navigate to the member's profile page
    console.log(`Navigating to /members/${memberId}`);
  }


  if (isLoading) {
    return (
        <div className="rounded-lg border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Org Placement</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(10)].map((_, i) => (
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
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
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

  return (
      <>
        <div className="rounded-lg border overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Org Placement</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredMembers && filteredMembers.map((member) => (
                <TableRow key={member.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={member.avatarUrl} />
                                <AvatarFallback>{member.fullName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{member.fullName}</div>
                                <div className="text-xs text-muted-foreground">ID: {member.eagleId}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="truncate w-40" title={`${member.region} • ${member.councilName} • ${member.clubName}`}>
                          {member.region} • {member.councilName} • {member.clubName}
                        </div>
                    </TableCell>
                     <TableCell>
                        <div className="flex flex-col gap-1">
                            <Badge variant="secondary" className="w-fit">{member.orgRole}</Badge>
                            {member.governmentRole && <Badge variant="outline" className="w-fit">{member.governmentRole}</Badge>}
                        </div>
                    </TableCell>
                     <TableCell>
                        <div className="truncate w-48" title={`Brgy ${member.barangayName}, ${member.municipalityCity}, ${member.province}`}>
                          Brgy {member.barangayName}, {member.municipalityCity}, {member.province}
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={getStatusBadgeVariant(member.status)}>{member.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>{format(member.joinedDate.toDate(), 'yyyy-MM-dd')}</div>
                      <div className="text-xs text-muted-foreground">{member.membershipType}</div>
                    </TableCell>
                     <TableCell>
                        <div>{member.mobileNumber}</div>
                        <div className="text-xs text-muted-foreground truncate w-32">{member.email}</div>
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
                                <DropdownMenuItem onClick={() => handleViewProfile(member.id)}>View Profile</DropdownMenuItem>
                                {isAdmin && (
                                  <>
                                    <DropdownMenuItem>Edit Member</DropdownMenuItem>
                                    <DropdownMenuItem>Change Status</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className='text-destructive focus:bg-destructive/10 focus:text-destructive'>Delete Member</DropdownMenuItem>
                                  </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
            {filteredMembers && filteredMembers.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    {searchTerm ? `No members found for "${searchTerm}"` : "No members in your scope."}
                </div>
            )}
        </div>
      </>
  );
}
