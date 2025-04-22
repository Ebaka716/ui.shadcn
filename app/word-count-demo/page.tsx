"use client";

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Define Content Block Types --- 

type ContentBlockBase = {
  id: string; // For unique key prop during rendering
};

type ParagraphBlock = ContentBlockBase & {
  type: 'paragraph';
  title: string;
  text: string; // Keep paragraph simple
};

// Add RichTextBlock type
type RichTextBlock = ContentBlockBase & {
  type: 'richText';
  title: string;
  content: React.ReactNode; // Use content for JSX
};

type FollowUpActionsBlock = ContentBlockBase & {
  type: 'actions';
  title: string;
  actions: { text: string; variant?: "link" | "outline" | "default" }[];
};

type DataSnippetBlock = ContentBlockBase & {
    type: 'snippet';
    title: string;
    data: { label: string; value: string }[]; 
};

// Update Union type
type ContentBlock = ParagraphBlock | RichTextBlock | FollowUpActionsBlock | DataSnippetBlock;

// --- Update Demo Content Structure --- 

const steps = [1, 3, 5, 7, 9];

interface DemoContent {
  preamble: string;
  exampleQuery: string;
  contentBlocks: ContentBlock[]; 
}

// --- Update Content Definitions --- 

const demoContentByStep: { [key: number]: DemoContent } = {
  1: {
    preamble: "With only one word (e.g., a ticker symbol like 'ORI'), the intent is ambiguous. Results provide a high-level overview, requiring further user navigation for specifics.",
    exampleQuery: "ORI",
    contentBlocks: [
      { 
        id: 'ori-overview-1', 
        type: 'richText', // <-- Change type to richText
        title: "ORI - Oaktree Real Estate Income Trust, Inc.", 
        // Move JSX to 'content' property
        content: (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Oaktree Real Estate Income Trust, Inc. (ORI) is a real estate investment trust (REIT). 
              REITs like ORI primarily invest in income-producing real estate assets, aiming to generate steady income for investors, often distributed through dividends, alongside potential long-term capital appreciation. 
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Since the query &apos;ORI&apos; is very broad, providing only the company symbol, the system presents this general overview. To get more specific information, you would typically need to refine your query. For example, you could ask about:
            </p>
            <ul className="list-disc pl-5 mt-1 text-sm text-muted-foreground">
              <li>ORI&apos;s recent financial performance</li>
              <li>Dividend history and yield</li>
              <li>Specific property types in their portfolio</li>
              <li>Comparison to other mortgage REITs</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              This initial view serves as a starting point for discovery.
            </p>
          </>
        )
      },
    ]
  },
  3: {
    preamble: "With three words (e.g., 'ORI dividend payout'), the intent becomes clearer, focusing on dividends. Results are more targeted but still offer broader context.",
    exampleQuery: "ORI dividend payout",
    contentBlocks: [
      { 
        id: 'ori-dividend-info-3', 
        type: 'snippet',
        title: "ORI Dividend Information", 
        data: [
            { label: "Yield (Simulated)", value: "5.2%" },
            { label: "Payout Frequency", value: "Quarterly" },
            { label: "Last Ex-Dividend Date", value: "Approx. 3 weeks ago" },
            { label: "Note", value: "Consider history/sustainability" }
        ]
      },
      { 
        id: 'ori-followup-3', 
        type: 'actions', 
        title: "Explore Further", 
        actions: [
          { text: "View Dividend History" },
          { text: "Analyze Payout Sustainability" },
          { text: "Compare to Peers", variant: "link" },
        ]
      }
    ]
  },
  5: {
    preamble: "With five words (e.g., 'ORI dividend history last year'), the intent is quite specific. Results focus sharply on the requested historical data, with less emphasis on broad context.",
    exampleQuery: "ORI dividend history last year",
    contentBlocks: [
      { 
        id: 'ori-history-table-5', 
        type: 'snippet', 
        title: "ORI Dividend History (Last 12 Months - Simulated)", 
        data: [
            { label: "Q2 2024", value: "$0.15" },
            { label: "Q1 2024", value: "$0.15" },
            { label: "Q4 2023", value: "$0.14" },
            { label: "Q3 2023", value: "$0.14" },
        ]
      },
      { 
        id: 'ori-history-analysis-5', 
        type: 'paragraph', 
        title: "Dividend Consistency", 
        text: "The simulated data shows consistent quarterly payments over the last year, with a slight increase noted towards the end of 2023. Analyzing longer trends would provide more insight into growth patterns."
      },
      { 
        id: 'ori-related-actions-5', 
        type: 'actions', 
        title: "Related Analysis", 
        actions: [
          { text: "View 5-Year History" },
          { text: "Analyze Dividend Growth Rate" },
        ]
      }
    ]
  },
  7: {
    preamble: "With seven words (e.g., 'compare ORI dividend payout history vs VNQ'), the intent involves comparison. Results directly compare the specified entities on the requested metric.",
    exampleQuery: "compare ORI dividend payout history vs VNQ",
    contentBlocks: [
      { 
        id: 'ori-vnq-compare-7', 
        type: 'snippet', 
        title: "Dividend Comparison: ORI vs VNQ (Simulated TTM)", 
        data: [
            { label: "Yield", value: "5.2% | 3.8%" },
            { label: "1-Yr Growth", value: "+7.1% | +4.5%" },
            { label: "Payout Freq.", value: "Quarterly | Quarterly" },
        ]
      },
      { 
        id: 'ori-vnq-summary-7', 
        type: 'paragraph', // Keep as paragraph, text is simple string
        title: "Comparison Summary", 
        text: "ORI shows a higher simulated yield and recent growth compared to the broader VNQ ETF. However, VNQ offers diversification across many REITs, potentially lowering risk. The choice depends on individual risk tolerance and income needs."
      },
      { 
        id: 'ori-vnq-actions-7', 
        type: 'actions', 
        title: "Deeper Comparison", 
        actions: [
          { text: "Compare Total Return" },
          { text: "Analyze Risk Metrics" },
          { text: "Explore VNQ Holdings", variant: "link" },
        ]
      }
    ]
  },
  9: {
    preamble: "With nine or more words (e.g., 'what affects ORI dividend payout history trends long term?'), the query is analytical. Results provide deeper analysis, potential influencing factors, and forward-looking statements (where appropriate and available).",
    exampleQuery: "what affects ORI dividend payout history trends long term?",
    contentBlocks: [
      { 
        id: 'ori-factors-9', 
        type: 'richText', // <-- Change type to richText
        title: "Factors Influencing ORI Long-Term Dividend Trends", 
        // Move JSX to 'content' property
        content: ( 
            <>
                <p className="text-sm text-muted-foreground mb-2">Several factors impact long-term dividend sustainability and growth for REITs like ORI:</p>
                <ul className='list-disc pl-5 mt-1 text-sm text-muted-foreground'>
                    <li><strong>Interest Rates:</strong> Rising rates increase borrowing costs, potentially impacting funds available for dividends.</li>
                    <li><strong>Property Market Health:</strong> Rental income and property values directly affect revenue.</li>
                    <li><strong>Company Performance:</strong> Funds From Operations (FFO) and payout ratios are key indicators.</li>
                    <li><strong>Economic Conditions:</strong> Broader economic health influences tenant stability and demand.</li>
                </ul>
            </>
        ) 
      },
      { 
        id: 'ori-analysis-actions-9', 
        type: 'actions', 
        title: "Analytical Tools", 
        actions: [
          { text: "Analyze FFO Trend" },
          { text: "Correlate with Interest Rates" },
          { text: "View Analyst Ratings" },
        ]
      },
       { 
        id: 'ori-outlook-9', 
        type: 'snippet', 
        title: "Simulated Outlook Snippets", 
        data: [
            { label: "Analyst Consensus", value: "Cautiously Optimistic" },
            { label: "Key Risk", value: "Interest Rate Sensitivity" },
            { label: "Potential Upside", value: "Strong Property Portfolio" },
        ]
      },
    ]
  },
};

