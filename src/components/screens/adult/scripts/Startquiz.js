import React from 'react';
import '../styles/Startquiz.css';
import { FaWallet, FaHome, FaChartBar } from 'react-icons/fa';

const Startquiz = ({ onStartQuiz }) => {
  return (
    <div className="sq-container sq">
      <div className="sq-green-light" />
      <div className="sq-header sq-header">
        <img src={process.env.PUBLIC_URL + '/logo/LifeSmartSessionsWhite.png'} alt="LifeSmart Logo" style={{ width: 300, height: 100 }} />
      </div>
      <div className="sq-main sq-main">
        <div className="sq-left sq-left">
          <h1 className="sq-title sq-title">Take the Quiz - Take Control of Your Finances</h1>
          <p className="sq-description sq-description">
            Learn to manage your money with confidence. LifeSmart's Financial Quiz helps you test your knowledge and build smarter financial habits—one question at a time.
          </p>
          <button className="sq-start-btn sq-start-btn" onClick={onStartQuiz}>START QUIZ</button>
        </div>
        <div className="sq-cards-container sq-cards-container">
          <div className="sq-card sq-card-active sq-card-budget">
            <FaWallet size={48} style={{ marginTop: 32, marginLeft: 32 }} />
            <div className="sq-card-label">Budget</div>
          </div>
          <div className="sq-card sq-card-mortgage">
            <FaHome size={48} style={{ marginTop: 32, marginLeft: 32 }} />
            <div className="sq-card-label">Mortgage</div>
          </div>
          <div className="sq-card sq-card-investment">
            <FaChartBar size={48} style={{ marginTop: 32, marginLeft: 32 }} />
            <div className="sq-card-label">Investment</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Startquiz;
