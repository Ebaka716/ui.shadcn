"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelRightClose, Plus, X } from 'lucide-react'; // Icons for toggling
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  isDesktopCollapsed: boolean;
  toggleDesktopSidebar: () => void;
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

export function Sidebar({ 
  isDesktopCollapsed, 
  toggleDesktopSidebar, 
  isMobileMenuOpen,
  closeMobileMenu 
}: SidebarProps) {
  
  // Use desktop collapsed state for tooltip disabling
  const tooltipsDisabled = !isDesktopCollapsed;

  return (
    <>
      {/* Overlay for Mobile Menu - Adjust top */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-x-0 top-16 bottom-0 z-30 bg-black/50 md:hidden" // Start below header
          onClick={closeMobileMenu} 
        />
      )}

      {/* Sidebar Container - Adjust top and height */}
      <div
        className={cn(
          "fixed left-0 top-16 bottom-0 z-40 h-[calc(100vh-4rem)]", // Start below header (h-16 = 4rem), fill remaining height
          "bg-white border-r flex flex-col",
          "transition-transform duration-300 ease-in-out md:transition-all", 
          "w-full", // <-- Add w-full as base width for mobile drawer
          // Mobile State:
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop State (applied from md breakpoint upwards):
          "md:translate-x-0", 
          isDesktopCollapsed ? "md:w-16" : "md:w-52" 
        )}
      >
        {/* Top Section: Close/Toggle Buttons */}
        <div className="p-2 flex justify-end">
          {/* Mobile Close Button (Top right inside drawer) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden" // Only show on mobile
            onClick={closeMobileMenu}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close Menu</span>
          </Button>

          {/* Desktop Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:block" // Only show on desktop
            onClick={toggleDesktopSidebar}
          >
            {isDesktopCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
             <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>

        {/* Main Content Area (Navigation Items) */}
        {/* Mobile menu is always expanded width, so no justify-center needed here based on collapse */}
        <div className="flex-1 p-2 space-y-2 overflow-y-auto">
          {/* New Search Item with Tooltip (Conditional) */}
          <Tooltip>
            <TooltipTrigger asChild disabled={tooltipsDisabled}>
              <Link href="/" passHref className="block"> {/* Simplified Link */} 
                <Button variant="ghost" className={cn("w-full justify-start", isDesktopCollapsed && "md:justify-center")}>
                  <Plus className="h-5 w-5 md:mr-2" /> {/* Keep mr-2 on desktop only */} 
                  {/* Text only visible when expanded (desktop) or on mobile (always expanded view) */}
                  <span className={cn(isDesktopCollapsed && "md:hidden")}>New Search</span> 
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-black text-white px-3 py-1.5 text-xs rounded-md">
              <p>New Search</p>
            </TooltipContent>
          </Tooltip>

          {/* Add more items here */}
        </div>

        {/* Footer Item (Settings) with Tooltip (Conditional) */}
        <div className="p-2 mt-auto border-t">
          <Tooltip>
            <TooltipTrigger asChild disabled={tooltipsDisabled}>
              <Button variant="ghost" className={cn("w-full justify-start", isDesktopCollapsed && "md:justify-center")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className={cn(isDesktopCollapsed && "md:hidden")}>Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-black text-white px-3 py-1.5 text-xs rounded-md">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
} 