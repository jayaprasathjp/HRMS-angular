const express = require('express');
const cors = require('cors');
const axios = require('axios'); 
const https = require('https');
const app = express();
const PORT = 3000;

app.use(cors());

const agent = new https.Agent({  
  rejectUnauthorized: false
});

app.get('/data', async (req, res) => {
  try {
    const response = await axios.get("https://retoolapi.dev/xzHZsQ/data", { httpsAgent: agent });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running`);
});
