import React from 'react';

const Page7 = ({ onNext, onComplete }) => {
  return (
    <div className="investing-course-page">
      <h2>Market Analysis</h2>
      <div className="investing-course-page-content">
        <p>
          Market analysis helps investors make informed decisions. There are two main types of analysis: fundamental and technical.
        </p>
        <p>
          Types of analysis:
        </p>
        <ul>
          <li>Fundamental analysis - Evaluating company financials and business model</li>
          <li>Technical analysis - Studying price patterns and market trends</li>
          <li>Market sentiment analysis - Understanding investor psychology</li>
          <li>Economic analysis - Assessing broader market conditions</li>
        </ul>
      </div>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Page7; 