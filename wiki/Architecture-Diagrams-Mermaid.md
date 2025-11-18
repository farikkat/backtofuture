# Architecture Diagrams (Mermaid)

## 📊 Interactive Architecture Diagrams

This page contains **interactive Mermaid diagrams** that render automatically in GitHub, GitLab, and other platforms.

---

## 🏛️ High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end
    
    subgraph "Presentation Layer - Port 3000"
        Frontend[Frontend Web App]
    end
    
    subgraph "Application Layer - Port 3001"
        Backend[Backend API Server]
        ConvMgr[Conversation Manager]
        DBService[Database Service]
        AIService[Databricks Service]
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB<br/>Port 27017)]
        MockData[Mock Data<br/>Fallback]
    end
    
    subgraph "External Services"
        Databricks[Databricks AI<br/>Claude, GPT-5, Gemini, Llama]
        Whisper[Whisper STT]
    end
    
    Browser --> Frontend
    Frontend <-->|HTTP/REST| Backend
    Backend --> ConvMgr
    Backend --> DBService
    Backend --> AIService
    DBService --> MongoDB
    DBService --> MockData
    AIService <--> Databricks
    AIService <--> Whisper
    
    style Browser fill:#e1f5ff
    style Frontend fill:#fff4e6
    style Backend fill:#e8f5e9
    style MongoDB fill:#f3e5f5
    style Databricks fill:#ffe0b2
```

---

## 🔄 Message Processing Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant AI as Databricks AI
    participant Speech as Speech Formatter
    
    User->>Frontend: Type/Speak message
    Frontend->>Backend: POST /api/conversation/message
    Backend->>Backend: Get session & history
    Backend->>AI: Send context + message
    AI-->>Backend: AI response
    Backend->>Speech: Format for natural TTS
    Speech-->>Backend: Formatted speech text
    Backend-->>Frontend: {message, speechText, intent...}
    Frontend->>Frontend: Display + Speak
    Frontend-->>User: Audio + Visual response
```

---

## 🔐 PIN Verification Flow

```mermaid
flowchart TD
    Start([User Calls]) --> Greeting[Neutral Greeting<br/>No name yet]
    Greeting --> AskAccount[Ask account number]
    AskAccount --> AskName[Ask caller's name]
    AskName --> AskPIN[Ask for 4-digit PIN]
    AskPIN --> CheckPIN{AI Compares<br/>Against Actual PIN}
    
    CheckPIN -->|Match| Verified[Identity Verified<br/>✅]
    CheckPIN -->|No Match| Failed[PIN Incorrect<br/>❌]
    
    Verified --> Authenticated[Use customer name<br/>Full access]
    Failed --> Retry{Retry or MFA?}
    Retry -->|Retry| AskPIN
    Retry -->|MFA| OfferMFA[Email/Mobile code]
    OfferMFA --> Authenticated
    
    style Verified fill:#c8e6c9
    style Authenticated fill:#81c784
    style Failed fill:#ffcdd2
```

---

## 🏠 Movers Retention Flow

```mermaid
flowchart TD
    Start([Customer Moving]) --> Detect[Detect: moving keywords]
    Detect --> Empathy[Express empathy<br/>We might help!]
    Empathy --> AskAddress[Ask new address]
    AskAddress --> Verify[Repeat address back]
    Verify --> CheckState{State is<br/>FL, TX, or CA?}
    
    CheckState -->|Yes| GoodNews[Great news!<br/>We serve that area!]
    CheckState -->|No| NotServed[Sorry, not serviced<br/>Help with cancellation]
    
    GoodNews --> Offer[Present Movers Offer<br/>1 Gig Fiber<br/>Special pricing]
    Offer --> Interest{Interested?}
    Interest -->|Yes| Success[🎉 Customer Retained]
    Interest -->|No| NotServed
    
    style Success fill:#81c784
    style GoodNews fill:#c8e6c9
    style NotServed fill:#ffcdd2
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    CUSTOMER {
        string customerId PK
        string accountNumber UK
        string pin "4-digit"
        string firstName
        string lastName
        string email
        string preferredLanguage
        number tenure
        object currentPlanDetails
        array vasServices
        object overdueBalance
    }
    
    SESSION {
        string sessionId PK
        string customerId FK
        array messages
        string intent
        string sentiment
        string language
        date startTime
    }
    
    CUSTOMER ||--o{ SESSION : "has many"
```

---

## 🔌 API Endpoints

```mermaid
graph LR
    Client[Client] --> C[Customer API<br/>4 endpoints]
    Client --> V[Conversation API<br/>5 endpoints]
    Client --> T[Transcribe API<br/>1 endpoint]
    Client --> H[Health Check<br/>1 endpoint]
    
    style C fill:#ffe0b2
    style V fill:#c5cae9
    style T fill:#b2dfdb
    style H fill:#f8bbd0
```

---

## 🚀 Deployment Architecture

### Development

```mermaid
graph TB
    Dev[Developer Machine]
    FE[Frontend :3000]
    BE[Backend :3001]
    DB[(MongoDB :27017)]
    EXT[Databricks API]
    
    Dev --> FE
    Dev --> BE
    FE --> BE
    BE --> DB
    BE --> EXT
    
    style FE fill:#e3f2fd
    style BE fill:#e8f5e9
    style DB fill:#f3e5f5
```

### Production

```mermaid
graph TB
    Users --> LB[Load Balancer]
    LB --> FE1[Frontend 1]
    LB --> FE2[Frontend 2]
    FE1 --> GW[API Gateway]
    FE2 --> GW
    GW --> BE1[Backend 1]
    GW --> BE2[Backend 2]
    GW --> BE3[Backend 3]
    BE1 --> DB[(MongoDB Cluster)]
    BE2 --> DB
    BE3 --> DB
    
    style LB fill:#ffccbc
    style GW fill:#ffccbc
```

---

## 🔐 Security Layers

```mermaid
graph TB
    L1[Layer 1: Authentication<br/>PIN, MFA, Sessions]
    L2[Layer 2: Data Protection<br/>Encryption, Validation]
    L3[Layer 3: Network Security<br/>CORS, HTTPS, Rate Limiting]
    L4[Layer 4: Application Security<br/>Error Handling, Logging]
    L5[Layer 5: Data Privacy<br/>PIN Storage, Masking]
    
    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5
    L5 --> Secure[Secure System]
    
    style L1 fill:#ffcdd2
    style L3 fill:#c8e6c9
    style L5 fill:#b2dfdb
```

---

## 📝 More Diagrams

For complete diagrams including component architecture, detailed data flows, and more:

**See:** [Complete Mermaid Diagrams](../ARCHITECTURE-MERMAID.md)

---

**Back to:** [Architecture Overview](Architecture-Overview) | [Home](Home)

