import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

export const analyzeTransaction = async (transactionData) => {
  const response = await axios.post(`${BASE_URL}/analyze`, [transactionData]);
  return response.data;
};

export const getAllTransactions = async () => {
  const response = await axios.get(`${BASE_URL}/transactions`);
  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await axios.get(`${BASE_URL}/transactions/${id}`);
  return response.data;
};

export const getAnomalies = async () => {
  const response = await axios.get(`${BASE_URL}/transactions/anomalies`);
  return response.data;
};
