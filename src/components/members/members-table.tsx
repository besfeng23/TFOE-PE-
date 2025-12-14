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
import { MoreHorizontal, ChevronDown, FileWarning } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useAuthUser } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Card, CardContent } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { MemberFormDialog } from './member-form-dialog';

interface MembersTableProps {
  searchTerm: string;
}

const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
        case 'Active': return 'default';
        case 'Leadership': return 'default';
        case 'Inactive': return 'outline';
        default: return 'secondary';
    }
}

const MemberCard = ({ member, onEdit }: { member: UserProfile, onEdit: (member: UserProfile) => void }) => {
    const { profile: currentUserProfile } = useAuthUser();
    const canEdit = currentUserProfile?.roleId === 'SuperAdmin' || 
                    (currentUserProfile?.roleId === 'RegionAdmin' && currentUserProfile?.regionId === member.regionId) ||
                    (currentUserProfile?.roleId === 'CouncilAdmin' && currentUserProfile?.councilName === member.councilName) ||
                    (currentUserProfile?.roleId === 'ClubAdmin' && currentUserProfile?.clubName === member.clubName);


    return (
        <Card>
            <CardContent className="p-4">
                <Collapsible>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={member.avatarUrl} />
                                <AvatarFallback>{member.firstName?.charAt(0)}{member.lastName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{member.firstName} {member.lastName}</p>
                                <p className="text-xs text-muted-foreground">ID: {member.membershipNumber || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             {canEdit && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => onEdit(member)}>Edit Member</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className='text-destructive focus:bg-destructive/10 focus:text-destructive'>Delete Member</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                            <CollapsibleTrigger asChild>
                               <Button variant="ghost" size="sm" className="w-full justify-center text-xs">
                                    More
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                         <div className="flex items-center gap-2">
                             <Badge variant={getStatusBadgeVariant(member.membershipStatus)}>{member.membershipStatus}</Badge>
                             <Badge variant="secondary">{member.roleId}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.clubName}, {member.regionId}</p>
                        {member.assignedGovernmentPosition && <p className="text-sm font-medium">{member.assignedGovernmentPosition}</p>}
                    </div>

                    <CollapsibleContent className="mt-4 space-y-2 text-sm">
                        <p><strong>Email:</strong> {member.email}</p>
                        <p><strong>Gov. Branch:</strong> {member.governmentBranch || 'N/A'}</p>
                        <p><strong>Position Type:</strong> {member.positionType || 'N/A'}</p>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    )
}

export default function MembersTable({ searchTerm }: MembersTableProps) {
  const firestore = useFirestore();
  const { profile: currentUserProfile, isUserLoading } = useAuthUser();
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const membersQuery = useMemoFirebase(() => {
    if (!firestore || !currentUserProfile) return null;
    
    let q = collection(firestore, 'userProfiles');
    
    // This is a simplified scoping logic. A real app would have more robust rules.
    if (currentUserProfile.roleId === 'RegionAdmin' && currentUserProfile.regionId) {
        return query(q, where('regionId', '==', currentUserProfile.regionId));
    }
    if (currentUserProfile.roleId === 'CouncilAdmin' && currentUserProfile.councilName) {
        return query(q, where('councilName', '==', currentUserProfile.councilName));
    }
    if (currentUserProfile.roleId === 'ClubAdmin' && currentUserProfile.clubName) {
        return query(q, where('clubName', '==', currentUserProfile.clubName));
    }
    if (currentUserProfile.roleId === 'Member') {
        return query(q, where('id', '==', currentUserProfile.id));
    }

    return query(q, orderBy('lastName', 'asc'));

  }, [firestore, currentUserProfile]);

  const { data: members, isLoading: membersLoading, error } = useCollection<UserProfile>(membersQuery);
  
  const isLoading = isUserLoading || membersLoading;

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    if (!searchTerm) return members;
    
    const lowercasedTerm = searchTerm.toLowerCase();

    return members.filter(member => 
        (member.firstName && member.firstName.toLowerCase().includes(lowercasedTerm)) ||
        (member.lastName && member.lastName.toLowerCase().includes(lowercasedTerm)) ||
        (member.membershipNumber && member.membershipNumber.toLowerCase().includes(lowercasedTerm)) ||
        (member.email && member.email.toLowerCase().includes(lowercasedTerm))
    );

  }, [members, searchTerm])

  const handleEdit = (member: UserProfile) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  }

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedMember(null);
  }

  if (isLoading) {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center rounded-md border-2 border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
            <FileWarning className="h-8 w-8" />
            <h3 className="mt-4 text-lg font-semibold">Error Loading Members</h3>
            <p className="mt-1 text-sm ">
                There was a problem fetching the member directory. Please check your permissions or network and try again.
            </p>
        </div>
    );
  }

  return (
      <>
        {/* Desktop Table View */}
        <div className="hidden md:block rounded-lg border overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Org Placement</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
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
                                <AvatarFallback>{member.firstName?.charAt(0)}{member.lastName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{member.firstName} {member.lastName}</div>
                                <div className="text-xs text-muted-foreground">ID: {member.membershipNumber || 'N/A'}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="truncate w-40" title={`${member.regionId} • ${member.councilName} • ${member.clubName}`}>
                          {member.regionId} • {member.councilName || 'N/A'} • {member.clubName || 'N/A'}
                        </div>
                    </TableCell>
                     <TableCell>
                        <div className="flex flex-col gap-1">
                            <Badge variant="secondary" className="w-fit">{member.roleId}</Badge>
                            {member.assignedGovernmentPosition && <Badge variant="outline" className="w-fit">{member.assignedGovernmentPosition}</Badge>}
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={getStatusBadgeVariant(member.membershipStatus)}>{member.membershipStatus || 'N/A'}</Badge>
                    </TableCell>
                     <TableCell>
                        <div>{member.contactInfo || 'N/A'}</div>
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
                                <DropdownMenuItem onClick={() => handleEdit(member)}>Edit Member</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='text-destructive focus:bg-destructive/10 focus:text-destructive'>Delete Member</DropdownMenuItem>
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
        
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
            {filteredMembers && filteredMembers.map(member => (
                <MemberCard key={member.id} member={member} onEdit={handleEdit} />
            ))}
             {filteredMembers && filteredMembers.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    {searchTerm ? `No members found for "${searchTerm}"` : "No members in your scope."}
                </div>
            )}
        </div>

        <MemberFormDialog
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            member={selectedMember}
        />
      </>
  );
}
