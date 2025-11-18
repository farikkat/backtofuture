const databaseService = require('../services/database-service');
const Customer = require('../models/Customer');
const { generateSeedData } = require('./seed-generator');

/**
 * Customer data to migrate (demo customers)
 */
const { mockCustomers } = require('../data/customer-data');

async function migrateCustomers(options = {}) {
  const { clear = false, seed = false, count = 200 } = options;
  
  console.log('[Migration] Starting customer data migration...');
  
  try {
    // Connect to database
    const connected = await databaseService.connect();
    if (!connected) {
      throw new Error('Failed to connect to MongoDB');
    }

    // Clear existing data if requested
    if (clear) {
      console.log('[Migration] Clearing existing customer data...');
      const deleteResult = await Customer.deleteMany({});
      console.log(`[Migration] ✓ Deleted ${deleteResult.deletedCount} existing customers`);
    }

    // Check if customers already exist
    const existingCount = await Customer.countDocuments();
    
    if (existingCount > 0 && !clear && !seed) {
      console.log(`[Migration] ⚠ Database already contains ${existingCount} customers`);
      console.log('[Migration] Use --clear to reset or --seed to add more customers');
      return { success: true, skipped: true, existingCount };
    }

    let customersToInsert;
    let insertedCount;

    if (seed) {
      // Generate seed data
      console.log(`\n[Migration] ═══════════════════════════════════════════════`);
      console.log(`[Migration] 🌱 SEED MODE: Generating ${count} customers`);
      console.log(`[Migration] ═══════════════════════════════════════════════\n`);
      
      const { customers, summary } = generateSeedData(count);
      customersToInsert = customers;
      
      // Insert customers
      console.log(`[Migration] Inserting ${customersToInsert.length} seed customers...`);
      const result = await Customer.insertMany(customersToInsert);
      insertedCount = result.length;
      
      // Display summary
      console.log('\n[Migration] ═══════════════════════════════════════════════');
      console.log('[Migration] 📊 SEED DATA SUMMARY');
      console.log('[Migration] ═══════════════════════════════════════════════');
      console.log(`[Migration] Total Customers: ${summary.total}`);
      console.log(`[Migration] Languages: English (${summary.byLanguage.English}) | Spanish (${summary.byLanguage.Spanish})`);
      console.log(`[Migration] Status: Active (${summary.byStatus.active}) | VIP (${summary.byStatus.vip}) | At-Risk (${summary.byStatus.atRisk})`);
      console.log(`[Migration] With Overdue Balance: ${summary.withOverdueBalance}`);
      console.log(`[Migration] With Trouble Tickets: ${summary.withTroubleTickets}`);
      console.log(`[Migration] Avg Tenure: ${summary.avgTenure} months`);
      console.log(`[Migration] Avg Bill: $${summary.avgMonthlyBill}/mo`);
      console.log(`[Migration] Total LTV: $${summary.totalLTV.toLocaleString()}`);
      console.log('[Migration] ═══════════════════════════════════════════════\n');
      
    } else {
      // Use demo customers
      customersToInsert = Object.values(mockCustomers).filter(c => c.customerId !== 'cust_demo');
      console.log(`[Migration] Inserting ${customersToInsert.length} demo customers...`);
      const result = await Customer.insertMany(customersToInsert);
      insertedCount = result.length;
    }
    
    console.log(`[Migration] ✓ Successfully migrated ${insertedCount} customers`);
    
    // Display database summary
    const dbSummary = await getCustomerSummary();
    console.log('\n[Migration] Database Summary:');
    console.log(`  - Total Customers: ${dbSummary.total}`);
    console.log(`  - English: ${dbSummary.english} | Spanish: ${dbSummary.spanish}`);
    console.log(`  - VIP: ${dbSummary.vip} | At Risk: ${dbSummary.atRisk}`);
    
    return { success: true, migrated: insertedCount, summary: dbSummary };
  } catch (error) {
    console.error('[Migration] ✗ Migration failed:', error.message);
    throw error;
  } finally {
    await databaseService.disconnect();
  }
}

async function clearAndMigrate(useSeed = false, count = 200) {
  console.log('[Migration] Clearing existing data...');
  
  try {
    const connected = await databaseService.connect();
    if (!connected) {
      throw new Error('Failed to connect to MongoDB');
    }

    // Delete all existing customers
    const deleteResult = await Customer.deleteMany({});
    console.log(`[Migration] Deleted ${deleteResult.deletedCount} existing customers`);
    
    // Insert fresh data
    if (useSeed) {
      const { customers, summary } = generateSeedData(count);
      const result = await Customer.insertMany(customers);
      console.log(`[Migration] ✓ Re-migrated ${result.length} seed customers`);
      
      return { 
        success: true, 
        deleted: deleteResult.deletedCount, 
        migrated: result.length,
        summary 
      };
    } else {
      const customersToInsert = Object.values(mockCustomers).filter(c => c.customerId !== 'cust_demo');
      const result = await Customer.insertMany(customersToInsert);
      console.log(`[Migration] ✓ Re-migrated ${result.length} demo customers`);
      
      return { 
        success: true, 
        deleted: deleteResult.deletedCount, 
        migrated: result.length 
      };
    }
  } catch (error) {
    console.error('[Migration] ✗ Clear and migrate failed:', error.message);
    throw error;
  } finally {
    await databaseService.disconnect();
  }
}

async function getCustomerSummary() {
  const total = await Customer.countDocuments();
  const english = await Customer.countDocuments({ preferredLanguage: 'English' });
  const spanish = await Customer.countDocuments({ preferredLanguage: 'Spanish' });
  const vip = await Customer.countDocuments({ accountStatus: 'vip' });
  const atRisk = await Customer.countDocuments({
    $or: [
      { 'overdueBalance.amount': { $gt: 0 } },
      { 'recentTroubleTickets.count': { $gte: 2 } }
    ]
  });
  
  return { total, english, spanish, vip, atRisk };
}

// Run migration if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const clear = args.includes('--clear');
  const seed = args.includes('--seed');
  const countArg = args.find(arg => arg.startsWith('--count='));
  const count = countArg ? parseInt(countArg.split('=')[1]) : 200;
  
  // Parse options
  const options = { clear, seed, count };
  
  migrateCustomers(options)
    .then(() => {
      console.log('[Migration] ✓ Migration complete!\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('[Migration] ✗ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = {
  migrateCustomers,
  clearAndMigrate,
  getCustomerSummary
};
