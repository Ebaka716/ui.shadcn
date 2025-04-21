import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { StockData } from '@/lib/simulationUtils';

// Define props interface
interface StockOverviewCardProps {
  stockData: NonNullable<StockData>; // Ensure stockData is not null
}

export const StockOverviewCard: React.FC<StockOverviewCardProps> = ({ stockData }) => {
  return (
    <Card className="shadow-none">
      <CardContent className="px-6 py-4 space-y-4">
        {/* Ticker, Price, Stats */}
        <div className="flex justify-between items-center">
          {/* ... Ticker/Name/Rating ... */}
          <div>
            <h1 className="text-3xl font-bold">{stockData.ticker}</h1>
            <p className="text-sm text-muted-foreground">{stockData.companyName}</p>
            {stockData.analystRating && (
              <p className="flex items-center text-xs mt-1">
                <span className="font-medium text-foreground mr-1">Analyst Rating:</span>
                <Badge variant={stockData.analystRating === 'Buy' ? 'default' : stockData.analystRating === 'Hold' ? 'secondary' : 'destructive'} className="text-xs">{stockData.analystRating}</Badge>
              </p>
            )}
          </div>
          {/* ... Price/Change ... */}
          <div className={`text-right`}>
            <p className={`text-2xl font-semibold ${stockData.isUp ? 'text-green-600' : 'text-red-600'}`}>${stockData.price}</p>
            <p className={`text-sm ${stockData.isUp ? 'text-green-600' : 'text-red-600'} flex items-center justify-end`}>
              {stockData.isUp ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {stockData.change} ({stockData.changePercent}%)
            </p>
          </div>
        </div>
        <Separator />
        {/* Details Row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {stockData.volume && <p><span className="font-medium text-foreground">Volume:</span> {stockData.volume}</p>}
          {stockData.marketCap && <p><span className="font-medium text-foreground">Mkt Cap:</span> {stockData.marketCap}</p>}
          {stockData.peRatio && <p><span className="font-medium text-foreground">P/E Ratio:</span> {stockData.peRatio}</p>}
          {stockData.dividendYield && <p><span className="font-medium text-foreground">Div Yield:</span> {stockData.dividendYield}</p>}
          <p><span className="font-medium text-foreground">Prev Close:</span> <span className="italic">N/A</span></p>
          <p><span className="font-medium text-foreground">Day&apos;s Range:</span> <span className="italic">N/A</span></p>
          <p><span className="font-medium text-foreground">52wk High:</span> <span className="italic">N/A</span></p>
          <p><span className="font-medium text-foreground">52wk Low:</span> <span className="italic">N/A</span></p>
        </div>
      </CardContent>
    </Card>
  );
}; 