"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, TrendingDown, Newspaper, Info, Briefcase, Activity, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingInputBar } from '@/components/FloatingInputBar';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
// Import Chart Components
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, PieChart, Pie, Cell, Bar, BarChart } from 'recharts';
// NOTE: Select components are NOT imported in this reverted state

// --- Helper functions for simulated data ---

// Simulate stock data if query looks like a ticker (e.g., 4 uppercase letters)
function getStockData(ticker: string) {
  const isTicker = /^[A-Z]{1,5}$/.test(ticker);
  if (!isTicker) return null;

  const price = (Math.random() * 1000 + 50).toFixed(2);
  const change = (Math.random() * 50 - 25);
  const changePercent = (change / parseFloat(price) * 100).toFixed(2);
  const volume = Math.floor(Math.random() * 10000000 + 100000).toLocaleString();
  const marketCap = (Math.random() * 2 + 0.5).toFixed(2) + 'T'; // Simulate Trillions
  const peRatio = (Math.random() * 30 + 10).toFixed(1);
  const dividendYield = (Math.random() * 5).toFixed(2) + '%';
  const analystRating = Math.random() > 0.6 ? 'Buy' : Math.random() > 0.3 ? 'Hold' : 'Sell';
  const ratingValue = analystRating === 'Buy' ? 85 : analystRating === 'Hold' ? 50 : 20;

  return {
    ticker,
    price,
    change: change.toFixed(2),
    changePercent,
    volume,
    marketCap,
    peRatio,
    dividendYield,
    analystRating,
    ratingValue,
    isUp: change >= 0,
  };
}

// Simulate general info for other terms
function getGeneralInfo(term: string) {
  return {
    definition: `This is a placeholder definition for "${term}". Financial data APIs would provide real information.`,
    relatedTerms: ['Term A', 'Term B', 'Term C'].filter(() => Math.random() > 0.5),
    sentiment: Math.random() > 0.6 ? 'Positive' : Math.random() > 0.3 ? 'Neutral' : 'Negative',
  };
}

// Simulate data for the "myNews" dashboard
function getMyNewsData() {
  return {
    newsItems: [
      { id: 1, headline: "Market Reacts Positively to Fed Announcement", source: "Global Financial Times", impact: "Positive" },
      { id: 2, headline: "Tech Sector Sees Pullback Amid Profit Taking", source: "Market Watchers", impact: "Negative" },
      { id: 3, headline: "Energy Prices Surge on Geopolitical Tensions", source: "Energy News Hub", impact: "Neutral" },
    ],
    accounts: [
      { id: 'acc1', name: 'Checking', balance: `$${(Math.random() * 5000 + 1000).toFixed(2)}`, change: `+${(Math.random() * 50).toFixed(2)}` },
      { id: 'acc2', name: 'Savings', balance: `$${(Math.random() * 20000 + 5000).toFixed(2)}`, change: `+${(Math.random() * 10).toFixed(2)}` },
      { id: 'acc3', name: 'Investment Portfolio', balance: `$${(Math.random() * 150000 + 50000).toFixed(2)}`, change: `${(Math.random() * 2 - 1) > 0 ? '+' : '-'}${(Math.random() * 1500).toFixed(2)}` },
    ],
    movers: [
      { id: 'm1', ticker: 'XYZ', changePercent: `+${(Math.random() * 5 + 2).toFixed(1)}%` },
      { id: 'm2', ticker: 'ABC', changePercent: `+${(Math.random() * 3 + 1).toFixed(1)}%` },
      { id: 'm3', ticker: 'DEF', changePercent: `-${(Math.random() * 4 + 1).toFixed(1)}%` },
    ],
    nextActions: [
      { id: 'n1', text: "Review Portfolio Allocation" },
      { id: 'n2', text: "Analyze Recent Market Trends" },
    ]
  };
}

