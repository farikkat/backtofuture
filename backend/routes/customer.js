const express = require('express');
const router = express.Router();

/**
 * Mock Customer Database
 * In production, this would query a real CRM/database
 */
const mockCustomers = {
  'cust_001': {
    customerId: 'cust_001',
    firstName: 'John',
    lastName: 'Smith',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0101',
    accountNumber: 'FTR-100234',
    serviceAddress: '1234 Maple Street, Springfield, IL 62701',
    customerScope: 'Telecom Residential',
    coreServices: ['Broadband/FIBER', 'Voice'],
    
    // Customer Insights
    customerTenure: {
      years: 1,
      months: 2,
      totalMonths: 14,
      message: 'Thank and reward tenure'
    },
    currentPlanDetails: {
      name: 'Fiber 500 Internet',
      price: 54.99,
      productTypes: ['Broadband/FIBER']
    },
    vasServices: ['Total Shield', 'Frontier Provided eero', 'Whole-Home Wi-Fi'],
    overdueBalance: null,
    autoPayStatus: {
      enrolled: true,
      message: 'Payment friction is low—leverage this convenience as a loyalty anchor'
    },
    eBillStatus: {
      enrolled: true,
      message: 'Shows some digital engagement—good channel for reminders'
    },
    upsellEligibility: {
      eligible: true,
      reason: 'Good standing, eligible for upgrades'
    },
    recentTroubleTickets: {
      count: 0,
      message: 'Service appears stable and reliable'
    },
    lastContactDate: '2025-11-06',
    totalInteractions: 2,
    openOrders: [],
    preferredLanguage: 'English',
    
    // Legacy fields (preserved for compatibility)
    monthlyBill: 54.99,
    currentPlan: 'Fiber 500 Internet',
    tenure: 14,
    paymentHistory: 'excellent',
    accountStatus: 'active',
    lifetimeValue: 769.86,
    recentActivity: [
      'Viewed competitor pricing online',
      'Called support 2 weeks ago about pricing',
      'Received promotional email'
    ],
    notes: 'Price-sensitive customer. High churn risk. Good payment history.'
  },
  
  'cust_002': {
    customerId: 'cust_002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1-555-0202',
    accountNumber: 'FTR-200456',
    serviceAddress: '5678 Oak Avenue, Portland, OR 97201',
    customerScope: 'Telecom Residential',
    coreServices: ['Broadband/FIBER', 'Video', 'Voice'],
    
    // Customer Insights
    customerTenure: {
      years: 3,
      months: 6,
      totalMonths: 42,
      message: 'Long-time valued customer—thank and reward loyalty'
    },
    currentPlanDetails: {
      name: 'Fiber 1 Gig + TV Premium',
      price: 89.99,
      productTypes: ['Broadband/FIBER', 'Video']
    },
    vasServices: ['Total Shield', 'Frontier Provided eero', 'Whole-Home Wi-Fi', 'Premium Support'],
    overdueBalance: null,
    autoPayStatus: {
      enrolled: true,
      message: 'Payment friction is low—leverage this convenience as a loyalty anchor'
    },
    eBillStatus: {
      enrolled: true,
      message: 'Shows strong digital engagement—good channel for proactive outreach'
    },
    upsellEligibility: {
      eligible: true,
      reason: 'Excellent standing, prime candidate for premium services'
    },
    recentTroubleTickets: {
      count: 0,
      message: 'Service appears stable and reliable'
    },
    lastContactDate: '2025-10-28',
    totalInteractions: 5,
    openOrders: [],
    preferredLanguage: 'English',
    
    // Legacy fields
    monthlyBill: 89.99,
    currentPlan: 'Fiber 1 Gig + TV Premium',
    tenure: 42,
    paymentHistory: 'excellent',
    accountStatus: 'active',
    lifetimeValue: 3779.58,
    recentActivity: [
      'Mentioned competitor offer in recent call',
      'Increased data usage last month',
      'Opened competitor advertising email'
    ],
    notes: 'Long-time customer. Competitor threat. High value account.'
  },
  
  'cust_003': {
    customerId: 'cust_003',
    firstName: 'Robert',
    lastName: 'Chen',
    name: 'Robert Chen',
    email: 'r.chen@email.com',
    phone: '+1-555-0303',
    accountNumber: 'FTR-300789',
    serviceAddress: '9012 Business Parkway, San Jose, CA 95134',
    customerScope: 'Telecom Residential',
    coreServices: ['Broadband/FIBER', 'Video', 'Voice'],
    
    // Customer Insights
    customerTenure: {
      years: 5,
      months: 7,
      totalMonths: 67,
      message: 'VIP customer—exceptional loyalty, premium treatment required'
    },
    currentPlanDetails: {
      name: 'Business Fiber 2 Gig + TV Premium + Multi-line',
      price: 199.99,
      productTypes: ['Broadband/FIBER', 'Video', 'Voice']
    },
    vasServices: ['Total Shield Premium', 'Frontier Provided eero Pro', 'Whole-Home Wi-Fi', 'Unbreakable Wi-Fi', 'Priority Support', 'Static IP'],
    overdueBalance: null,
    autoPayStatus: {
      enrolled: true,
      message: 'VIP convenience—maintain white-glove service'
    },
    eBillStatus: {
      enrolled: true,
      message: 'Full digital engagement—preferred communication channel'
    },
    upsellEligibility: {
      eligible: true,
      reason: 'VIP status—eligible for exclusive premium offerings'
    },
    recentTroubleTickets: {
      count: 0,
      message: 'Service excellent—no issues reported'
    },
    lastContactDate: '2025-09-15',
    totalInteractions: 12,
    openOrders: [],
    preferredLanguage: 'English',
    
    // Legacy fields
    monthlyBill: 199.99,
    currentPlan: 'Business Fiber 2 Gig + TV Premium + Multi-line',
    tenure: 67,
    paymentHistory: 'excellent',
    accountStatus: 'vip',
    lifetimeValue: 13399.33,
    recentActivity: [
      'VIP customer for 5+ years',
      'Referred 2 customers this year',
      'No service issues reported'
    ],
    notes: 'VIP customer. Extremely high value. Referral source. Premium treatment required.'
  },
  
  'cust_004': {
    customerId: 'cust_004',
    firstName: 'Maria',
    lastName: 'Garcia',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-555-0404',
    accountNumber: 'FTR-400112',
    serviceAddress: '3456 Sunset Boulevard, Miami, FL 33101',
    customerScope: 'Telecom Residential',
    coreServices: ['Broadband/FIBER'],
    
    // Customer Insights
    customerTenure: {
      years: 0,
      months: 8,
      totalMonths: 8,
      message: 'Newer customer—build relationship and trust'
    },
    currentPlanDetails: {
      name: 'Fiber 300 Internet',
      price: 74.99,
      productTypes: ['Broadband/FIBER']
    },
    vasServices: ['Total Shield'],
    overdueBalance: null,
    autoPayStatus: {
      enrolled: true,
      message: 'Payment friction is low—maintain convenience'
    },
    eBillStatus: {
      enrolled: false,
      message: 'Paper bills—opportunity for digital enrollment'
    },
    upsellEligibility: {
      eligible: false,
      reason: 'Recent service issues—focus on resolution before upsell'
    },
    recentTroubleTickets: {
      count: 3,
      message: 'Service quality concerns—requires immediate attention'
    },
    lastContactDate: '2025-11-10',
    totalInteractions: 6,
    openOrders: ['Service ticket #ST-789456 - Connectivity issue'],
    preferredLanguage: 'Spanish',
    
    // Legacy fields
    monthlyBill: 74.99,
    currentPlan: 'Fiber 300 Internet',
    tenure: 8,
    paymentHistory: 'good',
    accountStatus: 'active',
    lifetimeValue: 599.92,
    recentActivity: [
      'Reported connectivity issues 3 times this month',
      'Service ticket open',
      'Requested Spanish support'
    ],
    notes: 'Service quality issues. Spanish-speaking preferred. Newer customer at risk.'
  },
  
  'cust_005': {
    customerId: 'cust_005',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    name: 'Jennifer Martinez',
    email: 'jen.martinez@email.com',
    phone: '+1-555-0505',
    accountNumber: 'FTR-500334',
    serviceAddress: '7890 Pine Street, Austin, TX 78701',
    customerScope: 'Telecom Residential',
    coreServices: ['Broadband/FIBER', 'Video'],
    
    // Customer Insights
    customerTenure: {
      years: 2,
      months: 0,
      totalMonths: 24,
      message: 'Two-year customer—appreciate loyalty despite recent challenges'
    },
    currentPlanDetails: {
      name: 'Fiber 500 Internet + TV Select',
      price: 109.99,
      productTypes: ['Broadband/FIBER', 'Video']
    },
    vasServices: ['Frontier Provided eero', 'Whole-Home Wi-Fi'],
    overdueBalance: {
      amount: 98.19,
      aging: '60 and 90 days',
      message: 'Strong sign of financial distress or dissatisfaction; increases churn risk and blocks promotional eligibility'
    },
    autoPayStatus: {
      enrolled: true,
      message: 'AutoPay enabled but overdue balance exists—investigate payment failure'
    },
    eBillStatus: {
      enrolled: true,
      message: 'Digital engagement present—use for payment reminders'
    },
    upsellEligibility: {
      eligible: false,
      reason: 'Overdue balance blocks upgrades—focus retention & resolution, not new sales'
    },
    recentTroubleTickets: {
      count: 0,
      message: 'No service issues—billing is the primary concern'
    },
    lastContactDate: '2025-11-06',
    totalInteractions: 4,
    openOrders: [],
    preferredLanguage: 'English',
    
    // Legacy fields
    monthlyBill: 109.99,
    currentPlan: 'Fiber 500 Internet + TV Select',
    tenure: 24,
    paymentHistory: 'fair',
    accountStatus: 'active',
    lifetimeValue: 2639.76,
    recentActivity: [
      'Late payment last month',
      'Disputed charge 2 months ago',
      'Called billing department twice'
    ],
    notes: 'Billing concerns. Some payment delays. Needs financial empathy.'
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

