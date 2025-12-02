
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface MembersByGovtLevelChartProps {
    data: {
        branch: string;
        members: number;
    }[]
}

const chartConfig = {
  members: {
    label: 'Members',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function MembersByGovtLevelChart({ data }: MembersByGovtLevelChartProps) {
  if (data.length === 0) {
    return <div className="text-center text-muted-foreground p-8 h-full flex items-center justify-center">No members with government positions found.</div>
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-full">
        <ResponsiveContainer width="100%" height={300}>
            <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 20, top: 20, right: 20, bottom: 20 }}>
                <CartesianGrid horizontal={false} />
                <YAxis
                dataKey="branch"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <XAxis dataKey="members" type="number" hide />
                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="members" fill="var(--color-members)" radius={5}>
                    <LabelList dataKey="members" position="right" offset={8} className="fill-foreground font-semibold" fontSize={12} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
  );
}
