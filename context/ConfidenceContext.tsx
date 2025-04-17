'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context data
interface ConfidenceContextType {
  confidence: number;
  setConfidence: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context with a default value (can be undefined or a default state)
// Providing a default function helps with type safety if consumed outside a provider
const ConfidenceContext = createContext<ConfidenceContextType | undefined>(undefined);

// Create a provider component
interface ConfidenceProviderProps {
  children: ReactNode;
}

export function ConfidenceProvider({ children }: ConfidenceProviderProps) {
  const [confidence, setConfidence] = useState<number>(50); // Default confidence value

  const value = { confidence, setConfidence };

  return (
    <ConfidenceContext.Provider value={value}>
      {children}
    </ConfidenceContext.Provider>
  );
}

// Create a custom hook for easy consumption
export function useConfidence() {
  const context = useContext(ConfidenceContext);
  if (context === undefined) {
    throw new Error('useConfidence must be used within a ConfidenceProvider');
  }
  return context;
} 