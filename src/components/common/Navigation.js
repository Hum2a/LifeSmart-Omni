import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SelectScreen from '../screens/SelectScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';
import SettingsScreen from '../screens/auth/SettingsScreen';
import NotFound from '../screens/NotFound';

// Admin related screens
import AdminHome from '../screens/admin/scripts/AdminHome';
import AdminAnalytics from '../screens/admin/scripts/AdminAnalytics';
import AdminUserManagement from '../screens/admin/scripts/AdminUserManagement';
import AdminSystemSettings from '../screens/admin/scripts/AdminSystemSettings';
import AdminDatabaseManagement from '../screens/admin/scripts/AdminDatabaseManagement';
import AdminLoginCodes from '../screens/admin/scripts/AdminLoginCodes'; 

// Life Balance related screens
import LifeBalance from '../screens/lifebalance/LifeBalance';

// School Simulation related screens
import SchoolQuizLandingPage from '../screens/quiz/QuizLandingPage';
import SchoolFinancialQuiz from '../screens/quiz/FinancialQuiz';
import SchoolQuizSimulation from '../screens/simulation/scripts/QuizSimulation';
import SchoolSimSetup from '../screens/quiz/sim/SimSetup';

// Adult Simulation related screens
import AdultFinancialQuiz from '../screens/adultsimulation/FinancialQuiz';
import AdultLandingPage from '../screens/adultsimulation/LandingPage';
import AdultLeaderboard from '../screens/adultsimulation/Leaderboard';
import AdultSimSetup from '../screens/adultsimulation/sim/SimSetup';
import AdultPastSimulations from '../screens/adultsimulation/sim/PastSimulations';
import AdultSimulation from '../screens/adultsimulation/sim/Simulation';
import AdultSimulationControls from '../screens/adultsimulation/sim/SimulationControls';
import AdultResultsScreen from '../screens/adultsimulation/sim/ResultsScreen';

// Adult Quiz related screens
import AdultQuiz from '../screens/adult/scripts/AdultQuiz';

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

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/system-settings" element={<AdminSystemSettings />} />
          <Route path="/admin/database" element={<AdminDatabaseManagement />} />
          <Route path="/admin/login-codes" element={<AdminLoginCodes />} />
          

          {/* School Simulation System */}
          <Route path="/quiz-landing" element={<SchoolQuizLandingPage />} />
          <Route path="/quiz" element={<SchoolFinancialQuiz />} />
          <Route path="/quiz-simulation" element={<SchoolQuizSimulation />} />
          <Route path="/sim-setup" element={<SchoolSimSetup />} />

          {/* Adult Simulation System */}
          <Route path="/adult-simulation" element={<AdultLandingPage />} />
          <Route path="/adult-simulation-quiz" element={<AdultFinancialQuiz />} />
          <Route path="/adult-simulation-leaderboard" element={<AdultLeaderboard />} />
          <Route path="/adult-simulation-results" element={<AdultResultsScreen />} />
          <Route path="/adult-simulation-setup" element={<AdultSimSetup />} />
          <Route path="/adult-simulation-past-simulations" element={<AdultPastSimulations />} />
          <Route path="/adult-simulation-controls" element={<AdultSimulationControls />} />
          <Route path="/adult-simulation-page" element={<AdultSimulation />} />

          {/* Adult Quiz System */}
          <Route path="/adult-quiz" element={<AdultQuiz />} />

          {/* Life Balance System */}
          <Route path="/life-balance" element={<LifeBalance />} />

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

          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Navigation; 