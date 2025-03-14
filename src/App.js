import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import screens
import HomeScreen from './components/screens/HomeScreen';
import QuizLandingPage from './components/screens/quiz/QuizLandingPage';
import FinancialQuiz from './components/screens/quiz/FinancialQuiz';
import GroupCreation from './components/screens/simulation/GroupCreation';
import SimulationPage from './components/screens/simulation/Simulation';
import ResultsScreen from './components/screens/simulation/ResultsScreen';
import QuizSimulation from './components/screens/simulation/QuizSimulation';
import InvestmentCalculator from './components/screens/simulation/InvestmentCalculator';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/quiz-landing" element={<QuizLandingPage />} />
          <Route path="/quiz" element={<FinancialQuiz />} />
          <Route path="/quiz-simulation" element={<QuizSimulation />} />
          <Route path="/simulation" element={<GroupCreation />} />
          <Route path="/simulation-page" element={<SimulationPage />} />
          <Route path="/simulation-results" element={<ResultsScreen />} />
          <Route path="/investment-calculator" element={<InvestmentCalculator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
