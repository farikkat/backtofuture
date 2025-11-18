require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                                                        ║');
  console.log('║   🎨 AI Retention Agent - Frontend Demo Started       ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 Backend API: ${process.env.API_URL || 'http://localhost:3001'}`);
  console.log('');
  console.log('📱 Open http://localhost:' + PORT + ' in your browser');
  console.log('');
  console.log('⚠️  Make sure the backend API is running on port 3001');
  console.log('');
});

