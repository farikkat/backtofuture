# 🤖 AI Voice Retention Agent

A complete AI-powered customer retention system with separate backend API and frontend demo application, powered by **Databricks Foundation Models**.

---

## 📁 Project Structure

This project consists of two independent applications:

```
backtofuture/
├── backend/           # Core API (Node.js + Express)
│   ├── server.js      # API server
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic
│   └── README.md      # Backend documentation
│
└── frontend/          # Demo UI (Web Application)
    ├── server.js      # Static file server
    ├── index.html     # Demo interface
    ├── app.js         # Client logic
    ├── config.js      # API configuration
    └── README.md      # Frontend documentation
```

---

## 🚀 Quick Start

### 1. Start MongoDB (Optional but Recommended)

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo service mongod start
```

💡 **Don't have MongoDB?** No problem! The app works with mock data too.  
📚 See [MongoDB Quick Start](MONGODB_QUICKSTART.md) for installation.

### 2. Generate Customer Data (Optional)

```bash
cd backend
npm run seed  # Generates 200 diverse customers
```

💡 **Skip this step** to use 5 demo customers instead.  
📚 See [Seed Quick Start](SEED_QUICKSTART.md) for details.

### 3. Start Backend API

```bash
cd backend
npm install
# Create a .env file from the template (platform-specific):
# Windows (PowerShell / cmd):
#   copy config.example .env
# macOS / Linux:
#   cp config.example .env
# Edit backend/.env with your Databricks credentials
npm start
```

Backend runs on: **http://localhost:3001**

### 4. Start Frontend Demo

```bash
cd frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

### 5. Open Demo

Navigate to: **http://localhost:3000** in your browser

---

## ✨ Features

### Backend API
- 🧠 **Databricks AI Integration** - Claude, GPT-5, Gemini, Llama
- 🎤 **Whisper STT** - High-accuracy speech-to-text
- 📊 **Real-time Analysis** - Intent, sentiment, urgency
- 💼 **Smart Offers** - Personalized retention offers
- 🏠 **Movers Retention Flow** - Automated address verification & 1 Gig offers for FL/TX/CA
- 🔄 **Session Management** - Conversation history tracking
- 📡 **RESTful API** - 12+ endpoints
- 🗄️ **MongoDB Integration** - Persistent customer data storage
- 🌱 **Seed Data Generator** - Generate 200+ realistic customers
- 🎙️ **Speech Formatting** - Natural pronunciation of currency, dates, percentages

### Frontend Demo
- 🎭 **200+ Customer Profiles** - Diverse scenarios and demographics
- 🌍 **Bilingual Support** - English & Spanish customers
- 🎨 **Modern UI** - Real-time updates and animations
- 🎤 **Voice Input** - Record and transcribe audio
- 🔊 **Voice Output** - Natural text-to-speech (e.g., "$29.99" → "twenty-nine ninety-nine")
- 🔍 **Type-Ahead Search** - Fast customer search by name or account
- 📈 **Live Analytics** - Intent/sentiment visualization
- 📋 **Transfer Summaries** - Agent handoff reports

---

## 🏗️ Architecture

### Separation of Concerns

**Backend (Port 3001)**
- Pure API server
- No frontend code
- Handles all business logic
- Databricks integration
- Session management

**Frontend (Port 3000)**
- Static web application
- Calls backend APIs
- Handles UI/UX
- Voice recording/playback
- Demo scenarios

### Communication

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
│  Port 3000  │
└──────┬──────┘
       │ HTTP/REST
       │ (CORS enabled)
       ▼
┌─────────────┐
│   Backend   │
│     API     │
│  Port 3001  │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────┐
│ Databricks  │
│  Foundation │
│   Models    │
└─────────────┘
```

---

## 📋 Configuration

### Backend (.env)

```bash
DATABRICKS_HOST=https://dbc-4a93b454-f17b.cloud.databricks.com
DATABRICKS_TOKEN=REDACTED_REPLACE_WITH_REAL_TOKEN
DATABRICKS_LLM_MODEL=databricks-claude-sonnet-4-5
DATABRICKS_WHISPER_MODEL=whisper-large-v3
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (config.js)

