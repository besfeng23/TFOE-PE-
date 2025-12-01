'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
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
    return <div className="text-center text-muted-foreground p-8">No members with government positions found.</div>
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="branch"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className="capitalize"
        />
        <XAxis dataKey="members" type="number" hide />
        <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Bar dataKey="members" fill="var(--color-members)" radius={4} layout="vertical">
            {data.map((entry, index) => (
                <text key={`label-${index}`} x={entry.members > 10 ? 90 : 10} y={index * 35 + 20} fill={entry.members > 10 ? 'white' : 'black'} textAnchor="middle">
                    {entry.members}
                </text>
            ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}