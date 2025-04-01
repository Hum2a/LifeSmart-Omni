import React from 'react';
import { useStockMarket } from './useStockMarket';
import '../styles/StockMarket.css';

const StockMarketDisplay = () => {
  const { stockData, loading, error, conversionRate, getLatestPrice, convertToGBP } = useStockMarket();

  if (loading) {
    return <div className="stock-market-loading">Loading stock market data...</div>;
  }

  if (error) {
    return <div className="stock-market-error">Error: {error}</div>;
  }

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

  return (
    <div className="stock-market-container">
      <h2>Live Stock Market Data</h2>
      <div className="stock-market-grid">
        {companies.map((company) => {
          const usdPrice = getLatestPrice(company.symbol);
          const gbpPrice = convertToGBP(usdPrice);

          return (
            <div key={company.symbol} className="stock-market-card">
              <h3>{company.name}</h3>
              <p className="stock-symbol">{company.symbol}</p>
              <div className="stock-prices">
                <p>USD: ${usdPrice ? usdPrice.toFixed(2) : 'N/A'}</p>
                <p>GBP: £{gbpPrice ? gbpPrice.toFixed(2) : 'N/A'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockMarketDisplay; 