# Architecture Overview

## 🌐 System Overview

The AI Voice Retention Agent is a **full-stack customer retention system** with:
- **Frontend Demo Application** (Port 3000) - Web UI for agent demonstrations
- **Backend API Server** (Port 3001) - RESTful API with AI integration
- **MongoDB Database** (Port 27017) - Persistent customer data storage
- **Databricks Foundation Models** - AI/LLM services (Claude, GPT, Gemini, Llama)

---

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Browser)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │          Frontend Web Application (Port 3000)                 │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │  │
│  │  │   UI/UX    │  │   Voice    │  │   Customer Search      │ │  │
│  │  │  Components│  │  Recording │  │   & Selection          │ │  │
│  │  └────────────┘  └────────────┘  └────────────────────────┘ │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │  │
│  │  │ Real-time  │  │    TTS     │  │   Analytics Display    │ │  │
│  │  │   Updates  │  │  (Speech)  │  │   & Visualizations     │ │  │
│  │  └────────────┘  └────────────┘  └────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                │                                     │
│                                │ HTTP/REST API                       │
│                                ▼                                     │
└─────────────────────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │          Backend API Server (Port 3001)                       │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │                    API Routes                           │  │  │
│  │  │  /api/customer  /api/conversation  /api/transcribe     │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                          │                                    │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │                 Business Logic Layer                    │  │  │
│  │  │                                                          │  │  │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │  │
│  │  │  │Conversation  │  │  Databricks  │  │  Database   │  │  │  │
│  │  │  │  Manager     │  │   Service    │  │  Service    │  │  │  │
│  │  │  └──────────────┘  └──────────────┘  └─────────────┘  │  │  │
│  │  │                                                          │  │  │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │  │
│  │  │  │   Speech     │  │    Session   │  │   Customer  │  │  │  │
│  │  │  │  Formatter   │  │  Management  │  │   Context   │  │  │  │
│  │  │  └──────────────┘  └──────────────┘  └─────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                │                                     │
│                    ┌───────────┴───────────┐                        │
│                    ▼                       ▼                        │
└─────────────────────────────────────────────────────────────────────┘
           │                                         │
┌──────────▼──────────┐                 ┌───────────▼────────────┐
│   DATA LAYER        │                 │  EXTERNAL SERVICES     │
├─────────────────────┤                 ├────────────────────────┤
│                     │                 │                        │
│  ┌──────────────┐  │                 │  ┌──────────────────┐ │
│  │   MongoDB    │  │                 │  │   Databricks AI  │ │
│  │  (Port 27017)│  │                 │  │  Foundation      │ │
│  │              │  │                 │  │  Models API      │ │
│  │ ┌──────────┐ │  │                 │  │                  │ │
│  │ │Customers │ │  │                 │  │  • Claude        │ │
│  │ │Collection│ │  │                 │  │  • GPT-5         │ │
│  │ └──────────┘ │  │                 │  │  • Gemini        │ │
│  │              │  │                 │  │  • Llama         │ │
│  │ ┌──────────┐ │  │                 │  └──────────────────┘ │
│  │ │ Sessions │ │  │                 │                        │
│  │ │   (TBD)  │ │  │                 │  ┌──────────────────┐ │
│  │ └──────────┘ │  │                 │  │ Databricks       │ │
│  └──────────────┘  │                 │  │ Whisper STT      │ │
│                     │                 │  │ (Speech-to-Text) │ │
│  OR                 │                 │  └──────────────────┘ │
│                     │                 │                        │
│  ┌──────────────┐  │                 └────────────────────────┘
│  │  Mock Data   │  │
│  │  (Fallback)  │  │
│  └──────────────┘  │
└─────────────────────┘
```

---

## 🧩 Architecture Layers

### **1. Client Layer (Browser)**
- **HTML5, CSS3, JavaScript** - Modern web technologies
- **Web Speech API** - Voice input/output
- **Fetch API** - HTTP requests to backend
- **Real-time Updates** - Dynamic UI updates

### **2. Presentation Layer (Frontend - Port 3000)**
- **Static Web Application** - Served by Express
- **Customer Selection** - Search and choose customers
- **Voice Interface** - Record and playback audio
- **Analytics Dashboard** - Real-time metrics display
- **Conversation Display** - Message history and UI

### **3. Application Layer (Backend - Port 3001)**
- **REST API** - 11 endpoints for all operations
- **Business Logic** - Conversation management, AI integration
- **Session Management** - Stateful conversation tracking
- **Speech Processing** - Natural TTS formatting
- **Authentication** - PIN verification and MFA

### **4. Data Layer**
- **MongoDB (Primary)** - Persistent customer data
- **In-Memory (Fallback)** - Mock data when DB unavailable
- **Session Storage** - In-memory conversation sessions

### **5. External Services**
- **Databricks Foundation Models** - AI conversation engine
- **Databricks Whisper** - Speech-to-text transcription

---

## 🔄 Communication Flow

### **Frontend ↔ Backend**
```
Frontend (Port 3000)
        ↕ HTTP/REST API
