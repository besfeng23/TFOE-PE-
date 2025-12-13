'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, Plus, Search } from 'lucide-react';
import { useAuthUser } from '@/firebase';
import MembersTable from '@/components/members/members-table';

export default function MembersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { profile, isUserLoading } = useAuthUser();

    const canAdd = profile?.roleId && ['SuperAdmin', 'RegionAdmin', 'CouncilAdmin', 'ClubAdmin'].includes(profile.roleId);
    const canImportExport = profile?.roleId && ['SuperAdmin', 'RegionAdmin', 'CouncilAdmin', 'ClubAdmin'].includes(profile.roleId);


    if (isUserLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="font-headline">Members</CardTitle>
                            <CardDescription>
                                Central directory of all Eagles under your scope.
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                             {canImportExport && (
                                <>
                                    <Button variant="outline">
                                        Import
                                    </Button>
                                     <Button variant="outline">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export
                                    </Button>
                                </>
                            )}
                            {canAdd && (
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Member
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name, Eagle ID, email, or mobile..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* Quick filters will go here */}
                    </div>
                    <MembersTable searchTerm={searchTerm} />
                </CardContent>
            </Card>
        </div>
    )
}
