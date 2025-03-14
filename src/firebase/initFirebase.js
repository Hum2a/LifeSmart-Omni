// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBty3iHFAl_HrfBlIZlXp8JDGIOlkZ1gZE",
  authDomain: "lifesmart-investing-tool.firebaseapp.com",
  projectId: "lifesmart-investing-tool",
  storageBucket: "lifesmart-investing-tool.appspot.com",
  messagingSenderId: "949718346442",
  appId: "1:949718346442:web:7c75842869f1a305c2e233",
  measurementId: "G-E5MWPG1SGK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Authentication

// Save stock data to Firestore
export const saveStockDataToFirestore = async (symbol, data) => {
  try {
    await setDoc(doc(db, "Stock Market Data", symbol), {
      data,
      lastUpdated: new Date(),
    }, { merge: true });
  } catch (error) {
    console.error("Error saving stock data to Firestore", error);
    throw error;
  }
};

// Fetch stock data from Firestore
export const fetchStockDataFromFirestore = async (symbol) => {
  try {
    const docRef = doc(db, "Stock Market Data", symbol);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching stock data from Firestore", error);
    throw error;
  }
};

// Check if today's data is already fetched
export const isDataFetchedForToday = async (symbol) => {
  const today = new Date().toISOString().split("T")[0];
  const data = await fetchStockDataFromFirestore(symbol);
  if (data && data.lastUpdated) {
    const lastUpdated = data.lastUpdated.toDate().toISOString().split("T")[0];
    return today === lastUpdated;
  }
  return false;
};

// Initialize and export Firebase services
export const analytics = getAnalytics(app);
export const firebaseAuth = auth; // Export auth for use in components
export default app; 