# Customer Seed Data Generator Guide

## Overview

The seed data generator creates realistic customer accounts with diverse scenarios for testing and demonstrations. It can generate up to **200+ unique customer profiles** with various attributes, scenarios, and characteristics.

## Quick Start

### Generate 200 Customers (Default)

```bash
cd backend
npm run seed
```

This will:
- Clear existing customer data
- Generate 200 diverse customer accounts
- Insert them into MongoDB
- Display summary statistics

### Add More Customers (Keep Existing)

```bash
npm run seed:add
```

This will add 200 new customers WITHOUT clearing existing data.

### Custom Count

```bash
# Generate 500 customers
npm run seed:custom 500

# Or use the script directly
node scripts/migrate-customers.js --clear --seed --count=500
```

### Test Generator Only (No Database)

```bash
# See sample output without database
npm run seed:generate
```

## Customer Scenarios

The generator creates customers with 10 different scenario types:

### 1. **Price Complaint** (15%)
- Price-sensitive customers
- May have received competitor offers
- Recently viewed pricing information
- Good candidates for retention discounts

**Example:** Customer concerned about bill increases, comparing with competitors

### 2. **Competitor Offer** (10%)
- Received offers from competing providers
- High churn risk
- Requires competitive retention packages
- Actively researching alternatives

**Example:** Customer mentions specific competitor pricing

### 3. **Service Quality Issues** (10%)
- Multiple trouble tickets
- Technical problems
- Service interruptions
- Requires resolution before upsell

**Example:** Customer with 3+ recent service tickets

### 4. **Billing Issues** (10%)
- Billing disputes or confusion
- Potential overdue balances
- Payment challenges
- Requires careful account review

**Example:** Customer with $98.19 overdue balance (60-90 days)

### 5. **VIP Customer** (5%)
- Long tenure (3+ years)
- High monthly bills ($150+)
- Premium service requirements
- Multiple value-added services
- Excellent payment history

**Example:** 5-year customer on Business Fiber 2 Gig at $249.99/month

### 6. **New Customer** (10%)
- Less than 1 year tenure
- Building relationship phase
- Upsell opportunities
- Requires satisfaction monitoring

**Example:** Customer with 6 months tenure, eligible for VAS additions

### 7. **At-Risk** (10%)
- Multiple dissatisfaction indicators
- May have service + billing issues
- Potential overdue balance
- Proactive retention needed

**Example:** Customer with missed payments and service quality complaints

### 8. **Happy Customer** (15%)
- Satisfied with service
- No recent issues
- Good payment history
- Potential for referrals

**Example:** Long-term customer, no complaints, good engagement

### 9. **Upsell Opportunity** (10%)
- Stable account status
- Room for plan upgrades
- VAS addition potential
- Good standing with no blockers

**Example:** Customer on Fiber 500 eligible for Gig upgrade

### 10. **Technical Support** (5%)
- Needs technical assistance
- Equipment or service issues
- Focus on issue resolution
- Maintain service quality

**Example:** Customer needing modem replacement or troubleshooting

## Generated Customer Attributes

### Core Account Information
```javascript
{
  customerId: 'cust_001',
  firstName: 'John',
  lastName: 'Smith',
  name: 'John Smith',
  email: 'john.smith@email.com',
  phone: '+1-555-0101',
  accountNumber: 'FTR-100234',
  serviceAddress: '1234 Main St, Chicago, IL 60601',
  customerScope: 'Telecom Residential',
  coreServices: ['Broadband/FIBER', 'Voice']
}
```

### Customer Insights
```javascript
{
  customerTenure: {
    years: 2,
    months: 3,
    totalMonths: 27,
    message: 'Established customer—appreciate their business'
  },
  currentPlanDetails: {
    name: 'Fiber 1 Gig Internet',
    price: 84.99,
    productTypes: ['Broadband/FIBER']
  },
  vasServices: ['Total Shield', 'Whole-Home Wi-Fi'],
  overdueBalance: null, // or { amount, aging, message }
  autoPayStatus: {
    enrolled: true,
    message: 'Payment friction is low—leverage this convenience'
  },
  eBillStatus: {
    enrolled: true,
    message: 'Shows digital engagement—good channel for reminders'
  },
  upsellEligibility: {
    eligible: true,
    reason: 'Good standing, eligible for upgrades'
  },
  recentTroubleTickets: {
    count: 0,
    message: 'Service appears stable and reliable'
  },
  lastContactDate: '2025-11-10',
  totalInteractions: 3,
  openOrders: [],
  preferredLanguage: 'English', // or 'Spanish'
  recentBillingEvents: {
    hasChanges: false,
    message: 'No recent changes',
    changeAmount: 0,
    changeType: 'none'
  }
}
```

### Legacy/Compatibility Fields
```javascript
{
  monthlyBill: 84.99,
  currentPlan: 'Fiber 1 Gig Internet',
  tenure: 27,
  paymentHistory: 'excellent',
  accountStatus: 'active', // or 'vip', 'at-risk'
  lifetimeValue: 2294.73,
  recentActivity: ['Normal usage patterns', 'No recent issues'],
  notes: 'Scenario-specific notes for agent guidance',
  scenario: 'happy_customer'
}
```

## Data Distributions

### Language Distribution
- **English:** ~90%
- **Spanish:** ~10% (higher for Hispanic surnames)

### Account Status
- **Active:** ~85%
- **VIP:** ~5%
- **At-Risk:** ~10%

### Tenure Distribution
- **New (0-12 months):** 15%
- **Established (1-3 years):** 45%
- **Long-term (3-5 years):** 30%
- **VIP (5+ years):** 10%

