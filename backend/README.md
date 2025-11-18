# AI Voice Retention Agent - Backend API

Core backend API for the AI Voice Retention Agent, powered by Databricks Foundation Models.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create a .env file from the template (platform-specific):
# Windows (PowerShell / cmd):
#   copy config.example .env
# macOS / Linux:
#   cp config.example .env

# Edit backend/.env with your Databricks credentials

# Start the server
npm start
```

API will be available at: **http://localhost:3001**

---

## 📋 Configuration

Create a `.env` file:

```bash
# Databricks
DATABRICKS_HOST=https://dbc-4a93b454-f17b.cloud.databricks.com
# Do not commit actual secrets. Replace with your token in backend/.env locally:
DATABRICKS_TOKEN=REDACTED_REPLACE_WITH_REAL_TOKEN
DATABRICKS_LLM_MODEL=databricks-claude-sonnet-4-5
DATABRICKS_WHISPER_MODEL=whisper-large-v3

# Server
PORT=3001
NODE_ENV=development
SESSION_TIMEOUT_MINUTES=30

# CORS - Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 📡 API Endpoints

### System

**GET /**
- Returns API information and available endpoints

**GET /api/health**
- Health check and configuration status

### Conversation Management

**POST /api/conversation/start**
- Initialize new conversation session
- Body: `{ customerId, customerProfile }`
- Returns: `{ sessionId, greeting }`

**POST /api/conversation/message**
- Send message and get AI response
- Body: `{ sessionId, message }`
- Returns: `{ message, intent, sentiment, urgency, offers }`

**POST /api/conversation/transcribe**
- Transcribe audio to text using Whisper
- Body: `FormData with audio file, sessionId, language`
- Returns: `{ text, language }`

**GET /api/conversation/:sessionId**
- Get session details and history
- Returns: Full session object

**POST /api/conversation/:sessionId/transfer**
- Generate handoff summary for human agent
- Returns: Detailed transfer summary

**POST /api/conversation/:sessionId/end**
- End conversation session
- Returns: Success confirmation

**GET /api/conversation**
- List all active sessions
- Returns: Array of active sessions

### Customer Data

**GET /api/customer/scenarios/list**
- Get demo customer scenarios
- Returns: Array of 6 demo scenarios

**GET /api/customer/:customerId**
- Get customer profile by ID
- Returns: Customer profile object

**GET /api/customer**
- List all demo customers
- Returns: Array of customer summaries

---

## 🏗️ Architecture

```
backend/
├── server.js                    # Express server
├── package.json                 # Dependencies
├── .env                         # Configuration (create this)
├── config.example               # Configuration template
│
├── routes/                      # API endpoints
│   ├── conversation.js          # Conversation APIs
│   └── customer.js              # Customer data APIs
│
└── services/                    # Business logic
    ├── databricks-service.js    # Databricks integration
    ├── conversation-manager.js  # Session management
    └── retention-service.js     # Offer generation
```

---

## 🔌 Integration Example

### JavaScript/Fetch

```javascript
// Start conversation
const response = await fetch('http://localhost:3001/api/conversation/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: 'cust_001',
    customerProfile: {
      name: 'John Smith',
      monthlyBill: 89.99,
      tenure: 18,
      // ... other fields
    }
  })
});

const data = await response.json();
console.log(data.sessionId); // Use this for subsequent calls

// Send message
const msgResponse = await fetch('http://localhost:3001/api/conversation/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: data.sessionId,
    message: 'I want to cancel because prices are too high'
  })
});

const result = await msgResponse.json();
console.log(result.response.message); // AI response
console.log(result.response.intent);  // price_complaint
console.log(result.response.offers);  // Retention offers
```

### cURL

```bash
# Health check
curl http://localhost:3001/api/health

# Start conversation
curl -X POST http://localhost:3001/api/conversation/start \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust_001",
    "customerProfile": {
      "name": "John Smith",
      "monthlyBill": 89.99,
      "tenure": 18,
      "currentPlan": "Internet 500",
      "paymentHistory": "excellent",
      "preferredLanguage": "English"
    }
  }'

# Send message
curl -X POST http://localhost:3001/api/conversation/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "message": "I want to cancel"
  }'
```

---

## 🧠 Services

### DatabricksService
- LLM chat completion
- Audio transcription (Whisper)
- Conversation analysis
- Offer generation

### ConversationManager
- Session lifecycle management
- Message history tracking
- Intent/sentiment analysis
- System prompt generation
- Handoff summary creation

### RetentionService
- Customer tier classification
- Offer generation by intent
- Eligibility rules
- Offer prioritization

---

## 🔧 Development

```bash
# Install dependencies
npm install

# Run with auto-reload
npm run dev

# Run in production
NODE_ENV=production npm start
```

---

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-17T...",
  "environment": "development",
  "databricks": {
    "host": "configured",
    "llmModel": "databricks-claude-sonnet-4-5",
    "whisperModel": "whisper-large-v3"
  }
}
```

---

## 🐛 Troubleshooting

### Port Already in Use
Change `PORT` in `.env` file:
```bash
PORT=3002
```

### CORS Errors
Update `FRONTEND_URL` in `.env`:
```bash
FRONTEND_URL=http://localhost:3000
```

### Databricks Connection Errors
- Verify `DATABRICKS_TOKEN` is valid
- Check model endpoints are deployed
- Review server logs for details

---

## 🚀 Deployment

For production:
1. Set `NODE_ENV=production`
2. Use process manager (PM2, systemd)
3. Set up reverse proxy (nginx)
4. Enable HTTPS
5. Configure proper CORS origins
6. Add rate limiting
7. Set up monitoring/logging

---

## 📄 License

MIT

