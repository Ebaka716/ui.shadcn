import Link from 'next/link';
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

// --- Component ---

// Restore the props definition
export default function ResultsPage({ 
  searchParams 
}: { 
  searchParams?: { [key: string]: string | string[] | undefined } 
}) {
  
  // Restore searchParams usage
  const rawQuery = searchParams?.query;
  const query = typeof rawQuery === 'string' ? decodeURIComponent(rawQuery) : 'No query specified';
  // const query = "Test Query (Debug)"; // Removed hardcoded value

  // Restore dynamic check for isMyNewsQuery 
  const isMyNewsQuery = query === 'myNews'; 
  // const isMyNewsQuery = false; // Removed hardcoded value
  const myNewsData = isMyNewsQuery ? getMyNewsData() : null;
  const stockData = !isMyNewsQuery ? getStockData(query) : null;
  const generalInfo = !isMyNewsQuery && !stockData ? getGeneralInfo(query) : null;

  return (
    <div className="relative min-h-screen">
      <main className="flex flex-col items-center p-8 pb-32 bg-muted/40"> {/* Increased pb */}
        {/* Back Button */}
        <div className="w-full max-w-[800px] mb-8 self-start">
          <Link href="/" passHref>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          </Link>
        </div>

        {/* --- Conditional Rendering Based on Query --- */}
        
        {/* Layout for "myNews" Query - Will not render with hardcoded query */}
        {isMyNewsQuery && myNewsData && (
          <div className="w-full max-w-[800px] space-y-6">
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
                <CardTitle className="text-lg font-medium">Next Steps</CardTitle>
                <Lightbulb className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {myNewsData.nextActions.map(action => (
                    <li key={action.id}>
                       <Button variant="link" className="p-0 h-auto text-sm">{action.text}</Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Layout for Stock/General Query (Original Layout) - Will render with hardcoded query */}
        {!isMyNewsQuery && (
            <Card className="w-full max-w-[800px]">
              <CardHeader>
                <CardTitle className="text-2xl">Results for: {query}</CardTitle>
                {stockData && (
                  <CardDescription>
                    Simulated stock data for {stockData.ticker}
                  </CardDescription>
                )}
                 {generalInfo && (
                  <CardDescription>
                    Simulated information for &quot;{query}&quot;
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-6"> {/* Increased spacing */}

                {/* --- Stock Data Display --- */}
                {stockData && (
                  <div className="space-y-6">
                    {/* Key Info Card */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Current Price</CardDescription>
                        <CardTitle className="text-4xl">${stockData.price}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-sm ${stockData.isUp ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                          {stockData.isUp ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                          {stockData.change} ({stockData.changePercent}%) Today
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Volume: {stockData.volume}</p>
                      </CardContent>
                       <Separator />
                       <CardFooter className="flex justify-between text-xs text-muted-foreground pt-4">
                           <span>Mkt Cap: {stockData.marketCap}</span>
                           <span>P/E: {stockData.peRatio}</span>
                           <span>Div Yield: {stockData.dividendYield}</span>
                       </CardFooter>
                    </Card>

                    {/* Performance/Rating Card */}
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

                     {/* Placeholder News Card */}
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                             <CardTitle className="text-lg font-medium">Recent News</CardTitle>
                             <Newspaper className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Placeholder news item 1 about {stockData.ticker}...</li>
                                <li>Placeholder news item 2...</li>
                                <li>Placeholder news item 3...</li>
                            </ul>
                        </CardContent>
                     </Card>
                  </div>
                )}

                {/* --- General Info Display --- */}
                {generalInfo && (
                  <div className="space-y-4">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                             <CardTitle className="text-lg font-medium">Definition</CardTitle>
                             <Info className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{generalInfo.definition}</p>
                        </CardContent>
                     </Card>
                     <Card>
                         <CardHeader className="pb-2">
                             <CardTitle className="text-lg font-medium">Details</CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-1 text-sm">
                             <p>Sentiment: <Badge variant={generalInfo.sentiment === 'Positive' ? 'default' : generalInfo.sentiment === 'Neutral' ? 'secondary' : 'destructive'}>{generalInfo.sentiment}</Badge></p>
                             {generalInfo.relatedTerms.length > 0 && (
                                <p>Related Terms: {generalInfo.relatedTerms.join(', ')}</p>
                             )}
                        </CardContent>
                     </Card>
                  </div>
                )}

                {/* Fallback if no specific data generated */}
                {!stockData && !generalInfo && (
                     <p className="text-muted-foreground">Could not generate specific data for &quot;{query}&quot;.</p>
                )}

              </CardContent>
            </Card>
        )}

      </main>

      <FloatingInputBar />
    </div>
  );
}
