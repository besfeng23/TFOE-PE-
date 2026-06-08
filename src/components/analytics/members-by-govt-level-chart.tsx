
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Pie, PieChart } from 'recharts';
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
          <PieChart>
            <Pie data={data} dataKey="members">
                <LabelList dataKey="members" position="right" offset={8} className="fill-foreground font-semibold" fontSize={12} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
    </ChartContainer>
  );
}
