'use client';

import MemberEngagementChart from "@/components/analytics/member-engagement-chart";
import FormSubmissionsChart from "@/components/analytics/form-submissions-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CalendarCheck, ShieldAlert } from "lucide-react";
import { useAuthUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { Document, UserProfile, Attendance } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function AnalyticsCard({ title, icon: Icon, value, description, isLoading, error }: { title: string, icon: React.ElementType, value: string | number, description: string, isLoading: boolean, error?: any }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : error ? (
            <div className="text-sm font-bold text-destructive">Error</div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}


export default function AnalyticsPage() {
  const { profile, isProfileLoading } = useAuthUser();
  const firestore = useFirestore();
  const isAdmin = profile?.roleId === 'Admin';

  const profilesQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return query(collection(firestore, 'userProfiles'));
  }, [firestore, isAdmin]);
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useCollection<UserProfile>(profilesQuery);

  const documentsQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return query(collection(firestore, 'documents'));
  }, [firestore, isAdmin]);
  const { data: documents, isLoading: documentsLoading, error: documentsError } = useCollection<Document>(documentsQuery);
  
  const attendanceQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return query(collection(firestore, 'attendance'));
  }, [firestore, isAdmin]);
  const { data: attendance, isLoading: attendanceLoading, error: attendanceError } = useCollection<Attendance>(attendanceQuery);


  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <CardHeader>
          <div className="mx-auto bg-muted rounded-full p-3">
            <ShieldAlert className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4">Access Denied</CardTitle>
          <CardDescription>
            The analytics dashboard is only available to administrators.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnalyticsCard
            title="Active Members"
            icon={Users}
            value={profiles?.length ?? 0}
            description="Total registered user profiles"
            isLoading={profilesLoading}
            error={profilesError}
        />
        <AnalyticsCard
            title="Documents Submitted"
            icon={FileText}
            value={documents?.length ?? 0}
            description="Total documents in the repository"
            isLoading={documentsLoading}
            error={documentsError}
        />
        <AnalyticsCard
            title="Event Attendances"
            icon={CalendarCheck}
            value={attendance?.length ?? 0}
            description="Total attendance records for all events"
            isLoading={attendanceLoading}
            error={attendanceError}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Member Engagement</CardTitle>
            <CardDescription>Monthly logins and activities (mock data).</CardDescription>
          </CardHeader>
          <CardContent>
            <MemberEngagementChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Form Submissions</CardTitle>
            <CardDescription>Monthly submissions by form type (mock data).</CardDescription>
          </CardHeader>
          <CardContent>
            <FormSubmissionsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