```javascript
const CONFIG = {
  API_URL: 'http://localhost:3001'
};
```

---

## 📡 API Endpoints

### Conversation
- `POST /api/conversation/start` - Start session
- `POST /api/conversation/message` - Send message
- `POST /api/conversation/transcribe` - Transcribe audio
- `GET /api/conversation/:id` - Get session
- `POST /api/conversation/:id/transfer` - Transfer
- `POST /api/conversation/:id/end` - End session

### Customer Data
- `GET /api/customer/scenarios/list` - Demo scenarios
- `GET /api/customer/:id` - Customer profile
- `GET /api/customer` - List customers

### System
- `GET /api/health` - Health check

**Full API documentation**: See `backend/README.md`

---

## 🎯 Demo Scenarios

| Icon | Customer | Scenario | Difficulty |
|------|----------|----------|------------|
| 💰 | John Smith | Price Complaint | Easy |
| ⚠️ | Sarah Johnson | Competitor Offer | Medium |
| ⭐ | Robert Chen | VIP Customer | Easy |
| 🌐 | Maria Garcia | Service Quality (Spanish) | Medium |
| 💳 | Jennifer Martinez | Billing Issues | Medium |
| 🔧 | Demo Customer | General Testing | Flexible |

---

## 🛠️ Development

### Run Backend in Dev Mode

```bash
cd backend
npm run dev  # Auto-reload with nodemon
```

### Run Frontend in Dev Mode

```bash
cd frontend
npm run dev  # Auto-reload with nodemon
```

### Test Backend API

```bash
# Health check
curl http://localhost:3001/api/health

# Get scenarios
curl http://localhost:3001/api/customer/scenarios/list
```

---

## 🐛 Troubleshooting

### Backend Won't Start

1. Check Node.js version: `node --version` (need v14+)
2. Verify `.env` file exists with Databricks credentials
3. Check port 3001 is not in use
4. Run `npm install` to reinstall dependencies

### Frontend Can't Connect

1. Verify backend is running: `curl http://localhost:3001/api/health`
2. Check `frontend/config.js` has correct `API_URL`
3. Look for CORS errors in browser console
4. Ensure backend `.env` has `FRONTEND_URL=http://localhost:3000`

### Voice Features Not Working

1. Use Chrome, Edge, or Firefox
2. Allow microphone permissions
3. Must be on localhost or HTTPS
4. Check browser console for errors

---

## 🚀 Deployment

### Backend Deployment

**Options:**
- AWS EC2 / ECS / Lambda
- Google Cloud Run
- Azure App Service
- Heroku / Railway / Render

**Requirements:**
- Node.js v14+
- Environment variables configured
- CORS origins properly set

### Frontend Deployment

**Options:**
- Netlify (recommended)
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting

**Important**: Update `config.js` with production backend URL!

---

## 📊 Technology Stack

### Backend
- **Runtime**: Node.js v14+
- **Framework**: Express.js
- **AI/ML**: Databricks (Claude, GPT-5, Gemini, Whisper)
- **Storage**: In-memory (production: Redis recommended)

### Frontend
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: MediaRecorder, SpeechSynthesis, Fetch
- **Server**: Express (for static files)
- **Styling**: Pure CSS (no frameworks)

---

## 💡 Why Separate Applications?

### Benefits

1. **Independent Scaling** - Scale frontend and backend separately
2. **Technology Flexibility** - Replace frontend without touching backend
3. **Multiple Frontends** - Web, mobile, desktop can use same API
4. **Easier Testing** - Test backend API independently
5. **Clear Boundaries** - Separation of concerns
6. **Team Organization** - Frontend and backend teams can work independently

### Use Cases

- **Production**: Deploy backend to private network, frontend to CDN
- **Development**: Multiple developers working simultaneously
- **Integration**: Other apps can use the backend API
- **Mobile Apps**: Build native iOS/Android apps using same backend

