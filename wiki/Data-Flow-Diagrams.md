# Data Flow Diagrams

## 🔄 Overview

This page contains visual diagrams showing how data flows through the AI Voice Retention Agent system for various operations.

---

## 📋 Flow Index

1. [Customer Selection Flow](#1-customer-selection-flow)
2. [Call Start Flow](#2-call-start-flow)
3. [Message Processing Flow](#3-message-processing-flow)
4. [PIN Verification Flow](#4-pin-verification-flow)
5. [Movers Retention Flow](#5-movers-retention-flow)

---

## 1. Customer Selection Flow

### **Description**
How customer data is loaded and displayed in the frontend.

### **Flow Diagram**
```
┌─────────┐
│ Browser │
└────┬────┘
     │
     │ 1. Load customers
     │ GET /api/customer
     ▼
┌─────────────┐
│   Backend   │
│   Routes    │
└─────┬───────┘
      │
      │ 2. Check data source
      ├──────────┬──────────┐
      │          │          │
      ▼          ▼          ▼
  MongoDB    Mock Data   Hybrid
      │          │          │
      └──────────┴──────────┘
                 │
                 │ 3. Return customer list
                 │ {customers: [...]}
                 ▼
            ┌─────────┐
            │ Browser │
            │ Display │
            └─────────┘
```

###Human: continue
