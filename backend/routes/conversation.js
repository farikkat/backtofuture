const express = require('express');
const router = express.Router();
const multer = require('multer');
const conversationManager = require('../services/conversation-manager');
const databricksService = require('../services/databricks-service');

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

/**
 * POST /api/conversation/start
 */
router.post('/start', async (req, res) => {
  try {
    const { customerId, customerProfile } = req.body;
    
    if (!customerId || !customerProfile) {
      return res.status(400).json({
        error: 'customerId and customerProfile are required'
      });
    }
    
    const session = conversationManager.createSession(customerId, customerProfile);
    
    const systemPrompt = conversationManager.getSystemPrompt(
      customerProfile, 
      customerProfile.preferredLanguage || 'English'
    );
    
    const greetingMatch = systemPrompt.match(/Start the conversation with: "(.+?)"/);
    const greeting = greetingMatch ? greetingMatch[1] : 
      `Hello ${customerProfile.name.split(' ')[0]}, thank you for calling. How can I help you today?`;
    
    await conversationManager.addMessage(session.sessionId, 'agent', greeting);
    
    res.json({
      success: true,
      sessionId: session.sessionId,
      greeting,
      session: {
        customerId: session.customerId,
        customerName: session.customerProfile.name,
        status: session.status,
        language: session.language
      }
    });
  } catch (error) {
    console.error('[API] Start conversation error:', error);
    res.status(500).json({
      error: 'Failed to start conversation',
      message: error.message
    });
  }
});

/**
 * POST /api/conversation/message
 */
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({
        error: 'sessionId and message are required'
      });
    }
    
    const response = await conversationManager.processMessage(sessionId, message);
    
    res.json({
      success: true,
      response: {
        message: response.message,
        intent: response.intent,
        sentiment: response.sentiment,
        urgency: response.urgency,
        language: response.language,
        keyConcerns: response.keyConcerns,
        offers: response.offers
      }
    });
  } catch (error) {
    console.error('[API] Message error:', error);
    
    if (error.message.includes('not found') || error.message.includes('expired')) {
      return res.status(404).json({
        error: 'Session not found or expired',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message
    });
  }
});

/**
 * POST /api/conversation/transcribe
 */
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No audio file provided'
      });
    }
    
    const { sessionId, language } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        error: 'sessionId is required'
      });
    }
    
    conversationManager.getSession(sessionId);
    
    const transcription = await databricksService.transcribeAudio(
      req.file.buffer,
      { language: language || 'auto' }
    );
    
    res.json({
      success: true,
      transcription: {
        text: transcription.text,
        language: transcription.language,
        confidence: transcription.confidence || 'high'
      }
    });
  } catch (error) {
    console.error('[API] Transcription error:', error);
    
    if (error.message.includes('not found') || error.message.includes('expired')) {
      return res.status(404).json({
        error: 'Session not found or expired',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Failed to transcribe audio',
      message: error.message
    });
  }
});

/**
 * GET /api/conversation/:sessionId
 */
router.get('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = conversationManager.getSession(sessionId);
    
    res.json({
      success: true,
      session: {
        sessionId: session.sessionId,
        customerId: session.customerId,
        customerName: session.customerProfile.name,
        status: session.status,
        intent: session.intent,
        sentiment: session.sentiment,
        urgency: session.urgency,
        language: session.language,
        keyConcerns: session.keyConcerns,
        offers: session.offers,
        messageCount: session.messages.length,
        startTime: session.startTime,
        lastActivity: session.lastActivity,
        messages: session.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        }))
      }
    });
  } catch (error) {
    console.error('[API] Get session error:', error);
    
    if (error.message.includes('not found') || error.message.includes('expired')) {
      return res.status(404).json({
        error: 'Session not found or expired',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Failed to retrieve session',
      message: error.message
    });
  }
});

/**
 * POST /api/conversation/:sessionId/transfer
 */
router.post('/:sessionId/transfer', (req, res) => {
  try {
    const { sessionId } = req.params;
    const summary = conversationManager.generateHandoffSummary(sessionId);
    
    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('[API] Transfer error:', error);
    
    if (error.message.includes('not found') || error.message.includes('expired')) {
      return res.status(404).json({
        error: 'Session not found or expired',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Failed to generate transfer summary',
      message: error.message
    });
  }
});

/**
 * POST /api/conversation/:sessionId/end
 */
router.post('/:sessionId/end', (req, res) => {
  try {
    const { sessionId } = req.params;
    conversationManager.endSession(sessionId);
    
    res.json({
      success: true,
      message: 'Session ended successfully'
    });
  } catch (error) {
    console.error('[API] End session error:', error);
    res.status(500).json({
      error: 'Failed to end session',
      message: error.message
    });
  }
});

/**
 * GET /api/conversation
 */
router.get('/', (req, res) => {
  try {
    const activeSessions = conversationManager.getActiveSessions();
    
    res.json({
      success: true,
      count: activeSessions.length,
      sessions: activeSessions.map(s => ({
        sessionId: s.sessionId,
        customerId: s.customerId,
        customerName: s.customerProfile.name,
        status: s.status,
        intent: s.intent,
        sentiment: s.sentiment,
        urgency: s.urgency,
        messageCount: s.messages.length,
        startTime: s.startTime,
        lastActivity: s.lastActivity
      }))
    });
  } catch (error) {
    console.error('[API] List sessions error:', error);
    res.status(500).json({
      error: 'Failed to list sessions',
      message: error.message
    });
  }
});

module.exports = router;

