'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, Plus, Search, FileUp } from 'lucide-react';
import { useAuthUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import MembersTable from '@/components/members/members-table';
import type { UserProfile } from '@/lib/types';
import { MemberFormDialog } from '@/components/members/member-form-dialog';
import { ReportDialog } from '@/components/members/report-dialog';
import { AiImportDialog } from '@/components/members/ai-import-dialog';
import { collection, query } from 'firebase/firestore';

export default function MembersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { profile, isUserLoading } = useAuthUser();
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isAiImportOpen, setIsAiImportOpen] = useState(false);
    const [prefilledData, setPrefilledData] = useState<Partial<UserProfile> | null>(null);

    const firestore = useFirestore();

    const profilesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        // This is a simplified query. In a real app, you'd apply role-based filtering here.
        return query(collection(firestore, 'userProfiles'));
    }, [firestore]);

    const { data: profiles, isLoading: profilesLoading } = useCollection<UserProfile>(profilesQuery);

    const canAdd = profile?.roleId && ['SuperAdmin', 'RegionAdmin', 'CouncilAdmin', 'ClubAdmin'].includes(profile.roleId);
    const canImportExport = profile?.roleId && ['SuperAdmin', 'RegionAdmin', 'CouncilAdmin', 'ClubAdmin'].includes(profile.roleId);

    const handleOpenForm = () => {
        setPrefilledData(null);
        setIsFormOpen(true);
    }
    
    const handleAiImportComplete = (data: Partial<UserProfile>) => {
        setPrefilledData(data);
        setIsAiImportOpen(false);
        setIsFormOpen(true);
    }

    if (isUserLoading || profilesLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
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
                            <div className="flex flex-wrap gap-2">
                                {canImportExport && (
                                    <>
                                        <Button variant="outline" onClick={() => setIsAiImportOpen(true)}>
                                            <FileUp className="mr-2 h-4 w-4" />
                                            AI Import
                                        </Button>
                                        <Button variant="outline" onClick={() => setIsReportOpen(true)}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Export
                                        </Button>
                                    </>
                                )}
                                {canAdd && (
                                    <Button onClick={handleOpenForm}>
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
            {canAdd && (
                <MemberFormDialog 
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    prefilledData={prefilledData}
                />
            )}
            {canImportExport && (
                 <ReportDialog
                    isOpen={isReportOpen}
                    onClose={() => setIsReportOpen(false)}
                    profiles={profiles || []}
                />
            )}
             {canImportExport && (
                <AiImportDialog 
                    isOpen={isAiImportOpen}
                    onClose={() => setIsAiImportOpen(false)}
                    onImportComplete={handleAiImportComplete}
                />
            )}
        </>
    )
}
