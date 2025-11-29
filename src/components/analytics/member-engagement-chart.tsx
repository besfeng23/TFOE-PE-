'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', logins: 186, activities: 80 },
  { month: 'February', logins: 305, activities: 200 },
  { month: 'March', logins: 237, activities: 120 },
  { month: 'April', logins: 273, activities: 190 },
  { month: 'May', logins: 209, activities: 130 },
  { month: 'June', logins: 214, activities: 140 },
];

const chartConfig = {
  logins: {
    label: 'Logins',
    color: 'hsl(var(--chart-1))',
  },
  activities: {
    label: 'Activities',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function MemberEngagementChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Bar dataKey="logins" fill="var(--color-logins)" radius={4} />
        <Bar dataKey="activities" fill="var(--color-activities)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
