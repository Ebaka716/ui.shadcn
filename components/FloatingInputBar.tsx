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

export function FloatingInputBar() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [focusMode, setFocusMode] = useState("Learning Center");

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue) return;
    router.push(`/results?query=${encodeURIComponent(inputValue)}&focus=${encodeURIComponent(focusMode)}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
      <form
        onSubmit={handleFormSubmit}
        className="max-w-[800px] mx-auto pointer-events-auto"
      >
        <div className="rounded-lg border shadow-md relative flex items-center bg-background h-14 flex-grow overflow-hidden gap-2 px-3">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Focus Options ({focusMode})</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Focus</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setFocusMode("Learning Center")}>Learning Center</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFocusMode("MyGPS")}>MyGPS</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFocusMode("Investopedia")}>Investopedia</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFocusMode("My Accounts")}>My Accounts</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            type="text"
            placeholder="Ask follow-up questions..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pr-12 h-full flex-grow border-none ring-0 focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-9 w-9"
            disabled={!inputValue}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <button type="submit" hidden />
      </form>
    </div>
  );
}
