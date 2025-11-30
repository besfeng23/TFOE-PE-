'use client';

import MembersTable from "@/components/members/members-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthUser } from "@/firebase";
import { MemberFormDialog } from "@/components/members/member-form-dialog";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

export default function MembersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { profile } = useAuthUser();
    const isAdmin = profile?.roleId === 'Admin';

    return (
        <>
            <div className="grid gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-headline">Members Directory</CardTitle>
                            <CardDescription>
                                Browse, search, and manage members of the organization.
                            </CardDescription>
                        </div>
                         {isAdmin && (
                            <Button onClick={() => setIsFormOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Member
                            </Button>
                        )}
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
                        <MembersTable searchTerm={searchTerm} />
                    </CardContent>
                </Card>
            </div>
            {isAdmin && (
                <MemberFormDialog
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </>
    )
}
