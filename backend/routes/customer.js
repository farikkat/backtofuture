const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const databaseService = require('../services/database-service');
const { customersObject, customersArray } = require('../data/customer-data');

/**
 * Check if MongoDB is available
 */
let useDatabase = false;

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
  }
];

/**
 * Initialize database connection and populate if empty
 */
async function initializeDatabase() {
  try {
    const connected = await databaseService.connect();
    
    if (connected) {
      useDatabase = true;
      console.log('[Customer API] Using MongoDB for customer data');
      
      // Check if we need to populate the database
      const count = await Customer.countDocuments();
      if (count === 0) {
        console.log('[Customer API] Database empty, populating with initial data...');
        await Customer.insertMany(customersArray);
        console.log(`[Customer API] ✓ Populated database with ${customersArray.length} customers`);
      } else {
        console.log(`[Customer API] Database contains ${count} customers`);
      }
    } else {
      useDatabase = false;
      console.log('[Customer API] Using mock data (MongoDB unavailable)');
    }
  } catch (error) {
    useDatabase = false;
    console.error('[Customer API] Database initialization failed:', error.message);
    console.log('[Customer API] Falling back to mock data');
  }
}

// Initialize database on module load
initializeDatabase();

/**
 * GET /api/customer/scenarios/list
 * IMPORTANT: This must come BEFORE /:customerId route
 */
router.get('/scenarios/list', (req, res) => {
  res.json({
    success: true,
    scenarios: customerScenarios,
    dataSource: useDatabase ? 'mongodb' : 'mock'
  });
});

/**
 * GET /api/customer/health
 * Database health check endpoint
 */
router.get('/health', async (req, res) => {
  try {
    const health = await databaseService.healthCheck();
    const status = useDatabase ? await databaseService.getConnectionStatus() : null;
    
    res.json({
      success: true,
      database: {
        enabled: useDatabase,
        ...health,
        ...status
      }
    });
  } catch (error) {
    res.json({
      success: true,
      database: {
        enabled: false,
        message: 'Using mock data',
        error: error.message
      }
    });
  }
});

/**
 * GET /api/customer/list
 * List all customers with full details for search
 * IMPORTANT: This must come BEFORE /:customerId route
 */
router.get('/list', async (req, res) => {
  try {
    let customers;
    
    if (useDatabase) {
      // Get from MongoDB with fields needed for search
      customers = await Customer.find({}, {
        customerId: 1,
        firstName: 1,
        lastName: 1,
        name: 1,
        email: 1,
        accountNumber: 1,
        currentPlanDetails: 1,
        currentPlan: 1,
        monthlyBill: 1,
        tenure: 1,
        accountStatus: 1,
        preferredLanguage: 1
      }).lean();
    } else {
      // Get from mock data with fields needed for search
      customers = Object.values(customersObject).map(c => ({
        customerId: c.customerId,
        firstName: c.firstName,
        lastName: c.lastName,
        name: c.name,
        email: c.email,
        accountNumber: c.accountNumber,
        currentPlanDetails: c.currentPlanDetails,
        currentPlan: c.currentPlan,
        monthlyBill: c.monthlyBill,
        tenure: c.tenure,
        accountStatus: c.accountStatus,
        preferredLanguage: c.preferredLanguage
      }));
    }
    
    console.log(`[Customer API] Listed ${customers.length} customers for search`);
    
    res.json({
      success: true,
      customers,
      count: customers.length,
      dataSource: useDatabase ? 'mongodb' : 'mock'
    });
  } catch (error) {
    console.error('[Customer API] List error:', error);
    res.status(500).json({
      error: 'Failed to retrieve customers',
      message: error.message
    });
  }
});

/**
 * GET /api/customer
 * List all customers
 * IMPORTANT: This must come BEFORE /:customerId route
 */
router.get('/', async (req, res) => {
  try {
    let customers;
    
    if (useDatabase) {
      // Get from MongoDB
      customers = await Customer.find({}, {
        customerId: 1,
        name: 1,
        monthlyBill: 1,
        tenure: 1,
        accountStatus: 1,
        preferredLanguage: 1
      }).lean();
    } else {
      // Get from mock data
      customers = Object.values(customersObject).map(c => ({
        customerId: c.customerId,
        name: c.name,
        monthlyBill: c.monthlyBill,
        tenure: c.tenure,
        accountStatus: c.accountStatus,
        preferredLanguage: c.preferredLanguage
      }));
    }
    
    res.json({
      success: true,
      customers,
      count: customers.length,
      dataSource: useDatabase ? 'mongodb' : 'mock'
    });
  } catch (error) {
    console.error('[Customer API] List error:', error);
    res.status(500).json({
      error: 'Failed to retrieve customers',
      message: error.message
    });
  }
});

/**
 * POST /api/customer/verify-pin
 * Verify PIN for a customer account
 */
