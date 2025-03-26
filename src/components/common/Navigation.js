import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SelectScreen from '../screens/SelectScreen';
import QuizLandingPage from '../screens/quiz/QuizLandingPage';
import FinancialQuiz from '../screens/quiz/FinancialQuiz';
import GroupCreation from '../screens/simulation/GroupCreation';
import SimulationPage from '../screens/simulation/Simulation';
import ResultsScreen from '../screens/simulation/ResultsScreen';
import QuizSimulation from '../screens/simulation/QuizSimulation';
import InvestmentCalculator from '../screens/simulation/InvestmentCalculator';
import BudgetTool from '../screens/budget/BudgetTool';

const Navigation = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/select" element={<SelectScreen />} />
          <Route path="/quiz-landing" element={<QuizLandingPage />} />
          <Route path="/quiz" element={<FinancialQuiz />} />
          <Route path="/quiz-simulation" element={<QuizSimulation />} />
          <Route path="/simulation" element={<GroupCreation />} />
          <Route path="/simulation-page" element={<SimulationPage />} />
          <Route path="/simulation-results" element={<ResultsScreen />} />
          <Route path="/investment-calculator" element={<InvestmentCalculator />} />
          <Route path="/budget-tool" element={<BudgetTool />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Navigation; 