// Chart config for the original charts
const originalChartConfig = {
  value: { label: "Value", color: "hsl(var(--chart-1))" },
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
  equities: { label: "Equities", color: "hsl(var(--chart-1))" },
  bonds: { label: "Bonds", color: "hsl(var(--chart-2))" },
  cash: { label: "Cash", color: "hsl(var(--chart-3))" },
  alternatives: { label: "Alternatives", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

// --- New Bar Chart Component Definition ---
const barChartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const barChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function BarChartComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Activity</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={barChartConfig}>
          <BarChart accessibilityLayer data={barChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

// --- New Interactive Line Chart Component Definition ---
const interactiveLineChartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

const interactiveLineChartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function InteractiveLineChartComponent() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof interactiveLineChartConfig>("desktop");

  const total = React.useMemo(
    () => ({
      desktop: interactiveLineChartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: interactiveLineChartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Line Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
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
                <span className="text-xs text-muted-foreground">
                  {interactiveLineChartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={interactiveLineChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={interactiveLineChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke="black"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// --- Main Page Component ---

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get('query');
  const query = typeof rawQuery === 'string' ? decodeURIComponent(rawQuery) : 'No query specified';

  // --- State for data ---
  const [stockData, setStockData] = useState<ReturnType<typeof getStockData> | null>(null);
  const [generalInfo, setGeneralInfo] = useState<ReturnType<typeof getGeneralInfo> | null>(null);
  const [myNewsData, setMyNewsData] = useState<ReturnType<typeof getMyNewsData> | null>(null);
  // State for the original chart data structures
  const [lineChartData, setLineChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // NOTE: timeRange state is removed in this reverted state

  useEffect(() => {
    setIsLoading(true);
    const isMyNews = query === 'myNews';

    // Simulate data fetching/generation
    setMyNewsData(isMyNews ? getMyNewsData() : null);
    const currentStockData = !isMyNews ? getStockData(query) : null;
    setStockData(currentStockData);
    setGeneralInfo(!isMyNews && !currentStockData ? getGeneralInfo(query) : null);

    // Generate chart data only if stockData is present
    if (currentStockData) {
        // Original chart data generation (more realistic values)
        setLineChartData([
          { month: "Jan", value: 186 }, { month: "Feb", value: 205 }, { month: "Mar", value: 237 },
          { month: "Apr", value: 225 }, { month: "May", value: 273 }, { month: "Jun", value: 301 },
        ]);
        setPieChartData([
          { category: "Equities", value: 4500, fill: "var(--color-equities)" },
          { category: "Bonds", value: 2500, fill: "var(--color-bonds)" },
          { category: "Cash", value: 800, fill: "var(--color-cash)" },
          { category: "Alternatives", value: 1200, fill: "var(--color-alternatives)" },
        ]);
    } else {
        // Clear chart data if not applicable
        setLineChartData([]);
        setPieChartData([]);
    }

    setIsLoading(false);

  }, [query]); // Re-run effect when query changes

  // --- Render Logic ---
  return (
    <div className="relative min-h-screen">
      <main className="flex flex-col items-center p-8 pb-32 bg-muted/40">
        {/* Back Button */}
        <div className="w-full max-w-[800px] mb-8 self-start">
          <Link href="/" passHref>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
            <div className="w-full max-w-[800px] text-center py-10">
                <p className="text-muted-foreground">Loading results...</p>
            </div>
        )}

        {/* Content */}
        {!isLoading && (
            <div className="w-full max-w-[800px] space-y-6">
                {/* Layout for "myNews" Query */}
                {myNewsData && (
                    <div className="space-y-6">
                       {/* Title for this view */}
                       <h1 className="text-2xl font-semibold mb-4">Your Daily Digest</h1>

                       {/* News Card */}
                       <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-lg font-medium">Top News Affecting You</CardTitle>
                           <Newspaper className="h-5 w-5 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                           <ul className="space-y-3">
                             {myNewsData.newsItems.map(item => (
                               <li key={item.id} className="text-sm border-b pb-2 last:border-none">
                                 <p className="font-medium">{item.headline}</p>
                                 <p className="text-xs text-muted-foreground">{item.source} - Impact:
                                   <Badge variant={item.impact === 'Positive' ? 'default' : item.impact === 'Negative' ? 'destructive' : 'secondary'} className="ml-1 text-xs">
                                     {item.impact}
                                   </Badge>
                                 </p>
                               </li>
                             ))}
                           </ul>
                         </CardContent>
                       </Card>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Account Overview Card */}
                         <Card>
                           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                             <CardTitle className="text-lg font-medium">Account Overview</CardTitle>
                             <Briefcase className="h-5 w-5 text-muted-foreground" />
                           </CardHeader>
                           <CardContent>
                             <Table>
                               <TableHeader>
                                 <TableRow>
                                   <TableHead>Account</TableHead>
                                   <TableHead className="text-right">Balance</TableHead>
                                   <TableHead className="text-right">Change</TableHead>
                                 </TableRow>
                               </TableHeader>
                               <TableBody>
                                 {myNewsData.accounts.map(acc => (
                                   <TableRow key={acc.id}>
                                     <TableCell className="font-medium">{acc.name}</TableCell>
                                     <TableCell className="text-right">{acc.balance}</TableCell>
                                     <TableCell className={`text-right text-xs ${acc.change.startsWith('+') ? 'text-green-600' : acc.change.startsWith('-') ? 'text-red-600' : 'text-muted-foreground'}`}>{acc.change}</TableCell>
                                   </TableRow>
                                 ))}
                               </TableBody>
                             </Table>
                           </CardContent>
                         </Card>

                         {/* Daily Movers Card */}
                         <Card>
                           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                             <CardTitle className="text-lg font-medium">Daily Movers</CardTitle>
                             <Activity className="h-5 w-5 text-muted-foreground" />
                           </CardHeader>
                           <CardContent>
                              <ul className="space-y-2">
                                {myNewsData.movers.map(mover => (
                                  <li key={mover.id} className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{mover.ticker}</span>
                                    <Badge variant={mover.changePercent.startsWith('+') ? 'default' : 'destructive'}>{mover.changePercent}</Badge>
                                  </li>
                                ))}
                              </ul>
                           </CardContent>
                         </Card>
                       </div>

                        {/* Next Best Action Card */}
                       <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-lg font-medium">Suggested Next Steps</CardTitle>
                           <Lightbulb className="h-5 w-5 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                           <ul className="space-y-2 text-sm">
                             {myNewsData.nextActions.map(action => (
                               <li key={action.id} className="flex items-center">
                                 <Button variant="link" size="sm" className="p-0 h-auto mr-2 text-muted-foreground hover:text-primary">
                                   {action.text}
                                 </Button>
                               </li>
                             ))}
                           </ul>
                         </CardContent>
                       </Card>
                    </div>
                )}

                {/* Layout for Stock Ticker Query */}
                {stockData && (
                  <div className="space-y-6">
                    {/* Stock Header */}
                    <div className="flex items-baseline justify-between">
                      <h1 className="text-3xl font-bold">{stockData.ticker}</h1>
                      <div className={`text-xl font-semibold ${stockData.isUp ? 'text-green-600' : 'text-red-600'}`}>
                        ${stockData.price}
                        <span className="text-sm ml-2">({stockData.change} / {stockData.changePercent}%)
                          {stockData.isUp ? <TrendingUp className="inline h-4 w-4 ml-1" /> : <TrendingDown className="inline h-4 w-4 ml-1" />}
                        </span>
                      </div>
                    </div>
                    <Separator />

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {stockData.volume && (
                        <div className="flex items-center">
                          <p className="text-sm font-medium">Volume:</p>
                          <p className="text-sm ml-2">{stockData.volume}</p>
                        </div>
                      )}
                      {stockData.marketCap && (
                        <div className="flex items-center">
                          <p className="text-sm font-medium">Market Cap:</p>
                          <p className="text-sm ml-2">{stockData.marketCap}</p>
                        </div>
                      )}
                      {stockData.peRatio && (
                        <div className="flex items-center">
                          <p className="text-sm font-medium">P/E Ratio:</p>
                          <p className="text-sm ml-2">{stockData.peRatio}</p>
                        </div>
                      )}
                      {stockData.dividendYield && (
                        <div className="flex items-center">
                          <p className="text-sm font-medium">Dividend Yield:</p>
                          <p className="text-sm ml-2">{stockData.dividendYield}</p>
                        </div>
                      )}
                    </div>
                    <Separator />

                    {/* First Chart: Interactive Line Chart (Moved to Top) */}
                    <InteractiveLineChartComponent />

                    {/* Charts Grid (Now Second) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* First Chart in Grid: Line Chart */}
                      {lineChartData.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Price Trend (6 Months)</CardTitle>
                            <CardDescription>Showing simulated price movement.</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ChartContainer config={originalChartConfig} className="h-[200px] w-full">
                              <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                <Tooltip content={<ChartTooltipContent hideLabel indicator="line" />} />
                                <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={false} />
                              </LineChart>
                            </ChartContainer>
                          </CardContent>
                          <CardFooter>
                            <div className="text-xs text-muted-foreground">Data simulated for demonstration.</div>
                          </CardFooter>
                        </Card>
                      )}

                      {/* Second Chart in Grid: Bar Chart */}
                      <BarChartComponent />

                      {/* Third Chart in Grid: Pie Chart */}
                      {pieChartData.length > 0 && (
                          <Card>
                              <CardHeader>
                                  <CardTitle>Asset Allocation (Simulated)</CardTitle>
                                  <CardDescription>Distribution across asset classes.</CardDescription>
                              </CardHeader>
                              <CardContent className="flex items-center justify-center py-4">
                                  <ChartContainer config={originalChartConfig} className="mx-auto aspect-square h-[200px]">
                                      <PieChart>
                                          <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="category" />} />
                                          <Pie data={pieChartData} dataKey="value" nameKey="category" innerRadius={50} outerRadius={80} strokeWidth={2}>
                                              {pieChartData.map((entry, index) => (
                                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                              ))}
                                          </Pie>
                                          <ChartLegend content={<ChartLegendContent nameKey="category" />} />
                                      </PieChart>
                                  </ChartContainer>
                              </CardContent>
                              <CardFooter>
                                <div className="text-xs text-muted-foreground">Values represent simulated portfolio.</div>
                              </CardFooter>
                          </Card>
                      )}

                    </div>

                    {/* Analyst Rating */}
                    {stockData.analystRating && stockData.ratingValue && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Analyst Rating</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{stockData.analystRating}</span>
                            <Badge variant={stockData.analystRating === 'Buy' ? 'default' : stockData.analystRating === 'Hold' ? 'secondary' : 'destructive'}>
                              {stockData.analystRating}
                            </Badge>
                          </div>
                          <Progress value={stockData.ratingValue} aria-label={`${stockData.ratingValue}% rating`} />
                          <p className="text-xs text-muted-foreground">Based on 15 analyst reports</p>
                        </CardContent>
                      </Card>
                    )}

                  </div>
                )}

                {/* Layout for General Term Query */}
                {generalInfo && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-lg font-medium">Definition</CardTitle><Info className="h-5 w-5 text-muted-foreground" /></CardHeader>
                    <CardContent><p className="text-sm">{generalInfo.definition}</p></CardContent>
                  </Card>
                )}

                {/* Fallback if no data type matches */}
                {!isLoading && !stockData && !generalInfo && !myNewsData && (
                    <Card>
                        <CardHeader>
                            <CardTitle>No Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Could not fetch or generate data for "{query}". Please try another query.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        )}
      </main>

      {/* Floating Input Bar */}
      <FloatingInputBar />
    </div>
  );
}
