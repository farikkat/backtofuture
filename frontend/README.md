# AI Voice Retention Agent - Frontend Demo

Standalone web application for demonstrating the AI Voice Retention Agent.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Demo will be available at: **http://localhost:3000**

**⚠️ Important**: Make sure the backend API is running on port 3001!

---

## 📋 Configuration

The frontend connects to the backend API. Update `config.js` if needed:

```javascript
const CONFIG = {
  API_URL: 'http://localhost:3001',  // Backend API URL
  // ...
};
```

Or create a `.env` file (optional):

```bash
API_URL=http://localhost:3001
PORT=3000
```

---

## 🎯 Features

- **6 Demo Scenarios** - Pre-configured customer profiles
- **Real-time AI Analysis** - Intent, sentiment, urgency display
- **Voice Input** - Record audio and transcribe via Whisper
- **Voice Output** - Text-to-speech for AI responses
- **Retention Offers** - Personalized offers displayed dynamically
- **Transfer Summaries** - Generate handoff reports for human agents

---

## 🎬 How to Use

### 1. Start Both Applications

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

### 2. Open Demo

Navigate to: **http://localhost:3000**

### 3. Select Scenario

Choose from dropdown:
- 💰 **John Smith** - Price Complaint
- ⚠️ **Sarah Johnson** - Competitor Offer
- ⭐ **Robert Chen** - VIP Customer
- 🌐 **Maria Garcia** - Service Quality (Spanish)
- 💳 **Jennifer Martinez** - Billing Issues
- 🔧 **Demo Customer** - General Testing

### 4. Start Call

Click **"📞 Start Call"**

### 5. Interact

Type or speak your message:
```
I'm thinking about canceling because prices are too high
```

Watch the AI:
- Detect intent
- Analyze sentiment
- Generate offers
- Respond with empathy

---

## 📁 Project Structure

```
frontend/
├── server.js          # Express server for static files
├── package.json       # Dependencies
├── config.js          # API configuration
├── index.html         # Main UI
├── app.js             # Client-side logic
├── styles.css         # Styling
└── README.md          # This file
```

---

## 🔧 Development

### Run with Auto-Reload

```bash
npm run dev
```

### Change Backend URL

Edit `config.js`:

```javascript
const CONFIG = {
  API_URL: 'http://your-backend-url:3001',
  // ...
};
```

### Change Frontend Port

Edit `.env` or set environment variable:

```bash
PORT=8080 npm start
```

---

## 🎤 Voice Features

### Recording Audio

1. Click 🎤 microphone button
2. Allow microphone access
3. Speak your message
4. Click again to stop
5. Audio transcribed automatically

### Text-to-Speech

- AI responses automatically spoken
- Uses browser's built-in TTS
- Works best in Chrome/Edge

---

## 🐛 Troubleshooting

### Cannot Connect to Backend

**Problem**: "Failed to load scenarios" or network errors

**Solution**:
1. Verify backend is running: `curl http://localhost:3001/api/health`
2. Check `config.js` has correct `API_URL`
3. Check browser console for CORS errors

---

### CORS Errors

**Problem**: "Access-Control-Allow-Origin" errors

**Solution**:
1. Ensure backend `.env` has: `FRONTEND_URL=http://localhost:3000`
2. Restart backend server after changing `.env`
3. Clear browser cache

---

### Voice Not Working

**Problem**: Microphone or TTS not working

**Solution**:
1. Use Chrome, Edge, or Firefox
2. Allow microphone permissions
3. Check system volume
4. Fall back to text input

---

### Port Already in Use

**Problem**: `EADDRINUSE: Port 3000 already in use`

**Solution**:
```bash
PORT=3002 npm start
```

---

## 🌐 Browser Support

- ✅ **Chrome** (recommended)
- ✅ **Edge** (recommended)
- ✅ **Firefox**
- ⚠️ **Safari** (limited voice support)

---

## 📊 Demo Scenarios

| ID | Customer | Scenario | Use Case |
|----|----------|----------|----------|
| cust_001 | John Smith | Price Complaint | First demo, easy |
| cust_002 | Sarah Johnson | Competitor Offer | Competitive threat |
| cust_003 | Robert Chen | VIP Customer | Premium handling |
| cust_004 | Maria Garcia | Service Quality | Bilingual (Spanish) |
| cust_005 | Jennifer Martinez | Billing Issues | Financial empathy |
| cust_demo | Demo Customer | General Testing | Flexible scenario |

---

## 🚀 Deployment

### Static Hosting

The frontend can be deployed to any static hosting:

- **Netlify**: Drag and drop the folder
- **Vercel**: `vercel deploy`
- **GitHub Pages**: Push to gh-pages branch
- **AWS S3**: Upload as static website

**Important**: Update `config.js` with production backend URL!

### Docker

```dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📄 License

MIT

