"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConfidence } from '@/context/ConfidenceContext';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export function Header({ toggleMobileMenu }: HeaderProps) {
  const pathname = usePathname();
  const isConfidenceDemoPage = pathname === '/confidence-demo';

  // Always call the hook unconditionally at the top level
  const confidenceContext = useConfidence();
  
  // Destructure only if the context is available (it should be, thanks to the Provider)
  const { confidence, setConfidence } = confidenceContext || { confidence: 0, setConfidence: () => {} };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 h-16", // Height: h-16 = 4rem = 64px
      "bg-background border-b",          
      "z-50 flex items-center px-4"      // Layout & Stacking
    )}>
      <div className="flex items-center w-full justify-between">
        {/* Left side: Hamburger + Title (Grouped) */}
        <div className="flex items-center">
          {/* Hamburger Menu Button - Mobile Only */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost"
                size="icon"
                className="md:hidden mr-4" // Hide on md+, add margin right
                onClick={toggleMobileMenu}
              >
                <Menu className="h-6 w-6" /> 
                <span className="sr-only">Open Menu</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-black text-white px-3 py-1.5 text-xs rounded-md">
              <p>Open Menu</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Use primary color variable for title */}
          <div className="font-bold text-primary text-xl"> 
            Theta Corp
          </div>
        </div>

        {/* Right side: Conditionally render Slider, only use context values here */}
        {isConfidenceDemoPage && (
          <div className="flex items-center space-x-4 w-1/2 max-w-xs"> 
            <Label htmlFor="confidence-slider" className="whitespace-nowrap text-sm font-medium">
              Confidence: {confidence}%
            </Label>
            <Slider
              id="confidence-slider"
              min={0}
              max={100}
              step={1}
              value={[confidence]} 
              onValueChange={(value) => setConfidence(value[0])} // Use context setter
              className="w-full"
            />
          </div>
        )}
      </div>
    </header>
  );
} 