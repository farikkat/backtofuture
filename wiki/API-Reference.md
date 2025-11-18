# API Reference

## 📡 Overview

The Backend API Server provides **11 RESTful endpoints** for customer management, conversation handling, and speech transcription.

**Base URL:** `http://localhost:3001`  
**Format:** JSON  
**Protocol:** HTTP/REST

---

## 🔌 API Endpoints

### **Quick Reference**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/customer/:customerId` | GET | Get customer by ID |
| `/api/customer` | GET | List all customers |
| `/api/customer/list` | GET | List customers (search) |
| `/api/customer/verify-pin` | POST | Verify customer PIN |
| `/api/conversation/start` | POST | Start new conversation |
| `/api/conversation/message` | POST | Process customer message |
| `/api/conversation/voice` | POST | Process voice message |
| `/api/conversation/end` | POST | End conversation |
| `/api/conversation/:sessionId` | GET | Get conversation details |
| `/api/transcribe/audio` | POST | Transcribe audio to text |
| `/health` | GET | Health check |

---

## 👥 Customer API

### **GET /api/customer/:customerId**

Get customer details by customer ID.

**Request:**
```http
GET /api/customer/cust_001
```

**Response:**
```json
{
  "success": true,
  "customer": {
    "customerId": "cust_001",
    "firstName": "John",
    "lastName": "Smith",
    "name": "John Smith",
    "email": "john.smith@email.com",
    "phone": "+1-555-0101",
    "accountNumber": "FTR-100234",
    "pin": "1234",
    "serviceAddress": "1234 Maple Street, Springfield, IL 62701",
    "currentPlanDetails": {
      "name": "Fiber 500 Internet",
      "price": 54.99,
      "speed": "500 Mbps"
    },
    "preferredLanguage": "English",
    "tenure": 14,
    "accountStatus": "active",
    "lifetimeValue": 769.86,
    "monthlyBill": 54.99
    // ... more fields
  },
  "dataSource": "mongodb"
}
```

**Error Response:**
```json
{
  "error": "Customer not found"
}
```

---

### **GET /api/customer**

List all customers with basic information.

**Request:**
```http
GET /api/customer
```

**Response:**
```json
{
  "success": true,
  "customers": [
    {
      "customerId": "cust_001",
      "name": "John Smith",
      "monthlyBill": 54.99,
      "tenure": 14,
      "accountStatus": "active",
      "preferredLanguage": "English"
    },
    // ... more customers
  ],
  "count": 200,
  "dataSource": "mongodb"
}
```

---

### **GET /api/customer/list**

List all customers (optimized for search functionality).

**Request:**
```http
GET /api/customer/list
```

**Response:**
```json
{
  "success": true,
  "customers": [
    {
      "customerId": "cust_001",
      "name": "John Smith",
      "accountNumber": "FTR-100234",
      "email": "john.smith@email.com"
    },
    // ... more customers
  ]
}
```

---

### **POST /api/customer/verify-pin**

Verify customer PIN for authentication.

**Request:**
```http
POST /api/customer/verify-pin
Content-Type: application/json

{
  "accountNumber": "FTR-100234",
  "pin": "1234"
}
```

**Success Response:**
```json
{
  "success": true,
  "verified": true,
  "customer": {
    "customerId": "cust_001",
    "firstName": "John",
    "lastName": "Smith",
    "name": "John Smith",
    "email": "john.smith@email.com",
    "accountNumber": "FTR-100234"
  }
}
```

**Failure Response:**
```json
{
  "success": false,
  "verified": false,
  "error": "Invalid PIN"
}
```

---

## 💬 Conversation API

### **POST /api/conversation/start**

Start a new conversation session.

**Request:**
```http
POST /api/conversation/start
Content-Type: application/json

{
  "customerId": "cust_001",
  "customerProfile": {
    "customerId": "cust_001",
    "firstName": "John",
    "lastName": "Smith",
    "name": "John Smith",
    "accountNumber": "FTR-100234",
    "pin": "1234",
    "preferredLanguage": "English",
    // ... full customer profile
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-123-456-789",
  "greeting": "Hello! Thank you so much for calling. I'm here to help you today. To get started, may I please have the account number?",
  "speechText": "Hello! Thank you so much for calling. I'm here to help you today. To get started, may I please have the account number?",
  "session": {
    "customerId": "cust_001",
    "customerName": "John Smith",
    "status": "active",
    "language": "English"
  }
}
```

