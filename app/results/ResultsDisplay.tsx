"use client";

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Fragment, useRef, useLayoutEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { ExpandedAllocationView } from '@/components/results/ExpandedAllocationView';
import { Newspaper, Info, Atom, FileText, Sheet, File as FileIcon, TrendingUp, TrendingDown, Briefcase, Activity, Lightbulb, Search } from 'lucide-react'; // Re-add the lucide icons import

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

// REMOVE unused Bar Chart data and config
// const barChartData = [
//   { month: "January", desktop: 186 }, { month: "February", desktop: 305 }, { month: "March", desktop: 237 },
//   { month: "April", desktop: 73 }, { month: "May", desktop: 209 }, { month: "June", desktop: 214 },
// ];
// const barChartConfig = { desktop: { label: "Desktop", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;

// REMOVE unused Bar Chart component definition
/*
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
            <Bar dataKey="desktop" radius={8} />
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
*/

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
            <Line dataKey={activeChart} type="monotone" stroke={`var(--color-${activeChart})`} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


// --- Type definitions ---
interface LineChartDataPoint { month: string; value: number; }
interface PieChartDataPoint { category: string; value: number; fill: string; }
// Define General Info type explicitly for clarity
type GeneralInfoData = ReturnType<typeof getGeneralInfo>;

// Define the structure for each history entry
interface ResultEntry {
  id: string; 
  query: string;
  stockData: ReturnType<typeof getStockData> | null;
  generalInfo: GeneralInfoData | null; // For non-stock, non-news, non-definition
  myNewsData: ReturnType<typeof getMyNewsData> | null;
  definitionData: GeneralInfoData | null; // <-- ADDED for definitions (reusing structure)
  lineChartData: LineChartDataPoint[];
  pieChartData: PieChartDataPoint[];
}

