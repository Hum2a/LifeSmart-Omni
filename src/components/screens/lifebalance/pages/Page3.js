import React, { useState } from 'react';
import '../styles/Page3.css';

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

const Page3 = ({ baseScores = [], onSubmit }) => {
  const [newScores, setNewScores] = useState(Array(LIFE_AREAS.length).fill(5));

  const handleSliderChange = (idx, value) => {
    const updated = [...newScores];
    updated[idx] = value;
    setNewScores(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(newScores);
  };

  return (
    <form className="page3-form" onSubmit={handleSubmit}>
      <h2 className="page3-title">Now imagine a full year's salary lands in your bank account tomorrow.</h2>
      <p className="page3-desc">
        For each life area, move the slider to where you think it genuinely would be if you had the money to spend on this area.<br/>
        <br/>
        Use the prompts to think deeply about the impact that the money could have.
      </p>
      <div className="page3-table-wrapper">
        <table className="page3-table">
          <thead>
            <tr>
              <th>Life Area</th>
              <th>Money-lens Prompts</th>
              <th>Your Base Score<br/>(read-only)</th>
              <th>New Score with Cash</th>
            </tr>
          </thead>
          <tbody>
            {LIFE_AREAS.map((area, idx) => (
              <tr key={area.label}>
                <td className="page3-area">{area.label}</td>
                <td className="page3-prompt">{area.prompt}</td>
                <td className="page3-base-score">
                  <span className="page3-base-dot">●</span>
                  <span className="page3-base-value">{typeof baseScores[idx] === 'number' ? baseScores[idx] : '-'}</span>
                </td>
                <td className="page3-slider-cell">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={newScores[idx]}
                    onChange={e => handleSliderChange(idx, Number(e.target.value))}
                    className="page3-slider"
                  />
                  <span className="page3-slider-value">{newScores[idx]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="submit" className="page3-submit">Submit</button>
    </form>
  );
};

export default Page3; 