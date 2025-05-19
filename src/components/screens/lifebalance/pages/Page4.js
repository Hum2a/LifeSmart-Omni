import React, { useState } from 'react';
import '../styles/Page4.css';

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

const Page4 = ({ baseScores = [], onFinish }) => {
  const [newScores, setNewScores] = useState(Array(LIFE_AREAS.length).fill(5));

  const handleSliderChange = (idx, value) => {
    const updated = [...newScores];
    updated[idx] = value;
    setNewScores(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onFinish) onFinish(newScores);
  };

  return (
    <form className="page4-form" onSubmit={handleSubmit}>
      <h2 className="page4-title">Now imagine if you had an extra 12 hours of free time every week</h2>
      <p className="page4-desc">
        If you were to dedicate that time to each of these areas in turn, how high do you think your scores would reach?<br/>
        <br/>
        Again, use the prompts to think deeply about this.
      </p>
      <div className="page4-table-wrapper">
        <table className="page4-table">
          <thead>
            <tr>
              <th>Life Area</th>
              <th>Time-lens Prompts</th>
              <th>Your Base Score<br/>(read-only)</th>
              <th>New Score with Time</th>
            </tr>
          </thead>
          <tbody>
            {LIFE_AREAS.map((area, idx) => (
              <tr key={area.label}>
                <td className="page4-area">{area.label}</td>
                <td className="page4-prompt">{area.prompt}</td>
                <td className="page4-base-score">
                  <span className="page4-base-dot">●</span>
                  <span className="page4-base-value">{typeof baseScores[idx] === 'number' ? baseScores[idx] : '-'}</span>
                </td>
                <td className="page4-slider-cell">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={newScores[idx]}
                    onChange={e => handleSliderChange(idx, Number(e.target.value))}
                    className="page4-slider"
                  />
                  <span className="page4-slider-value">{newScores[idx]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="submit" className="page4-finish">Finish</button>
    </form>
  );
};

export default Page4; 