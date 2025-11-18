const express = require('express');
const router = express.Router();

/**
 * Mock Customer Database
 * In production, this would query a real CRM/database
 */
const mockCustomers = {
  'cust_001': {
    customerId: 'cust_001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0101',
    monthlyBill: 89.99,
    currentPlan: 'Internet 500 Mbps + TV Basic',
    tenure: 18,
    paymentHistory: 'excellent',
    accountStatus: 'active',
    lifetimeValue: 1619.82,
    recentActivity: [
      'Viewed competitor pricing online',
      'Called support 2 weeks ago about pricing',
      'Received promotional email'
    ],
    notes: 'Price-sensitive customer. High churn risk. Good payment history.',
    preferredLanguage: 'English'
  },
  
  'cust_002': {
    customerId: 'cust_002',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1-555-0202',
    monthlyBill: 134.99,
    currentPlan: 'Internet Gigabit + TV Premium + Phone',
    tenure: 42,
    paymentHistory: 'excellent',
    accountStatus: 'active',
    lifetimeValue: 5669.58,
    recentActivity: [
      'Mentioned competitor offer in recent call',
      'Increased data usage last month',
      'Opened competitor advertising email'
    ],
    notes: 'Long-time customer. Competitor threat. High value account.',
    preferredLanguage: 'English'
  },
  
  'cust_003': {
    customerId: 'cust_003',
    name: 'Robert Chen',
    email: 'r.chen@email.com',
    phone: '+1-555-0303',
    monthlyBill: 199.99,
    currentPlan: 'Business Internet + TV Premium + Multi-line Phone',
    tenure: 67,
    paymentHistory: 'excellent',
    accountStatus: 'vip',
    lifetimeValue: 13399.33,
    recentActivity: [
      'VIP customer for 3+ years',
      'Referred 2 customers this year',
      'No service issues reported'
    ],
    notes: 'VIP customer. Extremely high value. Referral source. Premium treatment required.',
    preferredLanguage: 'English'
  },
  
  'cust_004': {
    customerId: 'cust_004',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-555-0404',
    monthlyBill: 74.99,
    currentPlan: 'Internet 300 Mbps',
    tenure: 8,
    paymentHistory: 'good',
    accountStatus: 'active',
    lifetimeValue: 599.92,
    recentActivity: [
      'Reported connectivity issues 3 times this month',
      'Service ticket open',
      'Requested Spanish support'
    ],
    notes: 'Service quality issues. Spanish-speaking preferred. Newer customer at risk.',
    preferredLanguage: 'Spanish'
  },
  
  'cust_005': {
    customerId: 'cust_005',
    name: 'Jennifer Martinez',
    email: 'jen.martinez@email.com',
    phone: '+1-555-0505',
    monthlyBill: 109.99,
    currentPlan: 'Internet 1 Gig + TV Select',
    tenure: 24,
    paymentHistory: 'fair',
    accountStatus: 'active',
    lifetimeValue: 2639.76,
    recentActivity: [
      'Late payment last month',
      'Disputed charge 2 months ago',
      'Called billing department twice'
    ],
    notes: 'Billing concerns. Some payment delays. Needs financial empathy.',
    preferredLanguage: 'English'
  },
  
  'cust_demo': {
    customerId: 'cust_demo',
    name: 'Demo Customer',
    email: 'demo@example.com',
    phone: '+1-555-DEMO',
    monthlyBill: 99.99,
    currentPlan: 'Internet 500 Mbps + TV Standard',
    tenure: 12,
    paymentHistory: 'excellent',
    accountStatus: 'active',
    lifetimeValue: 1199.88,
    recentActivity: [
      'Demo account for testing',
      'All features enabled',
      'Flexible scenario'
    ],
    notes: 'General demo account. Use for flexible testing and demonstrations.',
    preferredLanguage: 'English'
  }
};

/**
 * Customer scenarios for demo dropdown
 */
const customerScenarios = [
  {
    id: 'cust_001',
    name: 'John Smith',
    scenario: 'Price Complaint',
    description: 'Long-time customer concerned about pricing',
    difficulty: 'Easy',
    icon: '💰'
  },
  {
    id: 'cust_002',
    name: 'Sarah Johnson',
    scenario: 'Competitor Offer',
    description: 'Received better offer from competitor',
    difficulty: 'Medium',
    icon: '⚠️'
  },
  {
    id: 'cust_003',
    name: 'Robert Chen',
    scenario: 'VIP Customer',
    description: 'High-value account requiring premium service',
    difficulty: 'Easy',
    icon: '⭐'
  },
  {
    id: 'cust_004',
    name: 'Maria Garcia',
    scenario: 'Service Quality (Bilingual)',
    description: 'Technical issues, prefers Spanish',
    difficulty: 'Medium',
    icon: '🌐'
  },
  {
    id: 'cust_005',
    name: 'Jennifer Martinez',
    scenario: 'Billing Issues',
    description: 'Payment concerns and disputed charges',
    difficulty: 'Medium',
    icon: '💳'
  },
  {
    id: 'cust_demo',
    name: 'Demo Customer',
    scenario: 'General Testing',
    description: 'Flexible demo account for any scenario',
    difficulty: 'Flexible',
    icon: '🔧'
  }
];

/**
 * GET /api/customer/scenarios/list
 * IMPORTANT: This must come BEFORE /:customerId route
 */
router.get('/scenarios/list', (req, res) => {
  res.json({
    success: true,
    scenarios: customerScenarios
  });
});

/**
 * GET /api/customer
 * IMPORTANT: This must come BEFORE /:customerId route
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    customers: Object.values(mockCustomers).map(c => ({
      customerId: c.customerId,
      name: c.name,
      monthlyBill: c.monthlyBill,
      tenure: c.tenure,
      accountStatus: c.accountStatus
    }))
  });
});

/**
 * GET /api/customer/:customerId
 * IMPORTANT: This must come AFTER specific routes
 */
router.get('/:customerId', (req, res) => {
  const { customerId } = req.params;
  
  const customer = mockCustomers[customerId];
  
  if (!customer) {
    return res.status(404).json({
      error: 'Customer not found',
      customerId
    });
  }
  
  res.json({
    success: true,
    customer
  });
});

module.exports = router;

