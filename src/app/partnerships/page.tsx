'use client';

import PartnershipsTable from "@/components/partnerships/partnerships-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthUser } from "@/firebase";
import { PartnershipFormDialog } from "@/components/partnerships/partnership-form-dialog";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

export default function PartnershipsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { profile } = useAuthUser();
    const isAdmin = profile?.roleId === 'Admin';

    return (
        <>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="font-headline">Partnerships</CardTitle>
                                <CardDescription>
                                    Manage corporate and private entity partnerships.
                                </CardDescription>
                            </div>
                            {isAdmin && (
                                <Button onClick={() => setIsFormOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Partner
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by name, contact, or type..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <PartnershipsTable searchTerm={searchTerm} />
                    </CardContent>
                </Card>
            </div>
            {isAdmin && (
                <PartnershipFormDialog
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </>
    )
}
