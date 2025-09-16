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
  const reqIp = https.get('https://api.ipify.org', { timeout: 5000 }, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      res.json({
        message: 'External IP test',
        externalIP: data.trim(),
        timestamp: new Date().toISOString(),
        note: 'Should match your Cloud NAT static IP when VPC egress is enabled'
      });
    });
  });

  reqIp.on('timeout', () => {
    reqIp.destroy(new Error('Upstream timeout'));
  });

  reqIp.on('error', (error) => {
    console.error('Error fetching IP:', error);
    res.status(504).json({
      error: error.message,
      message: 'Failed to fetch external IP',
      likelyCauses: [
        'No outbound internet because VPC connector enabled without Cloud NAT',
        'Cloud NAT not covering the connector’s subnet',
        'Region mismatch among Cloud Run, connector, router, and NAT'
      ]
    });
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Test app listening on port ${port}`);
});
