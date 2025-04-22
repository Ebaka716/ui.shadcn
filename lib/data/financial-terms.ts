import React from 'react';
import { Hash, TrendingUp, Lightbulb, Briefcase, Activity, Newspaper } from "lucide-react";

// Define the structure of a suggestion item
export interface SuggestionItem {
  value: string;
  type: string; // Consider using a more specific union type if possible
}

// Sample Financial Data
export const FINANCIAL_DATA: SuggestionItem[] = [
  { value: 'AAPL', type: 'ticker' },
  { value: 'GOOGL', type: 'ticker' },
  { value: 'MSFT', type: 'ticker' },
  { value: 'AMZN', type: 'ticker' },
  { value: 'TSLA', type: 'ticker' },
  { value: 'NVDA', type: 'ticker' },
  { value: 'S&P 500', type: 'index' },
  { value: 'Dow Jones', type: 'index' },
  { value: 'NASDAQ Composite', type: 'index' },
  { value: 'Checking Account', type: 'account' },
  { value: 'Savings Account', type: 'account' },
  { value: 'Investment Portfolio', type: 'account' },
  { value: 'Market Cap', type: 'term' },
  { value: 'Dividend Yield', type: 'term' },
  { value: 'P/E Ratio', type: 'term' },
  { value: 'Inflation Rate', type: 'term' },
  { value: 'Interest Rates', type: 'term' },
  { value: 'GDP Growth', type: 'term' },
  { value: 'Volatility (VIX)', type: 'term' },
  { value: 'Bond', type: 'term' },
  { value: 'ETF (Exchange Traded Fund)', type: 'term' },
  { value: 'Mutual Fund', type: 'term' },
  { value: 'Earnings Per Share (EPS)', type: 'metric' },
  { value: 'Return on Investment (ROI)', type: 'metric' },
  { value: 'What is diversification?', type: 'question' },
  { value: 'Explain asset allocation', type: 'term' },
  { value: 'How do bonds work?', type: 'question' },
  { value: 'What is market volatility?', type: 'term' },
  { value: 'Difference between stocks and bonds', type: 'topic' },
  { value: 'What is a mutual fund?', type: 'term' },
  { value: 'Explain ETFs', type: 'term' },
  { value: 'What is compound interest?', type: 'term' },
  { value: 'How to save for retirement?', type: 'question' },
  { value: 'What is a 401(k)?', type: 'term' },
  { value: 'Explain IRA (Individual Retirement Account)', type: 'term' },
  { value: 'Roth vs Traditional IRA', type: 'topic' },
  { value: 'What are capital gains?', type: 'term' },
  { value: 'Tax implications of investing', type: 'topic' },
  { value: 'What is inflation?', type: 'term' },
  { value: 'How does the Federal Reserve affect rates?', type: 'question' },
  { value: 'What is a credit score?', type: 'term' },
  { value: 'How to improve credit score?', type: 'question' },
  { value: 'Budgeting tips', type: 'topic' },
  { value: 'Understanding mortgages', type: 'topic' },
  { value: 'Fixed vs Variable Rate Mortgage', type: 'topic' },
  { value: 'What is equity?', type: 'term' },
  { value: 'Understanding balance sheets', type: 'topic' },
  { value: 'What is an income statement?', type: 'term' },
  { value: 'Cash flow analysis', type: 'topic' },
  { value: 'What are dividends?', type: 'term' },
  { value: 'Stock buybacks explained', type: 'term' },
  { value: 'What is a Bull Market?', type: 'term' },
  { value: 'What is a Bear Market?', type: 'term' },
  { value: 'Market correction vs crash', type: 'topic' },
  { value: 'Understanding risk tolerance', type: 'topic' },
  { value: 'What is dollar-cost averaging?', type: 'term' },
  { value: 'Lump sum investing vs DCA', type: 'topic' },
  { value: 'What are options trading?', type: 'term' },
  { value: 'Futures contracts explained', type: 'term' },
  { value: 'Cryptocurrency basics', type: 'topic' },
  { value: 'What is Blockchain?', type: 'term' },
  { value: 'Real Estate Investment Trusts (REITs)', type: 'term' },
  { value: 'Commodities trading (Oil, Gold)', type: 'topic' },
  { value: 'ESG Investing (Environmental, Social, Governance)', type: 'term' },
  { value: 'Impact investing', type: 'topic' },
  { value: 'What is a Robo-advisor?', type: 'term' },
  { value: 'Financial advisor vs Robo-advisor', type: 'topic' },
  { value: 'Understanding insurance types (Life, Health, Auto)', type: 'topic' },
  { value: 'Estate planning basics', type: 'topic' },
  { value: 'What is a trust fund?', type: 'term' },
  { value: 'Saving for college (529 plans)', type: 'topic' },
  { value: 'How does stock market work?', type: 'question' },
  { value: 'What drives stock prices?', type: 'question' },
  { value: 'How much should I save?', type: 'question' },
];

// Combine data sources - Only include FINANCIAL_DATA
export const ALL_SUGGESTIONS = [...FINANCIAL_DATA];

// Define a type for the icon map
// Keys are strings (suggestion types), values are Lucide icon components
export type IconMap = {
  [key: string]: React.ComponentType<{ className?: string }>;
};

// Map suggestion types to icons
export const typeToIconMap: IconMap = {
  ticker: TrendingUp, // Changed 'stock' to 'ticker' to match data
  index: TrendingUp,   // Added index type
  term: Lightbulb,      // Added term type
  metric: Activity,     // Added metric type
  question: Lightbulb, // Group questions with topics/terms
  topic: Lightbulb,
  account: Briefcase,
  action: Activity,     // Kept for potential future use
  news: Newspaper,      // Kept for potential future use
  default: Hash,
};

// Fuse.js options
export const fuseOptions = {
  keys: ['value'], // Search only in the 'value' field
  includeScore: true,
  threshold: 0.4, // Adjust threshold for fuzziness (0 = exact, 1 = match anything)
}; 