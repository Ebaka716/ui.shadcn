import { NextRequest, NextResponse } from 'next/server';

// Define interfaces for expected data structures (optional but good practice)
// Use Record<string, unknown> for now to allow any object structure
type PriceData = Record<string, unknown>;
type QuoteData = Record<string, unknown>;
type TimeSeriesData = Record<string, unknown>;
type ProfileData = Record<string, unknown>;
type EarningsData = Record<string, unknown>;

interface CombinedData {
  price: PriceData | null;
  quote: QuoteData | null;
  timeSeries: TimeSeriesData | null;
  profile: ProfileData | null;
  earnings: EarningsData | null;
  errors: Record<string, string>; // To store any errors encountered
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticker = searchParams.get('ticker');
  const interval = searchParams.get('interval') || '1day'; // Default interval for time series

  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker symbol is required' }, { status: 400 });
  }

  if (!apiKey) {
    console.error('API key for Twelve Data is not configured.');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const baseUrl = 'https://api.twelvedata.com';
  const endpoints = {
    price: `${baseUrl}/price?symbol=${ticker}&apikey=${apiKey}`,
    quote: `${baseUrl}/quote?symbol=${ticker}&apikey=${apiKey}`,
    timeSeries: `${baseUrl}/time_series?symbol=${ticker}&interval=${interval}&apikey=${apiKey}`,
    profile: `${baseUrl}/profile?symbol=${ticker}&apikey=${apiKey}`,
    earnings: `${baseUrl}/earnings?symbol=${ticker}&apikey=${apiKey}`,
  };

  try {
    // Fetch all endpoints in parallel
    const results = await Promise.allSettled([
      fetch(endpoints.price).then(res => res.ok ? res.json() : Promise.reject(res.statusText)),
      fetch(endpoints.quote).then(res => res.ok ? res.json() : Promise.reject(res.statusText)),
      fetch(endpoints.timeSeries).then(res => res.ok ? res.json() : Promise.reject(res.statusText)),
      fetch(endpoints.profile).then(res => res.ok ? res.json() : Promise.reject(res.statusText)),
      fetch(endpoints.earnings).then(res => res.ok ? res.json() : Promise.reject(res.statusText)),
    ]);

    const combinedData: CombinedData = {
      price: null,
      quote: null,
      timeSeries: null,
      profile: null,
      earnings: null,
      errors: {},
    };

    // Process results
    if (results[0].status === 'fulfilled') combinedData.price = results[0].value;
    else combinedData.errors.price = results[0].reason;

    if (results[1].status === 'fulfilled') combinedData.quote = results[1].value;
    else combinedData.errors.quote = results[1].reason;

    if (results[2].status === 'fulfilled') combinedData.timeSeries = results[2].value;
    else combinedData.errors.timeSeries = results[2].reason;

    if (results[3].status === 'fulfilled') combinedData.profile = results[3].value;
    else combinedData.errors.profile = results[3].reason;

    if (results[4].status === 'fulfilled') combinedData.earnings = results[4].value;
    else combinedData.errors.earnings = results[4].reason;

    // Check if all requests failed
    const allFailed = Object.values(combinedData).every(val => val === null || (typeof val === 'object' && Object.keys(val).length === 0));
    if (allFailed && Object.keys(combinedData.errors).length > 0) {
        console.error('All Twelve Data API calls failed for ticker:', ticker, combinedData.errors);
        return NextResponse.json({ error: 'Failed to fetch any data from Twelve Data', details: combinedData.errors }, { status: 502 }); // Bad Gateway might be appropriate
    }

    // Return the combined data (including any errors for specific endpoints)
    return NextResponse.json(combinedData);

  } catch (error) {
    // Catch unexpected errors during the Promise.allSettled or setup phase
    console.error('Error fetching stock data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 