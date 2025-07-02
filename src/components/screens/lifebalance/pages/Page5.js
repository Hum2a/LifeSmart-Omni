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
  biggestMoney = { area: 'Health & Wellbeing', value: 3.0 },
  biggestTime = { area: 'Health & Wellbeing', value: 2.5 },
}) => {
  // Find the recommended action for the biggest jump area
  const moneyAction = MONEY_ACTIONS.find(a => a.area === biggestMoney.area)?.action || '';
  const timeAction = TIME_ACTIONS.find(a => a.area === biggestTime.area)?.action || '';

  return (
    <div className="page5-container custom-layout">
      <h2 className="page5-title snapshot-title">
        Here's your <span className="snapshot-accent">Personal Snapshot</span>
      </h2>
      <p className="page5-desc snapshot-subtitle">
        On an average, here's how you rate your life
      </p>

      {/* Three-column average score box */}
      <div className="snapshot-averages-row">
        <div className="snapshot-average-col">
          <div className="snapshot-average-label">Now</div>
          <div className="snapshot-average-value">{averages.now}/10</div>
        </div>
        <div className="snapshot-average-col">
          <div className="snapshot-average-label">with $$$</div>
          <div className="snapshot-average-value">{averages.money}/10</div>
        </div>
        <div className="snapshot-average-col">
          <div className="snapshot-average-label">with Time</div>
          <div className="snapshot-average-value">{averages.time}/10</div>
        </div>
      </div>

      {/* Two horizontally aligned jump boxes */}
      <div className="snapshot-jumps-row">
        <div className="snapshot-jump-box">
          <div className="snapshot-jump-label">Biggest jump with <span className="money-accent">money</span></div>
          <div className="snapshot-jump-area">{biggestMoney.area}</div>
        </div>
        <div className="snapshot-jump-box">
          <div className="snapshot-jump-label">Biggest jump with <span className="time-accent">time</span></div>
          <div className="snapshot-jump-area">{biggestTime.area}</div>
        </div>
      </div>

      {/* What can you do now? section */}
      <div className="snapshot-section-divider">
        <span className="snapshot-section-title">What can you do now?</span>
      </div>
      <div className="snapshot-actions-row">
        <div className="snapshot-action-card">
          {moneyAction}
        </div>
        <div className="snapshot-action-card">
          {timeAction}
        </div>
      </div>

      {/* Key Takeaway section */}
      <div className="snapshot-section-divider">
        <span className="snapshot-section-title">Key Takeaway</span>
      </div>
      <div className="snapshot-key-takeaway">
        Money is only a tool – its real power is the freedom and security it can buy. Yet time is a resource you can never earn back. This exercise shows where extra cash or extra hours would truly change your life, so you can aim for independence and contentment instead of simply chasing more money at the cost of other things.
      </div>
    </div>
  );
};

export default Page5; 