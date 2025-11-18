# MongoDB Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install MongoDB (Choose One Option)

#### Option A: Local MongoDB (Recommended for Dev)

**Windows:**
```powershell
# Download and install from:
https://www.mongodb.com/try/download/community

# Start MongoDB
net start MongoDB
```

**Mac:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `.env` with your connection string

#### Option C: Skip MongoDB (Use Mock Data)

Don't install anything - the system will automatically use mock data!

### Step 2: Configure Environment

```bash
cd backend

# Copy config example
copy config.example .env

# Edit .env and update MongoDB URI (optional)
# For local MongoDB (default):
MONGODB_URI=mongodb://localhost:27017/retention-agent

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/retention-agent

# For mock data only:
# Just leave MONGODB_URI empty or don't set it
```

### Step 3: Start the Server

```bash
npm start
```

That's it! ✅

## What Happens on First Start?

### Scenario A: MongoDB Connected
```
[Database] ✓ Connected to MongoDB
[Customer API] Database empty, populating with initial data...
[Customer API] ✓ Populated database with 5 customers
```
✅ Your 5 customers are now in MongoDB!

### Scenario B: MongoDB Not Available
```
[Database] ⚠ Max connection attempts reached. Falling back to mock data.
[Customer API] Using mock data (MongoDB unavailable)
```
✅ Everything still works with mock data!

## Verify It's Working

### Check Customer Data

**Browser:** http://localhost:3001/api/customer

**Command Line:**
```bash
curl http://localhost:3001/api/customer
```

**Expected Response:**
```json
{
  "success": true,
  "customers": [...],
  "count": 5,
  "dataSource": "mongodb"  ← or "mock"
}
```

### Check Database Health

**Browser:** http://localhost:3001/api/customer/health

```json
{
  "success": true,
  "database": {
    "enabled": true,
    "healthy": true,
    "message": "MongoDB connection healthy"
  }
}
```

## Common Commands

```bash
# Start server
npm start

# Run migration (if needed)
npm run migrate

# Clear and re-migrate (WARNING: deletes all data)
npm run migrate:clear

# Check MongoDB directly
mongosh
use retention-agent
db.customers.find().pretty()
```

## Need Help?

See full documentation in `MONGODB_INTEGRATION.md`

## Key Points

✅ MongoDB is **optional** - system works fine without it
✅ Auto-populates on first run if database empty
✅ Automatic fallback to mock data if MongoDB unavailable
✅ No frontend changes needed
✅ All 5 customers with full insights migrate automatically

---

**Ready to go!** Start your server and everything works automatically 🎉

