'use client'; // Make it a client component

import React from 'react';
import { useConfidence } from '@/context/ConfidenceContext'; // Import context hook
// Import the result components
import { LowConfidenceResults } from '@/components/confidence-demo/LowConfidenceResults';
import { MediumConfidenceResults } from '@/components/confidence-demo/MediumConfidenceResults';
import { HighConfidenceResults } from '@/components/confidence-demo/HighConfidenceResults';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion

export default function ConfidenceDemoPage() {
  const { confidence } = useConfidence(); // Get confidence value from context

  // Define confidence thresholds
  const lowThreshold = 33;
  const mediumThreshold = 66;

  let ResultsComponent;
  let confidenceLevelKey: 'low' | 'medium' | 'high';

  if (confidence <= lowThreshold) {
    ResultsComponent = LowConfidenceResults;
    confidenceLevelKey = 'low';
  } else if (confidence <= mediumThreshold) {
    ResultsComponent = MediumConfidenceResults;
    confidenceLevelKey = 'medium';
  } else {
    ResultsComponent = HighConfidenceResults;
    confidenceLevelKey = 'high';
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-semibold">User Query (HSA)</h1>
      <p className="text-muted-foreground">
        Adjust the confidence slider in the header ({confidence}%) to see the results layout change.
      </p>
      
      {/* Add AnimatePresence for transitions */}
      <AnimatePresence mode="wait"> 
        <motion.div
          key={confidenceLevelKey} // Key tells AnimatePresence when component changes
          initial={{ opacity: 0, y: 10 }} // Start invisible and slightly down
          animate={{ opacity: 1, y: 0 }} // Animate to visible and original position
          exit={{ opacity: 0, y: -10 }} // Animate out invisible and slightly up
          transition={{ duration: 0.3 }} // Animation duration
          className="mt-6"
        >
          <ResultsComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 