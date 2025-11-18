// Frontend Configuration
const CONFIG = {
  // Backend API URL - update this if backend runs on different host/port
  API_URL: 'http://localhost:3001',
  
  // API Endpoints
  ENDPOINTS: {
    HEALTH: '/api/health',
    CUSTOMER_SCENARIOS: '/api/customer/scenarios/list',
    CUSTOMER: '/api/customer',
    CONVERSATION_START: '/api/conversation/start',
    CONVERSATION_MESSAGE: '/api/conversation/message',
    CONVERSATION_TRANSCRIBE: '/api/conversation/transcribe',
    CONVERSATION_GET: '/api/conversation',
    CONVERSATION_TRANSFER: '/api/conversation/:id/transfer',
    CONVERSATION_END: '/api/conversation/:id/end'
  }
};

// Make config available globally
window.APP_CONFIG = CONFIG;

