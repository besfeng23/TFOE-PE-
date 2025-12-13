
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthUser } from "@/firebase";
import { FileText, GanttChartSquare, Plus, Search } from "lucide-react";
import React from 'react';

const StatCard = ({ title, value, isLoading }: { title: string, value: number, isLoading: boolean }) => (
    <Card>
        <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{title}</p>
            {isLoading ? <div className="text-2xl font-bold">-</div> : <div className="text-2xl font-bold">{value}</div>}
        </CardContent>
    </Card>
);

export default function ApplicationsPage() {
    const { profile, isProfileLoading } = useAuthUser();
    const canCreate = profile?.roleId && ['ClubAdmin', 'CouncilAdmin', 'RegionAdmin', 'SuperAdmin'].includes(profile.roleId);
    const canExport = profile?.roleId && ['CouncilAdmin', 'RegionAdmin', 'SuperAdmin'].includes(profile.roleId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">5 I’s &amp; Applications</h1>
                    <p className="text-muted-foreground">Track Eagle applicants from interview to induction.</p>
                </div>
                <div className="flex gap-2">
                    {canCreate && (
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Application
                        </Button>
                    )}
                    {canExport && <Button variant="outline">Export</Button>}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <StatCard title="Total Active Applications" value={0} isLoading={isProfileLoading} />
                <StatCard title="In Interview" value={0} isLoading={isProfileLoading} />
                <StatCard title="For Regional Review" value={0} isLoading={isProfileLoading} />
                <StatCard title="For National Approval" value={0} isLoading={isProfileLoading} />
                <StatCard title="Approved (last 30 days)" value={0} isLoading={isProfileLoading} />
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by applicant name, sponsor, or mobile..."
                        className="pl-8"
                    />
                </div>
                {/* Filters will go here */}
            </div>

            <Tabs defaultValue="pipeline">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pipeline">
                        <GanttChartSquare className="mr-2 h-4 w-4" />
                        Pipeline
                    </TabsTrigger>
                    <TabsTrigger value="list">
                        <FileText className="mr-2 h-4 w-4" />
                        List
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="pipeline" className="pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Pipeline</CardTitle>
                            <CardDescription>Drag and drop applicants to move them through the 5 I's stages.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Kanban board will be implemented here */}
                            <div className="text-center py-12 text-muted-foreground">
                                Pipeline view is under construction.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="list" className="pt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Application List</CardTitle>
                            <CardDescription>A detailed list of all applications within your scope.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {/* Table view will be implemented here */}
                            <div className="text-center py-12 text-muted-foreground">
                                List view is under construction.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
