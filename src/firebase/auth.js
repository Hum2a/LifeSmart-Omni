import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { firebaseAuth } from './initFirebase';

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure Apple provider
appleProvider.addScope('email');
appleProvider.addScope('name');

// Custom hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      setError(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Register with email and password
  const register = async (email, password) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      return result.user;
    } catch (error) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const signInWithApple = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, appleProvider);
      return result.user;
    } catch (error) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    register,
    signInWithGoogle,
    signInWithApple,
    logout
  };
};

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Please choose a stronger password.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please register first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked. Please allow popups and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return 'An error occurred. Please try again.';
  }
}; 