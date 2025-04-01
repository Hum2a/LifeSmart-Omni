import axios from 'axios';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const db = getFirestore();
const API_KEY = process.env.REACT_APP_FINNHUB_API_KEY;

// List of companies to fetch real-time data for
const companies = [
  { name: 'Amazon', symbol: 'AMZN' },
  { name: 'Apple', symbol: 'AAPL' },
  { name: 'Barclays', symbol: 'BCS' },
  { name: 'Boeing', symbol: 'BA' },
  { name: 'Coca-Cola', symbol: 'KO' },
  { name: 'Disney', symbol: 'DIS' },
  { name: 'IBM', symbol: 'IBM' },
  { name: 'Microsoft', symbol: 'MSFT' },
  { name: 'Nike', symbol: 'NKE' },
  { name: 'NVIDIA', symbol: 'NVDA' },
  { name: 'Pfizer', symbol: 'PFE' },
  { name: 'Roblox', symbol: 'RBLX' },
  { name: 'Shell', symbol: 'SHEL' },
  { name: 'Spotify', symbol: 'SPOT' },
  { name: 'Tesla', symbol: 'TSLA' },
  { name: 'Visa', symbol: 'V' },
  { name: 'Walmart', symbol: 'WMT' }
];

// Function to fetch real-time stock data from Finnhub
const fetchRealTimeStockData = async (symbol) => {
  console.log(`Fetching data for ${symbol}`);
  try {
    // Fetch real-time quote data
    const quoteResponse = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
    const quoteData = quoteResponse.data;

    // Fetch historical daily data
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    const historicalResponse = await axios.get(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${Math.floor(oneYearAgo.getTime() / 1000)}&to=${Math.floor(today.getTime() / 1000)}&token=${API_KEY}`
    );
    const historicalData = historicalResponse.data;

    // Format data for Firestore storage
    const now = new Date();
    const day = now.toISOString().split('T')[0];
    const time = now.toISOString().split('T')[1].split('.')[0];

    // Store real-time data
    const realTimeDocRef = doc(db, 'Real Time Stock Market Data', symbol);
    const realTimeData = {
      days: {
        [day]: {
          [time]: {
            currentPrice: quoteData.c,
            highPrice: quoteData.h,
            lowPrice: quoteData.l,
            openPrice: quoteData.o,
            previousClosePrice: quoteData.pc
          }
        }
      }
    };

    const realTimeDocSnap = await getDoc(realTimeDocRef);
    if (realTimeDocSnap.exists()) {
      await updateDoc(realTimeDocRef, {
        [`days.${day}.${time}`]: realTimeData.days[day][time]
      });
    } else {
      await setDoc(realTimeDocRef, realTimeData);
    }

    // Store historical data in format compatible with PortfolioDisplay
    if (historicalData.s === 'ok') {
      const stockMarketData = {
        data: {
          'Meta Data': {
            '1. Information': `Daily Time Series for ${symbol}`,
            '2. Symbol': symbol,
            '3. Last Refreshed': now.toISOString(),
            '4. Output Size': 'Full size',
            '5. Time Zone': 'US/Eastern'
          },
          'Time Series (Daily)': {}
        }
      };

      // Convert historical data to required format
      for (let i = 0; i < historicalData.t.length; i++) {
        const date = new Date(historicalData.t[i] * 1000).toISOString().split('T')[0];
        stockMarketData.data['Time Series (Daily)'][date] = {
          '1. open': historicalData.o[i].toString(),
          '2. high': historicalData.h[i].toString(),
          '3. low': historicalData.l[i].toString(),
          '4. close': historicalData.c[i].toString(),
          '5. volume': historicalData.v[i].toString()
        };
      }

      // Store historical data
      const historicalDocRef = doc(db, 'Stock Market Data', symbol);
      await setDoc(historicalDocRef, stockMarketData);
    }

    console.log(`Data for ${symbol} saved successfully.`);
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
  }
};

// Function to fetch data for all companies
const fetchAllRealTimeStockData = async () => {
  for (const company of companies) {
    await fetchRealTimeStockData(company.symbol);
    // Add a small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

export { fetchRealTimeStockData, fetchAllRealTimeStockData, companies };
