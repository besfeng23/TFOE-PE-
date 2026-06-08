
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, Plus, Search, FileUp } from 'lucide-react';
import MembersTable from '@/components/members/members-table';
import type { UserProfile } from '@/lib/types';
import { MemberFormDialog } from '@/components/members/member-form-dialog';
import { ReportDialog } from '@/components/members/report-dialog';
import { AiImportDialog } from '@/components/members/ai-import-dialog';
import { getMembersAction } from '@/app/members/actions';
import { Skeleton } from '@/components/ui/skeleton';

function MembersPage() {
    const [members, setMembers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isAiImportOpen, setIsAiImportOpen] = useState(false);
    const [prefilledData, setPrefilledData] = useState<Partial<UserProfile> | null>(null);

    useEffect(() => {
        const fetchMembers = async () => {
            setIsLoading(true);
            const updatedMembers = await getMembersAction();
            setMembers(updatedMembers);
            setIsLoading(false);
        };
        fetchMembers();
    }, []);

    const canAdd = true;
    const canImportExport = true;

    const handleOpenForm = () => {
        setPrefilledData(null);
        setIsFormOpen(true);
    }
    
    const handleAiImportComplete = (data: Partial<UserProfile>) => {
        setPrefilledData(data);
        setIsAiImportOpen(false);
        setIsFormOpen(true);
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
                        {isLoading ? (
                            <Skeleton className="w-full h-[300px]"/>
                        ) : (
                            <MembersTable searchTerm={searchTerm} members={members} isLoading={false} />
                        )}
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
                    profiles={members || []}
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

export default MembersPage;
