'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Determine background based on route
  const isResultsOrAdvisorPage = pathname.startsWith('/results') || pathname.startsWith('/advisor');
  const backgroundClass = isResultsOrAdvisorPage ? 'bg-[#F9F7F5]' : 'bg-background';

  return (
    <div className={cn("flex h-screen", backgroundClass)}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <main
        id="main-scroll-area"
        className={cn(
          "flex-1 overflow-y-auto transition-all duration-300 ease-in-out"
        )}
      >
        <div className={cn(
          "w-full max-w-[800px] mx-auto py-8",
          !pathname.startsWith('/results') && "px-4 sm:px-6 lg:px-8"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
} 