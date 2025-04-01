// src/backend/api/stockService.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // Base URL for the API
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStockData = async (symbol) => {
  try {
    const response = await apiClient.get(`/stocks/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data', error);
    throw error;
  }
};