// --- Update Rendering Logic (inside the component) --- 

export default function WordCountDemoPage() {
  const [currentStep, setCurrentStep] = useState<string>("1");
  const currentContent = demoContentByStep[parseInt(currentStep, 10)];

  const animationVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const transitionProps = {
    duration: 0.3,
    ease: "easeInOut"
  };

  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold">Word Count Demo</h1>

      {/* Stepper using Tabs */}
      <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {steps.map((step) => (
            <TabsTrigger key={step} value={step.toString()}>
              {step} Words
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep} 
          variants={animationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transitionProps}
          className="space-y-6"
        >
          {/* Dynamic Preamble */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Context based on Word Count ({currentStep})</AlertTitle>
            <AlertDescription>
              {currentContent?.preamble || "Select a word count step."}
            </AlertDescription>
          </Alert>

          {/* Dynamic Results - Updated Rendering */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Results for: &quot;<span className="italic">{currentContent?.exampleQuery || '...'}</span>&quot;
            </h2>
            {currentContent?.contentBlocks && currentContent.contentBlocks.length > 0 ? (
              currentContent.contentBlocks.map((block) => (
                <Card key={block.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{block.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Render paragraph type */} 
                    {block.type === 'paragraph' && (
                      <p className="text-sm text-muted-foreground">{block.text}</p>
                    )}
                    {/* Render richText type (directly renders content) */}
                    {block.type === 'richText' && (
                       <div className="text-sm text-muted-foreground">
                         {block.content} 
                       </div>
                    )}
                    {/* Render actions type */}
                    {block.type === 'actions' && (
                      <div className="flex flex-wrap gap-2">
                        {block.actions.map((action, index) => (
                          <Button key={index} variant={action.variant || 'outline'} size="sm">
                            {action.text}
                          </Button>
                        ))}
                      </div>
                    )}
                    {/* Render snippet type */}
                    {block.type === 'snippet' && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {block.data.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.label}</TableCell>
                              <TableCell className="text-right">{item.value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No results defined for this step.</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 