import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';

const API_KEY = process.env.VUE_APP_CURRENCY_API_KEY;

export const fetchAndSaveConversionRate = async () => {
  const db = getFirestore();
  const conversionDocRef = doc(db, 'Conversion Rates', 'USD-GBP');

  const docSnap = await getDoc(conversionDocRef);
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  if (docSnap.exists()) {
    const data = docSnap.data();
    const lastUpdated = data.lastUpdated ? data.lastUpdated.toDate().toISOString().split('T')[0] : null;

    if (lastUpdated === todayStr) {
      console.log('Conversion rate is already updated for today.');
      return;
    }
  }

  // Fetch conversion rate if not updated today
  try {
    const response = await axios.get(`https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&currencies=GBP&base_currency=USD`);
    const conversionRate = response.data.data.GBP;

    await setDoc(conversionDocRef, {
      rate: conversionRate,
      lastUpdated: serverTimestamp()
    });

    console.log('Conversion rate updated successfully:', conversionRate);
  } catch (error) {
    console.error('Error fetching conversion rate:', error);
  }
};
