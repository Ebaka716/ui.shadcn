"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export function Header({ toggleMobileMenu }: HeaderProps) {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 h-16", // Height: h-16 = 4rem = 64px
      "bg-background border-b",          // Styling
      "z-50 flex items-center px-4"      // Layout & Stacking
    )}>
      {/* Hamburger Menu Button - Mobile Only */}
      <Button 
        variant="ghost"
        size="icon"
        className="md:hidden mr-4" // Hide on md+, add margin right
        onClick={toggleMobileMenu}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open Menu</span>
      </Button>
      
      {/* Placeholder for Logo/Title */}
      {/* <div className="font-semibold">App Title</div> */}

    </header>
  );
} 