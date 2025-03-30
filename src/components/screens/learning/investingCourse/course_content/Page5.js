import React from 'react';

const Page5 = ({ onNext, onComplete }) => {
  return (
    <div className="investing-course-page">
      <h2>Investment Strategies</h2>
      <div className="investing-course-page-content">
        <p>
          Different investment strategies suit different goals and risk tolerances. Understanding these strategies helps you make 
          better investment decisions.
        </p>
        <p>
          Common strategies:
        </p>
        <ul>
          <li>Value investing - Buying undervalued stocks</li>
          <li>Growth investing - Focusing on companies with high growth potential</li>
          <li>Dividend investing - Seeking stocks with regular dividend payments</li>
          <li>Index investing - Following market indices</li>
        </ul>
      </div>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Page5; 