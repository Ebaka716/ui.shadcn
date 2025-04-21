// lib/simulationUtils.ts

// Define StockData type based on getStockData return value
export type StockData = ReturnType<typeof getStockData>;

// Simulate stock data
export function getStockData(ticker: string) {
  const isTicker = /^[A-Z]{1,5}$/.test(ticker);
  if (!isTicker) return null;
  
  // Simulate company name based on ticker (very basic)
  const companyName = 
    ticker === "AAPL" ? "Apple Inc." : 
    ticker === "GOOGL" ? "Alphabet Inc." : 
    ticker === "MSFT" ? "Microsoft Corporation" :
    `${ticker} Holdings Inc.`; // Generic fallback

  const price = (Math.random() * 1000 + 50).toFixed(2);
  const change = (Math.random() * 50 - 25);
  const changePercent = (change / parseFloat(price) * 100).toFixed(2);
  const volume = Math.floor(Math.random() * 10000000 + 100000).toLocaleString();
  const marketCap = (Math.random() * 2 + 0.5).toFixed(2) + 'T';
  const peRatio = (Math.random() * 30 + 10).toFixed(1);
  const dividendYield = (Math.random() * 5).toFixed(2) + '%';
  const analystRating = Math.random() > 0.6 ? 'Buy' : Math.random() > 0.3 ? 'Hold' : 'Sell';
  const ratingValue = analystRating === 'Buy' ? 85 : analystRating === 'Hold' ? 50 : 20;
  
  return { 
    ticker, 
    companyName, // Added company name
    price, 
    change: change.toFixed(2), 
    changePercent, 
    volume, 
    marketCap, 
    peRatio, 
    dividendYield, 
    analystRating, 
    ratingValue, 
    isUp: change >= 0 
  };
}

// Define GeneralInfoData based on getGeneralInfo return value
export type GeneralInfoData = ReturnType<typeof getGeneralInfo>;

// Simulate general info
export function getGeneralInfo(term: string) {
  return {
    definition: `This is a placeholder definition for "${term}". Financial data APIs would provide real information.`,
    relatedTerms: ['Term A', 'Term B', 'Term C'].filter(() => Math.random() > 0.5),
    sentiment: Math.random() > 0.6 ? 'Positive' : Math.random() > 0.3 ? 'Neutral' : 'Negative',
  };
}

// Define return type for myNewsData for clarity
export interface MyNewsData {
  newsItems: { id: number; headline: string; source: string; impact: string; }[];
  accounts: { id: string; name: string; balance: string; change: string; }[];
  movers: { id: string; ticker: string; changePercent: string; }[];
  nextActions: { id: string; text: string; }[];
}

// Simulate data for "myNews"
export function getMyNewsData(): MyNewsData {
  return {
    newsItems: [
      { id: 1, headline: "Market Reacts Positively to Fed Announcement", source: "Global Financial Times", impact: "Positive" },
      { id: 2, headline: "Tech Sector Sees Pullback Amid Profit Taking", source: "Market Watchers", impact: "Negative" },
      { id: 3, headline: "Energy Prices Surge on Geopolitical Tensions", source: "Energy News Hub", impact: "Neutral" },
    ],
    accounts: [
      { id: 'acc1', name: 'Checking', balance: `$${(Math.random() * 5000 + 1000).toFixed(2)}`, change: `+${(Math.random() * 50).toFixed(2)}` },
      { id: 'acc2', name: 'Savings', balance: `$${(Math.random() * 20000 + 5000).toFixed(2)}`, change: `+${(Math.random() * 10).toFixed(2)}` },
      { id: 'acc3', name: 'Investment Portfolio', balance: `$${(Math.random() * 150000 + 50000).toFixed(2)}`, change: `${(Math.random() * 2 - 1) > 0 ? '+' : '-'}${(Math.random() * 1500).toFixed(2)}` },
    ],
    movers: [
      { id: 'm1', ticker: 'XYZ', changePercent: `+${(Math.random() * 5 + 2).toFixed(1)}%` },
      { id: 'm2', ticker: 'ABC', changePercent: `+${(Math.random() * 3 + 1).toFixed(1)}%` },
      { id: 'm3', ticker: 'DEF', changePercent: `-${(Math.random() * 4 + 1).toFixed(1)}%` },
    ],
    nextActions: [
      { id: 'n1', text: "Review Portfolio Allocation" },
      { id: 'n2', text: "Analyze Recent Market Trends" },
    ]
  };
} 