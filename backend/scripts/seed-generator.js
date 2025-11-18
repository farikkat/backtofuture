/**
 * Customer Seed Data Generator
 * Generates 200 diverse customer accounts with various scenarios
 */

const scenarios = {
  PRICE_COMPLAINT: 'price_complaint',
  COMPETITOR_OFFER: 'competitor_offer',
  SERVICE_QUALITY: 'service_quality',
  BILLING_ISSUES: 'billing_issues',
  VIP_CUSTOMER: 'vip_customer',
  NEW_CUSTOMER: 'new_customer',
  AT_RISK: 'at_risk',
  HAPPY_CUSTOMER: 'happy_customer',
  UPSELL_OPPORTUNITY: 'upsell_opportunity',
  TECHNICAL_SUPPORT: 'technical_support'
};

// Sample data pools
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna',
  'Larry', 'Brenda', 'Justin', 'Pamela', 'Scott', 'Nicole', 'Brandon', 'Emma',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Raymond', 'Christine', 'Gregory', 'Debra',
  'Alexander', 'Rachel', 'Frank', 'Catherine', 'Patrick', 'Carolyn', 'Raymond', 'Janet',
  'Jack', 'Ruth', 'Dennis', 'Maria', 'Jerry', 'Heather', 'Tyler', 'Diane',
  'Aaron', 'Virginia', 'Jose', 'Julie', 'Adam', 'Joyce', 'Henry', 'Victoria',
  'Nathan', 'Olivia', 'Douglas', 'Kelly', 'Zachary', 'Christina', 'Peter', 'Lauren',
  'Kyle', 'Joan', 'Walter', 'Evelyn', 'Ethan', 'Judith', 'Jeremy', 'Megan',
  'Harold', 'Cheryl', 'Keith', 'Andrea', 'Christian', 'Hannah', 'Roger', 'Jacqueline',
  'Noah', 'Martha', 'Gerald', 'Gloria', 'Carl', 'Teresa', 'Terry', 'Ann',
  'Sean', 'Sara', 'Austin', 'Madison', 'Arthur', 'Frances', 'Lawrence', 'Kathryn',
  'Jesse', 'Janice', 'Dylan', 'Jean', 'Bryan', 'Abigail', 'Joe', 'Alice'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza',
  'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers',
  'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell'
];

const cities = [
  { name: 'New York', state: 'NY', zip: '10001' },
  { name: 'Los Angeles', state: 'CA', zip: '90001' },
  { name: 'Chicago', state: 'IL', zip: '60601' },
  { name: 'Houston', state: 'TX', zip: '77001' },
  { name: 'Phoenix', state: 'AZ', zip: '85001' },
  { name: 'Philadelphia', state: 'PA', zip: '19019' },
  { name: 'San Antonio', state: 'TX', zip: '78201' },
  { name: 'San Diego', state: 'CA', zip: '92101' },
  { name: 'Dallas', state: 'TX', zip: '75201' },
  { name: 'San Jose', state: 'CA', zip: '95101' },
  { name: 'Austin', state: 'TX', zip: '78701' },
  { name: 'Jacksonville', state: 'FL', zip: '32099' },
  { name: 'Fort Worth', state: 'TX', zip: '76101' },
  { name: 'Columbus', state: 'OH', zip: '43004' },
  { name: 'Indianapolis', state: 'IN', zip: '46201' },
  { name: 'Charlotte', state: 'NC', zip: '28201' },
  { name: 'Seattle', state: 'WA', zip: '98101' },
  { name: 'Denver', state: 'CO', zip: '80201' },
  { name: 'Boston', state: 'MA', zip: '02101' },
  { name: 'Portland', state: 'OR', zip: '97201' },
  { name: 'Miami', state: 'FL', zip: '33101' },
  { name: 'Atlanta', state: 'GA', zip: '30301' },
  { name: 'Las Vegas', state: 'NV', zip: '89101' },
  { name: 'Nashville', state: 'TN', zip: '37201' },
  { name: 'Minneapolis', state: 'MN', zip: '55401' }
];

