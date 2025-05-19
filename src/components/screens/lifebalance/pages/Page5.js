import React from 'react';
import '../styles/Page5.css';

const MONEY_ACTIONS = [
  { area: 'Health & Wellbeing', action: 'See if you can set aside some money within your budget to spend on better nutrition and exercise.' },
  { area: 'Family & Connections', action: 'Create a "relationship fund" for trips, shared meals or meaningful gifts. Schedule one experience this month and pay for it upfront so it really happens.' },
  { area: 'Career & Income', action: 'Invest in a skill course, mentor or certification that advances you toward a role you truly want. Treat it as a high-return asset, not an expense.' },
  { area: 'Lifestyle, Spending & Fun', action: 'Pre-plan fun experiences (concert, adventure day) instead of impulse buys to ensure lasting happiness.' },
  { area: 'Housing, Safety & Security', action: 'Build or top-up an emergency fund (3-6 months expenses) or pay down high-interest debt. This single move reduces financial anxiety quickly.' },
  { area: 'Giving & Contribution', action: 'Automate a monthly donation or set up a giving-pot for spontaneous causes. Align with values so generosity becomes a habit, not an after-thought.' },
  { area: 'Growth & Purpose', action: 'Allocate a "growth pot" for books, courses or retreats that stretch your mind. Commit to one paid learning experience in the next quarter.' },
];

const TIME_ACTIONS = [
  { area: 'Health & Wellbeing', action: 'Block 3×30-minute exercise or meditation sessions into your calendar this week. Protect them like appointments.' },
  { area: 'Family & Connections', action: 'Schedule a weekly device-free meal or call with loved ones. Consistency matters more than extravagant plans.' },
  { area: 'Career & Income', action: 'Dedicate one evening a week to career reflection, networking or portfolio projects that align with long-term goals.' },
  { area: 'Lifestyle, Spending & Fun', action: 'Reserve at least half a day each month for a low-cost hobby or local adventure you keep postponing.' },
  { area: 'Housing, Safety & Security', action: 'Use a weekend block to review insurance, create a household emergency plan, or declutter to make your home feel safer.' },
  { area: 'Giving & Contribution', action: 'Pledge two hours a month to a cause you care about (mentoring, community clean-up). Put the first date in your calendar now.' },
  { area: 'Growth & Purpose', action: 'Book a regular "learning hour" each week for reading, journaling or an online course to keep purpose front-of-mind.' },
];

const Page5 = ({
  averages = { now: 6.1, money: 7.8, time: 7.3 },
  biggestMoney = { area: 'Housing, Safety & Security', value: 3.0, action: 'Build or top-up an emergency fund (3-6 months expenses) or pay down high-interest debt. This single move reduces financial anxiety quickly.' },
  biggestTime = { area: 'Family & Connections', value: 2.5, action: 'Schedule a weekly device-free meal or call with loved ones. Consistency matters more than extravagant plans.' },
}) => {
  return (
    <div className="page5-container">
      <h2 className="page5-title">Your Personal Snapshot</h2>
      <p className="page5-desc">
        Here's a clear view of how <b>MONEY</b> and <b>TIME</b> could reshape your life-balance—and where to focus first.
      </p>

      <div className="page5-dashboard">
        <div className="page5-dashboard-title"><em>Impact at-a-Glance (mini-dashboard)</em></div>
        <table className="page5-dashboard-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Now</th>
              <th>With ££</th>
              <th>With Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Overall average</td>
              <td>{averages.now} / 10</td>
              <td>{averages.money} / 10</td>
              <td>{averages.time} / 10</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="page5-jumps">
        <div className="page5-jump-row">
          <div className="page5-jump-label">Biggest jump with money</div>
          <div className="page5-jump-area"><em>{biggestMoney.area} (+{biggestMoney.value})</em></div>
          <div className="page5-jump-action">{biggestMoney.action}</div>
        </div>
        <div className="page5-jump-row">
          <div className="page5-jump-label">Biggest jump with time</div>
          <div className="page5-jump-area"><em>{biggestTime.area} (+{biggestTime.value})</em></div>
          <div className="page5-jump-action">{biggestTime.action}</div>
        </div>
      </div>

      <div className="page5-key-takeaway">
        <b>Key Takeaway</b><br/>
        Money is only a tool – its real power is the freedom and security it can buy. Yet time is a resource you can never earn back. This exercise shows where extra cash or extra hours would truly change your life, so you can aim for independence and contentment instead of simply chasing more money at the cost of other things.
      </div>

      <div className="page5-reference-note">
        <em>(Use the tables below to cross reference the comments that appear above)</em>
      </div>

      <div className="page5-table-section">
        <div className="page5-table-title money">A. Largest Gain Driven by Money</div>
        <table className="page5-action-table">
          <thead>
            <tr>
              <th>Life Area</th>
              <th>What you can do now (show to user)</th>
            </tr>
          </thead>
          <tbody>
            {MONEY_ACTIONS.map(row => (
              <tr key={row.area}>
                <td>{row.area}</td>
                <td>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="page5-table-section">
        <div className="page5-table-title time">B. Largest Gain Driven by Time</div>
        <table className="page5-action-table">
          <thead>
            <tr>
              <th>Life Area</th>
              <th>What you can do now (show to user)</th>
            </tr>
          </thead>
          <tbody>
            {TIME_ACTIONS.map(row => (
              <tr key={row.area}>
                <td>{row.area}</td>
                <td>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page5; 