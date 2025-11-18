# MongoDB Integration - Implementation Complete

## Overview

Customer insights data has been migrated from in-memory mock data to MongoDB with automatic fallback. The system now supports full CRUD operations, advanced queries, and seamless switching between MongoDB and mock data based on availability.

## What Was Implemented

### 1. MongoDB Infrastructure

#### Dependencies Installed
```bash
npm install mongoose --save
```
- **mongoose** v7.x: MongoDB object modeling for Node.js

#### Files Created
1. **`backend/models/Customer.js`** - Mongoose schema/model
2. **`backend/services/database-service.js`** - Connection management
3. **`backend/data/customer-data.js`** - Shared customer data
4. **`backend/scripts/migrate-customers.js`** - Migration utility

#### Files Modified
1. **`backend/routes/customer.js`** - Updated to use MongoDB with fallback
2. **`backend/config.example`** - Added MongoDB configuration
3. **`backend/package.json`** - Added migration scripts

### 2. Customer Schema (`backend/models/Customer.js`)

Comprehensive MongoDB schema with all 13 customer insights:

**Core Fields:**
- customerId (unique, indexed)
- firstName, lastName, name
- email, phone
- accountNumber (unique)
- serviceAddress
- customerScope, coreServices

**Customer Insights (13 fields):**
- customerTenure (object with years, months, message)
- currentPlanDetails (name, price, product types)
- vasServices (array)
- overdueBalance (nullable object)
- autoPayStatus, eBillStatus (objects with status + message)
- upsellEligibility (object with eligible flag + reason)
- recentTroubleTickets (count + message)
- lastContactDate, totalInteractions
- openOrders (array)
- preferredLanguage (enum: English/Spanish)
- recentBillingEvents (object with changes, amount, type)

**Legacy Fields** (for compatibility):
- monthlyBill, currentPlan, tenure
- paymentHistory, accountStatus, lifetimeValue
- recentActivity (array), notes

**Special Features:**
- Automatic timestamps (createdAt, updatedAt)
- Indexes on key fields (customerId, email, accountNumber, accountStatus, preferredLanguage)
- Virtual fields (fullName)
- Instance methods (getSummary)
- Static methods (findAtRisk, findVIP)

### 3. Database Service (`backend/services/database-service.js`)

Manages MongoDB connections with robust error handling:

**Features:**
- ✅ Automatic connection with retry logic (3 attempts, 5s delay)
- ✅ Connection pooling
- ✅ Event listeners (disconnect, error, reconnect)
- ✅ Health check endpoint
- ✅ Graceful shutdown (SIGINT/SIGTERM)
- ✅ Connection status monitoring
- ✅ Configurable timeout settings

**Connection States:**
- 0: disconnected
- 1: connected
- 2: connecting
- 3: disconnecting

### 4. Customer Routes (`backend/routes/customer.js`)

Complete REST API with MongoDB + fallback:

#### Read Operations

**GET /api/customer/scenarios/list**
- Returns customer scenarios for dropdown
- Includes dataSource indicator (mongodb/mock)

**GET /api/customer/health**
- Database health check
- Connection status
- Database name

**GET /api/customer**
- List all customers (summary view)
- Returns: customerId, name, monthlyBill, tenure, accountStatus, preferredLanguage
- Works with both MongoDB and mock data

**GET /api/customer/:customerId**
- Get single customer with full details
- 404 if not found
- Works with both MongoDB and mock data

#### Write Operations (MongoDB Only)

**POST /api/customer**
- Create new customer
- Validates data against schema
- 409 if customer already exists
- 503 if MongoDB unavailable

**PUT /api/customer/:customerId**
- Update existing customer
- Protects immutable fields (_id, customerId, createdAt)
- Runs validators
- 404 if not found
- 503 if MongoDB unavailable

**DELETE /api/customer/:customerId**
- Delete customer
- 404 if not found
- 503 if MongoDB unavailable

#### Advanced Queries (MongoDB Only)

**GET /api/customer/query/at-risk**
- Find customers at risk of churning
- Criteria: overdue balance > 0 OR trouble tickets >= 2 OR accountStatus = 'at-risk'
- Returns full customer objects

**GET /api/customer/query/vip**
- Find VIP customers
- Criteria: accountStatus = 'vip' OR monthlyBill >= $150 OR tenure >= 36 months
- Returns full customer objects

### 5. Migration Script (`backend/scripts/migrate-customers.js`)

Utility for populating MongoDB:

**Functions:**
- `migrateCustomers()` - Populate if database empty
- `clearAndMigrate()` - Delete all and re-populate
- `getCustomerSummary()` - Display stats

**Usage:**
```bash
# Migrate if empty (safe, won't overwrite)
npm run migrate

# Clear and re-migrate (WARNING: deletes all data)
npm run migrate:clear

# Or run directly
node scripts/migrate-customers.js
node scripts/migrate-customers.js --clear
```

