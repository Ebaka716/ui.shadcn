"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Remove Prop Interface again
// interface FloatingInputBarProps {
//   isDesktopCollapsed: boolean;
// }

// Remove prop from function signature again
export function FloatingInputBar(/* { isDesktopCollapsed } */) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [focusMode, setFocusMode] = useState("Learning Center");

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue) return;
    router.push(`/results?query=${encodeURIComponent(inputValue)}&focus=${encodeURIComponent(focusMode)}`);
    setInputValue("");
  };

  return (
    // Change back to sticky positioning, remove fixed layout classes, add top margin
    <div className={cn(
      "sticky bottom-0 mt-6 z-10" // Revert to sticky
    )}>
      {/* Inner centering div remains */}
      <div className="max-w-[800px] mx-auto pointer-events-auto">
        <form
          onSubmit={handleFormSubmit}
          className="w-full"
        >
          <div className="rounded-lg border shadow-xl bg-white overflow-hidden flex flex-col">
            <div className="flex items-center h-14 px-3 gap-2">
              <Input
                type="text"
                placeholder="Ask follow-up questions..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-full flex-grow border-none outline-none shadow-none ring-0 focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent p-0"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-9 w-9"
                disabled={!inputValue}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>

            <div className="flex items-center h-10 px-3 gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0 hover:bg-muted rounded-full">
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white px-3 py-1.5 text-xs rounded-md">
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0 hover:bg-muted rounded-full">
                        <Filter className="h-4 w-4" />
                        <span className="sr-only">Focus Options ({focusMode})</span>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black text-white px-3 py-1.5 text-xs rounded-md">
                    <p>Focus Options</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Focus</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setFocusMode("Learning Center")}>Learning Center</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFocusMode("MyGPS")}>MyGPS</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFocusMode("Investopedia")}>Investopedia</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFocusMode("My Accounts")}>My Accounts</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <button type="submit" hidden />
        </form>
      </div>
    </div>
  );
}
