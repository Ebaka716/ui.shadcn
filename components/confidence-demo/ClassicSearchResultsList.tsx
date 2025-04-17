import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClassicSearchResultsListProps {
  maxItems?: number; // Optional prop to limit items shown
}

const placeholderLinks = [
  { url: "#", title: "HSA Contribution Limits for 2024 - IRS", snippet: "Official IRS guidelines for maximum Health Savings Account contributions for individuals and families in 2024." },
  { url: "#", title: "What are Qualified Medical Expenses for an HSA?", snippet: "Learn about the types of medical expenses you can pay for tax-free using your HSA funds." },
  { url: "#", title: "Best HSA Providers Compared - NerdWallet", snippet: "A comparison of top HSA providers based on fees, investment options, and usability." },
  { url: "#", title: "Using Your HSA for Retirement Savings", snippet: "Explore the triple tax advantages of HSAs and how they can supplement your retirement strategy." },
  { url: "#", title: "HSA Eligibility Requirements", snippet: "Find out if you qualify for an HSA based on your health insurance plan (HDHP) and other factors." },
  { url: "#", title: "Investing HSA Funds: A Beginner's Guide", snippet: "Understand the basics of investing your HSA money for potential long-term growth." },
  { url: "#", title: "HSA vs. FSA: Key Differences Explained", snippet: "Compare Health Savings Accounts (HSAs) and Flexible Spending Accounts (FSAs) to see which is right for you." },
  { url: "#", title: "How to Open an HSA Account", snippet: "Step-by-step guide on opening an HSA, choosing a provider, and making initial contributions." },
];

export function ClassicSearchResultsList({ maxItems }: ClassicSearchResultsListProps) {
  const itemsToShow = maxItems ? placeholderLinks.slice(0, maxItems) : placeholderLinks;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Classic Search Results</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {itemsToShow.map((link, index) => (
            <li key={index}>
              <a href={link.url} className="text-blue-600 hover:underline">
                <h3 className="font-medium">{link.title}</h3>
              </a>
              <p className="text-sm text-gray-600 mt-1">{link.snippet}</p>
            </li>
          ))}
        </ul>
        {maxItems && maxItems < placeholderLinks.length && (
          <p className="text-sm text-muted-foreground mt-3">...</p>
        )}
      </CardContent>
    </Card>
  );
} 