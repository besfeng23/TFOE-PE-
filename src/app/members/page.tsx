'use client';

import MembersTable from "@/components/members/members-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { MemberFormDialog } from "@/components/members/member-form-dialog";
import { Download, FileUp, Plus, Search } from "lucide-react";
import { useState } from "react";
import { collection, query } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import { ReportDialog } from "@/components/members/report-dialog";
import { AiImportDialog } from "@/components/members/ai-import-dialog";

export default function MembersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isAiImportOpen, setIsAiImportOpen] = useState(false);
    const [prefilledData, setPrefilledData] = useState<Partial<UserProfile> | null>(null);

    const { profile } = useAuthUser();
    const isAdmin = profile?.roleId === 'Admin';
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'userProfiles'));
    }, [firestore]);

    const { data: profiles, isLoading: profilesLoading } = useCollection<UserProfile>(usersQuery);

    const handleAiImportComplete = (data: Partial<UserProfile>) => {
        setPrefilledData(data);
        setIsAiImportOpen(false);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        // Clear prefilled data after the form is closed
        setPrefilledData(null);
    };

    return (
        <>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="font-headline">Members Directory</CardTitle>
                                <CardDescription>
                                    Browse, search, and manage members of the organization.
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                {isAdmin && (
                                    <>
                                        <Button variant="outline" onClick={() => setIsReportOpen(true)} disabled={profilesLoading}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Generate Report
                                        </Button>
                                         <Button variant="outline" onClick={() => setIsAiImportOpen(true)}>
                                            <FileUp className="mr-2 h-4 w-4" />
                                            AI Import
                                        </Button>
                                        <Button onClick={() => setIsFormOpen(true)}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Member
                                        </Button>
                                    </>
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
                                    placeholder="Search by name, email, or role..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <MembersTable searchTerm={searchTerm} profiles={profiles} isLoading={profilesLoading}/>
                    </CardContent>
                </Card>
            </div>
            {isAdmin && (
                <MemberFormDialog
                    isOpen={isFormOpen}
                    onClose={handleFormClose}
                    prefilledData={prefilledData}
                />
            )}
            {isAdmin && (
                <AiImportDialog
                    isOpen={isAiImportOpen}
                    onClose={() => setIsAiImportOpen(false)}
                    onImportComplete={handleAiImportComplete}
                />
            )}
            {isAdmin && (
                <ReportDialog
                    isOpen={isReportOpen}
                    onClose={() => setIsReportOpen(false)}
                    profiles={profiles || []}
                />
            )}
        </>
    )
}
