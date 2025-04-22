"use client"; // Required for state and effects

import React, { useState, useEffect } from "react"; // Import React hooks
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge"; // No longer used
import {
  Command,
  CommandInput,
  CommandList,    // Add CommandList
  CommandEmpty,   // Add CommandEmpty
  CommandGroup,   // Add CommandGroup
  CommandItem,    // Add CommandItem
} from "@/components/ui/command";
// Import Atom icon and new suggestion icons
import { Atom, Hash, TrendingUp, Lightbulb, Briefcase, Activity, Newspaper } from "lucide-react"; 
import Fuse from 'fuse.js'; // Import Fuse.js

// Sample Financial Data (add type)
const FINANCIAL_DATA = [
  { value: 'AAPL', type: 'ticker' },
  { value: 'GOOGL', type: 'ticker' },
  { value: 'MSFT', type: 'ticker' },
  { value: 'AMZN', type: 'ticker' },
  { value: 'TSLA', type: 'ticker' },
  { value: 'NVDA', type: 'ticker' },
  { value: 'S&P 500', type: 'index' },
  { value: 'Dow Jones', type: 'index' },
  { value: 'NASDAQ Composite', type: 'index' },
  { value: 'Checking Account', type: 'account' },
  { value: 'Savings Account', type: 'account' },
  { value: 'Investment Portfolio', type: 'account' },
  { value: 'Market Cap', type: 'term' },
  { value: 'Dividend Yield', type: 'term' },
  { value: 'P/E Ratio', type: 'term' },
  { value: 'Inflation Rate', type: 'term' },
  { value: 'Interest Rates', type: 'term' },
  { value: 'GDP Growth', type: 'term' },
  { value: 'Volatility (VIX)', type: 'term' },
  { value: 'Bond', type: 'term' },
  { value: 'ETF (Exchange Traded Fund)', type: 'term' },
  { value: 'Mutual Fund', type: 'term' },
  { value: 'Earnings Per Share (EPS)', type: 'metric' },
  { value: 'Return on Investment (ROI)', type: 'metric' },
  { value: 'What is diversification?', type: 'question' },
  { value: 'Explain asset allocation', type: 'term' },
  { value: 'How do bonds work?', type: 'question' },
  { value: 'What is market volatility?', type: 'term' },
  { value: 'Difference between stocks and bonds', type: 'topic' },
  { value: 'What is a mutual fund?', type: 'term' },
  { value: 'Explain ETFs', type: 'term' },
  { value: 'What is compound interest?', type: 'term' },
  { value: 'How to save for retirement?', type: 'question' },
  { value: 'What is a 401(k)?', type: 'term' },
  { value: 'Explain IRA (Individual Retirement Account)', type: 'term' },
  { value: 'Roth vs Traditional IRA', type: 'topic' },
  { value: 'What are capital gains?', type: 'term' },
  { value: 'Tax implications of investing', type: 'topic' },
  { value: 'What is inflation?', type: 'term' },
  { value: 'How does the Federal Reserve affect rates?', type: 'question' },
  { value: 'What is a credit score?', type: 'term' },
  { value: 'How to improve credit score?', type: 'question' },
  { value: 'Budgeting tips', type: 'topic' },
  { value: 'Understanding mortgages', type: 'topic' },
  { value: 'Fixed vs Variable Rate Mortgage', type: 'topic' },
  { value: 'What is equity?', type: 'term' },
  { value: 'Understanding balance sheets', type: 'topic' },
  { value: 'What is an income statement?', type: 'term' },
  { value: 'Cash flow analysis', type: 'topic' },
  { value: 'What are dividends?', type: 'term' },
  { value: 'Stock buybacks explained', type: 'term' },
  { value: 'What is a Bull Market?', type: 'term' },
  { value: 'What is a Bear Market?', type: 'term' },
  { value: 'Market correction vs crash', type: 'topic' },
  { value: 'Understanding risk tolerance', type: 'topic' },
  { value: 'What is dollar-cost averaging?', type: 'term' },
  { value: 'Lump sum investing vs DCA', type: 'topic' },
  { value: 'What are options trading?', type: 'term' },
  { value: 'Futures contracts explained', type: 'term' },
  { value: 'Cryptocurrency basics', type: 'topic' },
  { value: 'What is Blockchain?', type: 'term' },
  { value: 'Real Estate Investment Trusts (REITs)', type: 'term' },
  { value: 'Commodities trading (Oil, Gold)', type: 'topic' },
  { value: 'ESG Investing (Environmental, Social, Governance)', type: 'term' },
  { value: 'Impact investing', type: 'topic' },
  { value: 'What is a Robo-advisor?', type: 'term' },
  { value: 'Financial advisor vs Robo-advisor', type: 'topic' },
  { value: 'Understanding insurance types (Life, Health, Auto)', type: 'topic' },
  { value: 'Estate planning basics', type: 'topic' },
  { value: 'What is a trust fund?', type: 'term' },
  { value: 'Saving for college (529 plans)', type: 'topic' },
  { value: 'How does stock market work?', type: 'question' },
  { value: 'What drives stock prices?', type: 'question' },
  { value: 'How much should I save?', type: 'question' },
];

// Combine data sources - Only include FINANCIAL_DATA
const ALL_SUGGESTIONS = [...FINANCIAL_DATA];

// Define a type for the icon map
// Keys are strings (suggestion types), values are Lucide icon components
type IconMap = {
  [key: string]: React.ComponentType<{ className?: string }>;
};

