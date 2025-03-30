import React from 'react';

const Page8 = ({ onNext, onComplete }) => {
  return (
    <div className="investing-course-page">
      <h2>Portfolio Management</h2>
      <div className="investing-course-page-content">
        <p>
          Portfolio management involves creating and maintaining a collection of investments that align with your financial goals 
          and risk tolerance.
        </p>
        <p>
          Key aspects:
        </p>
        <ul>
          <li>Asset allocation - Balancing different types of investments</li>
          <li>Rebalancing - Maintaining desired investment mix</li>
          <li>Performance monitoring - Tracking investment returns</li>
          <li>Tax efficiency - Managing tax implications</li>
        </ul>
      </div>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Page8; 