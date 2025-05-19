import React, { useState } from 'react';
import '../styles/Page2.css';

const LIFE_AREAS = [
  {
    label: 'Health & Well-being',
    prompt: 'Am I physically and mentally healthy?'
  },
  {
    label: 'Family & Connections',
    prompt: 'Do I have people I rely on - and who rely on me?'
  },
  {
    label: 'Career & Income',
    prompt: 'Do I earn enough for the life I want, in a career that feels right?'
  },
  {
    label: 'Lifestyle, Spending & Fun',
    prompt: 'Do I spend intentionally on joy, or just impulse?'
  },
  {
    label: 'Housing, Safety & Security',
    prompt: 'Does my living situation support or stress me?'
  },
  {
    label: 'Giving & Contribution',
    prompt: 'Do I give time or money to causes I care about?'
  },
  {
    label: 'Personal Growth & Purpose',
    prompt: 'Am I learning and moving toward my purpose?'
  }
];

const Page2 = ({ onSubmit }) => {
  const [scores, setScores] = useState(Array(LIFE_AREAS.length).fill(5));

  const handleSliderChange = (idx, value) => {
    const newScores = [...scores];
    newScores[idx] = value;
    setScores(newScores);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(scores);
  };

  return (
    <form className="page2-form" onSubmit={handleSubmit}>
      <h2 className="page2-title">Rate where you are right now</h2>
      <p className="page2-desc">
        Drag the slider for each life area below (0 = needs major work, 10 = thriving).<br/>
        <br/>
        Use the self-reflection prompt under every heading to guide your score.
      </p>
      <div className="page2-table-wrapper">
        <table className="page2-table">
          <thead>
            <tr>
              <th>Life Area</th>
              <th>Self-reflection prompt</th>
              <th>Your score today</th>
            </tr>
          </thead>
          <tbody>
            {LIFE_AREAS.map((area, idx) => (
              <tr key={area.label}>
                <td className="page2-area">{area.label}</td>
                <td className="page2-prompt">“{area.prompt}”</td>
                <td className="page2-slider-cell">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={scores[idx]}
                    onChange={e => handleSliderChange(idx, Number(e.target.value))}
                    className="page2-slider"
                  />
                  <span className="page2-slider-value">{scores[idx]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="submit" className="page2-submit">Submit</button>
    </form>
  );
};

export default Page2; 