import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../styles/Page3.css';
import '../styles/buttons.css';

const LIFE_AREAS = [
  {
    label: 'Health & Well-being',
    prompt: 'Better nutrition, gym/therapy, medical checks, or more harmful activities?'
  },
  {
    label: 'Family & Connections',
    prompt: 'Fun visits, shared trips, thoughtful gifts or higher expectations?'
  },
  {
    label: 'Career & Income',
    prompt: 'More likely to move towards the right career for you?'
  },
  {
    label: 'Lifestyle, Spending & Fun',
    prompt: 'Budget for meaningful hobbies & travel, or just more spending?'
  },
  {
    label: 'Housing, Safety & Security',
    prompt: 'Ability to build emergency fund, clear debt, improve home safety?'
  },
  {
    label: 'Giving & Contribution',
    prompt: 'Would your giving increase either in money, time or impact?'
  },
  {
    label: 'Growth & Purpose',
    prompt: 'Coaching, retreats, further study, purpose projects or less motivation?'
  }
];

const Page3 = ({ baseScores = [], onSubmit, onStepChange }) => {
  const [newScores, setNewScores] = useState(Array(LIFE_AREAS.length).fill(5));
  const [revealed, setRevealed] = useState(1);

  useEffect(() => {
    if (onStepChange) onStepChange(revealed);
  }, [revealed, onStepChange]);

  const handleSliderChange = (idx, value) => {
    const updated = [...newScores];
    updated[idx] = value;
    setNewScores(updated);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (revealed < LIFE_AREAS.length) {
      setRevealed(revealed + 1);
    } else {
      if (onSubmit) onSubmit(newScores);
    }
  };

  return (
    <form className="page2-form" onSubmit={handleNext}>
      <h2 className="page2-title">Now imagine a full year's salary lands in your bank account tomorrow.</h2>
      <p className="page2-desc">
        For each life area, move the slider to where you think it genuinely would be if you had the money to spend on this area.<br/>
        <br/>
        Use the prompts to think deeply about the impact that the money could have.
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
          {revealed < LIFE_AREAS.length ? 'Next' : 'Complete'}
        </button>
      </div>
      <div className="page2-remember">
        <b>Remember</b><br/>
        Let the question under each heading guide your reflection<br/>
        <span className="page2-desc-em">There are no right answers here.</span>
      </div>
    </form>
  );
};

export default Page3; 