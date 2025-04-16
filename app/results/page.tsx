"use client";

import Link from 'next/link';
import React, { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { FloatingInputBar } from '@/components/FloatingInputBar';

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
      <main className="flex flex-col items-center p-8 pb-32 bg-muted/40">
        {/* Back Button */}
        <div className="w-full max-w-[800px] mb-8 self-start">
          <Link href="/" passHref>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          </Link>
        </div>

        {/* Suspense boundary */}
        <Suspense fallback={<LoadingFallback />}>
          <ResultsDisplay />
        </Suspense>

      </main>

      {/* Floating Input Bar */}
      <FloatingInputBar />
    </div>
  );
}
