import React from 'react';
// Removed Card imports
import { Button } from "@/components/ui/button"; 
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
// Import Table components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; 

// Match the data types from ResultsDisplay
interface PieChartDataPoint { category: string; value: number; fill: string; }

interface ExpandedAllocationViewProps {
  ticker: string | null;
  data: PieChartDataPoint[];
  // Removed onClose prop
}

// We need a chartConfig here too, let's reuse the structure
const chartConfig = {
  equities: { label: "Equities", color: "hsl(var(--chart-1))" },
  bonds: { label: "Bonds", color: "hsl(var(--chart-2))" },
  cash: { label: "Cash", color: "hsl(var(--chart-3))" },
  alternatives: { label: "Alternatives", color: "hsl(var(--chart-4))" },
  other: { label: "Other", color: "hsl(var(--chart-5))" }, // Add a fallback
} satisfies import("@/components/ui/chart").ChartConfig;

export function ExpandedAllocationView({ ticker, data }: ExpandedAllocationViewProps) {
  
  // Calculate total for percentage display (optional)
  // const totalValue = React.useMemo(() => {
  //   return data.reduce((acc, curr) => acc + curr.value, 0);
  // }, [data]);

  return (
    <Card className="mt-6"> 
      <CardContent className="p-6 space-y-6"> {/* Added space-y-6 */}
        {/* Chart Section */}
        <div className="w-full h-[400px]"> {/* Give outer div a height */} 
          {/* Re-add ChartContainer */}
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip 
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="category" />} 
                />
                <Pie 
                  data={data} 
                  dataKey="value" 
                  nameKey="category" 
                  innerRadius={80} 
                  outerRadius={150}
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="category" />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Allocation Breakdown Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Allocation Breakdown</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.category}>
                  <TableCell className="font-medium flex items-center">
                    {/* Optional: Add color swatch */}
                    <span 
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.fill }}
                    ></span>
                    {item.category}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Basic number formatting, could add currency later */}
                    {item.value.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 