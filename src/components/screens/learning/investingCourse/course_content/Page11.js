import React from 'react';
import '../../../styles/InvestingCoursePages.css';

const Page11 = ({ onComplete }) => {
  return (
    <div className="investing-course-page">
      <h2>Course Summary</h2>
      <div className="investing-course-page-content">
        <p>Congratulations! You've completed the Investing Course. Let's review what you've learned:</p>
        <ul>
          <li>Understanding stocks and their role in the market</li>
          <li>Investment strategies and portfolio management</li>
          <li>Market analysis and research techniques</li>
          <li>Investment psychology and risk management</li>
        </ul>
        <p>You're now ready to take the final exam to demonstrate your knowledge and earn your certificate.</p>
        <button onClick={onComplete}>Take Final Exam</button>
      </div>
    </div>
  );
};

export default Page11; 