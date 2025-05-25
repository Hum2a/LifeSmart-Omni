import React, { useState, useEffect } from 'react';
import './Question2.css';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';

const Question2 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));

  const correctAnswer = 'A';

  useEffect(() => {
    let intervalId;
    if (timerStarted && timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerStarted, timer]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const progressBarWidth = (timer / 180) * 100;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  const submitAnswers = () => {
    setShowResults(true);
    // Scoring: 3 points for A, 2 for D/E, 1 for B/C
    const pointsArray = teamAnswers.map(answer => {
      if (answer === 'A') return 3;
      if (answer === 'D' || answer === 'E') return 2;
      if (answer === 'B' || answer === 'C') return 1;
      return 0;
    });
    onAwardPoints(pointsArray);
  };

  const nextQuestion = () => {
    onNextQuestion();
  };

  const handleTeamAnswerChange = (index, value) => {
    const newAnswers = [...teamAnswers];
    newAnswers[index] = value;
    setTeamAnswers(newAnswers);
  };

  return (
    <div className="question2-container">
      {/* Progress Bar Container */}
      <div className="question2-progress-bar-container">
        <div className="question2-progress-bar">
          <div className="question2-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>
        <div className="question2-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question2-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question2-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Header */}
      <div className="question2-task-header">
        <div className="question2-header-content">
          <div className="question2-points-section">
            <h3>Challenge 2</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question2-lightning-bolt" />
            <p className="question2-points">3 points</p>
          </div>
          <div className="question2-button-container">
            <button className="question2-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <p>
          Two months later, Zara lands her first colony job as a junior rover-tech on New Horizon.<br />
          She earns <strong>4,000 Mars Credits (MC)</strong> per month after the mandatory “O₂-tax” has already been deducted.<br />
          Below are her planned monthly costs (all in MC):
        </p>
        <div className="question2-cost-table-wrapper">
          <table className="question2-cost-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Cost (MC)</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Habitat pod rent</td><td>Includes air-recycling fee</td><td>1 150</td><td>Need</td></tr>
              <tr><td>Life-Support</td><td>Food, water, basic utilities</td><td>900</td><td>Need</td></tr>
              <tr><td>Transport</td><td>Mag-tram pass to the rover bay</td><td>240</td><td>Need</td></tr>
              <tr><td>Colony Data plan</td><td>Communicator & holo-net</td><td>210</td><td>Want</td></tr>
              <tr><td>Exploration & Fun</td><td>Holo-games subscription, eating out with friends</td><td>580</td><td>Want</td></tr>
              <tr><td>Safety Fund auto-transfer</td><td>Emergency savings (20% of income target)</td><td>?</td><td>Savings</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Section */}
      {showResults ? (
        <div className="question2-result-section">
          <h4>Correct Answer:</h4>
          <div className="question2-correct-answer">
            Option A: 120 MC
          </div>
          <div className="question2-correct-answer-description">
            <strong>Calculations:</strong>
            <ul>
              <li>Safety-Fund (20% of 4,000 MC) = 800 MC</li>
              <li>Total fixed & variable costs = 1 150 + 900 + 240 + 210 + 580 + 800 = 3 880 MC</li>
              <li>Leftover = 4,000 – 3,880 = <strong>120 MC</strong> → Option A</li>
            </ul>
          </div>
          <h4 className="question2-your-answers">Your answers</h4>
          <div className="question2-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question2-team-answer-box">
                <p>{team.name}</p>
                <div className={teamAnswers[index] === correctAnswer ? 'question2-correct' : 'question2-incorrect'}>
                  {teamAnswers[index] || '-'}
                </div>
              </div>
            ))}
          </div>
          <button className="question2-next-button" onClick={nextQuestion}>Next</button>
        </div>
      ) : (
        <div>
          {/* Question Section */}
          <div className="question2-question-section">
            <p className="question2-question">Calculate how much money she has left over after all her expenses including the safety fund auto-transfer.</p>
          </div>
          {/* Multiple Choice Options */}
          <div className="question2-choices-container">
            <button className="question2-choice-button">A. 120 MC</button>
            <button className="question2-choice-button">B. 200 MC</button>
            <button className="question2-choice-button">C. 920 MC</button>
            <button className="question2-choice-button">D. 304 MC</button>
            <button className="question2-choice-button">E. 3080 MC</button>
          </div>
          {/* Team Answer Section */}
          <div className="question2-team-answer-section">
            <h4>Your answers</h4>
            <div className="question2-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question2-team-answer-box">
                  <p>{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="question2-team-answer-select"
                  >
                    <option value="">Select an answer</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              ))}
            </div>
            <button 
              className="question2-submit-button" 
              onClick={submitAnswers}
              disabled={teamAnswers.some(answer => !answer)}
            >
              Submit Answers
            </button>
          </div>
        </div>
      )}
      {/* Hint Modal */}
      {showHintModal && (
        <div className="question2-hint-modal-overlay">
          <div className="question2-hint-modal">
            <h3>Hint</h3>
            <p>Remember to include the safety fund auto-transfer (20% of income) as an expense before calculating the leftover.</p>
            <button onClick={() => setShowHintModal(false)} className="question2-close-modal-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question2;