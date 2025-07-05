import React, { useState, useEffect } from 'react';
import './Question1.css';
import lightningBolt from '../../../../assets/icons/Lightning Bolt.png';
import q1Image from '../../../../assets/icons/q1image.png';
import { MdFlashOn } from 'react-icons/md';
import QuestionHeader from './QuestionHeader';

const PLANET_EARTH = '/financeQuest/celestialBodies/Earth.png';
const PLANET_MOON = '/financeQuest/celestialBodies/Moon.png';
const PLANET_MARS = '/financeQuest/celestialBodies/Mars.png';
const ALARM_CLOCK = '/financeQuest/icons/8bitAlarm.png';

const Question1 = ({ teams, onAnswer, onNextQuestion, onAwardPoints }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerStarted, setTimerStarted] = useState(false);
  const [glossaryTitle, setGlossaryTitle] = useState('');
  const [glossaryContent, setGlossaryContent] = useState('');
  const [hoverTerm, setHoverTerm] = useState(null);
  const [hoverContent, setHoverContent] = useState('');
  const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0 });
  const [showHoverModal, setShowHoverModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
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

  const showModal = (term, event) => {
    if (term === 'assets') {
      setModalTitle('Assets');
      setModalContent('Assets are things you own that have monetary value, such as cash, property, or investments.');
    } else if (term === 'liabilities') {
      setModalTitle('Liabilities');
      setModalContent('Liabilities are things you owe, such as debts or financial obligations.');
    }
    setShowHoverModal(true);

    const rect = event.target.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY - 60,
      left: rect.left + window.scrollX + 20,
    });
  };

  const hideModal = () => {
    setShowHoverModal(false);
  };

  const showDefinition = (term, event) => {
    setHoverTerm(term);
    if (term === 'assets') {
      setHoverContent('Things you own that are worth money.');
    } else if (term === 'liabilities') {
      setHoverContent('Money you owe to someone else.');
    }
    const rect = event.target.getBoundingClientRect();
    setBubblePosition({
      top: rect.top + window.scrollY - 40,
      left: rect.left + window.scrollX + 10
    });
  };

  const hideDefinition = () => {
    setHoverTerm(null);
  };

  const submitAnswers = () => {
    setShowResults(true);
    const pointsArray = teamAnswers.map(answer => {
      if (answer === 'A') return 3;
      if (answer === 'B' || answer === 'C') return 2;
      if (answer === 'D' || answer === 'E') return 1;
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
    <>
      <QuestionHeader />
      <div className="financeQuest-question1-pixel-bg">
        {/* Floating Planets */}
        <img src={PLANET_EARTH} alt="Earth" className="financeQuest-question1-planet earth" />
        <img src={PLANET_MOON} alt="Moon" className="financeQuest-question1-planet moon" />
        <img src={PLANET_MARS} alt="Mars" className="financeQuest-question1-planet mars" />
        {/* Main Content Card */}
        <div className="financeQuest-question1-main-card">
          {/* Story Section */}
          <div className="financeQuest-question1-story-box">
            <div className="financeQuest-question1-story-text">
              <span className="financeQuest-question1-story-year">The year is <b>2150</b>.</span><br />
              Zara, 18-years-old, has just move to the New Horizon city on <b>Mars</b>. She's given 10,000 Mars Credits (MC) to start her new life.<br /><br />
              She has to <b>split the money</b> across <b>four categories</b>:<br />
              <span className="financeQuest-question1-story-categories">
                <span className="financeQuest-question1-story-category"><span role="img" aria-label="Habitat">🏠</span> <b>Habitat</b> (life pod, air recycling)</span><br />
                <span className="financeQuest-question1-story-category"><span role="img" aria-label="Life-Support">💧</span> <b>Life-Support</b> (food, water, utilities)</span><br />
                <span className="financeQuest-question1-story-category"><span role="img" aria-label="Safety Fund">🛡️</span> <b>Safety Fund</b> (unexpected repairs)</span><br />
                <span className="financeQuest-question1-story-category"><span role="img" aria-label="Exploration & Fun">🚀</span> <b>Exploration & Fun</b> (holo-games, rover trips)</span>
              </span>
            </div>
          </div>
          {/* Question Section */}
          <div className="financeQuest-question1-question-section">
            <span className="financeQuest-question1-question-title">Decide the <span className="financeQuest-question1-best-split">best split</span> for her money</span>
          </div>
          {/* Choices Section */}
          <div className="financeQuest-question1-choices-pixel-grid">
            <div className="financeQuest-question1-choice-pixel-card">A
              <img src="/financeQuest/icons/8bitPieA.png" alt="A" className="financeQuest-question1-choice-pie" />
              <div className="financeQuest-question1-choice-desc">Exploration and Fun 30%<br />Habitat 30%<br />Safety Fund 20%<br />Life Support 20%</div>
            </div>
            <div className="financeQuest-question1-choice-pixel-card">B
              <img src="/financeQuest/icons/8bitPieB.png" alt="B" className="financeQuest-question1-choice-pie" />
              <div className="financeQuest-question1-choice-desc">Exploration and Fun 25%<br />Habitat 15%<br />Safety Fund 30%<br />Life Support 30%</div>
            </div>
            <div className="financeQuest-question1-choice-pixel-card">C
              <img src="/financeQuest/icons/8bitPieC.png" alt="C" className="financeQuest-question1-choice-pie" />
              <div className="financeQuest-question1-choice-desc">Exploration and Fun 15%<br />Habitat 25%<br />Safety Fund 30%<br />Life Support 30%</div>
            </div>
            <div className="financeQuest-question1-choice-pixel-card">D
              <img src="/financeQuest/icons/8bitPieD.png" alt="D" className="financeQuest-question1-choice-pie" />
              <div className="financeQuest-question1-choice-desc">Exploration and Fun 5%<br />Habitat 30%<br />Safety Fund 35%<br />Life Support 30%</div>
            </div>
            <div className="financeQuest-question1-choice-pixel-card">E
              <img src="/financeQuest/icons/8bitPieE.png" alt="E" className="financeQuest-question1-choice-pie" />
              <div className="financeQuest-question1-choice-desc">Exploration and Fun 50%<br />Habitat 25%<br />Safety Fund 5%<br />Life Support 20%</div>
            </div>
          </div>
          {/* Team Answer Section */}
          <div className="financeQuest-question1-team-answer-section">
            <span className="financeQuest-question1-select-answers">Select your <span className="financeQuest-question1-answers-highlight">answers</span></span>
            <div className="financeQuest-question1-team-dropdowns">
              {teams.map((team, idx) => (
                <div className="financeQuest-question1-team-dropdown" key={team.name}>
                  <span className="financeQuest-question1-team-label">{idx + 1}. <b>{team.name}</b></span>
                  <select
                    value={teamAnswers[idx]}
                    onChange={e => handleTeamAnswerChange(idx, e.target.value)}
                    className="financeQuest-question1-team-select"
                  >
                    <option value="">Select one</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              ))}
            </div>
            <button className="financeQuest-question1-submit-pixel" onClick={submitAnswers} disabled={teamAnswers.some(a => !a)}>SUBMIT</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Question1; 