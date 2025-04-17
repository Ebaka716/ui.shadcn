import React from 'react';
import { ClassicSearchResultsList } from './ClassicSearchResultsList';

export function LowConfidenceResults() {
  // Low confidence just shows the full classic list
  return <ClassicSearchResultsList />;
} 