---

## 📚 Documentation

### 📖 Wiki Documentation
- **[Wiki Pages](wiki/)** - Complete wiki-ready documentation for easy import
- **[Wiki Import Guide](wiki/WIKI-IMPORT-GUIDE.md)** - How to import into GitHub Wiki, Confluence, Notion, etc.

### Core Documentation
- **[Architecture Documentation](ARCHITECTURE.md)** - System architecture, data flow, component diagrams
- **[Architecture Diagrams (Mermaid)](ARCHITECTURE-MERMAID.md)** - Interactive visual diagrams (11 diagrams)
- **[Backend API Documentation](backend/README.md)** - API endpoints, integration guide
- **[Frontend Demo Documentation](frontend/README.md)** - UI features, configuration

### Database & Data
- **[MongoDB Integration Guide](MONGODB_INTEGRATION.md)** - Complete MongoDB setup and usage
- **[MongoDB Quick Start](MONGODB_QUICKSTART.md)** - Get MongoDB running in 5 minutes
- **[Seed Data Guide](SEED_DATA_GUIDE.md)** - Generate 200+ customer accounts
- **[Seed Quick Start](SEED_QUICKSTART.md)** - Generate customers in 30 seconds

### Additional Guides
- **[Enhanced Customer Profiles](ENHANCED_CUSTOMER_PROFILES.md)** - Customer insights and data structure
- **[Spanish Language Support](SPANISH_LANGUAGE_SUPPORT.md)** - Bilingual agent capabilities
- **[Recent Billing Events](RECENT_BILLING_EVENTS.md)** - Billing change tracking
- **[Movers Retention Flow](MOVERS_RETENTION_FLOW.md)** - Address verification & 1 Gig offers for relocating customers
- **[Speech Formatting Guide](SPEECH_FORMATTING.md)** - Natural TTS pronunciation of currency, dates, etc.
- **[Speech Formatting Quick Start](SPEECH_FORMATTING_QUICKSTART.md)** - Get started with natural speech in 5 minutes
- **[Customer Search Feature](CUSTOMER_SEARCH_FEATURE.md)** - Type-ahead search implementation
- **[Enhanced Agent Context](ENHANCED_AGENT_CONTEXT.md)** - AI agent customer insights
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Complete feature overview

---

## 🎓 Example Usage

### Using the Demo

1. Open http://localhost:3000
2. Select "John Smith - Price Complaint"
3. Click "Start Call"
4. Type: "I want to cancel, prices are too high"
5. Watch AI analyze and respond with offers

### Using the API Directly

```javascript
// Start conversation
const response = await fetch('http://localhost:3001/api/conversation/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: 'cust_001',
    customerProfile: { name: 'John Smith', /* ... */ }
  })
});

const { sessionId } = await response.json();

// Send message
const msgResponse = await fetch('http://localhost:3001/api/conversation/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId,
    message: 'I want to cancel'
  })
});

const result = await msgResponse.json();
console.log(result.response.offers); // Retention offers
```

---

## 📈 Performance

- **Backend Response Time**: 1-3 seconds (Databricks LLM)
- **Whisper Transcription**: 2-5 seconds
- **Frontend Load Time**: <1 second
- **Concurrent Sessions**: 100+ per backend instance

---

## 🔒 Security Notes

**For Production:**

1. ✅ Use HTTPS for both frontend and backend
2. ✅ Set proper CORS origins (not `*`)
3. ✅ Add authentication/authorization
4. ✅ Rate limit API endpoints
5. ✅ Validate all inputs
6. ✅ Use environment variables for secrets
7. ✅ Enable security headers
8. ✅ Monitor and log all requests

---

## 📄 License

MIT License

---

## 🎉 Ready to Start!

```bash
# Terminal 1 - Backend
cd backend && npm install && npm start

# Terminal 2 - Frontend
cd frontend && npm install && npm start

# Browser
# Open http://localhost:3000
```

**Happy demoing! 🚀**

