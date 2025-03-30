import React from 'react';

const Page2 = ({ onNext, onComplete }) => {
  return (
    <div className="investing-course-page">
      <h2>What are Stocks?</h2>
      <div className="investing-course-page-content">
        <p>
          Stocks represent ownership shares in a company. When you buy a stock, you're purchasing a small piece of that company, 
          making you a shareholder.
        </p>
        <p>
          Types of stocks:
        </p>
        <ul>
          <li>Common stocks - Basic ownership shares with voting rights</li>
          <li>Preferred stocks - Shares with fixed dividends but limited voting rights</li>
          <li>Growth stocks - Companies expected to grow faster than the market</li>
          <li>Value stocks - Companies trading below their intrinsic value</li>
        </ul>
      </div>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Page2; 