import React from 'react';
import '../styles/LifeBalanceHeader.css';

const LifeBalanceHeader = ({ currentStep, totalSteps }) => {
  return (
    <div className="life-balance-header">
      <div className="logo-container">
        <div className="logo-icon">💡</div>
        <span className="logo-text">LifeSmart</span>
      </div>
      {currentStep && totalSteps && (
        <div className="question-progress">
          Q {currentStep}/{totalSteps}
        </div>
      )}
    </div>
  );
};

export default LifeBalanceHeader; 