**Summary Output:**
```
[Migration] Customer Summary:
  - Total Customers: 5
  - English: 4
  - Spanish: 1
  - VIP: 1
  - At Risk: 2
```

### 6. Auto-Population

The system automatically populates MongoDB on startup if:
1. MongoDB connection successful
2. Database is empty (count = 0)

This means you can start fresh with just:
```bash
npm start
```

No manual migration needed for first-time setup!

### 7. Fallback Mechanism

**Automatic Fallback:**
- If MongoDB unavailable → uses mock data
- All read operations work seamlessly
- Write operations return 503 error

**Logged Clearly:**
```
[Customer API] Using MongoDB for customer data
[Customer API] Database contains 5 customers
```

or

```
[Customer API] Using mock data (MongoDB unavailable)
```

**Response Includes Source:**
```json
{
  "success": true,
  "customer": {...},
  "dataSource": "mongodb"  // or "mock"
}
```

## Configuration

### Environment Variables

Add to `.env` (copy from `config.example`):

```env
# MongoDB Configuration
# Local MongoDB (default)
MONGODB_URI=mongodb://localhost:27017/retention-agent

# Or MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/retention-agent
```

### MongoDB Setup Options

#### Option 1: Local MongoDB (Recommended for Development)

**Install MongoDB:**
- Windows: Download from https://www.mongodb.com/try/download/community
- Mac: `brew install mongodb-community`
- Linux: `sudo apt-get install -y mongodb`

**Start MongoDB:**
```bash
# Windows
net start MongoDB

# Mac/Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

**Verify Running:**
```bash
# Connect with mongo shell
mongo
# or with mongosh
mongosh
```

#### Option 2: MongoDB Atlas (Cloud)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Get connection string
4. Add to `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/retention-agent
```

#### Option 3: No MongoDB (Mock Data Only)

Simply don't set `MONGODB_URI` or set it to empty:
```env
MONGODB_URI=
```

System will automatically use mock data.

## Usage Examples

### Starting the Application

```bash
cd backend
npm start
```

**Scenarios:**

**A) MongoDB Available & Empty:**
```
[Database] ✓ Connected to MongoDB: mongodb://localhost:27017/retention-agent
[Customer API] Using MongoDB for customer data
[Customer API] Database empty, populating with initial data...
[Customer API] ✓ Populated database with 5 customers
Server running on port 3001
```

**B) MongoDB Available & Has Data:**
```
[Database] ✓ Connected to MongoDB
[Customer API] Using MongoDB for customer data
[Customer API] Database contains 5 customers
Server running on port 3001
```

**C) MongoDB Unavailable:**
```
[Database] ✗ MongoDB connection failed (attempt 1/3): connect ECONNREFUSED
[Database] Retrying in 5 seconds...
[Database] ⚠ Max connection attempts reached. Falling back to mock data.
[Customer API] Using mock data (MongoDB unavailable)
Server running on port 3001
```

### API Usage Examples

#### Get All Customers
```bash
curl http://localhost:3001/api/customer

# Response
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
    ...
  ],
  "count": 5,
  "dataSource": "mongodb"
}
```

#### Get Single Customer
```bash
curl http://localhost:3001/api/customer/cust_001

# Response
{
  "success": true,
  "customer": {
    "customerId": "cust_001",
    "firstName": "John",
    "lastName": "Smith",
    "accountNumber": "FTR-100234",
    "customerTenure": {
      "years": 1,
      "months": 2,
      "totalMonths": 14,
      "message": "Thank and reward tenure"
    },
    ...
  },
  "dataSource": "mongodb"
}
```

#### Create New Customer
```bash
curl -X POST http://localhost:3001/api/customer \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust_006",
    "firstName": "Alice",
    "lastName": "Johnson",
    "name": "Alice Johnson",
    "email": "alice@email.com",
    "phone": "+1-555-0606",
    "accountNumber": "FTR-600123",
    "serviceAddress": "123 Main St, City, ST 12345",
    "monthlyBill": 79.99,
    "currentPlan": "Fiber 500",
    "tenure": 6,
    "accountStatus": "active",
    "preferredLanguage": "English"
  }'
```

#### Update Customer
```bash
curl -X PUT http://localhost:3001/api/customer/cust_001 \
  -H "Content-Type: application/json" \
  -d '{
    "totalInteractions": 3,
    "lastContactDate": "2025-11-18"
  }'
```

#### Delete Customer
```bash
curl -X DELETE http://localhost:3001/api/customer/cust_006
```

#### Find At-Risk Customers
```bash
curl http://localhost:3001/api/customer/query/at-risk

# Returns customers with:
# - Overdue balance > 0
# - Trouble tickets >= 2
# - Account status = 'at-risk'
```

#### Find VIP Customers
```bash
curl http://localhost:3001/api/customer/query/vip

