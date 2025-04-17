import React from 'react';
import { AnswerCard } from './AnswerCard';
import { ClassicSearchResultsList } from './ClassicSearchResultsList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function HighConfidenceResults() {
  const hsaActions = [
    { label: "Check Eligibility", variant: "outline" as const, onClick: () => alert('Checking HSA eligibility...') },
    { label: "Maximize Contribution", variant: "default" as const, onClick: () => alert('Opening contribution workflow...') },
  ];

  return (
    <div className="space-y-6">
      <AnswerCard
        title="Understanding Your HSA"
        description="Key benefits and considerations for your Health Savings Account:"
        content={
          <div className="space-y-3">
            <p>HSAs offer a triple tax advantage: contributions are tax-deductible, growth is tax-free, and withdrawals for qualified medical expenses are tax-free. Unused funds roll over year after year and can be invested, making it a powerful tool for both healthcare costs and retirement.</p>
            <div>
              <strong>Important Considerations:</strong>
              <ul className="list-disc list-inside ml-4 text-sm">
                <li>Must be enrolled in a High-Deductible Health Plan (HDHP).</li>
                <li>Annual contribution limits apply (check current year's limits).</li>
                <li>Keep records of qualified medical expenses.</li>
                <li>Funds can be used for non-medical expenses after age 65 (subject to income tax).</li>
              </ul>
            </div>
          </div>
        }
        actions={hsaActions}
      />

      <div>
        <h3 className="text-lg font-semibold mb-3">Your HSA Snapshot</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">HSA Balance (Fidelity)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$8,450.72</p>
              <p className="text-sm text-muted-foreground">Invested: $5,100.00</p>
              <p className="text-sm text-muted-foreground">Cash: $3,350.72</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 border-primary/40">
            <CardHeader>
              <CardTitle className="text-base">Next Step: Maximize 2024</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">You can still contribute $1,749.28 towards the 2024 family limit ($8,300).</p>
              <Button size="sm" onClick={() => alert('Opening contribution workflow...')}>Contribute Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ClassicSearchResultsList maxItems={3} />
    </div>
  );
} 