### Billing Characteristics
- **With Overdue Balance:** 8-12%
- **AutoPay Enrolled:** ~70%
- **E-Bill Enrolled:** ~65%
- **With Trouble Tickets:** ~15%

### Plan Distribution
- **Fiber 300:** 20%
- **Fiber 500:** 30%
- **Fiber 1 Gig:** 25%
- **Fiber 2 Gig:** 10%
- **Bundles (Internet + TV/Phone):** 15%

## Sample Output

When you run the seed generator, you'll see:

```
[Seed Generator] Generating 200 customer accounts...
[Seed Generator] Generated 50/200 customers...
[Seed Generator] Generated 100/200 customers...
[Seed Generator] Generated 150/200 customers...
[Seed Generator] Generated 200/200 customers...
[Seed Generator] ✓ Generation complete!

[Seed Generator] Scenario Distribution:
  - price_complaint: 30 (15.0%)
  - competitor_offer: 20 (10.0%)
  - service_quality: 20 (10.0%)
  - billing_issues: 20 (10.0%)
  - vip_customer: 10 (5.0%)
  - new_customer: 20 (10.0%)
  - at_risk: 20 (10.0%)
  - happy_customer: 30 (15.0%)
  - upsell_opportunity: 20 (10.0%)
  - technical_support: 10 (5.0%)

[Seed Generator] Summary Statistics:
  - Total Customers: 200
  - English: 180 | Spanish: 20
  - Active: 170 | VIP: 10 | At-Risk: 20
  - With Overdue Balance: 18
  - With Trouble Tickets: 30
  - Avg Tenure: 28 months
  - Avg Monthly Bill: $89.45
  - Total Lifetime Value: $500,520

[Migration] ✓ Successfully inserted 200 seed customers.
```

## Use Cases

### 1. **Development & Testing**
```bash
# Reset database with fresh seed data
npm run seed

# Test specific customer counts
npm run seed:custom 50
```

### 2. **Demo Environments**
```bash
# Populate demo database with realistic data
npm run seed

# Add more variety
npm run seed:add
```

### 3. **Load Testing**
```bash
# Generate large dataset for performance testing
npm run seed:custom 1000
```

### 4. **Training**
```bash
# Create diverse customer scenarios for agent training
npm run seed

# Agents can practice with various customer types
```

## Advanced Usage

### Programmatic Generation

```javascript
const { generateSeedData, generateCustomer } = require('./scripts/seed-generator');

// Generate specific count
const { customers, summary } = generateSeedData(500);

// Generate single customer
const customer = generateCustomer(1);

// Filter by scenario
const vipCustomers = customers.filter(c => c.scenario === 'vip_customer');
const spanishCustomers = customers.filter(c => c.preferredLanguage === 'Spanish');
```

### Custom Scenario Weights

Edit `seed-generator.js` to adjust scenario probabilities:

```javascript
function assignScenario() {
  const rand = Math.random();
  if (rand < 0.20) return scenarios.PRICE_COMPLAINT; // Increase to 20%
  if (rand < 0.30) return scenarios.VIP_CUSTOMER;     // Increase VIP
  // ... adjust other scenarios
}
```

## Best Practices

### 1. **Clear Before Seeding**
Always use `--clear` flag when seeding to avoid duplicates:
```bash
npm run seed  # This includes --clear
```

### 2. **Appropriate Count for Environment**
- **Development:** 50-100 customers
- **Testing:** 200-500 customers
- **Demo:** 100-200 customers
- **Load Testing:** 1000+ customers

### 3. **Verify After Seeding**
```bash
# Check the API
curl http://localhost:3001/api/customer/health

# Or use the web app
open http://localhost:3000
```

### 4. **Backup Before Clearing**
If you have important data:
```bash
# Backup MongoDB
mongodump --db retention-agent --out ./backup

# Restore if needed
mongorestore --db retention-agent ./backup/retention-agent
```

## Troubleshooting

### Issue: "Failed to connect to MongoDB"
```bash
# Start MongoDB first
net start MongoDB  # Windows
sudo service mongod start  # Linux
```

### Issue: "Duplicate key error"
```bash
# Clear database first
npm run seed  # Already includes --clear
# OR
npm run migrate:clear
```

### Issue: Script hangs or fails
```bash
# Check MongoDB is running
mongosh

# Check connection in .env
MONGODB_URI=mongodb://localhost:27017/retention-agent
```

## Integration with Application

The seeded customers work seamlessly with your retention agent application:

1. **Customer Selection:** All seeded customers appear in the dropdown
2. **Scenario-Based Testing:** Each customer has realistic context
3. **Language Support:** Spanish-speaking customers trigger Spanish responses
4. **Diverse Testing:** Cover all major customer scenarios
5. **Realistic Data:** Names, addresses, account numbers all look authentic

## Next Steps

1. **Start MongoDB:**
   ```bash
   net start MongoDB
   ```

2. **Run Seed Process:**
   ```bash
   cd backend
   npm run seed
   ```

3. **Start Application:**
   ```bash
   npm start
   ```

4. **Test with Various Customers:**
   - Open frontend: http://localhost:3000
   - Select different customers from dropdown
   - See how agent handles different scenarios

## Summary

The seed data generator provides:
- ✅ **200+ realistic customer profiles**
- ✅ **10 distinct scenario types**
- ✅ **Diverse demographic data**
- ✅ **Comprehensive account insights**
- ✅ **Bilingual support (English/Spanish)**
- ✅ **Easy-to-use npm scripts**
- ✅ **Detailed summary statistics**
- ✅ **Flexible customization options**

Perfect for development, testing, demos, and training! 🎉

