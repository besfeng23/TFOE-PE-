
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  ShieldCheck,
  Building,
  BarChart3,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/lib/types';
import MembershipStatusChart from '@/components/analytics/membership-status-chart';
import MembersByGovtLevelChart from '@/components/analytics/members-by-govt-level-chart';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

function StatCard({ title, value, description, icon: Icon, isLoading }: { title: string, value: number, description: string, icon: React.ElementType, isLoading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-12" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { profile, loading: isProfileLoading } = useAuth();
  const supabase = createClient();

  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [areProfilesLoading, setAreProfilesLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase.from('userProfiles').select('*');
        if (error) throw error;
        setProfiles(data || []);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setAreProfilesLoading(false);
      }
    };
    fetchProfiles();
  }, [supabase]);

  const isLoading = isProfileLoading || areProfilesLoading;

  const stats = React.useMemo(() => {
    if (!profiles) return { total: 0, active: 0, inactive: 0, inGov: 0, barangay: 0 };
    return {
        total: profiles.length,
        active: profiles.filter(p => p.status === 'Active').length,
        inactive: profiles.filter(p => p.status === 'Inactive').length,
        inGov: profiles.filter(p => p.governmentRole && p.governmentRole !== 'None').length,
        barangay: profiles.filter(p => p.governmentBranch === 'LGU').length,
    }
  }, [profiles]);

  const membershipStatusData = React.useMemo(() => {
    if (!profiles) return [];
    const statusCounts = profiles.reduce((acc, profile) => {
        const status = profile.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        fill: `var(--chart-${Object.keys(statusCounts).indexOf(status) + 1})`
    }));
  }, [profiles]);

  const membersByGovtLevelData = React.useMemo(() => {
    if (!profiles) return [];
    const branchCounts = profiles.reduce((acc, profile) => {
        const branch = profile.governmentBranch || 'N/A';
        if (branch !== 'N/A' && branch.trim() !== '') {
            acc[branch] = (acc[branch] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(branchCounts).map(([branch, members]) => ({
        branch,
        members,
    }));
  }, [profiles]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        {isLoading ? (
          <>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="mt-2 h-5 w-80" />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Eagles Member Command Center
            </h1>
            <p className="text-muted-foreground">
              Today is {format(new Date(), 'eeee, MMMM dd, yyyy')}. Welcome, Kuya {profile?.firstName || 'User'}!
            </p>
          </>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Total Members" value={stats.total} description="All registered members" icon={Users} isLoading={isLoading} />
        <StatCard title="Active Members" value={stats.active} description="Members with active status" icon={UserCheck} isLoading={isLoading} />
        <StatCard title="Inactive Members" value={stats.inactive} description="Members with inactive status" icon={UserX} isLoading={isLoading} />
        <StatCard title="Members in Government" value={stats.inGov} description="Officials in any branch" icon={ShieldCheck} isLoading={isLoading} />
        <StatCard title="Barangay Officials" value={stats.barangay} description="Members serving in LGUs" icon={Building} isLoading={isLoading} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <BarChart3 className="h-5 w-5"/>
                    Membership Status
                </CardTitle>
                <CardDescription>Distribution of members by their current status.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-[300px] w-full" /> : <MembershipStatusChart data={membershipStatusData} />}
            </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <BarChart3 className="h-5 w-5"/>
                Members by Government Branch
            </CardTitle>
            <CardDescription>Breakdown of members serving in various government branches.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[300px] w-full" /> : <MembersByGovtLevelChart data={membersByGovtLevelData}/>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
