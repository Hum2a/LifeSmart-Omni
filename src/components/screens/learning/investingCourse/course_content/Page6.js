import React from 'react';

const Page6 = ({ onNext, onComplete }) => {
  return (
    <div className="investing-course-page">
      <h2>Risk Management</h2>
      <div className="investing-course-page-content">
        <p>
          Risk management is crucial in investing. Understanding and managing risks helps protect your investments and achieve 
          long-term success.
        </p>
        <p>
          Key risk management concepts:
        </p>
        <ul>
          <li>Diversification - Spreading investments across different assets</li>
          <li>Position sizing - Managing the size of each investment</li>
          <li>Stop-loss orders - Limiting potential losses</li>
          <li>Risk-reward ratio - Evaluating potential returns vs. risks</li>
        </ul>
      </div>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Page6; 