# 🏗️ Architecture Diagrams (Mermaid)

## 📊 Overview

This document contains all architecture diagrams in **Mermaid format** for the AI Voice Retention Agent application. These diagrams can be rendered in GitHub, GitLab, Notion, and many other platforms.

---

## 📋 Table of Contents

1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [Component Architecture](#2-component-architecture)
3. [Data Flow - Customer Selection](#3-data-flow---customer-selection)
4. [Data Flow - Call Start](#4-data-flow---call-start)
5. [Data Flow - Message Processing](#5-data-flow---message-processing)
6. [Data Flow - PIN Verification](#6-data-flow---pin-verification)
7. [Data Flow - Movers Retention](#7-data-flow---movers-retention)
8. [Database Schema](#8-database-schema)
9. [API Endpoints](#9-api-endpoints)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Security Layers](#11-security-layers)

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end
    
    subgraph "Presentation Layer - Port 3000"
        Frontend[Frontend Web App]
        UI[UI Components]
        Voice[Voice Recording/TTS]
        Search[Customer Search]
        Analytics[Analytics Display]
    end
    
    subgraph "Application Layer - Port 3001"
        Backend[Backend API Server]
        Routes[API Routes]
        ConvMgr[Conversation Manager]
        DBService[Database Service]
        AIService[Databricks Service]
        SpeechFmt[Speech Formatter]
    end
    
    subgraph "Data Layer - Port 27017"
        MongoDB[(MongoDB Database)]
        MockData[Mock Data Fallback]
    end
    
    subgraph "External Services"
        Databricks[Databricks AI<br/>Claude, GPT-5, Gemini, Llama]
        Whisper[Whisper STT]
    end
    
    Browser --> Frontend
    Frontend --> UI
    Frontend --> Voice
    Frontend --> Search
    Frontend --> Analytics
    
    Frontend <-->|HTTP/REST API| Backend
    
    Backend --> Routes
    Routes --> ConvMgr
    Routes --> DBService
    Routes --> AIService
    Routes --> SpeechFmt
    
    DBService -->|Primary| MongoDB
    DBService -->|Fallback| MockData
    
    AIService <-->|HTTPS| Databricks
    AIService <-->|HTTPS| Whisper
    
    ConvMgr --> AIService
    ConvMgr --> SpeechFmt
    
    style Browser fill:#e1f5ff
    style Frontend fill:#fff4e6
    style Backend fill:#e8f5e9
    style MongoDB fill:#f3e5f5
    style Databricks fill:#ffe0b2
    style Whisper fill:#ffe0b2
```

---

## 2. Component Architecture

### Frontend Components

```mermaid
graph TB
    subgraph "Frontend Application - Port 3000"
        subgraph "UI Layer"
            Header[Header + Logo]
            CustomerInfo[Customer Info Panel]
            CallControl[Call Control Panel]
            SearchBar[Search Bar<br/>Type-ahead]
            ConvDisplay[Conversation Display]
            AnalyticsDash[Analytics Dashboard]
        end
        
        subgraph "Core Logic Layer"
            CustomerMgr[Customer Manager]
            ConvHandler[Conversation Handler]
            VoiceCtrl[Voice I/O Controller]
            SearchEngine[Search Engine]
            AnalyticsProc[Analytics Processor]
            TTSEngine[TTS Engine<br/>Browser API]
        end
        
        subgraph "API Client Layer"
            CustomerAPI[Customer API Client]
            ConvAPI[Conversation API Client]
            TranscribeAPI[Transcription API Client]
        end
    end
    
    Header --> CustomerMgr
    CustomerInfo --> CustomerMgr
    SearchBar --> SearchEngine
    CallControl --> ConvHandler
    ConvDisplay --> ConvHandler
    AnalyticsDash --> AnalyticsProc
    
    CustomerMgr --> CustomerAPI
    ConvHandler --> ConvAPI
    VoiceCtrl --> TranscribeAPI
    VoiceCtrl --> TTSEngine
    
    SearchEngine --> CustomerAPI
    AnalyticsProc --> ConvHandler
    
    style Header fill:#e3f2fd
    style CustomerInfo fill:#e3f2fd
    style CallControl fill:#e3f2fd
    style CustomerMgr fill:#fff9c4
    style ConvHandler fill:#fff9c4
    style CustomerAPI fill:#c8e6c9
    style ConvAPI fill:#c8e6c9
```

### Backend Components

```mermaid
graph TB
    subgraph "Backend API Server - Port 3001"
        subgraph "API Routes Layer"
            CustomerRoute[/api/customer<br/>4 endpoints]
            ConvRoute[/api/conversation<br/>5 endpoints]
            TranscribeRoute[/api/transcribe<br/>1 endpoint]
            HealthRoute[/health<br/>1 endpoint]
        end
        
        subgraph "Services Layer"
            ConvMgr[Conversation Manager<br/>• Session Management<br/>• System Prompts<br/>• Message Processing]
            DBService[Database Service<br/>• MongoDB Connection<br/>• Retry Logic<br/>• Health Checks]
            AIService[Databricks Service<br/>• LLM Integration<br/>• Model Selection<br/>• Response Processing]
            SpeechFmt[Speech Formatter<br/>• Currency Formatting<br/>• Date Formatting<br/>• Symbol Replacement]
        end
        
        subgraph "Data Layer"
            CustomerModel[Customer Model<br/>Mongoose Schema]
            MockData[Mock Data<br/>5 Demo Customers]
            SeedGen[Seed Generator<br/>200+ Customers]
        end
    end
    
    CustomerRoute --> DBService
    CustomerRoute --> CustomerModel
    CustomerRoute --> MockData
    
    ConvRoute --> ConvMgr
    TranscribeRoute --> AIService
    
    ConvMgr --> AIService
    ConvMgr --> SpeechFmt
    ConvMgr --> DBService
    
    DBService --> CustomerModel
    DBService --> MockData
    
    SeedGen --> CustomerModel
    
    style CustomerRoute fill:#ffccbc
    style ConvRoute fill:#ffccbc
    style TranscribeRoute fill:#ffccbc
    style ConvMgr fill:#c5cae9
    style DBService fill:#c5cae9
    style AIService fill:#c5cae9
    style CustomerModel fill:#b2dfdb
    style MockData fill:#b2dfdb
```

---

## 3. Data Flow - Customer Selection

```mermaid
sequenceDiagram
    participant Browser
    participant Frontend
    participant Backend
    participant Database
    participant MockData
    
    Browser->>Frontend: Load page
    Frontend->>Backend: GET /api/customer
    
    Backend->>Database: Check MongoDB connection
    
    alt MongoDB Available
        Database-->>Backend: Connection OK
        Backend->>Database: Query customers
        Database-->>Backend: Return customer list
    else MongoDB Unavailable
        Backend->>MockData: Load mock data
        MockData-->>Backend: Return 5 demo customers
    end
    
    Backend-->>Frontend: {customers: [...], count: N, dataSource: "mongodb/mock"}
    Frontend-->>Browser: Display customer list
    Browser->>Frontend: Select customer
    Frontend->>Backend: GET /api/customer/:customerId
    Backend->>Database: Fetch full customer profile
    Database-->>Backend: Customer details
    Backend-->>Frontend: {customer: {...}}
    Frontend-->>Browser: Display customer info panel
```

---

## 4. Data Flow - Call Start

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant ConvMgr as Conversation Manager
    participant AIService as Databricks AI
    participant SpeechFmt as Speech Formatter
    
    User->>Frontend: Click "Start Call"
    Frontend->>Backend: POST /api/conversation/start<br/>{customerId, customerProfile}
    
    Backend->>ConvMgr: createSession(customerId, profile)
    ConvMgr->>ConvMgr: Generate UUID sessionId
    ConvMgr->>ConvMgr: Generate system prompt<br/>• Inject customer insights<br/>• Inject customer PIN<br/>• Set language
    ConvMgr->>ConvMgr: Extract greeting from prompt
    
    ConvMgr->>SpeechFmt: Format greeting for TTS<br/>• "$29.99" → "twenty-nine..."<br/>• "/" → "per"<br/>• Remove asterisks
    SpeechFmt-->>ConvMgr: Formatted speech text
    
    ConvMgr-->>Backend: {sessionId, greeting, speechText}
    Backend-->>Frontend: {success: true, sessionId, greeting, speechText}
    
    Frontend->>Frontend: Display greeting
    Frontend->>Frontend: Speak using TTS<br/>(speechText)
    Frontend-->>User: Audio + Visual greeting
```

---

## 5. Data Flow - Message Processing

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant ConvMgr as Conversation Manager
    participant AIService as Databricks AI
    participant SpeechFmt as Speech Formatter
    
    User->>Frontend: Type/Speak message
    Frontend->>Backend: POST /api/conversation/message<br/>{sessionId, message}
    
    Backend->>ConvMgr: processMessage(sessionId, message)
    ConvMgr->>ConvMgr: Get session & history
    ConvMgr->>ConvMgr: Build context<br/>• System prompt<br/>• Conversation history<br/>• Customer insights
    
    ConvMgr->>AIService: Call AI with full context
    AIService->>AIService: Select model<br/>(Claude/GPT/Gemini/Llama)
    AIService-->>ConvMgr: AI response
    
    ConvMgr->>ConvMgr: Save to history
    ConvMgr->>ConvMgr: Extract intent & sentiment
    ConvMgr->>ConvMgr: Update session state
    
    ConvMgr->>SpeechFmt: Format for speech
    SpeechFmt-->>ConvMgr: Formatted text
    
    ConvMgr-->>Backend: {message, speechText, intent, sentiment...}
    Backend-->>Frontend: Response object
    
    Frontend->>Frontend: Display message
    Frontend->>Frontend: Speak with TTS
    Frontend->>Frontend: Update analytics
    Frontend-->>User: Audio + Visual response
```

---

## 6. Data Flow - PIN Verification

```mermaid
flowchart TD
    Start([User Calls]) --> Greeting[Agent: Neutral Greeting<br/>No name used yet]
    Greeting --> AskAccount[Agent: Ask for account number]
    AskAccount --> UserAccount[User: Provides account number]
    UserAccount --> AskName[Agent: Ask for caller's name]
    AskName --> UserName[User: Provides name]
    UserName --> AskPIN[Agent: Ask for 4-digit PIN<br/>Can be found on bill]
    AskPIN --> UserPIN[User: Provides PIN]
    
    UserPIN --> CheckPIN{AI Compares PIN<br/>Against customer's<br/>actual PIN in<br/>system prompt}
    
    CheckPIN -->|Match| Verified[Agent: Perfect, thank you!<br/>I've verified your identity]
    CheckPIN -->|No Match| Failed[Agent: Sorry, that PIN<br/>doesn't match our records]
    
    Verified --> UseName[Agent: NOW uses<br/>customer's first name]
    UseName --> Authenticated[Customer Authenticated<br/>Full conversation access]
    
    Failed --> Retry{Customer wants<br/>to retry?}
    Retry -->|Yes| AskPIN
    Retry -->|No| OfferMFA[Agent: Offer MFA<br/>Email or Mobile]
    
    OfferMFA --> MFAChoice[User chooses method]
    MFAChoice --> SendCode[Agent: Send code]
    SendCode --> CodeProvided[User provides code]
    CodeProvided --> MFAVerified[Verified via MFA]
    MFAVerified --> UseName
    
    Authenticated --> Continue[Continue conversation<br/>with full context]
    
    style Start fill:#e8f5e9
    style Verified fill:#c8e6c9
    style Authenticated fill:#81c784
    style Failed fill:#ffcdd2
    style CheckPIN fill:#fff9c4
```

---

## 7. Data Flow - Movers Retention

```mermaid
flowchart TD
    Start([Customer mentions moving]) --> Detect[AI Detects keywords:<br/>moving, relocating, new address]
    
    Detect --> Empathy[Agent: Express empathy<br/>Moving is a big change!<br/>We might be able to help]
    
    Empathy --> AskAddress[Agent: Where are you moving to?<br/>What's the new address?]
    
    AskAddress --> UserAddress[User provides address]
    
    UserAddress --> Verify[Agent: Repeat address<br/>for confirmation]
    
    Verify --> Confirm{User confirms<br/>address?}
    
    Confirm -->|No| AskAddress
    Confirm -->|Yes| CheckState{Is state<br/>FL, TX, or CA?}
    
    CheckState -->|Yes - Serviced| GoodNews[Agent: Great news!<br/>We provide service<br/>in that state!]
    
    CheckState -->|No - Not Serviced| NotServed[Agent: Sorry, we don't<br/>serve that area.<br/>Let me help with<br/>cancellation]
    
    GoodNews --> Offer[Agent: Present Movers Offer<br/>• 1 Gig Fiber Internet<br/>• Special promotional pricing<br/>• Pro installation included]
    
    Offer --> Details[Agent: Share details<br/>• 1000 Mbps speeds<br/>• No early termination fees<br/>• Coordinate move schedule]
    
    Details --> Interest{Customer<br/>interested?}
    
    Interest -->|Yes| Schedule[Collect move date<br/>Schedule installation<br/>Transfer service]
    Interest -->|No| Address[Address concerns<br/>Emphasize convenience<br/>of same provider]
    
    Address --> Reoffer{Customer<br/>reconsiders?}
    Reoffer -->|Yes| Schedule
    Reoffer -->|No| NotServed
    
    Schedule --> Success[🎉 Customer Retained<br/>Service transferred]
    NotServed --> Cancelled[Process cancellation<br/>with empathy]
    
    style Start fill:#e8f5e9
    style GoodNews fill:#c8e6c9
    style Success fill:#81c784
    style NotServed fill:#ffcdd2
    style Cancelled fill:#ef9a9a
    style CheckState fill:#fff9c4
    style Interest fill:#fff9c4
```

---

## 8. Database Schema

```mermaid
erDiagram
    CUSTOMER {
        ObjectId _id PK
        string customerId UK "Unique customer ID"
        string firstName "Customer first name"
        string lastName "Customer last name"
        string name "Full name"
        string email "Email address"
        string phone "Phone number"
        string accountNumber UK "Account number"
        string pin "4-digit PIN"
        string serviceAddress "Service address"
        string customerScope "Customer type"
        array coreServices "List of services"
        object currentPlanDetails "Plan info"
        array vasServices "Value-added services"
        object overdueBalance "Overdue info"
        object autoPayStatus "AutoPay status"
        object eBillStatus "E-Bill status"
        object upsellEligibility "Upsell flags"
        object recentTroubleTickets "Ticket info"
        object recentBillingEvents "Billing changes"
        date lastContactDate "Last contact"
        number totalInteractions "Total interactions"
        number openOrders "Open orders"
        string preferredLanguage "EN or ES"
        number tenure "Tenure in months"
        string accountStatus "Account status"
        number lifetimeValue "LTV"
        number monthlyBill "Monthly bill"
        date createdAt "Created timestamp"
        date updatedAt "Updated timestamp"
    }
    
    SESSION {
        string sessionId PK "UUID"
        string customerId FK "Links to customer"
        object customerProfile "Full profile"
        array messages "Conversation history"
        string intent "Current intent"
        string sentiment "Current sentiment"
        number urgency "Urgency level"
        string language "EN or ES"
        array keyConcerns "Key concerns"
        array offers "Offers presented"
        date startTime "Session start"
        date lastActivity "Last activity"
        string status "active/ended"
    }
    
    CUSTOMER ||--o{ SESSION : "has many"
```

---

## 9. API Endpoints

```mermaid
graph LR
    subgraph "Customer API"
        C1[GET /api/customer/:id<br/>Get customer by ID]
        C2[GET /api/customer<br/>List all customers]
        C3[GET /api/customer/list<br/>Customer search list]
        C4[POST /api/customer/verify-pin<br/>Verify PIN]
    end
    
    subgraph "Conversation API"
        V1[POST /api/conversation/start<br/>Start new conversation]
        V2[POST /api/conversation/message<br/>Process text message]
        V3[POST /api/conversation/voice<br/>Process voice message]
        V4[POST /api/conversation/end<br/>End conversation]
        V5[GET /api/conversation/:id<br/>Get conversation]
    end
    
    subgraph "Transcription API"
        T1[POST /api/transcribe/audio<br/>Transcribe audio to text]
    end
    
    subgraph "Health API"
        H1[GET /health<br/>Health check]
    end
    
    Client[Client Application] --> C1
    Client --> C2
    Client --> C3
    Client --> C4
    Client --> V1
    Client --> V2
    Client --> V3
    Client --> V4
    Client --> V5
    Client --> T1
    Client --> H1
    
    style C1 fill:#ffe0b2
    style C2 fill:#ffe0b2
    style C3 fill:#ffe0b2
    style C4 fill:#ffe0b2
    style V1 fill:#c5cae9
    style V2 fill:#c5cae9
    style V3 fill:#c5cae9
    style V4 fill:#c5cae9
    style V5 fill:#c5cae9
    style T1 fill:#b2dfdb
    style H1 fill:#f8bbd0
```

---

## 10. Deployment Architecture

### Development Environment

```mermaid
graph TB
    subgraph "Developer Machine - localhost"
        subgraph "Terminal 1"
            FE[Frontend Server<br/>Port 3000<br/>npm start]
        end
        
        subgraph "Terminal 2"
            BE[Backend API<br/>Port 3001<br/>npm start]
        end
        
        subgraph "Local Services"
            DB[(MongoDB<br/>Port 27017<br/>Local instance)]
        end
        
        subgraph "Environment"
            ENV[.env File<br/>• API Keys<br/>• DB URI<br/>• Config]
        end
    end
    
    subgraph "External"
        DBAPI[Databricks API<br/>Claude, GPT, Gemini<br/>Whisper STT]
    end
    
    FE -->|HTTP| BE
    BE --> DB
    BE --> ENV
    BE -->|HTTPS| DBAPI
    
    style FE fill:#e3f2fd
    style BE fill:#e8f5e9
    style DB fill:#f3e5f5
    style DBAPI fill:#fff3e0
```

### Production Architecture (Proposed)

```mermaid
graph TB
    subgraph "Cloud Infrastructure"
        LB[Load Balancer<br/>AWS ALB]
        
        subgraph "Frontend Tier"
            FE1[Frontend Instance 1<br/>S3 + CloudFront]
            FE2[Frontend Instance 2<br/>S3 + CloudFront]
        end
        
        subgraph "API Gateway"
            GW[API Gateway<br/>Rate Limiting<br/>Auth]
        end
        
        subgraph "Backend Tier"
            BE1[Backend API 1<br/>EC2/ECS]
            BE2[Backend API 2<br/>EC2/ECS]
            BE3[Backend API 3<br/>EC2/ECS]
        end
        
        subgraph "Session Store"
            Redis[(Redis<br/>Shared Sessions)]
        end
        
        subgraph "Database Tier"
            Primary[(MongoDB Primary<br/>Atlas)]
            Secondary1[(MongoDB Secondary<br/>Replica 1)]
            Secondary2[(MongoDB Secondary<br/>Replica 2)]
        end
    end
    
    subgraph "External Services"
        DBAI[Databricks<br/>Foundation Models]
        DBSTT[Databricks<br/>Whisper STT]
    end
    
    Users[Users] --> LB
    LB --> FE1
    LB --> FE2
    
    FE1 --> GW
    FE2 --> GW
    
    GW --> BE1
    GW --> BE2
    GW --> BE3
    
    BE1 --> Redis
    BE2 --> Redis
    BE3 --> Redis
    
    BE1 --> Primary
    BE2 --> Primary
    BE3 --> Primary
    
    Primary --> Secondary1
    Primary --> Secondary2
    
    BE1 --> DBAI
    BE2 --> DBAI
    BE3 --> DBAI
    
    BE1 --> DBSTT
    BE2 --> DBSTT
    BE3 --> DBSTT
    
    style LB fill:#ffccbc
    style GW fill:#ffccbc
    style FE1 fill:#e3f2fd
    style FE2 fill:#e3f2fd
    style BE1 fill:#e8f5e9
    style BE2 fill:#e8f5e9
    style BE3 fill:#e8f5e9
    style Redis fill:#ffe0b2
    style Primary fill:#f3e5f5
    style Secondary1 fill:#f3e5f5
    style Secondary2 fill:#f3e5f5
```

---

## 11. Security Layers

```mermaid
graph TB
    subgraph "Layer 1: Authentication & Authorization"
        PIN[PIN Verification<br/>4-digit customer PIN]
        MFA[Multi-Factor Auth<br/>Email/SMS codes]
        Session[Session Management<br/>UUID tokens, 30min timeout]
    end
    
    subgraph "Layer 2: Data Protection"
        ENV[Environment Variables<br/>API keys, secrets in .env]
        DBSec[MongoDB Security<br/>Connection encryption]
        Input[Input Validation<br/>Sanitization]
    end
    
    subgraph "Layer 3: Network Security"
        CORS[CORS Configuration<br/>Allowed origins]
        HTTPS[HTTPS/TLS<br/>Encrypted transport]
        Rate[Rate Limiting<br/>DDoS protection]
    end
    
    subgraph "Layer 4: Application Security"
        Error[Error Handling<br/>No sensitive data leaks]
        Logging[Secure Logging<br/>Masked PII]
        Upload[File Upload Validation<br/>Audio files only]
    end
    
    subgraph "Layer 5: Customer Data Privacy"
        PINStore[Secure PIN Storage<br/>Database encrypted]
        Mask[Data Masking<br/>Logs & errors]
        Temp[Temporary Sessions<br/>In-memory only]
    end
    
    User[User Request] --> PIN
    PIN --> MFA
    MFA --> Session
    Session --> ENV
    ENV --> DBSec
    DBSec --> Input
    Input --> CORS
    CORS --> HTTPS
    HTTPS --> Rate
    Rate --> Error
    Error --> Logging
    Logging --> Upload
    Upload --> PINStore
    PINStore --> Mask
    Mask --> Temp
    Temp --> Secure[Secure Access]
    
    style PIN fill:#ffcdd2
    style MFA fill:#ffcdd2
    style Session fill:#ffcdd2
    style HTTPS fill:#c8e6c9
    style Rate fill:#c8e6c9
    style PINStore fill:#b2dfdb
    style Mask fill:#b2dfdb
```

---

## 🎯 How to Use These Diagrams

### **In GitHub/GitLab**
Mermaid diagrams render automatically! Just paste them in:
- README files
- Wiki pages
- Issue descriptions
- Pull request descriptions

### **In Notion**
1. Add a code block
2. Select "Mermaid" as the language
3. Paste the diagram code

### **In Confluence**
1. Install "Mermaid for Confluence" plugin
2. Use the Mermaid macro
3. Paste the diagram code

### **Standalone Rendering**
Use online editors:
- https://mermaid.live/
- https://mermaid.ink/

---

## 📝 Diagram Syntax Reference

### **Graph Types**
- `graph TB` - Top to Bottom
- `graph LR` - Left to Right
- `flowchart TD` - Flowchart Top-Down
- `sequenceDiagram` - Sequence diagram
- `erDiagram` - Entity Relationship

### **Node Shapes**
- `[Rectangle]` - Rectangle
- `(Rounded)` - Rounded rectangle
- `([Stadium])` - Stadium shape
- `[[Subroutine]]` - Subroutine
- `[(Database)]` - Cylinder/Database
- `((Circle))` - Circle
- `{Diamond}` - Diamond/Decision

### **Arrows**
- `-->` - Solid arrow
- `-.->` - Dotted arrow
- `==>` - Thick arrow
- `-->>` - Async message

---

**Last Updated:** 2025-01-18  
**Version:** 1.0  
**Status:** ✅ Ready to Use

