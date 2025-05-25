import React, { useState, useEffect } from 'react';
import './Question5.css';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';
import moneyBars from '../../../../assets/icons/moneybars.png';

const Question5 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(240);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [glossaryTitle, setGlossaryTitle] = useState('');
  const [glossaryContent, setGlossaryContent] = useState('');
  const [hoverModal, setHoverModal] = useState({
    show: false,
    title: "",
    content: "",
    x: 0,
    y: 0,
  });
  const [teamAnswers, setTeamAnswers] = useState(Array(teams.length).fill([]));

  const correctAnswer = 'E';

  const answerOptions = [
    'A. Martian Treat-Yo-Self: Add the full 1 000 MC to Exploration & Fun (holo-games, rover trips).',
    'B. 50 / 30 / 20-plus: Split the money in the 50/30/20 method so add 500MC to needs, 300 MC to needs and 200MC to savings.',
    'C. Pay-Yourself-First Boost: Send the entire 1 000 MC to her Safety-Fund/rover savings pot. Fun budget stays unchanged.',
    'D. Upgrade her living space: Move into a bigger pod which would increase her rent by 1000, but she would have much more space.',
    'E. Split & Invest: Use some of the money to increase her fun and improve her lifestyle but add at least 50% (500 MC) of it to extra savings.'
  ];

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
  const progressBarWidth = (timer / 240) * 100;

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  const showHoverModal = (title, content, event) => {
    if (!event) return;
    setHoverModal({
      show: true,
      title,
      content,
      x: event.clientX + 15,
      y: event.clientY + 15
    });
  };

  const hideHoverModal = () => {
    setHoverModal(prev => ({ ...prev, show: false }));
  };

  const handleTeamAnswerChange = (index, letter) => {
    const newAnswers = [...teamAnswers];
    const teamAnswerSet = new Set(newAnswers[index]);
    
    if (teamAnswerSet.has(letter)) {
      teamAnswerSet.delete(letter);
    } else {
      teamAnswerSet.add(letter);
    }
    
    newAnswers[index] = Array.from(teamAnswerSet).sort();
    setTeamAnswers(newAnswers);
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const nextQuestion = () => {
    // Calculate points based only on correct answers (1 point per correct answer)
    const pointsArray = teamAnswers.map(answers => {
      const correctCount = answers.filter(answer => correctAnswer.includes(answer)).length;
      return correctCount;
    });
    onAwardPoints(pointsArray);
    onNextQuestion();
  };

  return (
    <div className="question5-container">
      {/* Header and Progress Bar */}
      <div className="question5-progress-bar-container">
        <div className="question5-progress-bar">
          <div className="question5-progress" style={{ width: `${progressBarWidth}%` }}></div>
        </div>

        <div className="question5-timer-container">
          {!timerStarted ? (
            <button onClick={startTimer} className="question5-start-timer-button">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds} Start Timer
            </button>
          ) : (
            <div className="question5-timer">
              ⏳ {minutes}:{seconds < 10 ? '0' + seconds : seconds}
            </div>
          )}
        </div>
      </div>

      {/* Task Description */}
      <div className="question5-task-header">
        <div className="question5-top-layer">
          <div className="question5-points-section">
            <h3>Challenge 5</h3>
            <img src={lightningBolt} alt="Lightning Bolt" className="question5-lightning-bolt" />
            <p className="question5-points">3 points</p>
          </div>
          <div className="question5-button-container">
            <button className="question5-hint-button" onClick={() => setShowHintModal(true)}>Hint?</button>
          </div>
        </div>
        <div className="question5-task-header-question">
          <p>A month later, Zara's stellar performance at the rover-tech lab earns her a 1 000 MC pay rise after tax.<br />
          Her existing budget has been working well, and her costs remain the same.</p>
        </div>
      </div>

      {/* Cost Table and Question Section Side by Side */}
      <div className="question5-main-flex">
        <div className="question5-cost-table-wrapper">
          <table className="question5-cost-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Cost (MC)</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Habitat pod rent</td><td>Includes air-recycling fee</td><td>1 150</td><td>Needs</td></tr>
              <tr><td>Life-Support</td><td>Food, water, basic utilities</td><td>900</td><td>Need</td></tr>
              <tr><td>Transport</td><td>Mag-tram pass to the rover bay</td><td>240</td><td>Need</td></tr>
              <tr><td>Colony Data plan</td><td>Communicator & holo-net</td><td>210</td><td>Want</td></tr>
              <tr><td>Exploration & Fun</td><td>Holo-games subscription, eating out with friends</td><td>580</td><td>Want</td></tr>
              <tr><td>Safety Fund auto-transfer</td><td>Emergency savings (20 % of income target)</td><td>800</td><td>Savings</td></tr>
            </tbody>
          </table>
        </div>
        <div className="question5-question-section">
          <p className="question5-question-text">Goal – decide the smartest way to use the extra 1 000 MC she will get every month, while guarding against lifestyle inflation.</p>
        </div>
      </div>

      {!showResults ? (
        <div>
          {/* Multiple Choice Options */}
          <div className="question5-choices-container">
            {answerOptions.map((option, index) => (
              <button key={index} className="question5-choice-button">
                {option}
              </button>
            ))}
          </div>

          {/* Team Answer Section */}
          <div className="question5-team-answer-section">
            <h4>Your answers (select all that apply)</h4>
            <div className="question5-team-answer-container">
              {teams.map((team, index) => (
                <div key={team.name} className="question5-team-answer-box">
                  <p>{team.name}</p>
                  <div className="question5-answer-bubbles">
                    {['A', 'B', 'C', 'D', 'E'].map((letter) => (
                      <button
                        key={letter}
                        className={`question5-answer-bubble ${teamAnswers[index].includes(letter) ? 'selected' : ''}`}
                        onClick={() => handleTeamAnswerChange(index, letter)}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="question5-submit-button" onClick={submitAnswers}>Submit</button>
        </div>
      ) : (
        <div className="question5-result-section">
          <h4>Correct Answer:</h4>
          <div className="question5-correct-answer">Option E: Split & Invest</div>
          <div className="question5-correct-answer-description">
            <strong>Explanation:</strong>
            <ul>
              <li>Option E is smartest because it lets Zara enjoy her raise and grow her wealth: she automatically diverts at least 50% (500 MC) to her Safety/Invest Fund, then uses the remainder to boost her lifestyle.</li>
              <li>This "pay-yourself-first + invest" approach protects her from lifestyle-inflation, builds long-term security faster than Option B, is more sustainable than saving the whole 1,000 MC like Option C, and avoids the permanent cost hike of upgrading her pod (Option D) or spending everything on fun (Option A). In short, it balances reward now with freedom later.</li>
            </ul>
          </div>

          {/* Display each team's answer with comparison */}
          <div className="question5-team-answer-comparison">
            {teams.map((team, index) => (
              <div key={team.name} className="question5-team-answer-box">
                <p>{team.name}</p>
                <div className="question5-answers-display">
                  {teamAnswers[index].map((answer, answerIndex) => (
                    <div
                      key={answerIndex}
                      className={correctAnswer === answer ? 'question5-correct' : 'question5-incorrect'}
                    >
                      {answer}
                    </div>
                  ))}
                  {teamAnswers[index].length === 0 && <div className="question5-no-answer">-</div>}
                </div>
                <p className="question5-team-score">
                  Score: {teamAnswers[index].filter(answer => correctAnswer === answer).length}
                </p>
              </div>
            ))}
          </div>

          <button className="question5-next-button" onClick={nextQuestion}>Next</button>
        </div>
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="question5-hint-modal-overlay">
          <div className="question5-hint-modal">
            <h3>Hint</h3>
            <p>Think about what actions show banks that you're reliable with money.</p>
            <button onClick={() => setShowHintModal(false)} className="question5-close-modal-button">Close</button>
          </div>
        </div>
      )}

      {/* Hover Modal */}
      {hoverModal.show && (
        <div className="question5-hover-modal" style={{ top: hoverModal.y + 'px', left: hoverModal.x + 'px' }}>
          <h3>{hoverModal.title}</h3>
          <p>{hoverModal.content}</p>
        </div>
      )}
    </div>
  );
};

export default Question5; 