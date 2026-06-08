
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
  UserCheck,
  UserX,
} from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { format } from 'date-fns';
import React from 'react';
import { getProfiles } from '@/lib/repositories/profiles.repository';
import getSupabaseServerClient from '@/lib/supabase/server';
import { DashboardCharts } from '@/components/analytics/dashboard-charts';

function StatCard({ title, value, description, icon: Icon }: { title: string, value: number, description: string, icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single();

  const profiles: UserProfile[] = await getProfiles(supabase);

  const stats = {
    total: profiles.length,
    active: profiles.filter(p => p.status === 'Active').length,
    inactive: profiles.filter(p => p.status === 'Inactive').length,
    inGov: profiles.filter(p => p.governmentRole && p.governmentRole !== 'None').length,
    barangay: profiles.filter(p => p.governmentBranch === 'LGU').length,
  };

  const membershipStatusData = Object.entries(profiles.reduce((acc, profile) => {
    const status = profile.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)).map(([status, count], index, arr) => ({
    status,
    count,
    fill: `var(--chart-${index + 1})`
  }));

  const membersByGovtLevelData = Object.entries(profiles.reduce((acc, profile) => {
    const branch = profile.governmentBranch || 'N/A';
    if (branch !== 'N/A' && branch.trim() !== '') {
        acc[branch] = (acc[branch] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>)).map(([branch, members]) => ({
    branch,
    members,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
          <>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Eagles Member Command Center
            </h1>
            <p className="text-muted-foreground">
              Today is {format(new Date(), 'eeee, MMMM dd, yyyy')}. Welcome, Kuya {profile?.firstName || 'User'}!
            </p>
          </>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Total Members" value={stats.total} description="All registered members" icon={Users} />
        <StatCard title="Active Members" value={stats.active} description="Members with active status" icon={UserCheck} />
        <StatCard title="Inactive Members" value={stats.inactive} description="Members with inactive status" icon={UserX} />
        <StatCard title="Members in Government" value={stats.inGov} description="Officials in any branch" icon={ShieldCheck} />
        <StatCard title="Barangay Officials" value={stats.barangay} description="Members serving in LGUs" icon={Building} />
      </div>

      <DashboardCharts membershipStatusData={membershipStatusData} membersByGovtLevelData={membersByGovtLevelData} />
    </div>
  );
}
