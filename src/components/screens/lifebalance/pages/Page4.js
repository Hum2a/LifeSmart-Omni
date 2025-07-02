import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../styles/Page3.css'; // Reusing styles from Page 3
import '../styles/buttons.css';

const LIFE_AREAS = [
  {
    label: 'Health & Well-being',
    prompt: 'More rest, exercise, meal prep or routine to boost energy?'
  },
  {
    label: 'Family & Connections',
    prompt: 'Could deeper, unhurried time strengthen key relationships?'
  },
  {
    label: 'Career & Income',
    prompt: 'Would extra hours let you pursue training or a passion project?'
  },
  {
    label: 'Lifestyle, Spending & Fun',
    prompt: 'If you had more free time, would you feel richer experiences?'
  },
  {
    label: 'Housing, Safety & Security',
    prompt: 'With time to organise, maintain or move, would you feel safer?'
  },
  {
    label: 'Giving & Contribution',
    prompt: 'How much more impact could extra volunteer hours create?'
  },
  {
    label: 'Growth & Purpose',
    prompt: 'Could quiet blocks for reading or reflection fuel personal growth?'
  }
];

const Page4 = ({ baseScores = [], onFinish, onStepChange }) => {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [newScores, setNewScores] = useState(Array(LIFE_AREAS.length).fill(5));
  const [revealed, setRevealed] = useState(1);

  useEffect(() => {
    if (onStepChange && tutorialStep > 0) onStepChange(revealed);
  }, [revealed, onStepChange, tutorialStep]);

  const handleSliderChange = (idx, value) => {
    const updated = [...newScores];
    updated[idx] = value;
    setNewScores(updated);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (tutorialStep === 0) {
      setTutorialStep(1);
      return;
    }
    if (revealed < LIFE_AREAS.length) {
      setRevealed(revealed + 1);
    } else {
      if (onFinish) onFinish(newScores);
    }
  };

  // Tutorial slide first
  if (tutorialStep === 0) {
    return (
      <form className="page2-form" onSubmit={handleNext}>
        <h2 className="page2-title" style={{marginBottom: '2.5rem'}}>
          <span style={{color: '#97A1FF', fontWeight: 600}}>Now imagine if you had</span>
          <span style={{color: 'white', fontWeight: 400}}> an extra 12 hours of </span>
          <br/>
          <span style={{color: '#97A1FF', fontWeight: 600}}>free time</span>
          <span style={{color: 'white', fontWeight: 400}}> every week.</span>
        </h2>
        <div className="page2-cards-wrapper" style={{minHeight: 'unset', margin: '0 auto 2.5rem auto', maxWidth: 500}}>
          <div className="page2-card card-dark">
            <div className="page2-slider-row" style={{margin: 0}}>
              <div className="page2-slider-arrows">
                <div className="page2-slider-arrow left">
                  <div className="page2-slider-arrow-line"></div>
                  <div className="page2-slider-arrow-down"></div>
                </div>
                <div className="page2-slider-arrow right">
                  <div className="page2-slider-arrow-line"></div>
                  <div className="page2-slider-arrow-down"></div>
                </div>
              </div>
              <div style={{position: 'relative', width: '100%', height: '44px'}}>
                <ReactSlider
                  min={0}
                  max={10}
                  value={4}
                  disabled
                  className="page2-slider"
                  thumbClassName="page2-slider-thumb"
                  trackClassName="page2-slider-track"
                  renderThumb={(props, state) => (
                    <div {...props} className="page2-slider-thumb">
                      <span className="page2-slider-value-inside">{state.valueNow}</span>
                    </div>
                  )}
                  renderTrack={(props, state) => (
                    <div {...props} className={`page2-slider-track ${state.index === 0 ? 'filled' : 'unfilled'}`}></div>
                  )}
                />
              </div>
              <div className="page2-slider-labels">
                <span className="page2-slider-label">Needs work (0)</span>
                <span className="page2-slider-label">Thriving (10)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="tutorial-instructions-text">
          <div className="tutorial-arrow-container">
            <svg width="111" height="157" viewBox="-40 0 111 117" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 115 C-40 0, 40 0, 20 -3"
                stroke="#fff"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse" markerUnits="strokeWidth">
                  <polygon points="0 0, 8 4, 0 8" fill="#fff" transform="rotate(110 4 4)" />
                </marker>
              </defs>
            </svg>
          </div>
          <div className="tutorial-instructions-content">
            <div className="tutorial-instructions-main-text">
              Slide to rate each part of your life from<br/>
              <b className="tutorial-instructions-main-text-bold">0 (needs work) to 10 (thriving).</b>
            </div>
            <div className="tutorial-instructions-sub-text">
              Use the prompts to think deeply about the impact that extra time could have.
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary-active page2-next-btn page2-next-btn-absolute">
          Let's start
        </button>
      </form>
    );
  }

  // After tutorial, show the questions as before
  return (
    <form className="page2-form" onSubmit={handleNext}>
      <h2 className="page2-title" style={{marginBottom: '1.5rem', textAlign: 'center'}}>
        Ask yourself, how would more time affect these <br/>
        parts of your life?
      </h2>
      <p className="page2-desc" style={{textAlign: 'center', marginBottom: '2rem'}}>
        Now <b>slide</b> to rate what you think your score in each factor will be from <br/>
        <span style={{fontStyle: 'italic', fontWeight: 600}}>0 (needs work) to 10 (thriving).</span>
      </p>
      <div className="page2-cards-wrapper" style={{minHeight: '340px', position: 'relative'}}>
        <TransitionGroup>
          {LIFE_AREAS.slice(0, revealed).map((area, idx) => {
            const colorClass = idx % 3 === 0 ? 'card-dark' : idx % 3 === 1 ? 'card-green' : 'card-pink';
            return (
              <CSSTransition
                key={area.label}
                timeout={400}
                classNames="slide-card"
              >
                <div className={`page2-card ${colorClass}`}>
                  <div className="page2-card-label">{area.label}</div>
                  <div className="page2-card-prompt">{area.prompt}</div>
                  <div className="page3-prev-label">Previous Selection</div>
                  <div className="page2-slider-row">
                    <div className="page2-slider-arrows">
                      <div className="page2-slider-arrow left">
                        <div className="page2-slider-arrow-line"></div>
                        <div className="page2-slider-arrow-down"></div>
                      </div>
                      <div className="page2-slider-arrow right">
                        <div className="page2-slider-arrow-line"></div>
                        <div className="page2-slider-arrow-down"></div>
                      </div>
                    </div>
                    <div style={{position: 'relative', width: '100%', height: '44px'}}>
                      <ReactSlider
                        min={0}
                        max={10}
                        value={typeof baseScores[idx] === 'number' ? baseScores[idx] : 0}
                        disabled
                        className="page2-slider page3-prev-slider"
                        thumbClassName="page2-slider-thumb page3-prev-thumb"
                        trackClassName="page2-slider-track"
                        renderThumb={(props, state) => (
                          <div {...props} className="page2-slider-thumb page3-prev-thumb">
                            <span className="page2-slider-value-inside page3-prev-value">{state.valueNow}</span>
                          </div>
                        )}
                        renderTrack={(props, state) => (
                          <div {...props} className={`page2-slider-track ${state.index === 0 ? 'filled' : 'unfilled'} page3-prev-track`}></div>
                        )}
                      />
                    </div>
                    <div className="page2-slider-labels">
                      <span className="page2-slider-label">Needs work (0)</span>
                      <span className="page2-slider-label">Thriving (10)</span>
                    </div>
                  </div>
                  <div className="page2-slider-row">
                    <div className="page2-slider-arrows">
                      <div className="page2-slider-arrow left">
                        <div className="page2-slider-arrow-line"></div>
                        <div className="page2-slider-arrow-down"></div>
                      </div>
                      <div className="page2-slider-arrow right">
                        <div className="page2-slider-arrow-line"></div>
                        <div className="page2-slider-arrow-down"></div>
                      </div>
                    </div>
                    <div style={{position: 'relative', width: '100%', height: '44px'}}>
                      <ReactSlider
                        min={0}
                        max={10}
                        value={newScores[idx]}
                        onChange={val => handleSliderChange(idx, val)}
                        className="page2-slider"
                        thumbClassName="page2-slider-thumb"
                        trackClassName="page2-slider-track"
                        renderThumb={(props, state) => (
                          <div {...props} className="page2-slider-thumb">
                            <span className="page2-slider-value-inside">{state.valueNow}</span>
                          </div>
                        )}
                        renderTrack={(props, state) => (
                          <div {...props} className={`page2-slider-track ${state.index === 0 ? 'filled' : 'unfilled'}`}></div>
                        )}
                      />
                    </div>
                    <div className="page2-slider-labels">
                      <span className="page2-slider-label">Needs work (0)</span>
                      <span className="page2-slider-label">Thriving (10)</span>
                    </div>
                  </div>
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
        <button type="submit" className="btn btn-primary-active page2-next-btn page2-next-btn-absolute">
          {revealed < LIFE_AREAS.length ? 'Next' : 'Finish'}
        </button>
      </div>
      {/* Show the Remember box only for the first question */}
      {revealed === 1 && (
        <div className="page2-remember">
          <b>Remember</b><br/>
          Let the question under each heading guide your reflection<br/>
          <span className="page2-desc-em">There are no right answers here.</span>
        </div>
      )}
    </form>
  );
};

export default Page4; 