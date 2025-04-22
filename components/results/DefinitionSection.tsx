import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { GeneralInfoData } from '@/lib/simulationUtils';

interface DefinitionSectionProps {
  definitionData: NonNullable<GeneralInfoData>;
}

export const DefinitionSection: React.FC<DefinitionSectionProps> = ({ definitionData }) => {
  return (
    <div className="mt-4 space-y-6 debug-spacing-test">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Definition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-base space-y-4">
            <p>{definitionData.definition}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader><CardTitle>Analyze Stocks by P/E</CardTitle></CardHeader>
        <CardContent><Button variant="outline" size="sm">Go to Screener</Button></CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader><CardTitle>Compare Industry Ratios</CardTitle></CardHeader>
        <CardContent><Button variant="outline" size="sm">View Comparison</Button></CardContent>
      </Card>
       <Card className="shadow-none">
        <CardHeader><CardTitle>Related Concepts</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button variant="link" className="p-0 h-auto text-sm">Price-to-Book (P/B) Ratio</Button><br/>
          <Button variant="link" className="p-0 h-auto text-sm">Dividend Yield</Button>
         </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader><CardTitle>Historical Trend</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">View the historical trend of this metric for relevant entities.</p>
          <Button variant="outline" size="sm" className="mt-2">View Trend</Button>
        </CardContent>
      </Card>
    </div>
  );
}; 