import React from 'react';

const Page1 = ({ onNext, onComplete }) => {
  return (
    <div className="investing-course-page">
      <h2>Introduction to Investing</h2>
      <div className="investing-course-page-content">
        <p>
          Investing is the act of allocating resources, usually money, with the expectation of generating an income or profit over time. 
          In this course, you'll learn the fundamentals of investing in the stock market.
        </p>
        <p>
          Key concepts we'll cover:
        </p>
        <ul>
          <li>Understanding what stocks are</li>
          <li>How the stock market works</li>
          <li>Basic investment strategies</li>
          <li>Risk management</li>
        </ul>
      </div>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default Page1; 