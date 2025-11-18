const mongoose = require('mongoose');

/**
 * Customer Schema - Comprehensive telecom customer insights
 */
const customerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Basic Information
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  pin: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4,
    match: /^\d{4}$/
  },
  serviceAddress: {
    type: String,
    required: true
  },
  customerScope: {
    type: String,
    default: 'Telecom Residential'
  },
  coreServices: [{
    type: String
  }],
  
  // Customer Insights
  customerTenure: {
    years: Number,
    months: Number,
    totalMonths: Number,
    message: String
  },
  
  currentPlanDetails: {
    name: String,
    price: Number,
    productTypes: [String]
  },
  
  vasServices: [{
    type: String
  }],
  
  overdueBalance: {
    amount: Number,
    aging: String,
    message: String
  },
  
  autoPayStatus: {
    enrolled: Boolean,
    message: String
  },
  
  eBillStatus: {
    enrolled: Boolean,
    message: String
  },
  
  upsellEligibility: {
    eligible: Boolean,
    reason: String
  },
  
  recentTroubleTickets: {
    count: Number,
    message: String
  },
  
  lastContactDate: {
    type: String
  },
  
  totalInteractions: {
    type: Number,
    default: 0
  },
  
  openOrders: [{
    type: String
  }],
  
  preferredLanguage: {
    type: String,
    enum: ['English', 'Spanish'],
    default: 'English'
  },
  
  recentBillingEvents: {
    hasChanges: Boolean,
    message: String,
    changeAmount: Number,
    changeType: {
      type: String,
      enum: ['increase', 'decrease', 'none']
    }
  },
  
  // Legacy fields (for compatibility)
  monthlyBill: {
    type: Number,
    required: true
  },
  currentPlan: {
    type: String,
    required: true
  },
  tenure: {
    type: Number,
    required: true
  },
  paymentHistory: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor']
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'vip', 'at-risk'],
    default: 'active'
  },
  lifetimeValue: {
    type: Number,
    default: 0
  },
  recentActivity: [{
    type: String
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for performance
customerSchema.index({ email: 1 });
customerSchema.index({ accountNumber: 1 });
customerSchema.index({ 'accountStatus': 1 });
customerSchema.index({ 'preferredLanguage': 1 });

// Virtual for full name (alternative to stored name field)
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to get customer summary
customerSchema.methods.getSummary = function() {
  return {
    customerId: this.customerId,
    name: this.name,
    monthlyBill: this.monthlyBill,
    tenure: this.tenure,
    accountStatus: this.accountStatus,
    preferredLanguage: this.preferredLanguage
  };
};

// Static method to find customers at risk
customerSchema.statics.findAtRisk = function() {
  return this.find({
    $or: [
      { 'overdueBalance.amount': { $gt: 0 } },
      { 'recentTroubleTickets.count': { $gte: 2 } },
      { accountStatus: 'at-risk' }
    ]
  });
};

// Static method to find VIP customers
customerSchema.statics.findVIP = function() {
  return this.find({
    $or: [
      { accountStatus: 'vip' },
      { monthlyBill: { $gte: 150 } },
      { tenure: { $gte: 36 } }
    ]
  });
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;

