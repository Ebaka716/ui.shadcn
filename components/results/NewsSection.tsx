import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, Briefcase, Activity, Lightbulb } from 'lucide-react';
import type { MyNewsData } from '@/lib/simulationUtils';

interface NewsSectionProps {
  newsData: NonNullable<MyNewsData>;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ newsData }) => {
  return (
    <div className="mt-4 space-y-6"> 
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-lg font-medium">Top News Affecting You</CardTitle><Newspaper className="h-5 w-5 text-muted-foreground" /></CardHeader>
        <CardContent><ul className="space-y-3">{newsData.newsItems.map(item => (
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
          <CardContent><Table><TableHeader><TableRow><TableHead>Account</TableHead><TableHead className="text-right">Balance</TableHead><TableHead className="text-right">Change</TableHead></TableRow></TableHeader><TableBody>{newsData.accounts.map(acc => (<TableRow key={acc.id}><TableCell className="font-medium">{acc.name}</TableCell><TableCell className="text-right">{acc.balance}</TableCell><TableCell className={`text-right text-xs ${acc.change.startsWith('+') ? 'text-green-600' : acc.change.startsWith('-') ? 'text-red-600' : 'text-muted-foreground'}`}>{acc.change}</TableCell></TableRow>))}</TableBody></Table></CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-lg font-medium">Daily Movers</CardTitle><Activity className="h-5 w-5 text-muted-foreground" /></CardHeader>
          <CardContent><ul className="space-y-2">{newsData.movers.map(mover => (<li key={mover.id} className="flex justify-between items-center text-sm"><span className="font-medium">{mover.ticker}</span><Badge variant={mover.changePercent.startsWith('+') ? 'default' : 'destructive'}>{mover.changePercent}</Badge></li>))}</ul></CardContent>
        </Card>
      </div>
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-lg font-medium">Suggested Next Steps</CardTitle><Lightbulb className="h-5 w-5 text-muted-foreground" /></CardHeader>
        <CardContent><ul className="space-y-2 text-sm">{newsData.nextActions.map(action => (<li key={action.id} className="flex items-center"><Button variant="link" size="sm" className="p-0 h-auto mr-2 text-muted-foreground hover:text-primary">{action.text}</Button></li>))}</ul></CardContent>
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
  );
}; 