const streetNames = [
  'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine St', 'Elm Ave', 'Washington Blvd',
  'Park Ave', 'Broadway', 'Market St', 'Church St', 'Spring St', 'Sunset Blvd', 'Lake Dr',
  'Hill St', 'River Rd', 'Forest Ave', 'Highland Ave', 'Valley Rd', 'Summit St'
];

const plans = [
  { name: 'Fiber 300 Internet', basePrice: 64.99, services: ['Broadband/FIBER'] },
  { name: 'Fiber 500 Internet', basePrice: 74.99, services: ['Broadband/FIBER'] },
  { name: 'Fiber 1 Gig Internet', basePrice: 84.99, services: ['Broadband/FIBER'] },
  { name: 'Fiber 2 Gig Internet', basePrice: 124.99, services: ['Broadband/FIBER'] },
  { name: 'Fiber 500 + TV Select', basePrice: 109.99, services: ['Broadband/FIBER', 'Video'] },
  { name: 'Fiber 1 Gig + TV Premium', basePrice: 134.99, services: ['Broadband/FIBER', 'Video'] },
  { name: 'Fiber 500 + Phone', basePrice: 89.99, services: ['Broadband/FIBER', 'Voice'] },
  { name: 'Fiber 1 Gig + TV + Phone', basePrice: 149.99, services: ['Broadband/FIBER', 'Video', 'Voice'] },
  { name: 'Business Fiber 1 Gig', basePrice: 149.99, services: ['Broadband/FIBER'] },
  { name: 'Business Fiber 2 Gig + Premium', basePrice: 249.99, services: ['Broadband/FIBER', 'Video', 'Voice'] }
];

const vasOptions = [
  'Total Shield',
  'Frontier Provided eero',
  'Whole-Home Wi-Fi',
  'Unbreakable Wi-Fi',
  'Premium Support',
  'Static IP',
  'Cloud Storage',
  'Identity Protection',
  'Tech Support Plus',
  'Home Network Security'
];

const serviceIssues = [
  'Intermittent connectivity issues',
  'Slow internet speeds',
  'Wi-Fi router problems',
  'Service outage',
  'Modem replacement needed',
  'Line quality issues',
  'Video buffering problems',
  'Phone service static',
  'Installation delay',
  'Equipment malfunction'
];

const billingIssues = [
  'Unexpected charge on bill',
  'Promotional rate expired',
  'Loyalty credit not applied',
  'Late fee dispute',
  'Billing cycle confusion',
  'AutoPay failure',
  'Refund request pending',
  'Price increase notification',
  'Equipment charge dispute',
  'Overpayment credit'
];

// Utility functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
  return array[randomInt(0, array.length - 1)];
}

