"use client";

// Removed unused imports: Link, Button, ArrowLeft, FloatingInputBar
import React, { Suspense } from 'react';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft } from 'lucide-react';
// import { FloatingInputBar } from '@/components/FloatingInputBar';

// Keep dynamic import for ResultsDisplay
const ResultsDisplay = React.lazy(() => import('./ResultsDisplay'));

// Keep LoadingFallback
function LoadingFallback() {
  return (
    <div className="w-full max-w-[800px] text-center py-10">
      <p className="text-muted-foreground">Loading results...</p>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Ensure main content has max-width and is centered */}
      <main className="flex flex-col items-center pb-32 px-4">
        <div className="w-full max-w-3xl"> {/* Reverted max-width */} 
          <Suspense fallback={<LoadingFallback />}>
            <ResultsDisplay />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
