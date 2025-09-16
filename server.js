const express = require('express');
const https = require('https');
const app = express();

app.get('/', (req, res) => {
  res.json({ 
    message: 'Static IP Test App',
    timestamp: new Date().toISOString()
  });
});

app.get('/ip-test', (req, res) => {
  // Use Node.js built-in https module instead of fetch
  https.get('https://ifconfig.me', (response) => {
    let data = '';
    
    response.on('data', (chunk) => {
      data += chunk;
    });
    
    response.on('end', () => {
      res.json({
        message: 'External IP test',
        externalIP: data.trim(),
        timestamp: new Date().toISOString(),
        note: 'This should be your static IP when using VPC egress'
      });
    });
  }).on('error', (error) => {
    console.error('Error fetching IP:', error);
    res.status(500).json({
      error: error.message,
      message: 'Failed to fetch external IP',
      details: 'Using Node.js https module'
    });
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Test app listening on port ${port}`);
});
