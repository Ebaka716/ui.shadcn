"use client"; // Required for state and effects

import React from "react";
import { useRouter } from 'next/navigation'; // Import useRouter
import { Atom } from "lucide-react";
import { FinancialSearchCommand } from "@/components/search/FinancialSearchCommand";
import { Button } from "@/components/ui/button"; // Import Button

export default function Home() {
  const router = useRouter(); // Get router instance

  // Helper function for navigation (similar to the one in FinancialSearchCommand)
  const navigateToResults = (query: string) => {
     if (!query) return;
     router.push(`/results?query=${encodeURIComponent(query)}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      {/* Add icon to title - No spin */}
      <h1 className="mb-8 text-4xl font-semibold text-center flex items-center gap-3">
        <Atom className="h-8 w-8" />
        Theta Assistant
      </h1>

      {/* Render the extracted search command component */}
      <FinancialSearchCommand />

      {/* Container for wrapping icebreaker buttons, aligned with command bar */}
      <div className="flex flex-wrap gap-2 justify-center w-full max-w-xl"> {/* Removed mt-4 */}
        <Button
          variant="outline"
          onClick={() => navigateToResults('How\'s AAPL doing?')}
        >
          How&apos;s AAPL doing?
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/advisor')} // Simple route push
        >
          Check in with an Advisor
        </Button>
        <Button
          variant="outline"
          onClick={() => navigateToResults('Market Overview')}
        >
          Market Overview
        </Button>
        <Button
          variant="outline"
          onClick={() => navigateToResults('Explain P/E Ratio')}
        >
          Explain P/E Ratio
        </Button>
        <Button
          variant="outline"
          onClick={() => navigateToResults('What news has affected me today?')}
        >
          What news has affected me today?
        </Button>
      </div>
    </main>
  );
}
