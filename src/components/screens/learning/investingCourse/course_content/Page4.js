import React from 'react';

const Page4 = ({ onNext, onComplete }) => {
  return (
    <div className="investing-course-page">
      <h2>Understanding Stock Prices</h2>
      <div className="investing-course-page-content">
        <p>
          Stock prices are influenced by various factors, including company performance, market conditions, and investor sentiment. 
          Understanding these factors is crucial for making informed investment decisions.
        </p>
        <p>
          Factors affecting stock prices:
        </p>
        <ul>
          <li>Company earnings and financial health</li>
          <li>Industry trends and competition</li>
          <li>Economic conditions</li>
          <li>Market sentiment and news</li>
        </ul>
      </div>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Page4; 