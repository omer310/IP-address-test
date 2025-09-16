const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ 
    message: 'Static IP Test App',
    timestamp: new Date().toISOString()
  });
});

app.get('/ip-test', async (req, res) => {
  try {
    const response = await fetch('https://ifconfig.me');
    const externalIP = await response.text();
    
    res.json({
      message: 'External IP test',
      externalIP: externalIP.trim(),
      timestamp: new Date().toISOString(),
      note: 'This should be your static IP when using VPC egress'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Failed to fetch external IP'
    });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Test app listening on port ${port}`);
});