# Returns customers with:
# - Account status = 'vip'
# - Monthly bill >= $150
# - Tenure >= 36 months
```

#### Health Check
```bash
curl http://localhost:3001/api/customer/health

# Response
{
  "success": true,
  "database": {
    "enabled": true,
    "healthy": true,
    "message": "MongoDB connection healthy",
    "database": "retention-agent",
    "isConnected": true,
    "readyState": 1,
    "readyStateText": "connected"
  }
}
```

## Migration

### Initial Migration (Automatic)

Happens automatically on first `npm start` if database is empty.

### Manual Migration

```bash
# Safe migration (only if database empty)
npm run migrate

# Clear and re-migrate (WARNING: deletes all data)
npm run migrate:clear
```

### Migration Output

```
[Migration] Starting customer data migration...
[Database] ✓ Connected to MongoDB
[Migration] Inserting 5 customers...
[Migration] ✓ Successfully migrated 5 customers
[Migration] Customer Summary:
  - Total Customers: 5
  - English: 4
  - Spanish: 1
  - VIP: 1
  - At Risk: 2
[Database] ✓ Disconnected from MongoDB
```

## Testing

### Test MongoDB Connection

```bash
# Start MongoDB locally
mongod

# In another terminal, connect
mongosh

# In mongo shell
use retention-agent
db.customers.find()
```

### Test Fallback Behavior

1. **With MongoDB running:**
```bash
npm start
# Should show "Using MongoDB for customer data"
```

2. **Without MongoDB running:**
```bash
# Stop MongoDB first
npm start
# Should show "Using mock data (MongoDB unavailable)"
```

3. **Both scenarios should work identically from frontend perspective!**

### Frontend Integration

No changes needed! The frontend already works with the existing API:
- GET /api/customer/scenarios/list
- GET /api/customer/:customerId

Both now work with MongoDB (or fallback to mock).

## File Structure

```
backend/
├── data/
│   └── customer-data.js          # Shared customer data (mock + migration)
├── models/
│   └── Customer.js                # Mongoose schema/model
├── routes/
│   └── customer.js                # Updated API routes (MongoDB + fallback)
├── scripts/
│   └── migrate-customers.js       # Migration utility
├── services/
│   ├── database-service.js        # MongoDB connection management
│   ├── databricks-service.js      # (existing)
│   ├── retention-service.js       # (existing)
│   └── conversation-manager.js    # (existing)
├── config.example                 # Updated with MongoDB config
├── package.json                   # Added migration scripts
└── server.js                      # (no changes needed)
```

## Benefits

✅ **Persistent Data**: Customer insights survive server restarts
✅ **Scalable**: Ready for production with real customer database
✅ **CRUD Operations**: Full create, read, update, delete support
✅ **Advanced Queries**: Find at-risk customers, VIP customers, etc.
✅ **Automatic Fallback**: Never fails - uses mock data if MongoDB down
✅ **Auto-Population**: Database populates automatically on first run
✅ **Health Monitoring**: /health endpoint for system monitoring
✅ **Zero Frontend Changes**: Existing frontend works unchanged
✅ **Development Friendly**: Works with or without MongoDB

## Success Criteria

✅ Mongoose installed and configured
✅ Customer model with complete schema (13 insights + legacy fields)
✅ Database service with connection management + retry logic
✅ Customer routes updated with MongoDB + fallback
✅ Full CRUD API endpoints implemented
✅ Advanced query endpoints (at-risk, VIP)
✅ Migration script with clear/re-migrate options
✅ Auto-population on first startup
✅ npm scripts for migrations
✅ Environment configuration documented
✅ Health check endpoint
✅ Comprehensive error handling
✅ Zero linting errors
✅ No breaking changes to existing functionality

## Troubleshooting

### "MongoDB connection failed"

**Solution 1: Start MongoDB**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Solution 2: Check connection string**
```env
# In .env, verify:
MONGODB_URI=mongodb://localhost:27017/retention-agent
```

**Solution 3: Use mock data (disable MongoDB)**
```env
# Remove or comment out in .env:
# MONGODB_URI=
```

### "Cannot create customers when using mock data"

This is expected. Write operations (POST/PUT/DELETE) only work with MongoDB connected.

**Solution:** Connect MongoDB or use GET operations only.

### "Customer already exists" (409 error)

The migration won't overwrite existing data.

**Solution:** Use `npm run migrate:clear` to clear and re-migrate.

### Port 27017 already in use

MongoDB is already running, or another service is using that port.

**Solution:** Stop other MongoDB instances or change port in connection string.

---

**Implementation Date**: November 18, 2025  
**Status**: ✅ Complete and Production-Ready  
**Database**: MongoDB with Mongoose ODM  
**Fallback**: Automatic to mock data

