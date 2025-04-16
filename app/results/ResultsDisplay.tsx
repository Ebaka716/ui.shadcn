"use client";

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Fragment, useRef, useLayoutEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Newspaper, Info, Briefcase, Activity, Lightbulb, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
// Import Chart Components
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Bar, BarChart } from 'recharts';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// --- Helper functions (Could potentially be moved to a separate utils file) ---

// Simulate stock data
function getStockData(ticker: string) {
  const isTicker = /^[A-Z]{1,5}$/.test(ticker);
  if (!isTicker) return null;
  
  // Simulate company name based on ticker (very basic)
  const companyName = 
    ticker === "AAPL" ? "Apple Inc." : 
    ticker === "GOOGL" ? "Alphabet Inc." : 
    ticker === "MSFT" ? "Microsoft Corporation" :
    `${ticker} Holdings Inc.`; // Generic fallback

  const price = (Math.random() * 1000 + 50).toFixed(2);
  const change = (Math.random() * 50 - 25);
  const changePercent = (change / parseFloat(price) * 100).toFixed(2);
  const volume = Math.floor(Math.random() * 10000000 + 100000).toLocaleString();
  const marketCap = (Math.random() * 2 + 0.5).toFixed(2) + 'T';
  const peRatio = (Math.random() * 30 + 10).toFixed(1);
  const dividendYield = (Math.random() * 5).toFixed(2) + '%';
  const analystRating = Math.random() > 0.6 ? 'Buy' : Math.random() > 0.3 ? 'Hold' : 'Sell';
  const ratingValue = analystRating === 'Buy' ? 85 : analystRating === 'Hold' ? 50 : 20;
  
  return { 
    ticker, 
    companyName, // Added company name
    price, 
    change: change.toFixed(2), 
    changePercent, 
    volume, 
    marketCap, 
    peRatio, 
    dividendYield, 
    analystRating, 
    ratingValue, 
    isUp: change >= 0 
  };
}

// Simulate general info
function getGeneralInfo(term: string) {
  return {
    definition: `This is a placeholder definition for "${term}". Financial data APIs would provide real information.`,
    relatedTerms: ['Term A', 'Term B', 'Term C'].filter(() => Math.random() > 0.5),
    sentiment: Math.random() > 0.6 ? 'Positive' : Math.random() > 0.3 ? 'Neutral' : 'Negative',
  };
}

// Simulate data for "myNews"
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

// --- Chart Configs & Components (Copied from original page) ---

