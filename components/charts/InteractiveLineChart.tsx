// components/charts/InteractiveLineChart.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// --- Chart Data and Config (Moved from ResultsDisplay) ---
const interactiveLineChartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 }, { date: "2024-04-02", desktop: 97, mobile: 180 }, { date: "2024-04-03", desktop: 167, mobile: 120 },
  // Example data points - original file has more
  { date: "2024-04-04", desktop: 210, mobile: 190 },
  { date: "2024-04-05", desktop: 150, mobile: 130 },
  // Add rest of the data points if needed...
  { date: "2024-06-30", desktop: 446, mobile: 400 }, // Assuming this is the last point
];

const interactiveLineChartConfig = {
  views: { label: "Page Views" },
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

// --- Component Definition ---
export function InteractiveLineChartComponent() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof interactiveLineChartConfig>("desktop");
  const total = React.useMemo(() => ({
    desktop: interactiveLineChartData.reduce((acc, curr) => acc + curr.desktop, 0),
    mobile: interactiveLineChartData.reduce((acc, curr) => acc + curr.mobile, 0),
  }), []);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Line Chart - Interactive</CardTitle>
          <CardDescription>Showing total visitors for the last 3 months</CardDescription>
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof interactiveLineChartConfig;
            return (
              <button 
                key={chart} 
                data-active={activeChart === chart} 
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6" 
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{interactiveLineChartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">{total[key as keyof typeof total].toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={interactiveLineChartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart accessibilityLayer data={interactiveLineChartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8} 
              minTickGap={32} 
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} 
            />
            <ChartTooltip 
              cursor={false}
              content={<ChartTooltipContent 
                className="w-[150px]" 
                nameKey="views" 
                labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} 
              />} 
            />
            <Line dataKey={activeChart} type="monotone" stroke={`var(--color-${activeChart})`} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 