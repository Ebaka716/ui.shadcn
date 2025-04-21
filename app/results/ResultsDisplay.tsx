"use client";

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Fragment, useRef, useLayoutEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, Info, Atom } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// Import Chart Components
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { ExpandedAllocationView } from '@/components/results/ExpandedAllocationView';
// Import simulation utilities and types
import { getStockData, getGeneralInfo, getMyNewsData, type MyNewsData, type StockData, type GeneralInfoData } from '@/lib/simulationUtils';
import { StockOverviewCard } from '@/components/results/StockOverviewCard'; // Import the new component
import { DefinitionSection } from '@/components/results/DefinitionSection'; // Import DefinitionSection
import { NewsSection } from '@/components/results/NewsSection'; // Import NewsSection
import { InteractiveLineChartComponent } from '@/components/charts/InteractiveLineChart'; // Import the chart component

// --- Chart Configs & Components ---

const originalChartConfig = {
  value: { label: "Value", color: "hsl(var(--chart-1))" },
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
  equities: { label: "Equities", color: "hsl(var(--chart-1))" },
  bonds: { label: "Bonds", color: "hsl(var(--chart-2))" },
  cash: { label: "Cash", color: "hsl(var(--chart-3))" },
  alternatives: { label: "Alternatives", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

// --- Type definitions ---
interface LineChartDataPoint { month: string; value: number; }
interface PieChartDataPoint { category: string; value: number; fill: string; }
// REMOVED local type definitions for GeneralInfoData and StockData
// type GeneralInfoData = ReturnType<typeof getGeneralInfo>;
// type StockData = ReturnType<typeof getStockData>; // Use imported function's return type

// Define the structure for each history entry
interface ResultEntry {
  id: string;
  query: string;
  stockData: StockData | null; // Use StockData type imported from simulationUtils
  generalInfo: GeneralInfoData | null; // Use GeneralInfoData type imported from simulationUtils
  myNewsData: MyNewsData | null; // Use imported MyNewsData type
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
        let newStockData: StockData | null = null;
        let newGeneralInfo: GeneralInfoData | null = null;
        let newMyNewsData: MyNewsData | null = null;
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

  return (
    <div ref={historyContainerRef} className="w-full space-y-6">
      
      {resultsHistory.map((entry, index) => {
        const viewNames = [ 
          'Overview', 'Charts', 'Dividends & Earnings', 'Sentiment', 
          'Analyst Ratings', 'Comparison', 'Statistics'
        ];

        return (
          <Fragment key={entry.id}>
              {/* --- Standard H2 --- */}
              <h2 
                id={`title-${entry.id}`} 
                className="text-xl font-semibold pt-4 mt-6 flex items-center gap-2" /* Restored original classes */
              >
                <Atom className="h-5 w-5 text-muted-foreground flex-shrink-0"/>
                {entry.query}
              </h2>
              
              {/* --- Content Area (Below Sticky Header) --- */}
              {/* Definition Section - Use Component */}
              {entry.definitionData && <DefinitionSection definitionData={entry.definitionData} />}

              {/* News Section - Use Component */}
              {entry.myNewsData && <NewsSection newsData={entry.myNewsData} />}

              {/* Stock Section - Using Tabs (Non-Sticky) */}
              {entry.stockData && (
                 <Tabs 
                   value={activeStockViews[entry.id] || 'Overview'} 
                   onValueChange={(value) => setActiveStockViews(prev => ({ ...prev, [entry.id]: value }))}
                   className="w-full" // REMOVED mt-4
                 >
                   {/* Standard TabsList */}
                   <TabsList className="mb-4 w-full"> {/* REMOVED sticky classes, kept w-full, mb-4 */}
                     {viewNames.map(viewName => (
                       <TabsTrigger 
                         key={viewName} 
                         value={viewName} 
                         className="flex-1" 
                       >
                         {viewName}
                       </TabsTrigger>
                     ))}
                   </TabsList>
                   
                   {/* TabsContent */} 
                   {viewNames.map(viewName => (
                     <TabsContent key={viewName} value={viewName} className="mt-0"> {/* REMOVED mt-4, kept mt-0 */}
                       {viewName === 'Overview' ? (
                          // --- Overview Content --- 
                          <div className="space-y-4">
                            {/* Stock Overview Card - Use the new component only if data exists */}
                            {entry.stockData && <StockOverviewCard stockData={entry.stockData} />}

                            {/* Interactive Line Chart */}
                            <InteractiveLineChartComponent />
                            {/* Grid for Pie/Line Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                               {/* Pie Chart Button/Card */}
                               {entry.pieChartData.length > 0 && (
                                 <button 
                                   className="text-left w-full hover:bg-muted/50 p-0 rounded-lg transition-colors duration-150" 
                                   onClick={() => {
                                     setExpandedAllocationData(null);
                                     setExpandedAllocationTicker(null);
                                     setPendingExpansionData({ 
                                       data: entry.pieChartData, 
                                       ticker: entry.stockData?.ticker || null 
                                     });
                                     setIsLoadingExpandedView(true);
                                   }}
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
              {entry.generalInfo && (
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
              {!entry.definitionData && !entry.myNewsData && !entry.stockData && !entry.generalInfo && ( 
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