function randomSample(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomBoolean(probability = 0.5) {
  return Math.random() < probability;
}

function generateEmail(firstName, lastName) {
  const domains = ['email.com', 'mail.com', 'example.com', 'test.com'];
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`
  ];
  return `${randomChoice(formats)}@${randomChoice(domains)}`;
}

function generatePhone() {
  return `+1-${randomInt(200, 999)}-${randomInt(200, 999)}-${randomInt(1000, 9999)}`;
}

function generateAccountNumber(index) {
  return `FTR-${String(index).padStart(6, '0')}`;
}

function generateAddress(index) {
  const streetNumber = randomInt(100, 9999);
  const city = randomChoice(cities);
  return `${streetNumber} ${randomChoice(streetNames)}, ${city.name}, ${city.state} ${city.zip}`;
}

function generateDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

function assignScenario() {
  const rand = Math.random();
  if (rand < 0.15) return scenarios.PRICE_COMPLAINT;
  if (rand < 0.25) return scenarios.COMPETITOR_OFFER;
  if (rand < 0.35) return scenarios.SERVICE_QUALITY;
  if (rand < 0.45) return scenarios.BILLING_ISSUES;
  if (rand < 0.50) return scenarios.VIP_CUSTOMER;
  if (rand < 0.60) return scenarios.NEW_CUSTOMER;
  if (rand < 0.70) return scenarios.AT_RISK;
  if (rand < 0.85) return scenarios.HAPPY_CUSTOMER;
  if (rand < 0.95) return scenarios.UPSELL_OPPORTUNITY;
  return scenarios.TECHNICAL_SUPPORT;
}

function generateCustomer(index) {
  const firstName = randomChoice(firstNames);
  const lastName = randomChoice(lastNames);
  const name = `${firstName} ${lastName}`;
  const customerId = `cust_${String(index).padStart(3, '0')}`;
  const scenario = assignScenario();
  
  // Determine if Spanish-speaking (10% probability for Hispanic last names)
  const hispanicNames = ['Garcia', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Rivera', 'Gomez', 'Diaz', 'Cruz', 'Reyes', 'Morales', 'Ramos', 'Gutierrez', 'Ortiz', 'Chavez', 'Ruiz', 'Mendoza', 'Alvarez', 'Castillo', 'Jimenez'];
  const preferredLanguage = hispanicNames.includes(lastName) && randomBoolean(0.4) ? 'Spanish' : 'English';
  
  // Generate tenure (0-120 months)
  let tenureMonths;
  if (scenario === scenarios.NEW_CUSTOMER) {
    tenureMonths = randomInt(1, 12);
  } else if (scenario === scenarios.VIP_CUSTOMER) {
    tenureMonths = randomInt(36, 120);
  } else {
    tenureMonths = randomInt(3, 72);
  }
  const tenureYears = Math.floor(tenureMonths / 12);
  const tenureRemainder = tenureMonths % 12;
  
  // Select plan
  const plan = scenario === scenarios.VIP_CUSTOMER ? 
    randomChoice(plans.slice(-3)) : 
    randomChoice(plans);
  
  // Calculate monthly bill with variation
  let monthlyBill = plan.basePrice;
  const vasCount = scenario === scenarios.VIP_CUSTOMER ? randomInt(3, 6) : randomInt(0, 3);
  const selectedVAS = randomSample(vasOptions, vasCount);
  monthlyBill += vasCount * randomInt(5, 15);
  
  // Apply promotional discount for some customers
  const hasPromo = randomBoolean(0.3);
  if (hasPromo) {
    monthlyBill *= 0.85; // 15% discount
  }
  
  monthlyBill = Math.round(monthlyBill * 100) / 100;
  
  // Determine account status
  let accountStatus = 'active';
  if (scenario === scenarios.VIP_CUSTOMER || (tenureMonths > 36 && monthlyBill > 150)) {
    accountStatus = 'vip';
  } else if (scenario === scenarios.AT_RISK) {
    accountStatus = 'at-risk';
  }
  
  // Payment history
  let paymentHistory;
  if (scenario === scenarios.BILLING_ISSUES || scenario === scenarios.AT_RISK) {
    paymentHistory = randomChoice(['fair', 'poor']);
  } else if (scenario === scenarios.VIP_CUSTOMER) {
    paymentHistory = 'excellent';
  } else {
    paymentHistory = randomChoice(['excellent', 'good', 'good', 'excellent']); // weighted toward good/excellent
  }
  
  // Overdue balance
  let overdueBalance = null;
  if (scenario === scenarios.BILLING_ISSUES && randomBoolean(0.6)) {
    const amount = randomInt(50, 300) + Math.random() * 0.99;
    const agingOptions = ['30 days', '60 days', '60 and 90 days', '90+ days'];
    overdueBalance = {
      amount: Math.round(amount * 100) / 100,
      aging: randomChoice(agingOptions),
      message: 'Payment overdue - increases churn risk and blocks promotional eligibility'
    };
  } else if (scenario === scenarios.AT_RISK && randomBoolean(0.4)) {
    overdueBalance = {
      amount: randomInt(75, 200) + Math.random() * 0.99,
      aging: '30 days',
      message: 'Recent payment missed - follow up recommended'
    };
  }
  
  // AutoPay and E-Bill
  const autoPayEnrolled = scenario === scenarios.VIP_CUSTOMER ? true : randomBoolean(0.7);
  const eBillEnrolled = randomBoolean(0.65);
  
  // Trouble tickets
  let troubleTicketCount = 0;
  if (scenario === scenarios.SERVICE_QUALITY || scenario === scenarios.TECHNICAL_SUPPORT) {
    troubleTicketCount = randomInt(2, 5);
  } else if (scenario === scenarios.AT_RISK) {
    troubleTicketCount = randomInt(1, 3);
  } else {
    troubleTicketCount = randomBoolean(0.15) ? randomInt(1, 2) : 0;
  }
  
  // Interactions and last contact
  const lastContactDaysAgo = randomInt(1, 90);
  const totalInteractions = troubleTicketCount > 0 ? 
    randomInt(troubleTicketCount + 1, troubleTicketCount + 10) : 
    randomInt(0, 8);
  
  // Open orders
  const openOrders = [];
  if (troubleTicketCount > 0 && randomBoolean(0.5)) {
    openOrders.push(`Service ticket #ST-${randomInt(100000, 999999)} - ${randomChoice(serviceIssues)}`);
  }
  
  // Upsell eligibility
  const upsellEligible = !overdueBalance && troubleTicketCount < 2 && 
    scenario !== scenarios.BILLING_ISSUES && 
    scenario !== scenarios.SERVICE_QUALITY;
  
  // Recent billing events
  let recentBillingEvents;
  if (scenario === scenarios.PRICE_COMPLAINT || (hasPromo && randomBoolean(0.5))) {
    recentBillingEvents = {
      hasChanges: true,
      message: `Last month bill went up $${randomInt(5, 25)}.00 due to promotional discount expiring`,
      changeAmount: randomInt(5, 25),
      changeType: 'increase'
    };
  } else if (scenario === scenarios.BILLING_ISSUES && randomBoolean(0.7)) {
    recentBillingEvents = {
      hasChanges: true,
      message: randomChoice(billingIssues),
      changeAmount: randomInt(10, 50),
      changeType: 'increase'
    };
  } else if (vasCount > 0 && randomBoolean(0.3)) {
    recentBillingEvents = {
      hasChanges: true,
      message: `Last month bill went up $${vasCount * 10}.00 as customer added VAS products`,
      changeAmount: vasCount * 10,
      changeType: 'increase'
    };
  } else {
    recentBillingEvents = {
      hasChanges: false,
      message: 'No recent changes',
      changeAmount: 0,
      changeType: 'none'
    };
  }
  
  // Lifetime value
  const lifetimeValue = monthlyBill * tenureMonths;
  
  // Tenure message
  let tenureMessage;
  if (tenureYears >= 5) {
    tenureMessage = 'VIP customer—exceptional loyalty, premium treatment required';
  } else if (tenureYears >= 3) {
    tenureMessage = 'Long-time valued customer—thank and reward loyalty';
  } else if (tenureYears >= 1) {
    tenureMessage = 'Established customer—appreciate their business';
  } else {
    tenureMessage = 'Newer customer—build relationship and trust';
  }
  
  // Trouble ticket message
  let troubleTicketMessage;
  if (troubleTicketCount === 0) {
    troubleTicketMessage = 'Service appears stable and reliable';
  } else if (troubleTicketCount >= 3) {
    troubleTicketMessage = 'Service quality concerns—requires immediate attention';
  } else {
    troubleTicketMessage = 'Some service issues—monitor for patterns';
  }
  
  // Notes based on scenario
  let notes;
  switch (scenario) {
    case scenarios.PRICE_COMPLAINT:
      notes = 'Price-sensitive customer. Monitor for competitor offers. Consider retention discount.';
      break;
    case scenarios.COMPETITOR_OFFER:
      notes = 'Received competitor offer. High churn risk. Prepare competitive retention package.';
      break;
    case scenarios.SERVICE_QUALITY:
      notes = 'Service quality issues. Focus on resolution before upsell. Technical escalation may be needed.';
      break;
    case scenarios.BILLING_ISSUES:
      notes = 'Billing concerns. Review charges carefully. Show empathy for payment challenges.';
      break;
    case scenarios.VIP_CUSTOMER:
      notes = 'VIP customer. Premium treatment required. High lifetime value. Referral source.';
      break;
    case scenarios.NEW_CUSTOMER:
      notes = 'New customer. Build relationship. Opportunity for VAS upsell. Monitor satisfaction closely.';
      break;
    case scenarios.AT_RISK:
      notes = 'At-risk customer. Multiple indicators of dissatisfaction. Proactive retention effort needed.';
      break;
    case scenarios.HAPPY_CUSTOMER:
      notes = 'Satisfied customer. Good relationship. Potential for upsell and referrals.';
      break;
    case scenarios.UPSELL_OPPORTUNITY:
      notes = 'Upsell opportunity. Stable customer with room for plan upgrade or VAS additions.';
      break;
    case scenarios.TECHNICAL_SUPPORT:
      notes = 'Technical support needs. Focus on resolving issues. Maintain service quality.';
      break;
    default:
      notes = 'Standard account. Monitor for opportunities and issues.';
  }
  
  // Recent activity
  const recentActivity = [];
  if (scenario === scenarios.PRICE_COMPLAINT) {
    recentActivity.push('Viewed competitor pricing online', 'Called about bill increase', 'Received promotional email');
  } else if (scenario === scenarios.COMPETITOR_OFFER) {
    recentActivity.push('Mentioned competitor offer in call', 'Researching alternative providers', 'Compared pricing online');
  } else if (scenario === scenarios.SERVICE_QUALITY || scenario === scenarios.TECHNICAL_SUPPORT) {
    recentActivity.push(`Reported ${randomChoice(serviceIssues)}`, 'Multiple support calls', 'Service ticket open');
  } else if (scenario === scenarios.BILLING_ISSUES) {
    recentActivity.push(`${randomChoice(billingIssues)}`, 'Called billing department', 'Disputed charge');
  } else if (scenario === scenarios.VIP_CUSTOMER) {
    recentActivity.push('Long-term satisfied customer', 'Referred friend', 'No issues reported');
  } else {
    recentActivity.push('Normal usage patterns', 'No recent issues', 'Standard engagement');
  }
  
  return {
    customerId,
    firstName,
    lastName,
    name,
    email: generateEmail(firstName, lastName),
    phone: generatePhone(),
    accountNumber: generateAccountNumber(index + 100000),
    serviceAddress: generateAddress(index),
    customerScope: 'Telecom Residential',
    coreServices: plan.services,
    
    customerTenure: {
      years: tenureYears,
      months: tenureRemainder,
      totalMonths: tenureMonths,
      message: tenureMessage
    },
    currentPlanDetails: {
      name: plan.name,
      price: plan.basePrice,
      productTypes: plan.services
    },
    vasServices: selectedVAS,
    overdueBalance,
    autoPayStatus: {
      enrolled: autoPayEnrolled,
      message: autoPayEnrolled ? 
        'Payment friction is low—leverage this convenience as a loyalty anchor' : 
        'Not enrolled—opportunity for convenience and retention'
    },
    eBillStatus: {
      enrolled: eBillEnrolled,
      message: eBillEnrolled ? 
        'Shows digital engagement—good channel for reminders' : 
        'Paper bills—opportunity for digital enrollment'
    },
    upsellEligibility: {
      eligible: upsellEligible,
      reason: upsellEligible ? 
        'Good standing, eligible for upgrades' : 
        overdueBalance ? 'Overdue balance blocks upgrades—focus retention first' : 
        'Service issues—resolve before upsell'
    },
    recentTroubleTickets: {
      count: troubleTicketCount,
      message: troubleTicketMessage
    },
    lastContactDate: generateDate(lastContactDaysAgo),
    totalInteractions,
    openOrders,
    preferredLanguage,
    recentBillingEvents,
    
    // Legacy fields
    monthlyBill,
    currentPlan: plan.name,
    tenure: tenureMonths,
    paymentHistory,
    accountStatus,
    lifetimeValue: Math.round(lifetimeValue * 100) / 100,
    recentActivity,
    notes,
    
    // Metadata
    scenario
  };
}

