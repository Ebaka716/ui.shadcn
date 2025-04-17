import React from 'react';
import { AnswerCard } from './AnswerCard';
import { ClassicSearchResultsList } from './ClassicSearchResultsList';

export function MediumConfidenceResults() {
  return (
    <div className="space-y-6"> 
      <AnswerCard
        title="What is an HSA?"
        description="Health Savings Account (HSA)"
        content={
          <p>
            An HSA is a tax-advantaged savings account available to taxpayers in the United States who are enrolled in a high-deductible health plan (HDHP). The funds contributed to an account are not subject to federal income tax at the time of deposit.
          </p>
        }
      />
      
      {/* Display the full classic list (now with HSA links) */}
      <ClassicSearchResultsList />
    </div>
  );
} 