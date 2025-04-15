"use client"; // Required for state and effects

import React, { useState, useEffect } from "react"; // Import React hooks
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from "@/components/ui/button";
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

// Component list (add type)
const COMPONENT_DATA = [
  "Accordion", "Alert", "AlertDialog", "AspectRatio", "Avatar", "Badge",
  "Breadcrumb", "Button", "Calendar", "Card", "Carousel", "Chart",
  "Checkbox", "Collapsible", "Command", "ContextMenu", "DataTable",
  "DatePicker", "Dialog", "Drawer", "DropdownMenu", "Form", "HoverCard",
  "Input", "InputOTP", "Label", "Menubar", "NavigationMenu", "Pagination",
  "Popover", "Progress", "RadioGroup", "Resizable", "ScrollArea", "Select",
  "Separator", "Sheet", "Sidebar", "Skeleton", "Slider", "Sonner",
  "Switch", "Table", "Tabs", "Textarea", "Toast", "Toggle",
  "ToggleGroup", "Tooltip"
].map(name => ({ value: name, type: 'component' }));

// Sample Financial Data (add type)
const FINANCIAL_DATA = [
  { value: 'AAPL', type: 'ticker' },
  { value: 'GOOGL', type: 'ticker' },
  { value: 'MSFT', type: 'ticker' },
  { value: 'Checking Account', type: 'account' },
  { value: 'Savings Account', type: 'account' },
  { value: 'Investment Portfolio', type: 'account' },
  { value: 'Market Cap', type: 'term' },
  { value: 'Dividend Yield', type: 'term' },
  { value: 'P/E Ratio', type: 'term' },
];

// Combine data sources
const ALL_SUGGESTIONS = [...COMPONENT_DATA, ...FINANCIAL_DATA];

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
      <h1 className="mb-8 text-6xl font-semibold text-center">
        Theta Assistant
      </h1>

      <form onSubmit={handleFormSubmit} className="w-full max-w-xl mb-6">
        <Command className="rounded-lg border shadow-md overflow-visible relative h-14 flex [&_[cmdk-input-wrapper]]:border-b-0">
          <CommandInput
            placeholder="Search components or financial terms..."
            value={inputValue}
            onValueChange={(value) => {
               setInputValue(value);
            }}
            onFocus={() => setIsListOpen(suggestions.length > 0 && !!inputValue)}
            className="h-full [&_[cmdk-input-wrapper]]:border-b-0"
          />

          {isListOpen && (
            <CommandList className="absolute top-full mt-1 w-full rounded-md border bg-popover shadow-lg z-10">
              {suggestions.length > 0 ? (
                <>
                  {groupedSuggestions.component && (
                    <CommandGroup heading="Components">
                      {groupedSuggestions.component.map((suggestion) => (
                        <CommandItem
                          key={`comp-${suggestion.value}`}
                          value={suggestion.value}
                          onSelect={() => handleSelect(suggestion.value)}
                        >
                          {suggestion.value}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                 )}
                 {['ticker', 'account', 'term'].map(type => 
                    groupedSuggestions[type] && (
                      <CommandGroup heading={type.charAt(0).toUpperCase() + type.slice(1) + 's'} key={type}>
                         {groupedSuggestions[type].map((suggestion) => (
                          <CommandItem
                            key={`${type}-${suggestion.value}`}
                            value={suggestion.value}
                            onSelect={() => handleSelect(suggestion.value)}
                          >
                            {suggestion.value}
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

      <div className="flex space-x-4">
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => navigateToResults('AAPL')}
        >
          How&apos;s AAPL doing?
        </Button>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => navigateToResults('myNews')}
        >
          What news has affected me today?
        </Button>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => navigateToResults('Im Feeling Lucky')}
        >
          I&apos;m Feeling Lucky
        </Button>
      </div>
    </main>
  );
}
