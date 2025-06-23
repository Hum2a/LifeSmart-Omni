import React, { useState } from 'react';
import '../styles/WelcomePage.css';

const WelcomePage = ({ onNext }) => {
  const [showJourneyScreen, setShowJourneyScreen] = useState(false);

  if (showJourneyScreen) {
    return (
      <div className="welcome-page journey-screen">
        <h1 className="journey-title">Are you ready?</h1>
        <p className="journey-description">
          This takes less than 3 minutes. No right answers.
          <br />
          Just honest reflection.
        </p>
        <button 
          className="btn btn-primary-active"
          onClick={onNext}
        >
          Start my journey
        </button>
      </div>
    );
  }

  return (
    <div className="welcome-page">
      <h1 className="welcome-title">Welcome to Life Balance</h1>
      
      <div className="welcome-content">
        <p className="welcome-description">
          In just a few minutes, you'll map the key areas of your life — and discover how your <span className="highlight-text">time and money</span> influence each one.
        </p>

        <div className="welcome-section-container">
          <div className="welcome-section matters">
            <h2>Why it matters</h2>
            <p>Clearer picture = smarter financial decisions</p>
          </div>

          <div className="welcome-section get">
            <h2>What you'll get</h2>
            <p>A personalized LifeBalance Snapshot to guide your financial-literacy journey and build a life that reflects your values.</p>
          </div>
        </div>

        <button 
          className="btn btn-primary-inactive"
          onClick={() => setShowJourneyScreen(true)}
        >
          Lets Begin
        </button>
      </div>
    </div>
  );
};

export default WelcomePage; 