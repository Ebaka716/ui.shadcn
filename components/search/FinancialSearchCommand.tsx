"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Fuse from 'fuse.js';
import {
  ALL_SUGGESTIONS,
  fuseOptions,
  typeToIconMap,
  SuggestionItem, // Import the interface
} from "@/lib/data/financial-terms";

// Create a Fuse instance outside the component for performance
const fuse = new Fuse(ALL_SUGGESTIONS, fuseOptions);

export function FinancialSearchCommand() {
  const router = useRouter(); // Get router instance
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isListOpen, setIsListOpen] = useState(false);

  useEffect(() => {
    if (inputValue) {
      // Use Fuse.js for searching
      const results = fuse.search(inputValue);
      // Extract the original items from the Fuse results
      const filtered = results.map((result) => result.item);
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

  // Handle selecting an item from the list
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
  }, {} as Record<string, SuggestionItem[]>);

  return (
    <form onSubmit={handleFormSubmit} className="w-full max-w-xl mb-6">
      <Command className="rounded-lg border shadow-md overflow-visible relative">
        <CommandInput
          placeholder="Search financial terms..."
          value={inputValue}
          onValueChange={setInputValue} // Simplified handler
          onFocus={() => setIsListOpen(suggestions.length > 0 && !!inputValue)}
          // Removed onKeyDown here, relying on form onSubmit
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
                    <CommandGroup
                      heading={type.charAt(0).toUpperCase() + type.slice(1) + 's'} // Simple pluralization
                      key={type}
                      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground dark:[&_[cmdk-group-heading]]:text-neutral-400"
                    >
                      {suggestionsOfType.map((suggestion) => {
                        // Highlighting logic (Corrected)
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
                            className="flex items-center gap-2 text-popover-foreground cursor-pointer"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            {/* Render suggestion with CORRECT highlighting */}
                            {shouldHighlight ? (
                              <span className="truncate">
                                {suggestion.value.substring(0, matchIndex)}
                                <strong className="font-semibold text-foreground">{suggestion.value.substring(matchIndex, matchEndIndex)}</strong>
                                {suggestion.value.substring(matchEndIndex)}
                              </span>
                            ) : (
                              <span className="truncate">{suggestion.value}</span>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  ))}
                </>
              ) : (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
            </CommandList>
          </>
        )}
      </Command>
    </form>
  );
} 