const originalChartConfig = {
  value: { label: "Value", color: "hsl(var(--chart-1))" },
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
  equities: { label: "Equities", color: "hsl(var(--chart-1))" },
  bonds: { label: "Bonds", color: "hsl(var(--chart-2))" },
  cash: { label: "Cash", color: "hsl(var(--chart-3))" },
  alternatives: { label: "Alternatives", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const barChartData = [
  { month: "January", desktop: 186 }, { month: "February", desktop: 305 }, { month: "March", desktop: 237 },
  { month: "April", desktop: 73 }, { month: "May", desktop: 209 }, { month: "June", desktop: 214 },
];
const barChartConfig = { desktop: { label: "Desktop", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;

function BarChartComponent() {
  return (
    <Card>
      <CardHeader><CardTitle>Bar Chart - Activity</CardTitle><CardDescription>January - June 2024</CardDescription></CardHeader>
      <CardContent>
        <ChartContainer config={barChartConfig}>
          <BarChart accessibilityLayer data={barChartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /></div>
        <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter>
    </Card>
  );
}

const interactiveLineChartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 }, { date: "2024-04-02", desktop: 97, mobile: 180 }, { date: "2024-04-03", desktop: 167, mobile: 120 },
  // ... (rest of the data omitted for brevity) ...
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];
const interactiveLineChartConfig = {
  views: { label: "Page Views" },
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

function InteractiveLineChartComponent() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof interactiveLineChartConfig>("desktop");
  const total = React.useMemo(() => ({
    desktop: interactiveLineChartData.reduce((acc, curr) => acc + curr.desktop, 0),
    mobile: interactiveLineChartData.reduce((acc, curr) => acc + curr.mobile, 0),
  }), []);
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6"><CardTitle>Line Chart - Interactive</CardTitle><CardDescription>Showing total visitors for the last 3 months</CardDescription></div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof interactiveLineChartConfig;
            return (
              <button key={chart} data-active={activeChart === chart} className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6" onClick={() => setActiveChart(chart)}>
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
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
            <ChartTooltip content={<ChartTooltipContent className="w-[150px]" nameKey="views" labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />} />
            <Line dataKey={activeChart} type="monotone" stroke="black" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


// --- Type definitions ---
interface LineChartDataPoint { month: string; value: number; }
interface PieChartDataPoint { category: string; value: number; fill: string; }

// Define the structure for each history entry
interface ResultEntry {
  id: string; // Unique key
  query: string;
  stockData: ReturnType<typeof getStockData> | null;
  generalInfo: ReturnType<typeof getGeneralInfo> | null;
  myNewsData: ReturnType<typeof getMyNewsData> | null;
  // isLoading: boolean; // Removed per-entry loading state
  // error: string | null; // Removed per-entry error state
  // Include chart data specific to this entry if generated dynamically
  lineChartData: LineChartDataPoint[];
  pieChartData: PieChartDataPoint[];
}

// --- Main Display Component ---
export default function ResultsDisplay() {
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('query') || 'No query specified';

  const [resultsHistory, setResultsHistory] = useState<ResultEntry[]>([]);
  // Re-introduce isLoadingNewSection state
  const [isLoadingNewSection, setIsLoadingNewSection] = useState<boolean>(false);
  
  const processingQueryRef = useRef<string | null>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const prevHistoryLengthRef = useRef<number>(0);

  // Effect to process new queries (with delay)
  useEffect(() => {
    // Revert Check 1
    if (currentQuery === resultsHistory[resultsHistory.length - 1]?.query) {
      processingQueryRef.current = currentQuery; 
      return; 
    }
    
    // Revert Check 2 
    if (currentQuery === processingQueryRef.current) {
        return;
    }

    // Revert startProcessingWithDelay logic
    const startProcessingWithDelay = () => {
      processingQueryRef.current = currentQuery;
      setIsLoadingNewSection(true);
      const queryToProcess = currentQuery; 

      // Revert timeout logic: create final entry object inside timeout
      const timerId = setTimeout(async () => {
        const isMyNews = queryToProcess === 'myNews';
        const newStockData = !isMyNews ? getStockData(queryToProcess) : null;
        const newGeneralInfo = !isMyNews && !newStockData ? getGeneralInfo(queryToProcess) : null;
        const newMyNewsData = isMyNews ? getMyNewsData() : null;

        let newLineChartData: LineChartDataPoint[] = [];
        let newPieChartData: PieChartDataPoint[] = [];
        if (newStockData) {
          newLineChartData = [
            { month: "Jan", value: 186 }, { month: "Feb", value: 205 }, { month: "Mar", value: 237 },
            { month: "Apr", value: 225 }, { month: "May", value: 273 }, { month: "Jun", value: 301 },
          ];
          newPieChartData = [
            { category: "Equities", value: 4500, fill: "var(--color-equities)" },
            { category: "Bonds", value: 2500, fill: "var(--color-bonds)" },
            { category: "Cash", value: 800, fill: "var(--color-cash)" },
            { category: "Alternatives", value: 1200, fill: "var(--color-alternatives)" },
          ];
        }

        // Create the final entry directly
        const newEntry: ResultEntry = {
          id: uuidv4(),
          query: queryToProcess,
          stockData: newStockData,
          generalInfo: newGeneralInfo,
          myNewsData: newMyNewsData,
          lineChartData: newLineChartData,
          pieChartData: newPieChartData,
          // No isLoading/error here
        };

        // Add the final entry and stop loading indicator
        setResultsHistory(prev => [...prev, newEntry]);
        setIsLoadingNewSection(false);
        processingQueryRef.current = null; 

      }, 2000);

      return () => clearTimeout(timerId);
    };

    startProcessingWithDelay();

  // Revert dependency array
  }, [currentQuery, resultsHistory]); 

  // Re-introduce effect for scrolling on isLoadingNewSection
  useEffect(() => {
    if (isLoadingNewSection) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [isLoadingNewSection]);

  // LayoutEffect for scrolling (remains unchanged)
  useLayoutEffect(() => {
    if (resultsHistory.length > prevHistoryLengthRef.current) {
        const latestEntryId = resultsHistory[resultsHistory.length - 1]?.id;
        if (latestEntryId) {
            const targetElementId = `title-${latestEntryId}`;
            const targetElement = document.getElementById(targetElementId);
            if (targetElement) {
              targetElement.scrollIntoView({ 
                  behavior: "smooth",
                  block: "start" 
              });
            }
        }
    }
    prevHistoryLengthRef.current = resultsHistory.length;
  }, [resultsHistory]);

  // REMOVED: renderSkeleton function 
  // REMOVED: renderError function 

  return (
    <div ref={historyContainerRef} className="w-full max-w-[800px] space-y-6">
      
      {/* Revert Map logic: Render all entries directly */}
      {resultsHistory.map((entry, index) => (
        <Fragment key={entry.id}>
            {/* Render actual content directly */}
            <h2 id={`title-${entry.id}`} className="text-xl font-semibold pt-4 border-t mt-6">Results for: {entry.query}</h2>
            {entry.myNewsData && (
              <div className="space-y-6">
                 {/* ... myNewsData cards ... */}
                  {/* News Card */}
                  <Card className="shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-lg font-medium">Top News Affecting You</CardTitle><Newspaper className="h-5 w-5 text-muted-foreground" /></CardHeader>
                    <CardContent><ul className="space-y-3">{entry.myNewsData.newsItems.map(item => (
                      <li key={item.id} className="text-sm border-b pb-3 last:border-none flex justify-between items-start gap-4">
                        <div className="flex-grow">
                          <p className="font-medium">{item.headline}</p>
                          <p className="text-xs text-muted-foreground">{item.source}</p>
                        </div>
                        <Badge variant={item.impact === 'Positive' ? 'default' : item.impact === 'Negative' ? 'destructive' : 'outline'} className="ml-1 text-xs flex-shrink-0 mt-0.5">{item.impact}</Badge>
                      </li>
                    ))}</ul></CardContent>
                  </Card>
                  {/* Account/Movers Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-none">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-lg font-medium">Account Overview</CardTitle><Briefcase className="h-5 w-5 text-muted-foreground" /></CardHeader>
                      <CardContent><Table><TableHeader><TableRow><TableHead>Account</TableHead><TableHead className="text-right">Balance</TableHead><TableHead className="text-right">Change</TableHead></TableRow></TableHeader><TableBody>{entry.myNewsData.accounts.map(acc => (<TableRow key={acc.id}><TableCell className="font-medium">{acc.name}</TableCell><TableCell className="text-right">{acc.balance}</TableCell><TableCell className={`text-right text-xs ${acc.change.startsWith('+') ? 'text-green-600' : acc.change.startsWith('-') ? 'text-red-600' : 'text-muted-foreground'}`}>{acc.change}</TableCell></TableRow>))}</TableBody></Table></CardContent>
                    </Card>
                    <Card className="shadow-none">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-lg font-medium">Daily Movers</CardTitle><Activity className="h-5 w-5 text-muted-foreground" /></CardHeader>
                      <CardContent><ul className="space-y-2">{entry.myNewsData.movers.map(mover => (<li key={mover.id} className="flex justify-between items-center text-sm"><span className="font-medium">{mover.ticker}</span><Badge variant={mover.changePercent.startsWith('+') ? 'default' : 'destructive'}>{mover.changePercent}</Badge></li>))}</ul></CardContent>
                    </Card>
                  </div>
                  {/* Next Actions */}
                  <Card className="shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-lg font-medium">Suggested Next Steps</CardTitle><Lightbulb className="h-5 w-5 text-muted-foreground" /></CardHeader>
                    <CardContent><ul className="space-y-2 text-sm">{entry.myNewsData.nextActions.map(action => (<li key={action.id} className="flex items-center"><Button variant="link" size="sm" className="p-0 h-auto mr-2 text-muted-foreground hover:text-primary">{action.text}</Button></li>))}</ul></CardContent>
                  </Card>
              </div>
            )}
            {entry.stockData && (
              <div className="space-y-4"> 
                 {/* ... stockData cards ... */}
                  <Card className="shadow-none">
                    <CardContent className="p-4 space-y-4"> 
                      <div className="flex justify-between items-center">
                        <div>
                          <h1 className="text-3xl font-bold">{entry.stockData.ticker}</h1>
                          <p className="text-sm text-muted-foreground">{entry.stockData.companyName}</p>
                          {/* MOVED Analyst Rating Right Under Company Name */}
                          {entry.stockData.analystRating && (
                             <p className="flex items-center text-xs mt-1"> {/* Adjusted size and margin */} 
                              <span className="font-medium text-foreground mr-1">Analyst Rating:</span> 
                              <Badge variant={entry.stockData.analystRating === 'Buy' ? 'default' : entry.stockData.analystRating === 'Hold' ? 'secondary' : 'destructive'} className="text-xs">{entry.stockData.analystRating}</Badge>
                             </p>
                          )}
                        </div>
                        <div className={`text-right`}>
                           <p className={`text-2xl font-semibold ${entry.stockData.isUp ? 'text-green-600' : 'text-red-600'}`}>${entry.stockData.price}</p>
                           <p className={`text-sm ${entry.stockData.isUp ? 'text-green-600' : 'text-red-600'} flex items-center justify-end`}>
                             {entry.stockData.isUp ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                             {entry.stockData.change} ({entry.stockData.changePercent}%)
                           </p>
                        </div>
                      </div>
                      
                      <Separator /> 

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                         {entry.stockData.volume && <p><span className="font-medium text-foreground">Volume:</span> {entry.stockData.volume}</p>}
                         {entry.stockData.marketCap && <p><span className="font-medium text-foreground">Mkt Cap:</span> {entry.stockData.marketCap}</p>}
                         <p><span className="font-medium text-foreground">Day High:</span> ${(parseFloat(entry.stockData.price) + Math.random() * 5).toFixed(2)}</p>
                         <p><span className="font-medium text-foreground">Day Low:</span> ${(parseFloat(entry.stockData.price) - Math.random() * 5).toFixed(2)}</p>
                         <p><span className="font-medium text-foreground">52W High:</span> ${(parseFloat(entry.stockData.price) + Math.random() * 50 + 10).toFixed(2)}</p>
                         <p><span className="font-medium text-foreground">52W Low:</span> ${(parseFloat(entry.stockData.price) - Math.random() * 50 - 10).toFixed(2)}</p>
                         {entry.stockData.peRatio && <p><span className="font-medium text-foreground">P/E Ratio:</span> {entry.stockData.peRatio}</p>}
                         {entry.stockData.dividendYield && <p><span className="font-medium text-foreground">Div Yield:</span> {entry.stockData.dividendYield}</p>}
                      </div>
                    </CardContent>
                  </Card>

                  <InteractiveLineChartComponent />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {entry.lineChartData.length > 0 && ( <Card className="shadow-none"> <CardHeader><CardTitle>Price Trend (6 Months)</CardTitle><CardDescription>Showing simulated price movement.</CardDescription></CardHeader><CardContent><ChartContainer config={originalChartConfig} className="h-[200px] w-full"><LineChart data={entry.lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} /><YAxis tickLine={false} axisLine={false} tickMargin={8} /><Tooltip content={<ChartTooltipContent hideLabel indicator="line" />} /><Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={false} /></LineChart></ChartContainer></CardContent><CardFooter><div className="text-xs text-muted-foreground">Data simulated for demonstration.</div></CardFooter></Card>)}
                    <BarChartComponent /> 
                    {entry.pieChartData.length > 0 && (<Card className="shadow-none"><CardHeader><CardTitle>Asset Allocation (Simulated)</CardTitle><CardDescription>Distribution across asset classes.</CardDescription></CardHeader><CardContent className="flex items-center justify-center py-4"><ChartContainer config={originalChartConfig} className="mx-auto aspect-square h-[200px]"><PieChart><ChartTooltip content={<ChartTooltipContent hideLabel nameKey="category" />} /><Pie data={entry.pieChartData} dataKey="value" nameKey="category" innerRadius={50} outerRadius={80} strokeWidth={2}>{entry.pieChartData.map((pieEntry, index) => (<Cell key={`cell-${index}`} fill={pieEntry.fill} />))}</Pie><ChartLegend content={<ChartLegendContent nameKey="category" />} /></PieChart></ChartContainer></CardContent><CardFooter><div className="text-xs text-muted-foreground">Values represent simulated portfolio.</div></CardFooter></Card>)}
                  </div>
              </div>
            )}
            {entry.generalInfo && ( 
              <div className="space-y-4"> {/* Add space-y for spacing */} 
                 {/* ... generalInfo cards ... */}
                  {/* Original Definition Card */} 
                  <Card className="shadow-none"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-lg font-medium">Definition</CardTitle><Info className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><p className="text-sm">{entry.generalInfo.definition}</p></CardContent></Card>
                  
                  {/* Added Placeholder Cards */} 
                  <Card className="shadow-none">
                    <CardHeader><CardTitle className="text-lg font-medium">Placeholder Metric 1</CardTitle></CardHeader>
                    <CardContent>
                      <p>Value: {(Math.random() * 100).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-none">
                    <CardHeader><CardTitle className="text-lg font-medium">Placeholder Data Set 2</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                      <p>Row 1: Some filler text here.</p>
                      <Separator/>
                      <p>Row 2: Another line simulating data.</p>
                      <Separator/>
                      <p className="text-sm text-muted-foreground">Excepteur sint occaecat cupidatat non proident.</p>
                    </CardContent>
                  </Card>
                   <Card className="shadow-none">
                    <CardHeader><CardTitle className="text-lg font-medium">Filler Section 3</CardTitle></CardHeader>
                    <CardContent>
                      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
                    </CardContent>
                  </Card>
              </div>
            )}
            {/* Fallback within entry if somehow no data was generated (shouldn't happen with current logic) */}
            {!entry.myNewsData && !entry.stockData && !entry.generalInfo && ( <Card className="shadow-none"><CardHeader><CardTitle>No Results</CardTitle></CardHeader><CardContent><p>Could not fetch or generate data for &quot;{entry.query}&quot;. Please try another query.</p></CardContent></Card> )}

            {/* Add separator between entries, but not after the last one */}
            {index < resultsHistory.length - 1 && <Separator className="my-6" />}
        </Fragment>
      ))}

      {/* Replace skeleton card with spinner */}
      {isLoadingNewSection && (
        <div className="w-full pt-12 border-t mt-6 flex flex-col items-center justify-center"> 
           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
           <p className="text-sm text-muted-foreground pt-2 text-center">Loading results for: {processingQueryRef.current ?? currentQuery}...</p>
        </div>
      )}
      
    </div>
  );
} 