"use client"; // Required for state and effects

import React, { useState, useEffect } from "react"; // Import React hooks
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Import Badge
import {
  Command,
  CommandInput,
  CommandList,    // Add CommandList
  CommandEmpty,   // Add CommandEmpty
  CommandGroup,   // Add CommandGroup
  CommandItem,    // Add CommandItem
} from "@/components/ui/command";
// Removed imports for dropdown and icons
// import { Send, Paperclip, ChevronDown, Filter } from 'lucide-react'; 
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

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
];

// Combine data sources - Only include FINANCIAL_DATA
const ALL_SUGGESTIONS = [...FINANCIAL_DATA];

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
      const filtered = ALL_SUGGESTIONS.filter(item =>
        item.value.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
      setIsListOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsListOpen(false);
    }
  }, [inputValue]);

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
      <h1 className="mb-8 text-4xl font-semibold text-center">
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

          {isListOpen && (
            <CommandList className="absolute top-full mt-1 w-full rounded-md border bg-popover shadow-lg z-10">
              {suggestions.length > 0 ? (
                <>
                  {['ticker', 'index', 'account', 'term', 'metric'].map(type => 
                    groupedSuggestions[type] && (
                      <CommandGroup heading={type.charAt(0).toUpperCase() + type.slice(1) + 's'} key={type}>
                         {groupedSuggestions[type].map((suggestion) => (
                          <CommandItem
                            key={`${type}-${suggestion.value}`}
                            value={suggestion.value}
                            onSelect={() => handleSelect(suggestion.value)}
                            className="flex items-center gap-2"
                          >
                            <Badge variant="secondary" className="capitalize">{suggestion.type}</Badge>
                            <span>{suggestion.value}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )
                 )}
                </>
              ) : (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
            </CommandList>
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
