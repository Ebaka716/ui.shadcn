'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from '@/components/Header';
import { FloatingInputBar } from '@/components/FloatingInputBar';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  // --- Desktop Sidebar State ---
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(true);
  // --- Mobile Menu State ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const pathname = usePathname();

  const toggleDesktopSidebar = () => {
    setIsDesktopCollapsed(!isDesktopCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Close mobile menu on path change (optional but good UX)
  useEffect(() => {
      setIsMobileMenuOpen(false);
  }, [pathname]);

  // Determine background based on route
  const isContentPage = pathname.startsWith('/results') 
                     || pathname.startsWith('/advisor');
  const backgroundClass = isContentPage ? 'bg-[#F9F7F5]' : 'bg-background';

  return (
    <TooltipProvider>
      <Header toggleMobileMenu={toggleMobileMenu} />
      
      <div className={cn("flex h-screen pt-16", backgroundClass)}>
        <Sidebar 
          isDesktopCollapsed={isDesktopCollapsed} 
          toggleDesktopSidebar={toggleDesktopSidebar} 
          isMobileMenuOpen={isMobileMenuOpen}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />
        <div 
          id="content-scroll-wrapper" 
          className={cn(
            "flex-1 overflow-y-auto p-6",
            isDesktopCollapsed ? "md:ml-16" : "md:ml-52"
          )}
        >
          <main
            id="main-scroll-area"
            className={cn("mb-6")}
          >
            <div className={cn(
              "w-full max-w-[800px] mx-auto",
            )}>
              {children}
            </div>
          </main>
          
          {isContentPage && (
            <FloatingInputBar /> 
          )}
        </div>
      </div>
    </TooltipProvider>
  );
} 