const express = require('express');
const os = require('os');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Serve static files (our simple frontend)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check route - useful for load balancers / monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Info route - shows server details, great for confirming deployment worked
app.get('/api/info', (req, res) => {
  res.json({
    message: 'Hello from your EC2-deployed Node app!',
    hostname: os.hostname(),
    platform: os.platform(),
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

// Simple counter API to prove state/logic works
let visitCount = 0;
app.get('/api/visits', (req, res) => {
  visitCount += 1;
  res.json({ visits: visitCount });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