Backend (Port 3001)
```

**Protocol:** HTTP/REST  
**Format:** JSON  
**Authentication:** Session-based (UUID tokens)

### **Backend ↔ Database**
```
Backend API
        ↕ MongoDB Driver (Mongoose)
MongoDB (Port 27017)
```

**Protocol:** MongoDB Wire Protocol  
**Connection:** Connection pooling  
**Fallback:** In-memory mock data if unavailable

### **Backend ↔ AI Services**
```
Backend API
        ↕ HTTPS REST API
Databricks Foundation Models
```

**Protocol:** HTTPS  
**Authentication:** API Key  
**Models:** Claude, GPT-5, Gemini, Llama

---

## 📊 System Characteristics

### **Separation of Concerns**
- **Frontend:** UI/UX, voice recording, display logic
- **Backend:** Business logic, AI integration, data management
- **Database:** Data persistence and retrieval
- **AI Services:** Natural language processing

### **Stateful Architecture**
- **Sessions:** Tracked in-memory with UUID
- **Conversation History:** Maintained per session
- **Customer Context:** Loaded at session start
- **Timeout:** 30-minute inactivity timeout

### **Fallback Mechanisms**
- **Database:** MongoDB → Mock Data
- **AI Models:** Multiple model support (Claude, GPT, etc.)
- **Error Handling:** Graceful degradation

### **Scalability**
- **Horizontal Scaling:** Multiple backend instances
- **Load Balancing:** API Gateway / Load Balancer
- **Session Sharing:** Redis (future enhancement)
- **Database:** MongoDB replica set for HA

---

## 🎯 Design Principles

### **1. Modularity**
- Independent frontend and backend
- Pluggable AI models
- Swappable data sources

### **2. Reliability**
- Fallback data sources
- Error handling at all layers
- Session timeout management

### **3. Security**
- PIN verification with customer data
- Multi-factor authentication
- Secure session management
- Environment variable configuration

### **4. Performance**
- Connection pooling (MongoDB)
- In-memory session storage
- Efficient API design
- Caching strategies (future)

### **5. Maintainability**
- Clear separation of concerns
- Well-documented APIs
- Consistent code structure
- Comprehensive logging

---

## 🔗 Related Pages

- **[Component Architecture](Component-Architecture)** - Detailed component breakdown
- **[Data Flow Diagrams](Data-Flow-Diagrams)** - How data moves through the system
- **[Database Architecture](Database-Architecture)** - MongoDB schema and design
- **[API Reference](API-Reference)** - Complete API documentation
- **[Security Architecture](Security-Architecture)** - Security implementation
- **[Technology Stack](Technology-Stack)** - Tools and frameworks

---

## 📈 System Statistics

```
System Components: 4
  ├─ Frontend Application (Port 3000)
  ├─ Backend API Server (Port 3001)
  ├─ MongoDB Database (Port 27017)
  └─ Databricks AI Services

API Endpoints: 11
  ├─ Customer API: 4 endpoints
  ├─ Conversation API: 5 endpoints
  ├─ Transcription API: 1 endpoint
  └─ Health Check: 1 endpoint

Supported Languages: 2
  ├─ English
  └─ Spanish

AI Models: 4+
  ├─ Claude (Anthropic)
  ├─ GPT-5 (OpenAI)
  ├─ Gemini (Google)
  └─ Llama (Meta)

Data Sources: 2
  ├─ MongoDB (Primary)
  └─ Mock Data (Fallback)
```

---

**Next:** Explore the [Component Architecture](Component-Architecture) to understand individual components in detail.

**Back to:** [Home](Home)