function generateSeedData(count = 200) {
  console.log(`[Seed Generator] Generating ${count} customer accounts...`);
  
  const customers = [];
  const scenarioCounts = {};
  
  for (let i = 1; i <= count; i++) {
    const customer = generateCustomer(i);
    customers.push(customer);
    
    // Track scenario distribution
    scenarioCounts[customer.scenario] = (scenarioCounts[customer.scenario] || 0) + 1;
    
    if (i % 50 === 0) {
      console.log(`[Seed Generator] Generated ${i}/${count} customers...`);
    }
  }
  
  console.log('[Seed Generator] ✓ Generation complete!');
  console.log('\n[Seed Generator] Scenario Distribution:');
  Object.entries(scenarioCounts).forEach(([scenario, count]) => {
    const percentage = ((count / customers.length) * 100).toFixed(1);
    console.log(`  - ${scenario}: ${count} (${percentage}%)`);
  });
  
  // Calculate summary statistics
  const summary = {
    total: customers.length,
    byLanguage: {
      English: customers.filter(c => c.preferredLanguage === 'English').length,
      Spanish: customers.filter(c => c.preferredLanguage === 'Spanish').length
    },
    byStatus: {
      active: customers.filter(c => c.accountStatus === 'active').length,
      vip: customers.filter(c => c.accountStatus === 'vip').length,
      atRisk: customers.filter(c => c.accountStatus === 'at-risk').length
    },
    withOverdueBalance: customers.filter(c => c.overdueBalance !== null).length,
    withTroubleTickets: customers.filter(c => c.recentTroubleTickets.count > 0).length,
    avgTenure: Math.round(customers.reduce((sum, c) => sum + c.tenure, 0) / customers.length),
    avgMonthlyBill: Math.round(customers.reduce((sum, c) => sum + c.monthlyBill, 0) / customers.length * 100) / 100,
    totalLTV: Math.round(customers.reduce((sum, c) => sum + c.lifetimeValue, 0))
  };
  
  console.log('\n[Seed Generator] Summary Statistics:');
  console.log(`  - Total Customers: ${summary.total}`);
  console.log(`  - English: ${summary.byLanguage.English} | Spanish: ${summary.byLanguage.Spanish}`);
  console.log(`  - Active: ${summary.byStatus.active} | VIP: ${summary.byStatus.vip} | At-Risk: ${summary.byStatus.atRisk}`);
  console.log(`  - With Overdue Balance: ${summary.withOverdueBalance}`);
  console.log(`  - With Trouble Tickets: ${summary.withTroubleTickets}`);
  console.log(`  - Avg Tenure: ${summary.avgTenure} months`);
  console.log(`  - Avg Monthly Bill: $${summary.avgMonthlyBill}`);
  console.log(`  - Total Lifetime Value: $${summary.totalLTV.toLocaleString()}`);
  
  return { customers, summary };
}

module.exports = {
  generateSeedData,
  generateCustomer,
  scenarios
};

// If run directly, generate and display sample
if (require.main === module) {
  const { customers, summary } = generateSeedData(200);
  console.log('\n[Seed Generator] Sample customers (first 3):');
  customers.slice(0, 3).forEach(c => {
    console.log(`\n  ${c.customerId}: ${c.name}`);
    console.log(`    Plan: ${c.currentPlan} - $${c.monthlyBill}/mo`);
    console.log(`    Tenure: ${c.tenure} months | Status: ${c.accountStatus}`);
    console.log(`    Scenario: ${c.scenario}`);
  });
}

