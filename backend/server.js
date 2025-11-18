require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const conversationRoutes = require('./routes/conversation');
const customerRoutes = require('./routes/customer');
const conversationManager = require('./services/conversation-manager');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/conversation', conversationRoutes);
app.use('/api/customer', customerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    databricks: {
      host: process.env.DATABRICKS_HOST ? 'configured' : 'not configured',
      llmModel: process.env.DATABRICKS_LLM_MODEL || 'databricks-claude-sonnet-4-5',
      whisperModel: process.env.DATABRICKS_WHISPER_MODEL || 'whisper-large-v3'
    }
  });
});

// Root endpoint - API info
app.get('/', (req, res) => {
  res.json({
    name: 'AI Voice Retention Agent - Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      conversation: {
        start: 'POST /api/conversation/start',
        message: 'POST /api/conversation/message',
        transcribe: 'POST /api/conversation/transcribe',
        get: 'GET /api/conversation/:sessionId',
        transfer: 'POST /api/conversation/:sessionId/transfer',
        end: 'POST /api/conversation/:sessionId/end',
        list: 'GET /api/conversation'
      },
      customer: {
        scenarios: 'GET /api/customer/scenarios/list',
        get: 'GET /api/customer/:customerId',
        list: 'GET /api/customer'
      }
    },
    documentation: 'See README.md for API documentation'
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Cleanup old sessions periodically
setInterval(() => {
  conversationManager.cleanupOldSessions();
}, 10 * 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                                                        ║');
  console.log('║   🤖 AI Retention Agent - Backend API Started         ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📡 API Server: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🧠 LLM Model: ${process.env.DATABRICKS_LLM_MODEL || 'databricks-claude-sonnet-4-5'}`);
  console.log(`🎤 Whisper: ${process.env.DATABRICKS_WHISPER_MODEL || 'whisper-large-v3'}`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('');
  console.log('Available API Endpoints:');
  console.log('  - GET  /api/health                    → Health check');
  console.log('  - POST /api/conversation/start        → Start session');
  console.log('  - POST /api/conversation/message      → Send message');
  console.log('  - POST /api/conversation/transcribe   → Transcribe audio');
  console.log('  - GET  /api/customer/scenarios/list   → Demo scenarios');
  console.log('');
  console.log('🚀 Backend API ready!');
  console.log('');
  
  if (!process.env.DATABRICKS_HOST || !process.env.DATABRICKS_TOKEN) {
    console.log('⚠️  WARNING: Databricks credentials not configured!');
    console.log('   Create .env file with your credentials');
    console.log('');
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;