---

### **POST /api/conversation/message**

Process a text message from the customer.

**Request:**
```http
POST /api/conversation/message
Content-Type: application/json

{
  "sessionId": "uuid-123-456-789",
  "message": "FTR-100234"
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    "message": "Thank you! I have account number FTR-100234. Perfect. And may I please have your name?",
    "speechText": "Thank you! I have account number F T R dash one hundred thousand two hundred thirty-four. Perfect. And may I please have your name?",
    "intent": "account_verification",
    "sentiment": "neutral",
    "urgency": 5,
    "keyConcerns": [],
    "offers": []
  }
}
```

---

### **POST /api/conversation/voice**

Process a voice message (text already transcribed).

**Request:**
```http
POST /api/conversation/voice
Content-Type: application/json

{
  "sessionId": "uuid-123-456-789",
  "message": "I want to cancel my service"
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    "message": "I understand you're considering canceling. I'd love to help address any concerns you have. May I ask what's prompting this decision?",
    "speechText": "I understand you're considering canceling. I'd love to help address any concerns you have. May I ask what's prompting this decision?",
    "intent": "cancellation",
    "sentiment": "negative",
    "urgency": 8,
    "keyConcerns": ["cancellation"],
    "offers": []
  }
}
```

---

### **POST /api/conversation/end**

End a conversation and generate summary.

**Request:**
```http
POST /api/conversation/end
Content-Type: application/json

{
  "sessionId": "uuid-123-456-789"
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalMessages": 12,
    "duration": 420,
    "finalIntent": "retention_successful",
    "finalSentiment": "positive",
    "finalUrgency": 3,
    "keyConcerns": ["billing", "pricing"],
    "offersPresented": ["loyalty_discount_20"],
    "outcome": "retained"
  },
  "session": {
    "sessionId": "uuid-123-456-789",
    "customerId": "cust_001",
    "status": "ended",
    "startTime": "2025-01-18T10:00:00Z",
    "endTime": "2025-01-18T10:07:00Z"
  }
}
```

---

### **GET /api/conversation/:sessionId**

Get conversation details and history.

**Request:**
```http
GET /api/conversation/uuid-123-456-789
```

**Response:**
```json
{
  "success": true,
  "session": {
    "sessionId": "uuid-123-456-789",
    "customerId": "cust_001",
    "customerProfile": {
      // ... customer details
    },
    "messages": [
      {
        "role": "agent",
        "content": "Hello! Thank you for calling...",
        "timestamp": "2025-01-18T10:00:00Z"
      },
      {
        "role": "customer",
        "content": "FTR-100234",
        "timestamp": "2025-01-18T10:00:15Z"
      }
      // ... more messages
    ],
    "intent": "retention_successful",
    "sentiment": "positive",
    "urgency": 3,
    "status": "active"
  }
}
```

---

## 🎤 Transcription API

### **POST /api/transcribe/audio**

Transcribe audio file to text using Whisper STT.

**Request:**
```http
POST /api/transcribe/audio
Content-Type: multipart/form-data

audio: (binary audio file)
```

**Supported Formats:** WAV, MP3, WEBM, OGG  
**Max File Size:** 10 MB

**Response:**
```json
{
  "success": true,
  "transcription": "I want to cancel my service"
}
```

**Error Response:**
```json
{
  "error": "Only audio files are allowed"
}
```

---

## ❤️ Health Check

### **GET /health**

Check server health status.

**Request:**
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-18T10:00:00Z"
}
```

---

## 🔐 Authentication

### **Session-Based**
- Sessions identified by UUID
- Created on `/api/conversation/start`
- 30-minute timeout from last activity
- Stored in-memory (backend)

### **PIN Verification**
- 4-digit PIN per customer
- Verified via `/api/customer/verify-pin`
- Matched against customer's actual PIN
- Used in authentication flow

---

## ⚠️ Error Handling

### **Standard Error Response**
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

### **Common HTTP Status Codes**

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid PIN or authentication |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## 🔗 Related Pages

- **[Customer API Details](Customer-API)** - Deep dive into customer endpoints
- **[Conversation API Details](Conversation-API)** - Conversation management
- **[Architecture Overview](Architecture-Overview)** - System architecture
- **[Data Flow Diagrams](Data-Flow-Diagrams)** - API interaction flows

---

**Back to:** [Home](Home)

