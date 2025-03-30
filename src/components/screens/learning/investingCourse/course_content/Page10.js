import React from 'react';

const Page10 = ({ onNext, onComplete }) => {
  return (
    <div className="investing-course-page">
      <h2>Long-term Investing</h2>
      <div className="investing-course-page-content">
        <p>
          Long-term investing focuses on building wealth over time through consistent investment strategies and patience.
        </p>
        <p>
          Key principles:
        </p>
        <ul>
          <li>Time in the market vs. timing the market</li>
          <li>Compound interest and its benefits</li>
          <li>Regular investment contributions</li>
          <li>Staying invested during market volatility</li>
        </ul>
      </div>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Page10; 