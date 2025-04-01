import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SelectScreen from '../screens/SelectScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Quiz related screens
import QuizLandingPage from '../screens/quiz/QuizLandingPage';
import FinancialQuiz from '../screens/quiz/FinancialQuiz';
import QuizSimulation from '../screens/simulation/scripts/QuizSimulation';
import SimSetup from '../screens/quiz/sim/SimSetup';

// Simulation related screens
import GroupCreation from '../screens/simulation/scripts/GroupCreation';
import SimulationPage from '../screens/simulation/scripts/Simulation';
import ResultsScreen from '../screens/simulation/scripts/ResultsScreen';

// Learning and Courses
import FinancialLiteracy from '../screens/learning/FinancialLiteracy';
import InvestingCourse from '../screens/learning/investingCourse/InvestingCourse';
import InvestingCourseContent from '../screens/learning/investingCourse/InvestingCourseContent';
import InvestingCourseExam from '../screens/learning/investingCourse/InvestingCourseExam';

// Stock Market related screens
import PortfolioCreation from '../screens/stockmarket/scripts/PortfolioCreation';
import PortfolioDisplay from '../screens/stockmarket/scripts/PortfolioDisplay';
import StockTradingSelect from '../screens/stockmarket/scripts/StockTradingSelect';
import StickyNoteCreator from '../screens/stockmarket/scripts/StickyNoteCreator'; 

// Tools and Calculators
import InvestmentCalculator from '../screens/calculator/InvestmentCalculator';
import BudgetTool from '../screens/budget/scripts/BudgetTool';

const Navigation = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Core Navigation */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="/select" element={<SelectScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />

          {/* Quiz System */}
          <Route path="/quiz-landing" element={<QuizLandingPage />} />
          <Route path="/quiz" element={<FinancialQuiz />} />
          <Route path="/quiz-simulation" element={<QuizSimulation />} />
          <Route path="/sim-setup" element={<SimSetup />} />

          {/* Simulation System */}
          <Route path="/simulation" element={<GroupCreation />} />
          <Route path="/simulation-page" element={<SimulationPage />} />
          <Route path="/simulation-results" element={<ResultsScreen />} />

          {/* Learning Platform */}
          <Route path="/financial-literacy" element={<FinancialLiteracy />} />
          <Route path="/investing-course" element={<InvestingCourse />} />
          <Route path="/investing-course-content" element={<InvestingCourseContent />} />
          <Route path="/investing-course-exam" element={<InvestingCourseExam />} />

          {/* Stock Market System */}
          <Route path="/portfolio-creation" element={<PortfolioCreation />} />
          <Route path="/portfolio-display" element={<PortfolioDisplay />} />
          <Route path="/stock-market-simulator" element={<StockTradingSelect />} />
          <Route path="/sticky-note-creator" element={<StickyNoteCreator />} />

          {/* Financial Tools */}
          <Route path="/investment-calculator" element={<InvestmentCalculator />} />
          <Route path="/budget-tool" element={<BudgetTool />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Navigation; 