router.post('/verify-pin', async (req, res) => {
  try {
    const { accountNumber, pin } = req.body;
    
    if (!accountNumber || !pin) {
      return res.status(400).json({
        error: 'Account number and PIN are required'
      });
    }
    
    let customer;
    
    if (useDatabase) {
      // Get from MongoDB
      customer = await Customer.findOne({ accountNumber }).lean();
    } else {
      // Get from mock data
      customer = Object.values(customersObject).find(c => c.accountNumber === accountNumber);
    }
    
    if (!customer) {
      console.log(`[Customer API] Account not found: ${accountNumber}`);
      return res.status(404).json({
        success: false,
        verified: false,
        error: 'Account not found'
      });
    }
    
    // Verify PIN
    const pinMatches = customer.pin === pin;
    
    if (pinMatches) {
      console.log(`[Customer API] PIN verified for account: ${accountNumber}`);
      return res.json({
        success: true,
        verified: true,
        customer: {
          customerId: customer.customerId,
          firstName: customer.firstName,
          lastName: customer.lastName,
          name: customer.name,
          email: customer.email,
          accountNumber: customer.accountNumber
        }
      });
    } else {
      console.log(`[Customer API] PIN verification failed for account: ${accountNumber}`);
      return res.status(401).json({
        success: false,
        verified: false,
        error: 'Invalid PIN'
      });
    }
  } catch (error) {
    console.error('[Customer API] PIN verification error:', error);
    res.status(500).json({
      error: 'Failed to verify PIN',
      message: error.message
    });
  }
});

/**
 * GET /api/customer/:customerId
 * Get a single customer by ID
 * IMPORTANT: This must come AFTER specific routes
 */
router.get('/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    let customer;
    
    if (useDatabase) {
      // Get from MongoDB
      customer = await Customer.findOne({ customerId }).lean();
    } else {
      // Get from mock data
      customer = customersObject[customerId];
    }
    
    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found',
        customerId
      });
    }
    
    res.json({
      success: true,
      customer,
      dataSource: useDatabase ? 'mongodb' : 'mock'
    });
  } catch (error) {
    console.error('[Customer API] Get customer error:', error);
    res.status(500).json({
      error: 'Failed to retrieve customer',
      message: error.message
    });
  }
});

/**
 * POST /api/customer
 * Create a new customer
 */
router.post('/', async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(503).json({
        error: 'Database not available',
        message: 'Cannot create customers when using mock data'
      });
    }
    
    const customerData = req.body;
    
    // Check if customer already exists
    const existing = await Customer.findOne({ customerId: customerData.customerId });
    if (existing) {
      return res.status(409).json({
        error: 'Customer already exists',
        customerId: customerData.customerId
      });
    }
    
    // Create new customer
    const customer = new Customer(customerData);
    await customer.save();
    
    console.log(`[Customer API] ✓ Created customer ${customer.customerId}`);
    
    res.status(201).json({
      success: true,
      customer: customer.toObject(),
      message: 'Customer created successfully'
    });
  } catch (error) {
    console.error('[Customer API] Create error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.message,
        details: error.errors
      });
    }
    
    res.status(500).json({
      error: 'Failed to create customer',
      message: error.message
    });
  }
});

/**
 * PUT /api/customer/:customerId
 * Update an existing customer
 */
router.put('/:customerId', async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(503).json({
        error: 'Database not available',
        message: 'Cannot update customers when using mock data'
      });
    }
    
    const { customerId } = req.params;
    const updates = req.body;
    
    // Remove immutable fields
    delete updates._id;
    delete updates.customerId;
    delete updates.createdAt;
    
    const customer = await Customer.findOneAndUpdate(
      { customerId },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found',
        customerId
      });
    }
    
    console.log(`[Customer API] ✓ Updated customer ${customerId}`);
    
    res.json({
      success: true,
      customer: customer.toObject(),
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('[Customer API] Update error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        message: error.message,
        details: error.errors
      });
    }
    
    res.status(500).json({
      error: 'Failed to update customer',
      message: error.message
    });
  }
});

/**
 * DELETE /api/customer/:customerId
 * Delete a customer
 */
router.delete('/:customerId', async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(503).json({
        error: 'Database not available',
        message: 'Cannot delete customers when using mock data'
      });
    }
    
    const { customerId } = req.params;
    
    const customer = await Customer.findOneAndDelete({ customerId });
    
    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found',
        customerId
      });
    }
    
    console.log(`[Customer API] ✓ Deleted customer ${customerId}`);
    
    res.json({
      success: true,
      message: 'Customer deleted successfully',
      customerId
    });
  } catch (error) {
    console.error('[Customer API] Delete error:', error);
    res.status(500).json({
      error: 'Failed to delete customer',
      message: error.message
    });
  }
});

/**
 * GET /api/customer/query/at-risk
 * Find customers at risk
 */
router.get('/query/at-risk', async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(503).json({
        error: 'Query not available with mock data',
        message: 'Advanced queries require database connection'
      });
    }
    
    const customers = await Customer.findAtRisk();
    
    res.json({
      success: true,
      customers,
      count: customers.length,
      dataSource: 'mongodb'
    });
  } catch (error) {
    console.error('[Customer API] At-risk query error:', error);
    res.status(500).json({
      error: 'Failed to query at-risk customers',
      message: error.message
    });
  }
});

/**
 * GET /api/customer/query/vip
 * Find VIP customers
 */
router.get('/query/vip', async (req, res) => {
  try {
    if (!useDatabase) {
      return res.status(503).json({
        error: 'Query not available with mock data',
        message: 'Advanced queries require database connection'
      });
    }
    
    const customers = await Customer.findVIP();
    
    res.json({
      success: true,
      customers,
      count: customers.length,
      dataSource: 'mongodb'
    });
  } catch (error) {
    console.error('[Customer API] VIP query error:', error);
    res.status(500).json({
      error: 'Failed to query VIP customers',
      message: error.message
    });
  }
});

module.exports = router;
