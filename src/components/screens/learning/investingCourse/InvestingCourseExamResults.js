import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './styles/InvestingCourseExamResults.css';

const InvestingCourseExamResults = ({ onBackToCourse }) => {
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const examRef = doc(db, user.uid, 'Financial Literacy Courses', 'Basics of Investing', 'Exam Results');
      const examDoc = await getDoc(examRef);

      if (examDoc.exists()) {
        const answers = examDoc.data();
        const correctAnswers = {
          1: 'B',
          2: 'B',
          3: 'B',
          4: 'B',
          5: 'B',
          6: 'A',
          7: 'B',
          8: 'B',
          9: 'A',
          10: 'B'
        };
        let currentScore = 0;
        const resultsArray = [];

        for (let i = 1; i <= 10; i++) {
          const userAnswer = answers[`Question ${i}`];
          const correctAnswer = correctAnswers[i];
          const correct = userAnswer === correctAnswer;
          if (correct) {
            currentScore++;
          }
          resultsArray.push({
            question: i,
            userAnswer,
            correctAnswer,
            correct
          });
        }

        setScore(currentScore);
        setPassed(currentScore >= 7);
        setResults(resultsArray);
        await updatePassStatus(currentScore >= 7 ? 'Passed' : 'Failed', examRef);
      }
    }
  };

  const updatePassStatus = async (status, examRef) => {
    await setDoc(examRef, { [status]: true }, { merge: true });
  };

  return (
    <div className="results-container">
      <div className="score-card">
        <h2>Exam Results</h2>
        <p className="score">Your Score: {score} / 10</p>
        <p className="status">{passed ? 'Congratulations, you passed!' : 'Unfortunately, you did not pass.'}</p>
      </div>
      <div className="results-list">
        {results.map((result, index) => (
          <div key={index} className="result-card">
            <p className="question-text">Question {result.question}</p>
            <p className={result.correct ? 'correct-answer' : 'incorrect-answer'}>
              Your answer: {result.userAnswer}
            </p>
            {!result.correct && (
              <p className="correct-answer">
                Correct answer: {result.correctAnswer}
              </p>
            )}
          </div>
        ))}
      </div>
      <button onClick={onBackToCourse} className="back-button">Back to Course</button>
    </div>
  );
};

export default InvestingCourseExamResults; 