import axios from 'axios';

const BASE_URL = 'https://anomaly-backend-u4ny.onrender.com/api/v1';

export const analyzeTransaction = async (transactionData) => {
  const maxRetries = 20; // Allow cold start wake-up time up to 2-3 minutes
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.post(`${BASE_URL}/analyze`, [transactionData]);
      return response.data;
    } catch (error) {
      const status = error.response ? error.response.status : null;
      // Retry on server cold start errors (500, 502, 503, 504) while waking up
      if ((status && status >= 500) || (!error.response && attempt < maxRetries - 1)) {
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          continue;
        }
      }
      throw error;
    }
  }
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
