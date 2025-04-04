const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const PORT = process.env.PORT || 9876;
const WINDOW_SIZE = 10;
const TIMEOUT_MS = 500;
const TEST_SERVER_BASE_URL = 'http://20.244.56.144/evaluation-service';

let numberWindow = [];

const apiEndpoints = {
  'p': '/primes',    // Prime numbers
  'f': '/fibo',      // Fibonacci numbers
  'e': '/even',      // Even numbers
  'r': '/rand'       // Random numbers
};

function calculateAverage(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((total, num) => total + num, 0);
  return (sum / arr.length).toFixed(2);
}

app.get('/numbers/:numberid', async (req, res) => {
  const startTime = Date.now();
  const numberid = req.params.numberid;
  
  if (!apiEndpoints[numberid]) {
    return res.status(400).json({ error: 'Invalid number ID. Use p, f, e, or r.' });
  }
  
  try {
    const windowPrevState = [...numberWindow];
    
    const accessToken = process.env.ACCESS_TOKEN;
    
    if (!accessToken) {
      return res.status(500).json({ error: 'Missing access token in environment variables' });
    }
    
    const endpoint = `${TEST_SERVER_BASE_URL}${apiEndpoints[numberid]}`;
    const response = await axios.get(endpoint, { 
      timeout: TIMEOUT_MS,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const fetchedNumbers = response.data.numbers || [];
    
    fetchedNumbers.forEach(num => {
      if (!numberWindow.includes(num)) {
        if (numberWindow.length >= WINDOW_SIZE) {
          numberWindow.shift();
        }
        numberWindow.push(num);
      }
    });
    
    const avg = calculateAverage(numberWindow);
    
    const processingTime = Date.now() - startTime;
    if (processingTime > TIMEOUT_MS) {
      return res.status(500).json({ error: 'Processing timeout exceeded' });
    }
    
    return res.json({
      windowPrevState,
      windowCurrState: numberWindow,
      numbers: fetchedNumbers,
      avg: parseFloat(avg)
    });
    
  } catch (error) {
    console.error('API error:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: 'Third-party API request timeout' });
    }
    
    return res.status(500).json({ 
      error: 'Error fetching numbers', 
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Average Calculator Microservice running on port ${PORT}`);
});