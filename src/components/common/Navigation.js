import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SelectScreen from '../screens/SelectScreen';
import QuizLandingPage from '../screens/quiz/QuizLandingPage';
import FinancialQuiz from '../screens/quiz/FinancialQuiz';
import GroupCreation from '../screens/simulation/scripts/GroupCreation';
import SimulationPage from '../screens/simulation/scripts/Simulation';
import ResultsScreen from '../screens/simulation/scripts/ResultsScreen';
import QuizSimulation from '../screens/simulation/scripts/QuizSimulation';
import InvestmentCalculator from '../screens/calculator/InvestmentCalculator';
import BudgetTool from '../screens/budget/scripts/BudgetTool';
import SimSetup from '../screens/quiz/sim/SimSetup';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PortfolioCreation from '../screens/stockmarket/scripts/PortfolioCreation';
import PortfolioDisplay from '../screens/stockmarket/scripts/PortfolioDisplay';
import StockTradingSelect from '../screens/stockmarket/scripts/StockTradingSelect';
import FinancialLiteracy from '../screens/learning/FinancialLiteracy';
import InvestingCourse from '../screens/learning/investingCourse/InvestingCourse';

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
          <Route path="/sim-setup" element={<SimSetup />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/portfolio-creation" element={<PortfolioCreation />} />
          <Route path="/portfolio-display" element={<PortfolioDisplay />} />
          <Route path="/stock-market-simulator" element={<StockTradingSelect />} />
          <Route path="/investing-course" element={<InvestingCourse />} />
          <Route path="/financial-literacy" element={<FinancialLiteracy />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Navigation; 