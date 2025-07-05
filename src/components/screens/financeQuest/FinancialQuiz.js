import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFirestore, collection, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Question1 from './questions/Question1';
import Question2 from './questions/Question2';
import Question3 from './questions/Question3';
import Question4 from './questions/Question4';
import Question5 from './questions/Question5';
import Question6 from './questions/Question6';
import Leaderboard from './Leaderboard';
import '../../styles/FinancialQuiz.css';

const FinancialQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [teams, setTeams] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [uid, setUid] = useState(null);
  const db = getFirestore();
  const auth = getAuth();

  const questions = [
    Question1,
    Question2,
    Question3,
    Question4,
    Question5,
    Question6
  ];

  // Get the current question component (using PascalCase)
  const CurrentQuestionComponent = questions[currentQuestionIndex];

  // Calculate sorted teams
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  useEffect(() => {
    // Get current user's UID
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUid(currentUser.uid);
    } else {
      console.error("No user is logged in.");
      navigate('/');
    }

    // Debug logging
    console.log('location.state:', location.state);
    if (location.state) {
      console.log('location.state.teams:', location.state.teams);
    }

    // Prefer teams from location.state, fallback to query string
    let teamsList = [];
    if (location.state && Array.isArray(location.state.teams)) {
      teamsList = location.state.teams.map(name => ({
        name,
        points: 0,
        taskScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
      }));
    } else {
      const searchParams = new URLSearchParams(location.search);
      const teamsParam = searchParams.get('teams');
      if (teamsParam) {
        teamsList = teamsParam.split(',').map(name => ({
          name,
          points: 0,
          taskScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
        }));
      }
    }

    console.log('teamsList:', teamsList);

    if (teamsList.length > 0) {
      setTeams(teamsList);
    } else {
      navigate('/finance-quest');
    }
  }, [location, navigate, auth.currentUser]);

  const handleAnswer = (answer) => {
    console.log("Team answered:", answer);
  };

  const updateScores = (scores) => {
    setTeams(prevTeams => {
      return prevTeams.map((team, index) => {
        const currentTask = currentQuestionIndex + 1;
        return {
          ...team,
          points: team.points + (scores[index] || 0),
          taskScores: {
            ...team.taskScores,
            [currentTask]: scores[index] || 0
          }
        };
      });
    });
  };

  const nextQuestion = () => {
    setShowResults(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizComplete(true);
      saveResultsAndNavigate();
    }
  };

  const goHome = () => {
    navigate('/');
  };

  const saveResultsAndNavigate = async () => {
    if (!uid) {
      alert("No user is logged in. Please sign in.");
      navigate('/');
      return;
    }

    const teamsCollectionRef = collection(db, uid, "Adult Simulations", "Teams");

    try {
      // Step 1: Retrieve and delete all existing team documents for this user
      const snapshot = await getDocs(teamsCollectionRef);
      const deletePromises = snapshot.docs.map(docSnapshot =>
        deleteDoc(docSnapshot.ref)
      );
      await Promise.all(deletePromises);

      console.log("All old teams deleted from Firebase for this user.");

      // Step 2: Save each new team's data from the current session
      const savePromises = sortedTeams.map(team => {
        const teamDocRef = doc(teamsCollectionRef, team.name);
        return setDoc(teamDocRef, {
          name: team.name,
          points: team.points,
          taskScores: team.taskScores
        });
      });

      await Promise.all(savePromises);

      console.log("New results saved to Firebase:", sortedTeams);

      // Step 3: Navigate to the SimSetup screen with teams data
      navigate('/adult-simulation-setup', { 
        state: { 
          teams: sortedTeams
        }
      });
    } catch (error) {
      console.error("Error during saving results to Firebase:", error);
    }
  };

  if (teams.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="financial-quiz">
      <main className="main-content">
        {showResults ? (
          <Leaderboard
            teams={sortedTeams}
            quizComplete={quizComplete}
            onNextQuestion={nextQuestion}
          />
        ) : (
          <CurrentQuestionComponent
            teams={teams}
            onAnswer={handleAnswer}
            onNextQuestion={() => setShowResults(true)}
            onAwardPoints={updateScores}
          />
        )}
      </main>

      <footer className="footer">
        <p className="footer-text">© 2024 Our App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FinancialQuiz;
