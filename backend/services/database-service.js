const mongoose = require('mongoose');

class DatabaseService {
  constructor() {
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
  }

  async connect() {
    if (this.isConnected) {
      console.log('[Database] Already connected to MongoDB');
      return true;
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:sewr3434fedgsdr2WEWds@ftr-mongodb.agentsmp.com:27019';
    
    try {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      this.connectionAttempts = 0;
      
      console.log(`[Database] ✓ Connected to MongoDB: ${mongoUri}`);
      
      // Set up connection event listeners
      mongoose.connection.on('disconnected', () => {
        console.warn('[Database] ⚠ MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('error', (err) => {
        console.error('[Database] ✗ MongoDB error:', err.message);
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('[Database] ✓ MongoDB reconnected');
        this.isConnected = true;
      });

      return true;
    } catch (error) {
      console.error(`[Database] ✗ MongoDB connection failed (attempt ${this.connectionAttempts + 1}/${this.maxRetries}):`, error.message);
      this.connectionAttempts++;
      
      if (this.connectionAttempts < this.maxRetries) {
        console.log(`[Database] Retrying in ${this.retryDelay / 1000} seconds...`);
        await this.sleep(this.retryDelay);
        return await this.connect();
      }
      
      console.warn('[Database] ⚠ Max connection attempts reached. Falling back to mock data.');
      return false;
    }
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('[Database] ✓ Disconnected from MongoDB');
    } catch (error) {
      console.error('[Database] ✗ Error disconnecting:', error.message);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      readyStateText: this.getReadyStateText(mongoose.connection.readyState)
    };
  }

  getReadyStateText(state) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[state] || 'unknown';
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health check
  async healthCheck() {
    if (!this.isConnected) {
      return { healthy: false, message: 'Not connected to MongoDB' };
    }

    try {
      await mongoose.connection.db.admin().ping();
      return { 
        healthy: true, 
        message: 'MongoDB connection healthy',
        database: mongoose.connection.name
      };
    } catch (error) {
      return { 
        healthy: false, 
        message: `Health check failed: ${error.message}` 
      };
    }
  }
}

// Singleton instance
const databaseService = new DatabaseService();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('[Database] Received SIGINT, closing MongoDB connection...');
  await databaseService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('[Database] Received SIGTERM, closing MongoDB connection...');
  await databaseService.disconnect();
  process.exit(0);
});

module.exports = databaseService;

