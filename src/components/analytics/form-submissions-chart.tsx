'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const chartData = [
    { month: "January", resolution: 12, financial: 8, membership: 5 },
    { month: "February", resolution: 15, financial: 10, membership: 8 },
    { month: "March", resolution: 8, financial: 5, membership: 15 },
    { month: "April", resolution: 18, financial: 12, membership: 7 },
    { month: "May", resolution: 10, financial: 7, membership: 12 },
    { month: "June", resolution: 22, financial: 15, membership: 10 },
]

const chartConfig = {
    resolution: {
        label: "Resolutions",
        color: "hsl(var(--chart-1))",
    },
    financial: {
        label: "Financial Forms",
        color: "hsl(var(--chart-2))",
    },
    membership: {
        label: "Membership Apps",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export default function FormSubmissionsChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="resolution"
          type="monotone"
          stroke="var(--color-resolution)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="financial"
          type="monotone"
          stroke="var(--color-financial)"
          strokeWidth={2}
          dot={false}
        />
         <Line
          dataKey="membership"
          type="monotone"
          stroke="var(--color-membership)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
