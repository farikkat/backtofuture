# ⚡ Quick Start - AI Voice Retention Agent

Get both applications running in **5 minutes**!

---

## 📦 What You Have

Two independent applications that work together:

- **Backend API** (`backend/` folder) - Core AI functionality on port 3001
- **Frontend Demo** (`frontend/` folder) - Web interface on port 3000

---

## 🚀 5-Minute Setup

### Step 1: Setup Backend API (2 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create configuration file from the template (platform-specific)
# Windows (PowerShell / cmd):
#   copy config.example .env
# macOS / Linux:
#   cp config.example .env
# Then edit backend/.env with your Databricks credentials
```

Create `backend/.env` file with your credentials:

```bash
DATABRICKS_HOST=https://dbc-4a93b454-f17b.cloud.databricks.com
DATABRICKS_TOKEN=REDACTED_REPLACE_WITH_REAL_TOKEN
DATABRICKS_LLM_MODEL=databricks-claude-sonnet-4-5
DATABRICKS_WHISPER_MODEL=whisper-large-v3
PORT=3001
NODE_ENV=development
SESSION_TIMEOUT_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

**Start the backend:**
```bash
npm start
```

✅ Backend API running on **http://localhost:3001**

---

### Step 2: Setup Frontend Demo (2 minutes)

Open a **NEW terminal window** and:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the frontend
npm start
```

✅ Frontend demo running on **http://localhost:3000**

---

### Step 3: Open & Test (1 minute)

1. Open browser: **http://localhost:3000**
2. Select **"💰 John Smith - Price Complaint"** from dropdown
3. Click **"📞 Start Call"**
4. Type: `"I'm thinking about canceling because prices are too high"`
5. Hit Enter and watch the AI respond!

---

## ✅ Quick Verification

### Is Backend Running?

```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "healthy",
  "databricks": { "host": "configured", ... }
}
```

### Is Frontend Running?

Open http://localhost:3000 - you should see the demo interface.

---

## 📁 Project Structure

```
backtofuture/
│
├── backend/              ← Backend API Application
│   ├── .env             ← Create this with your config!
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   └── services/
│
└── frontend/            ← Frontend Demo Application
    ├── server.js
    ├── package.json
    ├── config.js        ← Points to backend
    ├── index.html
    ├── app.js
    └── styles.css
```

---

## 🎯 Demo Scenarios

Try these pre-configured scenarios:

| Icon | Customer | Scenario | Best For |
|------|----------|----------|----------|
| 💰 | John Smith | Price Complaint | First demo |
| ⚠️ | Sarah Johnson | Competitor Offer | Competitive threat |
| ⭐ | Robert Chen | VIP Customer | Premium handling |
| 🌐 | Maria Garcia | Service Quality (Spanish) | Bilingual support |
| 💳 | Jennifer Martinez | Billing Issues | Financial empathy |
| 🔧 | Demo Customer | General Testing | Flexible testing |

---

## 🎤 Testing Voice Features

### Voice Input
1. Click the **🎤 microphone button**
2. Allow microphone access
3. Speak your message
4. Click again to stop
5. Audio transcribed automatically via Whisper

### Voice Output
- AI responses are automatically spoken
- Uses browser's built-in text-to-speech
- Works best in Chrome or Edge

---

## 🐛 Common Issues

### "Cannot find module" error

```bash
# In the problematic directory (backend or frontend)
npm install
```

### Backend won't start

**Problem**: Databricks credentials error

**Solution**: Make sure `backend/.env` file exists with valid credentials

---

### Frontend can't connect to backend

**Problem**: Network errors in browser console

**Solution**: 
1. Verify backend is running on port 3001
2. Check `frontend/config.js` has: `API_URL: 'http://localhost:3001'`
3. Restart backend with correct `FRONTEND_URL` in `.env`

---

### Port already in use

**Backend (port 3001):**
```bash
# Change PORT in backend/.env
PORT=3002
```

**Frontend (port 3000):**
```bash
# Change PORT in frontend/.env or:
PORT=8080 npm start
```

---

## 🔧 Configuration Files

### Backend Configuration

File: `backend/.env` (create this)

```bash
DATABRICKS_HOST=https://dbc-4a93b454-f17b.cloud.databricks.com
DATABRICKS_TOKEN=REDACTED_REPLACE_WITH_REAL_TOKEN
DATABRICKS_LLM_MODEL=databricks-claude-sonnet-4-5
DATABRICKS_WHISPER_MODEL=whisper-large-v3
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration

File: `frontend/config.js` (already exists)

```javascript
const CONFIG = {
  API_URL: 'http://localhost:3001'  // Backend API URL
};
```

---

## 🚀 Running Commands Reference

### Start Backend
```bash
cd backend
npm start
# Runs on http://localhost:3001
```

### Start Frontend
```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

### Development Mode (Auto-reload)
```bash
# Backend
cd backend
npm run dev

# Frontend  
cd frontend
npm run dev
```

---

## 📊 What Each Application Does

### Backend API (Port 3001)
- ✅ Databricks AI integration
- ✅ Conversation management
- ✅ Intent/sentiment analysis
- ✅ Offer generation
- ✅ Session management
- ✅ Whisper transcription

### Frontend Demo (Port 3000)
- ✅ User interface
- ✅ Voice recording
- ✅ Voice playback
- ✅ Real-time updates
- ✅ Demo scenarios
- ✅ Transfer summaries

---

## 🎬 Demo Flow

1. **Select Customer** → Choose scenario from dropdown
2. **Start Call** → AI greets customer by name
3. **Send Message** → Type or speak your concern
4. **AI Responds** → Watch intent/sentiment/offers update
5. **Review Offers** → See personalized retention offers
6. **Transfer** (optional) → Generate handoff summary

---

## 📚 Next Steps

### For Learning
- Try all 6 demo scenarios
- Test voice input and output
- Generate transfer summaries
- Review real-time AI analysis

### For Customization
- Modify AI personality: `backend/services/conversation-manager.js`
- Adjust offers: `backend/services/retention-service.js`
- Change UI: `frontend/styles.css`
- Add customers: `backend/routes/customer.js`

### For Production
- Add authentication
- Set up persistent storage
- Deploy to cloud
- Configure production URLs

---

## 📖 Documentation

- **Backend API Docs**: `backend/README.md`
- **Frontend Docs**: `frontend/README.md`
- **Full Guide**: `README.md`
- **Implementation Details**: `IMPLEMENTATION_COMPLETE.md`

---

## ✅ Success Checklist

- [ ] Backend installed and running on port 3001
- [ ] Frontend installed and running on port 3000
- [ ] Can access http://localhost:3000 in browser
- [ ] Can select a customer scenario
- [ ] Can start a call
- [ ] Can send a message
- [ ] AI responds with intent/sentiment
- [ ] Offers are displayed
- [ ] Can generate transfer summary

---

## 🎉 You're Ready!

Both applications are now running:

- **Backend API**: http://localhost:3001
- **Frontend Demo**: http://localhost:3000

Open the frontend URL in your browser and start demoing! 🚀

---

## 💡 Quick Tips

1. **Always start backend first** - Frontend needs backend API
2. **Keep both terminals open** - Both apps need to run simultaneously
3. **Use Chrome/Edge** - Best voice feature support
4. **Check console logs** - Helpful for debugging
5. **Test API directly** - Use `curl` for backend testing

---

## 🆘 Need Help?

- **Backend issues**: See `backend/README.md`
- **Frontend issues**: See `frontend/README.md`
- **Architecture questions**: See `README.md`
- **Complete implementation**: See `IMPLEMENTATION_COMPLETE.md`

**Happy demoing! 🎊**
