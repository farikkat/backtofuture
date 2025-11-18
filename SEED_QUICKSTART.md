# Seed Data Quick Start Guide

## 🚀 Get Started in 30 Seconds

### 1. Start MongoDB
```bash
net start MongoDB
```

### 2. Generate 200 Customers
```bash
cd backend
npm run seed
```

### 3. Start Your App
```bash
npm start
```

**Done!** You now have 200 diverse customers ready for testing.

---

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `npm run seed` | **Clear database** & generate 200 customers |
| `npm run seed:add` | **Add** 200 customers (keep existing) |
| `npm run seed:custom 500` | Generate **custom count** (e.g., 500) |
| `npm run seed:generate` | **Preview** generation (no database) |
| `npm run migrate` | Load **5 demo customers** only |
| `npm run migrate:clear` | **Clear** database completely |

---

## 🎯 What You Get

### 200 Customers With:
- ✅ **10 Scenario Types** (price complaints, VIPs, billing issues, etc.)
- ✅ **Realistic Data** (names, addresses, account numbers)
- ✅ **Diverse Characteristics** (tenure, plans, services)
- ✅ **Bilingual Support** (English + Spanish)
- ✅ **Financial Variety** (overdue balances, AutoPay, E-Bill)
- ✅ **Service History** (trouble tickets, interactions)

### Scenario Breakdown:
- 15% Price Complaints
- 15% Happy Customers  
- 10% Competitor Offers
- 10% Service Quality Issues
- 10% Billing Issues
- 10% New Customers
- 10% At-Risk Customers
- 10% Upsell Opportunities
- 5% VIP Customers
- 5% Technical Support

---

## 📊 Sample Output

```
[Seed Generator] Generating 200 customer accounts...
[Seed Generator] ✓ Generation complete!

[Seed Generator] Summary Statistics:
  - Total Customers: 200
  - English: 180 | Spanish: 20
  - Active: 170 | VIP: 10 | At-Risk: 20
  - With Overdue Balance: 18
  - Avg Tenure: 28 months
  - Avg Monthly Bill: $89.45
  - Total Lifetime Value: $500,520

[Migration] ✓ Successfully inserted 200 seed customers.
```

---

## 🎨 Example Customers

### Price-Sensitive Customer
```
Name: John Smith
Plan: Fiber 500 @ $74.99/mo
Tenure: 14 months
Status: Active
Recent: Bill increased $5 (promo expired)
Notes: Price-sensitive, high churn risk
```

### VIP Customer
```
Name: Sarah Johnson  
Plan: Business Fiber 2 Gig @ $249.99/mo
Tenure: 67 months (5+ years!)
Status: VIP
Services: Multiple VAS, AutoPay, E-Bill
Notes: Premium treatment required
```

### At-Risk Customer
```
Name: Maria Garcia (Spanish)
Plan: Fiber 300 @ $64.99/mo
Tenure: 8 months
Status: At-Risk
Issues: 3 trouble tickets, $150 overdue
Notes: Proactive retention needed
```

---

## 🔧 Customize

### Generate Different Amounts

```bash
# 50 customers (development)
npm run seed:custom 50

# 1000 customers (load testing)
npm run seed:custom 1000

# Add 100 more (keep existing)
node scripts/migrate-customers.js --seed --count=100
```

### Use Specific Scenarios

Edit `backend/scripts/seed-generator.js`:
```javascript
function assignScenario() {
  const rand = Math.random();
  if (rand < 0.50) return scenarios.VIP_CUSTOMER; // 50% VIP!
  // ... adjust other scenarios
}
```

---

## ✅ Verify It Worked

### Check Database
```bash
# Connect to MongoDB
mongosh

# Count customers
use retention-agent
db.customers.countDocuments()

# View sample
db.customers.findOne()
```

### Check API
```bash
# Health check
curl http://localhost:3001/api/customer/health

# List customers
curl http://localhost:3001/api/customer/list
```

### Check Web App
1. Open: http://localhost:3000
2. Click customer dropdown
3. See all 200 customers! 🎉

---

## 🆘 Troubleshooting

### MongoDB Not Running?
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo service mongod start
```

### Duplicate Key Errors?
```bash
# Clear first, then seed
npm run seed  # Already includes --clear!
```

### Script Hangs?
```bash
# Check MongoDB connection
mongosh
# Should connect without errors

# Check .env file
cat .env
# Should have: MONGODB_URI=mongodb://localhost:27017/retention-agent
```

---

## 🎓 Next Steps

1. **Explore Customers:** Open the web app and browse through different customers
2. **Test Scenarios:** Start conversations with various customer types
3. **Spanish Support:** Try customers with Spanish preferred language
4. **Billing Issues:** Test customers with overdue balances
5. **VIP Treatment:** See how agent handles high-value customers

---

## 📚 Learn More

- **Full Documentation:** See [SEED_DATA_GUIDE.md](SEED_DATA_GUIDE.md)
- **MongoDB Setup:** See [MONGODB_QUICKSTART.md](MONGODB_QUICKSTART.md)
- **Customer Schema:** See [backend/models/Customer.js](backend/models/Customer.js)
- **Generator Code:** See [backend/scripts/seed-generator.js](backend/scripts/seed-generator.js)

---

## 💡 Pro Tips

1. **Development:** Use 50-100 customers for faster testing
2. **Demos:** Use 200 customers for variety
3. **Load Testing:** Use 1000+ customers for performance
4. **Reset Often:** `npm run seed` to start fresh
5. **Backup Important Data:** Use `mongodump` before clearing

---

**Happy Testing!** 🚀

Need help? Check the full documentation or open an issue.

