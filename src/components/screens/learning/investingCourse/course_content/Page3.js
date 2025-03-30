import React from 'react';

const Page3 = ({ onNext, onComplete }) => {
  return (
    <div className="investing-course-page">
      <h2>How the Stock Market Works</h2>
      <div className="investing-course-page-content">
        <p>
          The stock market is a platform where stocks are bought and sold. It's a complex system that matches buyers with sellers 
          and determines stock prices through supply and demand.
        </p>
        <p>
          Key concepts:
        </p>
        <ul>
          <li>Stock exchanges (NYSE, NASDAQ)</li>
          <li>Market orders vs. limit orders</li>
          <li>Bid and ask prices</li>
          <li>Market makers and liquidity</li>
        </ul>
      </div>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Page3; 