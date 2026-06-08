'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsBarTooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const MembershipStatusChart = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <RechartsTooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          contentStyle={{
            background: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
          }}
        />
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={80}
          labelLine={false}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return (
              <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Legend iconSize={12} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
};

const MembersByGovtLevelChart = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} />
        <RechartsBarTooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          contentStyle={{
            background: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
          }}
        />
        <Bar dataKey="members" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DashboardCharts = ({ membershipStatusData, membersByGovtLevelData }: { membershipStatusData: any[], membersByGovtLevelData: any[] }) => {
    return (
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
                    <MembershipStatusChart data={membershipStatusData} />
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
                    <MembersByGovtLevelChart data={membersByGovtLevelData} />
                </CardContent>
            </Card>
        </div>
    );
};