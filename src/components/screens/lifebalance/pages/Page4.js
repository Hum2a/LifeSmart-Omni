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
      if (onFinish) onFinish(newScores);
    }
  };

  return (
    <form className="page2-form" onSubmit={handleNext}>
      <h2 className="page2-title">Now imagine if you had an extra 12 hours of free time every week</h2>
      <p className="page2-desc">
        If you were to dedicate that time to each of these areas in turn, how high do you think your scores would reach?<br/>
        <br/>
        Again, use the prompts to think deeply about this.
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
      <div className="page2-remember">
        <b>Remember</b><br/>
        Let the question under each heading guide your reflection<br/>
        <span className="page2-desc-em">There are no right answers here.</span>
      </div>
    </form>
  );
};

export default Page4; 