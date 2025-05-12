import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaBookOpen, FaLightbulb } from 'react-icons/fa';
import '../styles/AdultQuiz.css';
import Startquiz from '../scripts/Startquiz';

const AdultQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [points, setPoints] = useState(0);
  const [selected, setSelected] = useState(null);

  const questions = [
    {
      id: 1,
      category: "High Interest Debt",
      question: "You owe £4000 on a 19% card and £1200 on a 5% loan. You can pay an extra £150/mo. Which is the best action?",
      options: [
        "Pay the loan first, it has the smallest balance",
        "Pay the 19% card first",
        "Split £75/£75",
        "Smallest balance first"
      ],
      correctAnswer: "Pay the 19% card first",
      explanation: "Paying off the 19% card first will reduce your interest charges more than paying off the loan first. This is because the 19% card has a higher interest rate, so paying it off first will reduce the amount of interest you owe on the loan."
    },
    {
      id: 2,
      category: "High Interest Debt",
      question: "You normally put about £1,000 on your credit card each month and pay it off in full, avoiding any interest. This month you buy a laptop for £3,500 but can't clear that extra amount from your salary. What's the smartest move?",
      options: [
        "Pay your usual £1,000 plus a little extra each month until the balance is gone.",
        "Use savings and aim to clear the £3,500 within six months so the payments feel manageable and there is a plan.",
        "Shift the £3,500 to a 0% purchase or balance transfer card and set automatic payments to clear it before the promo period ends, while still paying off new spending in full on the original card.",
        "Open a second credit card; at month end transfer the balance to get another 30days interest free."
      ],
      correctAnswer: "Shift the £3,500 to a 0% purchase or balance transfer card and set automatic payments to clear it before the promo period ends, while still paying off new spending in full on the original card.",
      explanation: "Shifting the £3,500 to a 0% purchase or balance transfer card will allow you to clear the balance before the promo period ends, while still paying off new spending in full on the original card."
    },
    {
      id: 3,
      category: "High Interest Debt",
      question: "Which action is most likely to improve your credit score?",
      options: [
        "Closing your oldest credit card to reduce the number of open accounts",
        "Hitting your full credit limit each month and paying it off on the due date",
        "Registering yourself on the electoral roll at your current address",
        "Making only the minimum payment so lenders see you use available credit"
      ],
      correctAnswer: "Registering yourself on the electoral roll at your current address",
      explanation: "Registering yourself on the electoral roll at your current address will help you build a good credit history and improve your credit score."
    },
    {
      id: 4,
      category: "High Interest Debt",
      question: "You have £30k saved. Option 1: buy a £250k home with a 10% deposit and a 25 year mortgage at 5% fixed for 2years, then variable. Option 2: keep renting for £1,100/month. What's the smartest financial consideration?",
      options: [
        "Renting is always cheaper unless you have a 20% deposit and don't face repairs or housing price drops.",
        "Mortgage payments stay fixed for 25 years, so buying is always cheaper long term.",
        "Buying needs a £25k deposit plus ≈ £5k fees. The mortgage starts near £1,170/month (slightly above rent) and could jump after the 2 year fix; you'll also pay for repairs and insurance, though you build equity.",
        "Your £30k covers everything; but better to wait until rates fall, then buying will be better than renting."
      ],
      correctAnswer: "Buying needs a £25k deposit plus ≈ £5k fees. The mortgage starts near £1,170/month (slightly above rent) and could jump after the 2 year fix; you'll also pay for repairs and insurance, though you build equity.",
      explanation: "Buying a home requires a larger upfront investment, but it can be a more cost-effective long-term option compared to renting. The mortgage payments are fixed for 25 years, so you know exactly what your housing costs will be. However, you'll also need to pay for repairs and insurance, which can add to your monthly expenses."
    },
    {
      id: 5,
      category: "Savings and budgeting",
      question: "You earn £3,100 net. Needs are £1,900. What's the best way to use the £1,200 left? ",
      options: [
        "Spend it all on wants and save leftovers",
        "50% wants / 50% savings",
        "Save as much as possible, trim wants",
        "Save one third (£400) and enjoy the rest (£800)"
      ],
      correctAnswer: "Save one third (£400) and enjoy the rest (£800)",
      explanation: "Saving one third of your income will help you build a solid emergency fund and still have money left for wants. This approach allows you to enjoy some of your income while still saving for the future."
    },
    {
      id: 6,
      category: "Savings and budgeting",
      question: "Whats the best way to organise savings",
      options: [
        "One big fund",
        "Individual fund for every goal",
        "Layered funds: Emergency→Sinking→Goal",
        "Split by short  vs long term goals"
      ],
      correctAnswer: "Layered funds: Emergency→Sinking→Goal",
      explanation: "Layered funds: Emergency→Sinking→Goal is a good way to organise savings because it allows you to save for emergencies first, then save for sinking funds, and finally save for goals. This approach helps you build a solid financial foundation and achieve your long-term goals."
    },
    {
      id: 7,
      category: "Savings and budgeting",
      question: "From your salary of £3,000, 50% is spent on your Needs, 40% on your wants and you save 10% each month. Whats the minimm you should have in an emergency fund? ",
      options: [
        "£3000",
        "£4500",
        "£9000",
        "£18000"
      ],
      correctAnswer: "£4500",
      explanation: "Having an emergency fund of £4,500 will give you a buffer to cover unexpected expenses, such as a car repair or medical emergency. This amount is typically recommended to provide a three to six months' worth of living expenses."
    },
    {
      id: 8,
      category: "Savings and budgeting",
      question: "Which action most boosts saving success? ",
      options: [
        "Transferring leftovers at month end",
        "pay yourself first, standing order after payday",
        "Manual transfer whenever you have extra money",
        "Put extra into the savings and dip back in when needed to encourage higher savings"
      ],
      correctAnswer: "pay yourself first, standing order after payday",
      explanation: "Paying yourself first, standing order after payday, ensures that you save a portion of your income before you spend it. This approach helps you build a consistent savings habit and ensures that you save a portion of your income each month."
    },
    {
      id: 9,
      category: "Investing & Growth",
      question: "You have £10,000 you don't need that you put into a savings account generating 3%. After 3 years you decide to spend it. If the inflation rate has been 5%, which of the following is not correct:",
      options: [
        "You now have approximately £11,000 in the account",
        "Your purchasing power (the amount you can buy) with the £10,000 has decreased.",
        "Your money has had a real inflation adjusted return of -2%",
        "Over a short time period like 3 years, the purchasing power will not be affected"
      ],
      correctAnswer: "Over a short time period like 3 years, the purchasing power will not be affected",
      explanation: "Over a short time period like 3 years, the purchasing power will not be affected because the inflation rate is lower than the savings rate."
    },
    {
      id: 10,
      category: "Investing & Growth",
      question: "What is the best long term fund type for a newbie?",
      options: [
        "Low cost index fund",
        "Actively managed fund",
        "ETF for day trading",
        "Hedge fund"
      ],
      correctAnswer: "Low cost index fund",
      explanation: "Low cost index funds are a good option for beginners because they are simple to understand and have a low cost structure."
    },
    {
      id: 11,
      category: "Investing & Growth",
      question: "Adam is 30 and can leave £10,000 untouched for at least ten years. Which mix suits his growth at medium risk strategy best?",
      options: [
        "50% equity fund • 20% Real Estate •10% Gold • 10% cash equivalent • 10% alternatives (crypto)",
        "100% 3.5% savings account",
        "80% crypto • 20% stocks",
        "50% gold • 50% cash"
      ],
      correctAnswer: "50% equity fund • 20% Real Estate •10% Gold • 10% cash equivalent • 10% alternatives (crypto)",
      explanation: "A medium risk strategy involves investing in a mix of assets that balance growth potential with risk tolerance. This mix includes equity funds for growth, real estate for stability, gold for diversification, cash equivalents for liquidity, and alternatives like crypto for potential returns."
    },
    {
      id: 12,
      category: "Investing & Growth",
      question: "Maria has a has diversified portfolio for many years. As she nears retirement, which asset class should she increase in her allocation to?",
      options: [
        "Developed market equities",
        "Emerging market equities",
        "Cryptocurrency",
        "Investment grade bonds and cash like instruments"
      ],
      correctAnswer: "Investment grade bonds and cash like instruments",
      explanation: "As Maria nears retirement, she should increase her allocation to investment grade bonds and cash like instruments to provide a stable income stream and reduce risk."
    },
    {
      id: 13,
      category: "Investing & Growth",
      question: "Why should you put an index fund investment into a Stocks & Shares ISA before a normal account?",
      options: [
        "Higher interest",
        "Gains & dividends are tax free",
        "ISA returns are usually higher",
        "You can withdraw tax free before 55"
      ],
      correctAnswer: "Gains & dividends are tax free",
      explanation: "Stocks & Shares ISAs offer tax-free growth and dividends, which can help you build wealth faster."
    },
    {
      id: 14,
      category: "Investing & Growth",
      question: "Which feature in an online investment advert is NOT a red flag?",
      options: [
        "Guaranteed 10% monthly return",
        "No mention of risks",
        "5 year verified returns to justify guaranteed results",
        "Management and transaction fees"
      ],
      correctAnswer: "Management and transaction fees",
      explanation: "Management and transaction fees are a necessary cost of investing, and should be disclosed in an investment advert."
    },
    {
      id: 15,
      category: "Retirement & Tax Efficiency",
      question: "You earn £30,000 salary at a company offering a standard auto-enrolment workplace pension scheme.  What's the total minimum contribution and what does it cost you?",
      options: [
        "£900 from your salary (3%) + £900 extra from your employer for a total £1,800",
        "£1,500 from your salary (5%); employer £0",
        "£1,500 from your salary (5%) + £900 extra from your employer (3%) for a total of £2,400",
        "£1,500 (5%) + £900 (3%) employer contribution, but both come out of your salary"
      ],
      correctAnswer: "£1,500 from your salary (5%) + £900 extra from your employer (3%) for a total of £2,400",
      explanation: "The total minimum contribution is £1,500 from your salary (5%) + £900 extra from your employer (3%) for a total of £2,400."
    },
    {
      id: 16,
      category: "Retirement & Tax Efficiency",
      question: "You earn £60,000 and put £4,000 of take home pay into a Self Invested Personal Pension (SIPP). After tax relief, what lands in your pension, and what does it really cost you?",
      options: [
        "£5,000 in the pot after the 20% basic-rate tax relief; costs you £4,000",
        "£5,000 in the pot (20% uplift) and you reclaim another £1,000 via your tax return, so it costs you £3,000",
        "£6,000 in the pot because your employer matches 50% of your contribution, costs you £4,000",
        "£5,600 in the pot after 40% relief added directly to the SIPP; cost still £4,000"
      ],
      correctAnswer: "£5,000 in the pot (20% uplift) and you reclaim another £1,000 via your tax return, so it costs you £3,000",
      explanation: "After tax relief, £5,000 lands in your pension, and you reclaim another £1,000 via your tax return, so it costs you £3,000."
    },
    {
      id: 17,
      category: "Retirement & Tax Efficiency",
      question: "You earn £49,000, just below the 40% band that starts at £50,270. Your employer gives you a £3,000 raise (new salary £52,000). How much extra tax will you pay on that £3,000?",
      options: [
        "About £950 – the first £1,270 of the raise is taxed at 20% and the remainder at 40%",
        "£1,200 – the whole £3,000 is now in the higher rate band, so it's all taxed at 40%",
        "£600 – the whole raise is still taxed at 20% because you haven't hit £55k yet",
        "Nothing extra – only bonuses trigger more tax, not basic salary increases"
      ],
      correctAnswer: "About £950 – the first £1,270 of the raise is taxed at 20% and the remainder at 40%",
      explanation: "The first £1,270 of the raise is taxed at 20% and the remainder at 40%, resulting in an extra tax of about £950."
    },
    {
      id: 18,
      category: "Estate Planning",
      question: "Ben is 32, married, two young kids, house £250k (with mortgage), £20k savings. Should he set up both a will and a financial Lasting Power of Attorney (LPA)?",
      options: [
        "Everything already passes to his spouse tax free so only a LPA is needed.",
        "A will lets you name guardians and choose who gets what; an LPA lets a trusted person pay the mortgage, bills and access savings if you lose mental capacity",
        "The estate is small, so neither is needed at the moment",
        "Setting up a will should ensure his kids pay no inheritance tax, LPA not needed as his spouse can automatically act for him if he loses mental capacity"
      ],
      correctAnswer: "A will lets you name guardians and choose who gets what; an LPA lets a trusted person pay the mortgage, bills and access savings if you lose mental capacity",
      explanation: "A will lets you name guardians and choose who gets what, while an LPA lets a trusted person pay the mortgage, bills and access savings if you lose mental capacity."
    },
    {
      id: 19,
      category: "Estate Planning",
      question: "Sam—married, two children, total estate £800k (family home + other assets). Sam's will leaves everything directly to the kids. What inheritance tax (IHT) bill will the family face, and what is one way to reduce it?",
      options: [
        "First £500k is tax free (£325k nil rate + £175k residence band). The remaining £300k is taxed at 40% → £120k IHT. Sam could reduce this by gifting during life or leaving 10% to charity.",
        "No IHT because assets are split between the two children, each below £500k threshold.",
        "Full £800k taxed at 40% (£320k) because nothing passes to the spouse; Sam can reduce avoid this by putting everything into a trust.",
        "Parents can pass up to £1m tax free if it only includes a primary/ family home, so no tax at all"
      ],
      correctAnswer: "First £500k is tax free (£325k nil rate + £175k residence band). The remaining £300k is taxed at 40% → £120k IHT. Sam could reduce this by gifting during life or leaving 10% to charity.",
      explanation: "The first £500k is tax free (£325k nil rate + £175k residence band). The remaining £300k is taxed at 40% → £120k IHT. Sam could reduce this by gifting during life or leaving 10% to charity."
    }
  ];

  const handleSelect = (option) => {
    if (!answered) setSelected(option);
  };

  const handleSubmitAnswer = () => {
    if (selected == null) return;
    const isCorrect = selected === questions[currentQuestion].correctAnswer;
    setAnswers({
      ...answers,
      [currentQuestion]: selected
    });
    setShowExplanation(true);
    setAnswered(true);
    setWasCorrect(isCorrect);
    if (isCorrect && !answers[currentQuestion]) {
      setPoints(points + 100);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setAnswered(false);
      setWasCorrect(false);
      setSelected(null);
    } else {
      setShowResults(true);
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(answers[currentQuestion - 1] !== undefined);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  const handleSubmit = () => {
    navigate('/select');
  };

  if (!quizStarted) {
    return <Startquiz onStartQuiz={() => setQuizStarted(true)} />;
  }

  if (showResults) {
    let level = '';
    let levelDesc = '';
    if (score >= 16) {
      level = 'Expert';
      levelDesc = 'You have excellent financial knowledge!';
    } else if (score >= 11) {
      level = 'Intermediate';
      levelDesc = 'You have a good grasp of financial concepts, but there is room to grow.';
    } else {
      level = 'Beginner';
      levelDesc = 'Keep learning and practicing to improve your financial skills!';
    }
    return (
      <div className="adult-quiz-outer">
        <div className="aq-green-light" />
        <div className="adult-quiz-container">
          <div className="quiz-header-bar">
            <img src={process.env.PUBLIC_URL + '/logo/LifeSmartSessionsWhite.png'} alt="LifeSmart Logo" style={{ width: 300, height: 100 }} />
            <div className="quiz-progress-bar-bg">
              <div className="quiz-progress-bar-fill" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="quiz-results-summary">
            <h2 className="quiz-results-title">Quiz Results</h2>
            <div className="quiz-score">
              <h3>Your Level: <span className={`quiz-level quiz-level-${level.toLowerCase()}`}>{level}</span></h3>
              <p>{levelDesc}</p>
              <p>You scored {score} out of {questions.length}.</p>
            </div>
            <button className="quiz-submit-btn" onClick={handleSubmit}>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // PointsGauge component
  const PointsGauge = ({ points, maxPoints }) => {
    const percent = Math.min(points / maxPoints, 1);
    return (
      <div className="points-gauge-outer">
        <div className="points-gauge-label">Points</div>
        <div className="points-gauge-bar-bg">
          <div className="points-gauge-bar-fill" style={{ height: `${percent * 100}%` }}></div>
        </div>
        <div className="points-gauge-points">{points}</div>
      </div>
    );
  };

  return (
    <div className="adult-quiz-outer">
      <div className="aq-green-light" />
      <div className="adult-quiz-container">
        <div className="quiz-header-bar">
          <img src={process.env.PUBLIC_URL + '/logo/LifeSmartSessionsWhite.png'} alt="LifeSmart Logo" style={{ width: 300, height: 100 }} />
          <div className="quiz-progress-bar-bg">
            <div className="quiz-progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="quiz-category-pill">{questions[currentQuestion].category}</div>
        <div className="quiz-actions">
          <button className="quiz-action-btn"><FaBookOpen /> Glossary</button>
          <button className="quiz-action-btn"><FaLightbulb /> Hint</button>
        </div>
        <div className="quiz-question-text">
          {questions[currentQuestion].question}
        </div>
        <div className="quiz-options">
          {questions[currentQuestion].options.map((option, idx) => {
            let optionClass = 'quiz-option';
            if (answered) {
              if (option === questions[currentQuestion].correctAnswer) {
                optionClass += ' correct';
              } else if (option === selected) {
                optionClass += ' incorrect';
              }
            } else if (selected === option) {
              optionClass += ' selected';
            }
            return (
              <button
                key={idx}
                className={optionClass}
                onClick={() => handleSelect(option)}
                disabled={answered}
              >
                {String.fromCharCode(97 + idx)}) {option}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`quiz-explanation-box ${wasCorrect ? 'correct' : 'incorrect'}`}>
            <div className="quiz-explanation-title">
              {wasCorrect ? 'Correct!' : 'Incorrect.'} <span style={{fontWeight: 500, fontStyle: 'italic'}}>Answer Explanation:</span>
            </div>
            <div className="quiz-explanation-text">
              {questions[currentQuestion].explanation}
            </div>
          </div>
        )}
        {!answered ? (
          <button
            className="quiz-submit-btn"
            onClick={handleSubmitAnswer}
            disabled={selected == null}
          >
            Submit Answer
          </button>
        ) : (
          <button
            className="quiz-submit-btn"
            onClick={handleNext}
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next Question'}
          </button>
        )}
      </div>
      <PointsGauge points={points} maxPoints={questions.length * 100} />
    </div>
  );
};

export default AdultQuiz;
