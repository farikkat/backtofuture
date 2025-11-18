/**
 * Customer Data - Comprehensive telecom customer profiles
 * This data is used for:
 * 1. MongoDB migration (initial data population)
 * 2. Fallback mock data when MongoDB is unavailable
 */

const customersArray = [
  {
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
    recentBillingEvents: {
      hasChanges: true,
      message: 'Last month bill went up $5.00 due to promotional discount expiring',
      changeAmount: 5.00,
      changeType: 'increase'
    },
    
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
  
  {
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
    recentBillingEvents: {
      hasChanges: false,
      message: 'No recent changes',
      changeAmount: 0,
      changeType: 'none'
    },
    
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
  
  {
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
    recentBillingEvents: {
      hasChanges: false,
      message: 'No recent changes',
      changeAmount: 0,
      changeType: 'none'
    },
    
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
  
  {
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
    recentBillingEvents: {
      hasChanges: true,
      message: 'Last month bill went up $10.00 as customer added new VAS product (Total Shield)',
      changeAmount: 10.00,
      changeType: 'increase'
    },
    
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
  
  {
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
    recentBillingEvents: {
      hasChanges: true,
      message: 'Last month bill went up $19.99 due to loyalty credit expiring',
      changeAmount: 19.99,
      changeType: 'increase'
    },
    
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
  }
];

// Convert array to object with customerId as key (for backward compatibility)
const customersObject = {};
customersArray.forEach(customer => {
  customersObject[customer.customerId] = customer;
});

module.exports = customersArray;
module.exports.customersObject = customersObject;
module.exports.customersArray = customersArray;

