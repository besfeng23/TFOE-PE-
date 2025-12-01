'use client';

import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

interface MembershipStatusChartProps {
    data: {
        status: string;
        count: number;
        fill: string;
    }[]
}

const chartConfig = {
  count: {
    label: 'Members',
  },
  Active: {
    label: 'Active',
    color: 'hsl(var(--chart-1))',
  },
  Inactive: {
    label: 'Inactive',
    color: 'hsl(var(--chart-2))',
  },
  Leadership: {
    label: 'Leadership',
    color: 'hsl(var(--chart-3))',
  },
  Unknown: {
    label: 'Unknown',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;


export default function MembershipStatusChart({ data }: MembershipStatusChartProps) {
  if (data.length === 0) {
    return <div className="text-center text-muted-foreground p-8">No membership status data to display.</div>
  }
  
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="status" innerRadius={60}>
            {data.map((entry) => (
              <Cell key={entry.status} fill={entry.fill} />
            ))}
        </Pie>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent nameKey="status" />} />
      </PieChart>
    </ChartContainer>
  