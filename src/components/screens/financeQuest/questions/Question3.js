import React, { useState, useEffect } from 'react';
import './Question3.css';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';

const Question3 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill(''));

  // Points mapping: A=1, B=4, C=0, D=3, E=2
  const pointsMapping = { A: 1, B: 4, C: 0, D: 3, E: 2 };
  const correctAnswer = 'B';

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
    const pointsArray = teamAnswers.map(answer => pointsMapping[answer] || 0);
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

  // For color-coding points (optional, can be removed if not needed)
  const getPointsColor = (points) => {
    const minPoints = 0;
    const maxPoints = 4;
    const coldColor = [0, 0, 255]; // Blue
    const warmColor = [0, 255, 0]; // Green
    const ratio = (points - minPoints) / (maxPoints - minPoints);
    const r = Math.round(coldColor[0] + ratio * (warmColor[0] - coldColor[0]));
    const g = Math.round(coldColor[1] + ratio * (warmColor[1] - coldColor[1]));
    const b = Math.round(coldColor[2] + ratio * (warmColor[2] - coldColor[2]));
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="question3-container">
      {/* Progress Bar Container */}
      <div className="question3-progress-bar-container">
        <div className="question3-progress-bar">
          <div className="question3-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>
        <div className="question3-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question3-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question3-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Header */}
      <div className="question3-task-header">
        <div className="question3-top-layer">
          <div className="question3-points-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h3 style={{ margin: 0 }}>Challenge 3</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img src={lightningBolt} alt="Lightning Bolt" className="question3-lightning-bolt" style={{ width: 28, height: 28, verticalAlign: 'middle' }} />
              <span className="question3-points">4 points</span>
            </span>
          </div>
          <div className="question3-button-container">
            <button className="question3-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <div className="question3-task-header-question">
          <p>Zara's dream is to buy her own Mars-Rover scooter (cost 6 000 MC).<br />
          With her current budget, she has 120 MC left over each month so she knows that it would take her many years to save up extra money to buy it.<br />
          She thinks of five possible strategies to reach the Rover goal much quicker.<br />
          <strong>Which option is the smartest and most sustainable way to hit the target?</strong></p>
        </div>
      </div>

      {/* Results Section */}
      {showResults ? (
        <div className="question3-result-section">
          <h4>Correct Answer:</h4>
          <div className="question3-correct-answer">
            Option B: Skill-Boost Course (4 points)
          </div>
          <div className="question3-correct-answer-description">
            <div className="question3-explanation-cards-container">
              <div className="question3-explanation-card best">
                <div className="question3-explanation-label">Why Option B Wins</div>
                <div className="question3-explanation-main">Spending money on an up-skilling course creates a permanent pay-rise, giving Zara more income every month without risky debt or extreme lifestyle cuts.</div>
              </div>
              <div className="question3-explanation-card others">
                <div className="question3-explanation-label">Why Not the Others?</div>
                <div className="question3-explanation-main">Other choices rely on unsustainable sacrifice (A), high risk and borrowing (C), extra time and limited scale (D), or small savings that take longer to reach the goal (E).</div>
              </div>
            </div>
          </div>
          <h4 className="question3-your-answers">Your answers</h4>
          <div className="question3-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question3-team-answer-box">
                <p>{team.name}</p>
                <div className={teamAnswers[index] === correctAnswer ? 'question3-correct' : 'question3-incorrect'}>
                  {teamAnswers[index] || '-'}
                  <div className="question3-team-answer-points">
                    {pointsMapping[teamAnswers[index]] || 0} points
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="question3-next-button" onClick={nextQuestion}>Next</button>
        </div>
      ) : (
        <div>
          {/* Question Section */}
          <div className="question3-question-section">
            <p className="question3-question">Which option is the smartest and most sustainable way to hit the target?</p>
          </div>
          {/* Multiple Choice Options */}
          <div className="question3-choices-container">
            <button className="question3-choice-button">A. Zero-Fun Freeze – Cancel Exploration-&-Fun. This would save her an extra 180 MC per month. (1 point)</button>
            <button className="question3-choice-button">B. Skill-Boost Course – Pay 500 MC upfront for a 2-month engineering up-skilling course that helps her get a pay rise. (4 points)</button>
            <button className="question3-choice-button">C. Crypto Tip-Off – Her cousin tells her about the new RedDustCoin launching that he is sure is going to triple this year. He will lend her 3,000MC so she can buy this. (0 points)</button>
            <button className="question3-choice-button">D. Side Hustle – She can use her tech skills to do freelance tech support on the weekend for family and friends. This will give her an extra +500 MC/month extra income. (3 points)</button>
            <button className="question3-choice-button">E. Small Cuts Everywhere – Trim each expense by a little bit (Habitat, Life-Support, Transport, Data, Fun). Saves around 250 MC/month. (2 points)</button>
          </div>
          {/* Team Answer Section */}
          <div className="question3-team-answer-section">
            <h4>Your answers</h4>
            <div className="question3-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question3-team-answer-box">
                  <p>{team.name}</p>
                  <select
                    value={teamAnswers[index]}
                    onChange={(e) => handleTeamAnswerChange(index, e.target.value)}
                    className="question3-team-answer-select"
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
              className="question3-submit-button" 
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
        <div className="question3-hint-modal-overlay">
          <div className="question3-hint-modal">
            <h3>Hint</h3>
            <p>Think about which option gives Zara a permanent, sustainable increase in her ability to save for her goal, without risky debt or extreme sacrifice.</p>
            <button onClick={() => setShowHintModal(false)} className="question3-close-modal-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question3; 