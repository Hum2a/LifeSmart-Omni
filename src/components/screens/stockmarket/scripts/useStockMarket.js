import { useState, useEffect } from 'react';
import { fetchAndSaveConversionRate } from '../api/ConversionRateChecker';
import { fetchAllRealTimeStockData } from '../api/FinnHubAPI';
import { getStockData } from '../api/stockService';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export const useStockMarket = () => {
  const [stockData, setStockData] = useState({});
  const [conversionRate, setConversionRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch and save conversion rate
        await fetchAndSaveConversionRate();
        
        // Fetch conversion rate from Firestore
        const db = getFirestore();
        const conversionDoc = await getDoc(doc(db, 'Conversion Rates', 'USD-GBP'));
        if (conversionDoc.exists()) {
          setConversionRate(conversionDoc.data().rate);
        }

        // Fetch real-time stock data
        await fetchAllRealTimeStockData();

        // Get latest stock data from Firestore
        const stocksSnapshot = await Promise.all([
          'AMZN', 'AAPL', 'BCS', 'BA', 'KO', 'DIS', 'IBM', 'MSFT', 'NKE', 
          'NVDA', 'PFE', 'RBLX', 'SHEL', 'SPOT', 'TSLA', 'V', 'WMT'
        ].map(async (symbol) => {
          const stockDoc = await getDoc(doc(db, 'Real Time Stock Market Data', symbol));
          if (stockDoc.exists()) {
            return { symbol, data: stockDoc.data() };
          }
          return null;
        }));

        const stockDataMap = stocksSnapshot.reduce((acc, stock) => {
          if (stock) {
            acc[stock.symbol] = stock.data;
          }
          return acc;
        }, {});

        setStockData(stockDataMap);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stock market data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllData();

    // Set up an interval to refresh data every 5 minutes
    const intervalId = setInterval(fetchAllData, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getLatestPrice = (symbol) => {
    if (!stockData[symbol]) return null;

    const days = stockData[symbol].days;
    if (!days) return null;

    // Get the latest day
    const latestDay = Object.keys(days).sort().pop();
    if (!latestDay) return null;

    // Get the latest time for that day
    const latestTime = Object.keys(days[latestDay]).sort().pop();
    if (!latestTime) return null;

    return days[latestDay][latestTime].currentPrice;
  };

  const convertToGBP = (usdPrice) => {
    if (!conversionRate || !usdPrice) return null;
    return usdPrice * conversionRate;
  };

  return {
    stockData,
    loading,
    error,
    conversionRate,
    getLatestPrice,
    convertToGBP
  };
}; 