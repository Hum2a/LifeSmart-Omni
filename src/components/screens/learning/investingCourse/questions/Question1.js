import React from 'react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import QuestionTemplate from '../components/QuestionTemplate';

const Question1 = ({ onAnswered }) => {
  const question = {
    text: 'What is a stock?',
    options: [
      'A) A certificate that shows you owe money to a company.',
      'B) A part of a company that you can buy.',
      'C) A type of savings account.',
      'D) A promise to perform a service.'
    ]
  };

  const saveAnswer = async (questionNumber, answer) => {
    console.log(`Saving answer for question ${questionNumber}: ${answer}`);
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const examRef = doc(db, user.uid, 'Financial Literacy Courses', 'Basics of Investing', 'Exam Results');
      await setDoc(examRef, {
        [`Question ${questionNumber}`]: answer
      }, { merge: true });
      console.log(`Answer for question ${questionNumber} saved: ${answer}`);
    }
  };

  const handleAnswer = async (option) => {
    console.log(`selectAnswer called with option: ${option}`);
    const answerLetter = option.charAt(0); // Extract the letter
    await saveAnswer(1, answerLetter); // Save the answer to Firestore
    console.log(`Emitting answered with: ${answerLetter}`);
    if (onAnswered) {
      onAnswered(answerLetter);
    }
  };

  return (
    <QuestionTemplate 
      question={question} 
      onAnswered={handleAnswer}
    />
  );
};

export default Question1; 