// Map suggestion types to icons
const typeToIconMap: IconMap = {
  stock: TrendingUp,
  topic: Lightbulb,
  account: Briefcase,
  action: Activity,
  news: Newspaper,
  default: Hash, // Keep a default
};

// Fuse.js options
const fuseOptions = {
  keys: ['value'], // Search only in the 'value' field
  includeScore: true,
  threshold: 0.4, // Adjust threshold for fuzziness (0 = exact, 1 = match anything)
};

// Create a Fuse instance outside the component for performance
const fuse = new Fuse(ALL_SUGGESTIONS, fuseOptions);

export default function Home() {
  const router = useRouter(); // Get router instance
  const [inputValue, setInputValue] = useState("");
  // Suggestions state now holds objects { value: string, type: string }
  const [suggestions, setSuggestions] = useState<{ value: string, type: string }[]>([]);
  const [isListOpen, setIsListOpen] = useState(false);
  // Removed focusMode state
  // const [focusMode, setFocusMode] = useState("Learning Center");

  useEffect(() => {
    if (inputValue) {
      // Use Fuse.js for searching
      const results = fuse.search(inputValue);
      // Extract the original items from the Fuse results, adding type annotation
      const filtered = results.map((result: { item: { value: string, type: string } }) => result.item);
      setSuggestions(filtered);
      setIsListOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsListOpen(false);
    }
  }, [inputValue]); // Only run when inputValue changes

  // Function to navigate to results page
  const navigateToResults = (query: string) => {
     if (!query) return; // Don't navigate if query is empty
     router.push(`/results?query=${encodeURIComponent(query)}`);
     setIsListOpen(false); // Close list after navigation
  };

  // Updated handleSelect to use navigation function
  const handleSelect = (value: string) => {
    setInputValue(value);
    navigateToResults(value);
  };

  // Handle form submission (Enter key)
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent full page reload
    navigateToResults(inputValue);
  };

  // Group suggestions by type for rendering
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    const key = suggestion.type;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(suggestion);
    return acc;
  }, {} as Record<string, { value: string, type: string }[]>);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      {/* Add icon to title - No spin */}
      <h1 className="mb-8 text-4xl font-semibold text-center flex items-center gap-3"> 
        <Atom className="h-8 w-8" /> 
        Theta Assistant
      </h1>

      <form onSubmit={handleFormSubmit} className="w-full max-w-xl mb-6">
        <Command className="rounded-lg border shadow-md overflow-visible relative">
          <CommandInput
            placeholder="Search financial terms..."
            value={inputValue}
            onValueChange={(value) => {
               setInputValue(value);
            }}
            onFocus={() => setIsListOpen(suggestions.length > 0 && !!inputValue)}
            onKeyDown={(event: React.KeyboardEvent) => {
              if (event.key === 'Enter' && inputValue) {
                event.preventDefault(); 
                navigateToResults(inputValue);
              }
            }}
            className=""
          />

          {/* Conditionally render the suggestion list */}
          {isListOpen && (
            <> 
              {/* Clickable overlay to close list */}
              <div 
                className="fixed inset-0 z-10 bg-transparent" 
                onClick={() => setIsListOpen(false)}
              />
              {/* Suggestion List (increased z-index, explicit dark bg) */}
              <CommandList className="absolute top-full mt-1 w-full rounded-md border bg-white dark:bg-neutral-900 shadow-lg z-20">
                {suggestions.length > 0 ? (
                  <>
                    {Object.entries(groupedSuggestions).map(([type, suggestionsOfType]) => (
                        <CommandGroup heading={type.charAt(0).toUpperCase() + type.slice(1) + 's'} key={type} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground dark:[&_[cmdk-group-heading]]:text-neutral-400">
                           {suggestionsOfType.map((suggestion) => {
                            // Logic for highlighting
                            const matchIndex = suggestion.value.toLowerCase().indexOf(inputValue.toLowerCase());
                            const matchEndIndex = matchIndex + inputValue.length;
                            const shouldHighlight = matchIndex !== -1 && inputValue.length > 0;
                            
                            // Get the icon using the map
                            const Icon = typeToIconMap[suggestion.type] || typeToIconMap.default;

                            return (
                              <CommandItem
                                key={`${type}-${suggestion.value}`}
                                value={suggestion.value}
                                onSelect={() => handleSelect(suggestion.value)}
                                className="flex items-center gap-2 text-popover-foreground"
                              >
                                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" /> 
                                {/* Render suggestion with REVERSED highlighted match */}
                                {shouldHighlight ? (
                                  <span className="truncate">
                                    <strong>{suggestion.value.substring(0, matchIndex)}</strong>
                                    {suggestion.value.substring(matchIndex, matchEndIndex)}{/* Non-bold match */}
                                    <strong>{suggestion.value.substring(matchEndIndex)}</strong>
                                  </span>
                                ) : (
                                  <span className="truncate"><strong>{suggestion.value}</strong></span> /* Bold if no match */
                                )}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      )
                   )}
                  </>
                ) : (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}
              </CommandList>
            </>
          )}
        </Command>
        <button type="submit" hidden />
      </form>

      {/* Container for wrapping icebreaker buttons, aligned with command bar */}
      <div className="flex flex-wrap gap-2 justify-center w-full max-w-xl">
        <Button 
          variant="outline"
          onClick={() => navigateToResults('How\'s AAPL doing?')}
        >
          How&apos;s AAPL doing?
        </Button>
        <Button 
          variant="outline"
          onClick={() => router.push('/advisor')}
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
