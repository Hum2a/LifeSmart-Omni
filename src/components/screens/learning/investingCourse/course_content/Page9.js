import React from 'react';

const Page9 = ({ onNext, onComplete }) => {
  return (
    <div className="investing-course-page">
      <h2>Investment Psychology</h2>
      <div className="investing-course-page-content">
        <p>
          Understanding investment psychology helps you avoid common emotional pitfalls and make more rational investment decisions.
        </p>
        <p>
          Common psychological factors:
        </p>
        <ul>
          <li>Fear and greed - Managing emotional responses</li>
          <li>Confirmation bias - Seeking information that confirms beliefs</li>
          <li>Overconfidence - Avoiding excessive risk-taking</li>
          <li>Loss aversion - Understanding risk perception</li>
        </ul>
      </div>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Page9; 