// --- Main Display Component ---
export default function ResultsDisplay() {
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('query') || 'No query specified';

  const [resultsHistory, setResultsHistory] = useState<ResultEntry[]>([]);
  const [isLoadingNewSection, setIsLoadingNewSection] = useState<boolean>(false);
  const [expandedAllocationData, setExpandedAllocationData] = useState<PieChartDataPoint[] | null>(null);
  const [expandedAllocationTicker, setExpandedAllocationTicker] = useState<string | null>(null);
  const [isLoadingExpandedView, setIsLoadingExpandedView] = useState<boolean>(false);
  const [pendingExpansionData, setPendingExpansionData] = useState<{ data: PieChartDataPoint[], ticker: string | null } | null>(null);
  const [activeStockViews, setActiveStockViews] = useState<{ [entryId: string]: string }>({});

  const processingQueryRef = useRef<string | null>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const prevHistoryLengthRef = useRef<number>(0);
  const loaderRef = useRef<HTMLDivElement>(null);
  const expandedLoaderRef = useRef<HTMLDivElement>(null);

  // Effect to process new queries
  useEffect(() => {
    if (currentQuery === resultsHistory[resultsHistory.length - 1]?.query) {
      processingQueryRef.current = currentQuery; 
      return; 
    }
    if (currentQuery === processingQueryRef.current) {
        return;
    }

    // --- Process Query --- 
    const startProcessingWithDelay = () => {
      processingQueryRef.current = currentQuery;
      setIsLoadingNewSection(true);
      const queryToProcess = currentQuery; 
      const lowerQuery = queryToProcess.toLowerCase();

      // --- Determine Query Type and Data Key --- 
      let queryType: 'definition' | 'stock' | 'news' | 'general' = 'general';
      let dataQueryKey = queryToProcess; 
      let termForDefinition = '';

      const definitionPrefixes = ['explain ', 'define ', 'what is ', 'what are '];
      const definitionMatch = definitionPrefixes.find(prefix => lowerQuery.startsWith(prefix));

      if (definitionMatch) {
        queryType = 'definition';
        termForDefinition = queryToProcess.substring(definitionMatch.length).trim();
        // Use the extracted term for potential general info lookup if needed
        dataQueryKey = termForDefinition; 
      } else if (lowerQuery.includes('news')) {
        queryType = 'news';
        dataQueryKey = 'myNews'; // Specific key for news function
      } else if (lowerQuery.includes('apple') || lowerQuery.includes('aapl')) {
        queryType = 'stock';
        dataQueryKey = 'AAPL';
      } else if (lowerQuery.includes('google') || lowerQuery.includes('googl')) {
        queryType = 'stock';
        dataQueryKey = 'GOOGL';
      } else if (lowerQuery.includes('microsoft') || lowerQuery.includes('msft')) {
        queryType = 'stock';
        dataQueryKey = 'MSFT';
      } else {
        // Check if it *looks* like a ticker even if not explicitly mapped
        const isTickerLike = /^[A-Z]{1,5}$/.test(queryToProcess);
        if (isTickerLike) {
          queryType = 'stock'; 
          dataQueryKey = queryToProcess; // Try the query directly as a ticker
        }
        // Otherwise, it remains 'general' with dataQueryKey = queryToProcess
      }
      // --- End Determine Query Type ---

      const timerId = setTimeout(async (originalQueryForTitle) => {
        // --- Fetch Data based on Type ---
        let newStockData: ReturnType<typeof getStockData> | null = null;
        let newGeneralInfo: GeneralInfoData | null = null;
        let newMyNewsData: ReturnType<typeof getMyNewsData> | null = null;
        let newDefinitionData: GeneralInfoData | null = null;

        if (queryType === 'definition') {
          // Use getGeneralInfo to simulate getting definition data
          newDefinitionData = getGeneralInfo(termForDefinition || dataQueryKey);
        } else if (queryType === 'news') {
          newMyNewsData = getMyNewsData();
        } else if (queryType === 'stock') {
          newStockData = getStockData(dataQueryKey);
          // If stock lookup fails, maybe fall back to general info?
          if (!newStockData) {
            newGeneralInfo = getGeneralInfo(dataQueryKey); 
          }
        } else { // queryType === 'general'
          newGeneralInfo = getGeneralInfo(dataQueryKey);
        }
        // --- End Fetch Data ---
        
        // --- Chart Data (Only for Stock) ---
        let newLineChartData: LineChartDataPoint[] = [];
        let newPieChartData: PieChartDataPoint[] = [];
        if (newStockData) { // Only generate charts if we have stock data
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
        // --- End Chart Data ---

        const newEntry: ResultEntry = {
          id: uuidv4(),
          query: originalQueryForTitle, 
          stockData: newStockData,
          generalInfo: newGeneralInfo,
          myNewsData: newMyNewsData,
          definitionData: newDefinitionData, // <-- Include definition data
          lineChartData: newLineChartData,
          pieChartData: newPieChartData,
        };

        setResultsHistory(prev => [...prev, newEntry]);
        // --- Initialize active view for the new entry ---
        if (newStockData) {
          setActiveStockViews(prev => ({ ...prev, [newEntry.id]: 'Overview' }));
        }
        // --- End Initialization ---
        setIsLoadingNewSection(false);
        processingQueryRef.current = null; 

      }, 2000, queryToProcess);

      return () => clearTimeout(timerId);
    };

    startProcessingWithDelay();

  }, [currentQuery, resultsHistory]); 

  // Re-introduce effect for scrolling, but target the loader
  useEffect(() => {
    if (isLoadingNewSection && loaderRef.current) {
      loaderRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center' 
      });
    }
  }, [isLoadingNewSection]);

  // LayoutEffect for scrolling - ONLY for new history entries
  useLayoutEffect(() => {
    // Scroll to new result entry
    if (resultsHistory.length > prevHistoryLengthRef.current) {
      const latestEntryId = resultsHistory[resultsHistory.length - 1]?.id;
      if (latestEntryId) {
        const targetElementId = `title-${latestEntryId}`;
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
          // Use 'start' block alignment for new results
          targetElement.scrollIntoView({ 
              behavior: "smooth",
              block: "start" 
          });
        }
      }
    } 
    // Removed the else if block for expanded view
    
    prevHistoryLengthRef.current = resultsHistory.length;
  }, [resultsHistory]); // Only depend on resultsHistory

  // Effect to handle loading and displaying the expanded view
  useEffect(() => {
    if (isLoadingExpandedView && pendingExpansionData) {
      // Scroll loader into view
      expandedLoaderRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      console.log("[Expanded View] Loader scrolled into view.");

      // Simulate loading delay
      const timerId = setTimeout(() => {
        // Store ticker locally before clearing pending data
        const tickerToScrollTo = pendingExpansionData.ticker;
        console.log("[Expanded View] Ticker to scroll to:", tickerToScrollTo);
        
        // Set the actual data to render the component
        setExpandedAllocationData(pendingExpansionData.data);
        setExpandedAllocationTicker(pendingExpansionData.ticker);
        setIsLoadingExpandedView(false);
        setPendingExpansionData(null);

        // Now scroll the NEWLY RENDERED title into view
        // Use requestAnimationFrame to ensure element exists after state update
        requestAnimationFrame(() => {
          console.log("[Expanded View] requestAnimationFrame fired."); 
          // Add a small timeout to ensure DOM update completes
          setTimeout(() => {
            console.log("[Expanded View] setTimeout inside rAF fired."); // New log
            if (tickerToScrollTo) {
              const targetElementId = `title-expanded-allocation-${tickerToScrollTo}`; 
              console.log("[Expanded View] Target Element ID:", targetElementId);
              const targetElement = document.getElementById(targetElementId);
              console.log("[Expanded View] Target Element Found:", targetElement);
              targetElement?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' // Match new result scroll
              });
            } else {
               console.error("[Expanded View] No ticker found to scroll to!");
            }
          }, 10); // 10ms delay
        });

      }, 1500); // Simulate 1.5 second load

      return () => clearTimeout(timerId); // Cleanup timer
    }
  }, [isLoadingExpandedView, pendingExpansionData]);

  const handleSetActiveView = (entryId: string, view: string) => {
    setActiveStockViews(prev => ({ ...prev, [entryId]: view }));
  };
  
  // Restore the logic inside handleExpandAllocation
  const handleExpandAllocation = (data: PieChartDataPoint[], ticker: string | null) => {
    setExpandedAllocationData(null); // Clear previous data first
    setExpandedAllocationTicker(null); 
    setPendingExpansionData({ data, ticker }); // Set pending data
    setIsLoadingExpandedView(true); // Start loading state
    // The useEffect hook depending on isLoadingExpandedView will handle the rest
  };

  return (
    <div ref={historyContainerRef} className="w-full space-y-6">
      
      {resultsHistory.map((entry, index) => {
        const viewNames = [ 
          'Overview', 'Charts', 'Dividends & Earnings', 'Sentiment', 
          'Analyst Ratings', 'Comparison', 'Statistics'
        ];

        // --- Logic to extract attachments and query text for context badge(s) ---
        interface AttachmentInfo {
          name: string;
          type: string;
        }
        let attachments: AttachmentInfo[] = [];
        let displayQuery = entry.query;

        const questionPrefix = "Question about ";
        const analyzePrefix = "Analyze file: ";

        // Log the incoming query and the prefixes for debugging
        console.log(`[ResultsDisplay] Rendering Entry ID: ${entry.id}`);
        console.log(`  Original Query: "${entry.query}"`);
        console.log(`  Starts with Question Prefix? ${entry.query.startsWith(questionPrefix)}`);
        console.log(`  Starts with Analyze Prefix? ${entry.query.startsWith(analyzePrefix)}`);

        let fileInfoString = "";
        if (entry.query.startsWith(questionPrefix)) {
          const parts = entry.query.substring(questionPrefix.length).split(': ');
          if (parts.length >= 2) {
            fileInfoString = parts[0];
            displayQuery = parts.slice(1).join(': '); // Get the rest as the query
          }
        } else if (entry.query.startsWith(analyzePrefix)) {
          fileInfoString = entry.query.substring(analyzePrefix.length);
          // Keep displayQuery as is for now, might need refinement later if only file is present
          // displayQuery = `Analysis of [filename]`; // Placeholder if needed
        }

        // Parse the fileInfoString (e.g., "filename.pdf|application/pdf")
        if (fileInfoString) {
          const fileParts = fileInfoString.split('|');
          if (fileParts.length === 2) {
            attachments = [{ name: fileParts[0], type: fileParts[1] }];
            // If it was an analyze query with no text, set a default display query
            if (entry.query.startsWith(analyzePrefix) && displayQuery === entry.query) {
                 displayQuery = `Analysis of ${fileParts[0]}`;
            }
          } else {
            // Fallback if parsing fails (e.g., filename has '|')
            attachments = [{ name: fileInfoString, type: '' }]; // Store name, unknown type
             if (entry.query.startsWith(analyzePrefix) && displayQuery === entry.query) {
                 displayQuery = `Analysis of ${fileInfoString}`;
            }
          }
        }

        // Log the result of parsing
        console.log(`  Extracted Attachments: ${JSON.stringify(attachments)}`);
        console.log(`  Display Query: "${displayQuery}"`);
        // --- End parsing logic ---

        // --- Helper function to get icon based on MIME type ---
        const getFileIcon = (mimeType: string) => {
          if (mimeType.startsWith('text/csv')) {
            return <Sheet className="h-3.5 w-3.5 mr-1 flex-shrink-0" />;
          }
          if (mimeType.startsWith('application/pdf') || mimeType.startsWith('text/') || mimeType.includes('document')) {
            return <FileText className="h-3.5 w-3.5 mr-1 flex-shrink-0" />;
          }
          return <FileIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />; // Default icon
        };

        const searchLinks = [
          { title: "Investopedia: Price-to-Earnings (P/E) Ratio: Definition and How to Use It", url: "#", description: "Learn the definition of the P/E ratio, how it is calculated, its limitations, and different variations like forward P/E..." },
          { title: "Wikipedia: P/E ratio", url: "#", description: "The price–earnings ratio, also known as the P/E ratio, P/E, or PER, is the ratio of a company's share (stock) price to the company's earnings per share..." },
          { title: "Corporate Finance Institute: P/E Ratio - Formula, Examples and Guide to Price-to-Earnings Ratio", url: "#", description: "The Price-to-Earnings (P/E) ratio is a valuation ratio that compares a company's stock price to its earnings per share..." },
          { title: "Search Google for: P/E Ratio explained", url: "#", description: "See more results from across the web." },
        ];

        return (
          <Fragment key={entry.id}>
              {/* --- Title Section --- */}
              <div className="mt-6"> 
                {/* Main Title */} 
                <h2 
                  id={`title-${entry.id}`} 
                  className="text-xl font-semibold flex items-center gap-2"
                >
                  <Atom className="h-5 w-5 text-muted-foreground flex-shrink-0"/>
                  {displayQuery} {/* Display the extracted query */}
                </h2>
                {/* Attachment Context Badges (Below Title) */}
                {attachments.length > 0 && (
                  <div className="mt-1 pl-7 flex flex-wrap gap-1"> {/* Indent to align with title text, adjusted margin */}
                    {attachments.map((attachment, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-normal inline-flex items-center px-2.5 py-0.5">
                        {getFileIcon(attachment.type)}
                        <span className="truncate">{attachment.name}</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {/* --- Content Area (Below Sticky Header) --- */}

              {/* == START: ADDED P/E Ratio Specific View == */}
              {entry.query === 'Explain P/E Ratio' && (
                  <div className="mt-4 space-y-6"> 
                    {/* Definition Card - Add shadow-none */}
                    <Card className="border shadow-none"> 
                      <CardHeader className="pb-2">
                         <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-muted-foreground" />
                            Understanding the P/E Ratio
                         </CardTitle>
                      </CardHeader>
                       <CardContent className="p-6 pt-1 prose prose-sm max-w-none dark:prose-invert">
                         {/* Add mt-4 to subsequent headings/lists for spacing */}
                         <h4>What it is:</h4>
                         <p>
                           The Price-to-Earnings (P/E) ratio is a widely used valuation metric that compares a company's current share price to its earnings per share (EPS).<sup>[1]</sup> It essentially indicates how much investors are willing to pay for each dollar of a company's earnings.
                         </p>
                         <h4 className="mt-4">Calculation:</h4>
                         <p>
                           It&apos;s calculated simply as:
                           <br />
                           <strong>P/E Ratio = Market Value per Share / Earnings Per Share (EPS)</strong>
                           <br />
                           Earnings Per Share (EPS) is typically calculated over the trailing twelve months (TTM).<sup>[2]</sup>
                         </p>
                         <h4 className="mt-4">Interpretation:</h4>
                         <ul className="mt-2"> {/* Add margin to list too */} 
                           <li>A <strong>high P/E ratio</strong> might suggest that investors expect higher earnings growth in the future compared to companies with a lower P/E ratio. It could also indicate that a stock is overvalued.<sup>[1]</sup></li>
                           {/* eslint-disable-next-line react/no-unescaped-entities */}
                           <li>A <strong>low P/E ratio</strong> might indicate that a company is currently undervalued or that investors have lower expectations for its future growth prospects.<sup>[3]</sup></li>
                           <li>Comparing a company&apos;s P/E ratio to its historical levels or to industry peers provides more context than looking at the number in isolation.<sup>[2]</sup></li>
                         </ul>
                         <h4 className="mt-4">Limitations:</h4>
                         <ul className="mt-2"> {/* Add margin to list too */} 
                           <li>P/E ratios can be misleading if earnings are negative or highly volatile.</li>
                           <li>Accounting practices can affect reported earnings, impacting the ratio.</li>
                           <li>It doesn&apos;t account for debt levels or cash flow directly.<sup>[3]</sup></li>
                         </ul>
                       </CardContent>
                       {/* Restyle CardFooter for source cards and add heading */}
                       <CardFooter className="flex flex-wrap gap-2 pt-4 border-t bg-muted/50 p-4">
                         {/* ADDED: Small heading for sources */}
                         <p className="w-full text-xs font-medium text-muted-foreground mb-2">Sources:</p>
                         {[ 
                           { id: 1, text: "Investopedia - P/E Ratio Explained" },
                           { id: 2, text: "Corporate Finance Institute - Price-to-Earnings Ratio" },
                           { id: 3, text: "Wall Street Journal - Guide to Stock Valuation" }
                         ].map(source => (
                           <Card key={source.id} className="p-2 shadow-none border bg-card text-xs">
                             <p><sup>[{source.id}]</sup> {source.text}</p>
                           </Card>
                         ))}
                       </CardFooter>
                    </Card>
            
                    {/* Search Links Card - Add shadow-none */}
                    <Card className="border shadow-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                          <Search className="h-4 w-4 text-muted-foreground"/>
                          Further Reading & Resources
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {searchLinks.map((link, index) => (
                            <li key={index}>
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="block group">
                                <p className="text-sm font-medium text-blue-600 group-hover:underline">{link.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
              )}
              {/* == END: ADDED P/E Ratio Specific View == */}

              {/* Definition Section */}
              {entry.definitionData && entry.query !== 'Explain P/E Ratio' && (
                 <div className="mt-4"> 
                   <Card className="shadow-none">
                     <CardHeader>
                       <CardTitle>Definition</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <div className="text-base space-y-4">
                         <p>{entry.definitionData.definition}</p>
                         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                         <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                       </div>
                     </CardContent>
                   </Card>
                   {/* Add placeholder action cards (could be dynamic later) */}
                   <Card className="shadow-none">
                     <CardHeader><CardTitle>Analyze Stocks by P/E</CardTitle></CardHeader>
                     <CardContent><Button variant="outline" size="sm">Go to Screener</Button></CardContent>
                   </Card>
                   <Card className="shadow-none">
                     <CardHeader><CardTitle>Compare Industry Ratios</CardTitle></CardHeader>
                     <CardContent><Button variant="outline" size="sm">View Comparison</Button></CardContent>
                   </Card>
                   {/* Added More Placeholder Action Cards */}
                    <Card className="shadow-none">
                     <CardHeader><CardTitle>Related Concepts</CardTitle></CardHeader>
                     <CardContent className="space-y-2">
                       <Button variant="link" className="p-0 h-auto text-sm">Price-to-Book (P/B) Ratio</Button><br/>
                       <Button variant="link" className="p-0 h-auto text-sm">Dividend Yield</Button>
                      </CardContent>
                   </Card>
                   <Card className="shadow-none">
                     <CardHeader><CardTitle>Historical Trend</CardTitle></CardHeader>
                     <CardContent><p className="text-sm text-muted-foreground">View the historical trend of this metric for relevant entities.</p><Button variant="outline" size="sm" className="mt-2">View Trend</Button></CardContent>
                   </Card>
                 </div>
              )}

              {/* News Section */}
              {entry.myNewsData && entry.query !== 'Explain P/E Ratio' && (
                 <div className="mt-4 space-y-6"> {/* Add space-y back */}
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
                   <Card className="shadow-none">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-lg font-medium">Suggested Next Steps</CardTitle><Lightbulb className="h-5 w-5 text-muted-foreground" /></CardHeader>
                     <CardContent><ul className="space-y-2 text-sm">{entry.myNewsData.nextActions.map(action => (<li key={action.id} className="flex items-center"><Button variant="link" size="sm" className="p-0 h-auto mr-2 text-muted-foreground hover:text-primary">{action.text}</Button></li>))}</ul></CardContent>
                   </Card>
                   {/* ADDED: Placeholder Sector News Card */}
                   <Card className="shadow-none">
                     <CardHeader><CardTitle>Sector News</CardTitle></CardHeader>
                     <CardContent>
                       <ul className="space-y-2">
                         <li className="text-sm">Technology sector shows signs of consolidation.</li>
                         <li className="text-sm">Renewable energy investments continue to grow.</li>
                       </ul>
                       <Button variant="link" size="sm" className="p-0 h-auto mt-2">View More Sector News</Button>
                     </CardContent>
                   </Card>
                 </div>
              )}

              {/* Stock Section - Using Tabs (Non-Sticky) */}
              {entry.stockData && entry.query !== 'Explain P/E Ratio' && (
                 <Tabs 
                   value={activeStockViews[entry.id] || 'Overview'} 
                   onValueChange={(view: string) => handleSetActiveView(entry.id, view)}
                   className="w-full" 
                 >
                   {/* Wrapper for horizontal scrolling with hidden scrollbar */}
                   <div className="w-full overflow-x-auto whitespace-nowrap mb-4 scrollbar-hide"> 
                     <TabsList className="inline-flex h-auto p-1"> {/* Use inline-flex */} 
                       {viewNames.map(viewName => (
                         <TabsTrigger
                           key={viewName} 
                           value={viewName} 
                           className="px-3 py-1.5 text-sm" // Adjusted padding/size
                         >
                           {viewName}
                         </TabsTrigger>
                       ))}
                     </TabsList>
                   </div>

                   {/* TabsContent */}
                   {viewNames.map(viewName => (
                     <TabsContent key={viewName} value={viewName} className="mt-0">
                       {viewName === 'Overview' ? (
                          // --- Overview Content --- 
                          <div className="space-y-4">
                            {/* Stock Overview Card */}
                            <Card className="shadow-none">
                               <CardContent className="px-6 py-4 space-y-4">
                                 {/* Ticker, Price, Stats */}
                                 <div className="flex justify-between items-center">
                                   {/* ... Ticker/Name/Rating ... */}
                                   <div>
                                    <h1 className="text-3xl font-bold">{entry.stockData!.ticker}</h1>
                                    <p className="text-sm text-muted-foreground">{entry.stockData!.companyName}</p>
                                    {entry.stockData!.analystRating && (
                                       <p className="flex items-center text-xs mt-1"> 
                                        <span className="font-medium text-foreground mr-1">Analyst Rating:</span> 
                                        <Badge variant={entry.stockData!.analystRating === 'Buy' ? 'default' : entry.stockData!.analystRating === 'Hold' ? 'secondary' : 'destructive'} className="text-xs">{entry.stockData!.analystRating}</Badge>
                                       </p>
                                    )}
                                   </div>
                                   {/* ... Price/Change ... */}
                                   <div className={`text-right`}>
                                      <p className={`text-2xl font-semibold ${entry.stockData!.isUp ? 'text-green-600' : 'text-red-600'}`}>${entry.stockData!.price}</p>
                                      <p className={`text-sm ${entry.stockData!.isUp ? 'text-green-600' : 'text-red-600'} flex items-center justify-end`}>
                                        {entry.stockData!.isUp ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                                        {entry.stockData!.change} ({entry.stockData!.changePercent}%)
                                      </p>
                                   </div>
                                 </div>
                                 <Separator /> 
                                 {/* Details Row */}
                                 <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                    {entry.stockData!.volume && <p><span className="font-medium text-foreground">Volume:</span> {entry.stockData!.volume}</p>}
                                    {entry.stockData!.marketCap && <p><span className="font-medium text-foreground">Mkt Cap:</span> {entry.stockData!.marketCap}</p>}
                                    {entry.stockData!.peRatio && <p><span className="font-medium text-foreground">P/E Ratio:</span> {entry.stockData!.peRatio}</p>}
                                    {entry.stockData!.dividendYield && <p><span className="font-medium text-foreground">Div Yield:</span> {entry.stockData!.dividendYield}</p>}
                                    <p><span className="font-medium text-foreground">Prev Close:</span> <span className="italic">N/A</span></p>
                                    <p><span className="font-medium text-foreground">Day&apos;s Range:</span> <span className="italic">N/A</span></p>
                                    <p><span className="font-medium text-foreground">52wk High:</span> <span className="italic">N/A</span></p>
                                    <p><span className="font-medium text-foreground">52wk Low:</span> <span className="italic">N/A</span></p>
                                 </div>
                               </CardContent>
                            </Card>
                            {/* Interactive Line Chart */}
                            <InteractiveLineChartComponent />
                            {/* Grid for Pie/Line Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                               {/* Pie Chart Button/Card - Fix onClick */}
                               {entry.pieChartData.length > 0 && (
                                 <button 
                                   className="text-left w-full hover:bg-muted/50 p-0 rounded-lg transition-colors duration-150" 
                                   onClick={() => handleExpandAllocation(entry.pieChartData, entry.stockData?.ticker || null)}
                                 >
                                   <Card className="shadow-none cursor-pointer">
                                      <CardHeader><CardTitle>Asset Allocation (Simulated)</CardTitle><CardDescription>Distribution across asset classes.</CardDescription></CardHeader>
                                      <CardContent className="flex items-center justify-center py-4">
                                        <ChartContainer config={originalChartConfig} className="mx-auto aspect-square h-[200px]">
                                          <PieChart>
                                            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="category" />} />
                                            <Pie data={entry.pieChartData} dataKey="value" nameKey="category" innerRadius={50} outerRadius={80} strokeWidth={2}>{entry.pieChartData.map((pieEntry, index) => (<Cell key={`cell-${index}`} fill={pieEntry.fill} />))}</Pie>
                                            <ChartLegend content={<ChartLegendContent nameKey="category" />} />
                                          </PieChart>
                                        </ChartContainer>
                                      </CardContent>
                                      <CardFooter><div className="text-xs text-muted-foreground">Values represent simulated portfolio.</div></CardFooter>
                                   </Card>
                                 </button>
                               )}
                              {entry.lineChartData.length > 0 && (
                                <Card className="shadow-none"> 
                                  <CardHeader><CardTitle>Price Trend (6 Months)</CardTitle><CardDescription>Showing simulated price movement.</CardDescription></CardHeader>
                                  <CardContent><ChartContainer config={originalChartConfig} className="h-[200px] w-full"><LineChart data={entry.lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} /><YAxis tickLine={false} axisLine={false} tickMargin={8} /><Tooltip content={<ChartTooltipContent hideLabel indicator="line" />} /><Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={false} /></LineChart></ChartContainer></CardContent>
                                  <CardFooter><div className="text-xs text-muted-foreground">Data simulated for demonstration.</div></CardFooter>
                                </Card>
                              )}
                            </div>
                            {/* Related News Card */}
                            <Card className="shadow-none mt-6">
                               <CardHeader>
                                 <CardTitle className="flex items-center gap-2">
                                   <Newspaper className="h-5 w-5 text-muted-foreground"/>
                                   Related News
                                 </CardTitle>
                               </CardHeader>
                               <CardContent>
                                 <ul className="space-y-3">
                                   <li className="text-sm border-b pb-3 last:border-none">
                                     <p className="font-medium">{entry.stockData!.ticker} Announces Quarterly Earnings Beat</p>
                                     <p className="text-xs text-muted-foreground">Source Name - 2 hours ago</p>
                                   </li>
                                   <li className="text-sm border-b pb-3 last:border-none">
                                     <p className="font-medium">Analyst Upgrades {entry.stockData!.ticker} to Strong Buy</p>
                                     <p className="text-xs text-muted-foreground">Financial News Today - 5 hours ago</p>
                                   </li>
                                   <li className="text-sm border-b pb-3 last:border-none">
                                     <p className="font-medium">New Product Launch Boosts {entry.stockData!.ticker} Outlook</p>
                                     <p className="text-xs text-muted-foreground">Tech Chronicle - Yesterday</p>
                                   </li>
                                 </ul>
                               </CardContent>
                               <CardFooter>
                                 <Button variant="link" size="sm" className="p-0 h-auto">View More News</Button>
                               </CardFooter>
                             </Card>
                          </div>
                       ) : viewName === 'Charts' ? (
                          // --- Charts Placeholder --- 
                          <Card className="shadow-none">
                            <CardHeader><CardTitle>Detailed Chart Analysis</CardTitle></CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-4">Interactive charts with multiple timeframes and technical indicators will be displayed here.</p>
                              {/* Simulate a chart area */}
                              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                <p className="text-sm text-muted-foreground">[Chart Placeholder]</p>
                              </div>
                            </CardContent>
                          </Card>
                       ) : viewName === 'Dividends & Earnings' ? (
                          // --- Dividends & Earnings Placeholder --- 
                          <div className="space-y-4">
                            <Card className="shadow-none">
                              <CardHeader><CardTitle>Upcoming Earnings</CardTitle></CardHeader>
                              <CardContent>
                                <p className="text-sm"><span className="font-medium">Expected Date:</span> Aug 15, 2024 (Estimated)</p>
                                <p className="text-sm text-muted-foreground">Past performance is not indicative of future results.</p>
                              </CardContent>
                            </Card>
                            <Card className="shadow-none">
                              <CardHeader><CardTitle>Dividend History</CardTitle></CardHeader>
                              <CardContent>
                                <p className="text-sm"><span className="font-medium">Last Dividend:</span> $0.25 per share</p>
                                <p className="text-sm"><span className="font-medium">Ex-Dividend Date:</span> Jul 30, 2024</p>
                                <p className="text-sm"><span className="font-medium">Yield (TTM):</span> {entry.stockData?.dividendYield || 'N/A'}</p>
                                <Button variant="link" size="sm" className="p-0 h-auto mt-2">View Full History</Button>
                              </CardContent>
                            </Card>
                          </div>
                       ) : viewName === 'Sentiment' ? (
                          // --- Sentiment Placeholder --- 
                          <Card className="shadow-none">
                            <CardHeader><CardTitle>Market Sentiment Analysis</CardTitle></CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-around gap-4">
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground mb-1">News Sentiment</p>
                                  <p className="text-2xl font-semibold text-green-600">78</p>
                                  <p className="text-xs text-muted-foreground">(Positive)</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground mb-1">Social Media Buzz</p>
                                  <p className="text-2xl font-semibold text-orange-500">Moderate</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground mb-1">Analyst Consensus</p>
                                  <p className="text-2xl font-semibold">{entry.stockData?.analystRating || 'N/A'}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                       ) : (
                          // --- Generic Placeholder Content for other views --- 
                          <Card className="shadow-none">
                            <CardHeader><CardTitle>{viewName} View</CardTitle></CardHeader>
                            <CardContent>
                              <p>Content for the {viewName} view will be displayed here.</p>
                            </CardContent>
                          </Card>
                       )}
                     </TabsContent>
                  ))}
                </Tabs>
              )}

              {/* General Info Section */}
              {entry.generalInfo && !entry.stockData && !entry.myNewsData && !entry.definitionData && entry.query !== 'Explain P/E Ratio' && (
                <div className="mt-4 space-y-4"> {/* Add space-y back */}
                   <Card className="shadow-none"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-lg font-medium">Definition</CardTitle><Info className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><p className="text-sm">{entry.generalInfo.definition}</p></CardContent></Card>
                   <Card className="shadow-none">
                     <CardHeader><CardTitle>Related Topics</CardTitle></CardHeader>
                     <CardContent className="space-y-1">
                        <Button variant="link" className="p-0 h-auto text-sm">Topic X</Button><br/>
                        <Button variant="link" className="p-0 h-auto text-sm">Concept Y</Button><br/>
                        <Button variant="link" className="p-0 h-auto text-sm">Term Z</Button>
                     </CardContent>
                   </Card>
                </div>
              )}

              {/* Fallback Section */}
              {!entry.stockData && !entry.myNewsData && !entry.definitionData && !entry.generalInfo && entry.query !== 'Explain P/E Ratio' && (
                 <div className="mt-4"> 
                   <Card className="shadow-none"> 
                     <CardHeader><CardTitle>No Specific Results</CardTitle></CardHeader><CardContent><p>Could not generate specific results for &quot;{entry.query}&quot;. Please try rephrasing.</p></CardContent></Card> 
                 </div>
              )}

              {index < resultsHistory.length - 1 && <Separator className="my-6" />}
          </Fragment>
        );
      })}

      {/* Render Expanded View Section Conditionally */}
      {expandedAllocationData && expandedAllocationTicker && (
        <Fragment> 
          <h2 
            id={`title-expanded-allocation-${expandedAllocationTicker}`} 
            className="text-xl font-semibold pt-4 mt-6 flex items-center gap-2"
          >
            <Atom className="h-5 w-5 text-muted-foreground flex-shrink-0"/>
            Asset Allocation Details ({expandedAllocationTicker})
          </h2>
          <ExpandedAllocationView 
            data={expandedAllocationData} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Rebalance Options</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Consider rebalancing if your allocation drifts significantly.</p>
                <Button variant="outline">Analyze Drift</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Explore Alternatives</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Learn more about alternative investments to potentially diversify.</p>
                <Button variant="outline">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </Fragment>
      )}

      {/* Loading Indicators */}
      {isLoadingNewSection && (
        <div ref={loaderRef} className="w-full pt-12 mt-6 flex flex-col items-center justify-center">
           <Atom className="h-8 w-8 animate-spin text-muted-foreground" />
           <p className="text-sm text-muted-foreground pt-2 text-center">Loading results for: {processingQueryRef.current ?? currentQuery}...</p>
        </div>
      )}

      {isLoadingExpandedView && (
        <div ref={expandedLoaderRef} className="w-full pt-12 mt-6 flex flex-col items-center justify-center">
           <Atom className="h-8 w-8 animate-spin text-muted-foreground" />
           <p className="text-sm text-muted-foreground pt-2 text-center">Loading expanded view...</p>
        </div>
      )}
    </div>
  );
} 