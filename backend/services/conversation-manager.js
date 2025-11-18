const { v4: uuidv4 } = require('uuid');
const databricksService = require('./databricks-service');

class ConversationManager {
  constructor() {
    this.sessions = new Map();
    this.sessionTimeout = (process.env.SESSION_TIMEOUT_MINUTES || 30) * 60 * 1000;
  }

  createSession(customerId, customerProfile) {
    const sessionId = uuidv4();
    
    const session = {
      sessionId,
      customerId,
      customerProfile,
      messages: [],
      intent: null,
      sentiment: 'neutral',
      urgency: 5,
      language: 'English',
      keyConcerns: [],
      offers: [],
      startTime: new Date(),
      lastActivity: new Date(),
      status: 'active'
    };

    this.sessions.set(sessionId, session);
    
    console.log(`[ConversationManager] Created session ${sessionId} for customer ${customerId}`);
    return session;
  }

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const timeSinceActivity = Date.now() - session.lastActivity.getTime();
    if (timeSinceActivity > this.sessionTimeout) {
      this.endSession(sessionId);
      throw new Error(`Session ${sessionId} has expired`);
    }

    return session;
  }

  async addMessage(sessionId, role, content) {
    const session = this.getSession(sessionId);
    
    const message = {
      role,
      content,
      timestamp: new Date()
    };

    session.messages.push(message);
    session.lastActivity = new Date();

    console.log(`[ConversationManager] Added ${role} message to session ${sessionId}`);
    return message;
  }

  getSystemPrompt(customerProfile, language = 'English') {
    const greeting = language === 'Spanish' 
      ? `Hola ${customerProfile.name.split(' ')[0]}`
      : `Hello ${customerProfile.name.split(' ')[0]}`;

    return `You are an empathetic customer retention specialist for a telecommunications company.

Your goal is to:
1. Listen actively and understand customer concerns
2. Show genuine empathy and professionalism
3. Identify the root cause of their dissatisfaction
4. Present personalized retention offers when appropriate
5. Resolve issues or escalate to a human agent if needed

Customer Context:
- Name: ${customerProfile.name}
- Account Tenure: ${customerProfile.tenure} months
- Monthly Bill: $${customerProfile.monthlyBill}
- Current Plan: ${customerProfile.currentPlan}

Guidelines:
- Be conversational and warm, not scripted
- Use the customer's preferred language (${language})
- Ask clarifying questions to understand their needs
- Present 2-3 offer options, let them choose
- If they're very upset or have complex issues, offer to transfer to a specialist
- Keep responses concise (2-4 sentences max)

Start the conversation with: "${greeting}, thank you for calling. I understand you're considering making changes to your account. I'm here to help - can you tell me what's prompting your call today?"`;
  }

  async processMessage(sessionId, userMessage) {
    const session = this.getSession(sessionId);
    
    await this.addMessage(sessionId, 'user', userMessage);

    try {
      const analysis = await databricksService.analyzeConversation(
        session.messages.slice(0, -1),
        userMessage
      );

      session.intent = analysis.intent;
      session.sentiment = analysis.sentiment;
      session.urgency = analysis.urgency;
      session.language = analysis.language;
      session.keyConcerns = analysis.key_concerns || [];

      console.log(`[ConversationManager] Analysis - Intent: ${session.intent}, Sentiment: ${session.sentiment}, Urgency: ${session.urgency}`);
    } catch (error) {
      console.error('[ConversationManager] Analysis failed:', error.message);
    }

    const conversationMessages = session.messages.map(msg => ({
      role: msg.role === 'agent' ? 'assistant' : 'user',
      content: msg.content
    }));

    try {
      const systemPrompt = this.getSystemPrompt(session.customerProfile, session.language);
      
      const response = await databricksService.chatCompletion(
        conversationMessages,
        {
          systemPrompt,
          temperature: 0.7,
          maxTokens: 300
        }
      );

      await this.addMessage(sessionId, 'agent', response.content);

      if (this.shouldGenerateOffers(session)) {
        await this.generateOffers(sessionId);
      }

      return {
        message: response.content,
        intent: session.intent,
        sentiment: session.sentiment,
        urgency: session.urgency,
        language: session.language,
        keyConcerns: session.keyConcerns,
        offers: session.offers
      };
    } catch (error) {
      console.error('[ConversationManager] Response generation failed:', error.message);
      throw error;
    }
  }

  shouldGenerateOffers(session) {
    const cancellationIntents = ['price_complaint', 'competitor_offer', 'service_quality', 'billing_issue'];
    
    return session.offers.length === 0 
      && session.messages.length >= 3
      && cancellationIntents.includes(session.intent);
  }

  async generateOffers(sessionId) {
    const session = this.getSession(sessionId);
    
    if (session.offers.length > 0) {
      return session.offers;
    }

    try {
      const result = await databricksService.generateOffers(
        session.customerProfile,
        session.intent,
        session.sentiment,
        session.urgency
      );

      session.offers = result.offers || [];
      console.log(`[ConversationManager] Generated ${session.offers.length} offers for session ${sessionId}`);
      
      return session.offers;
    } catch (error) {
      console.error('[ConversationManager] Offer generation failed:', error.message);
      return [];
    }
  }

  generateHandoffSummary(sessionId) {
    const session = this.getSession(sessionId);
    
    const duration = Math.round((Date.now() - session.startTime.getTime()) / 1000 / 60);
    const messageCount = session.messages.length;

    const summary = {
      sessionId,
      customer: {
        name: session.customerProfile.name,
        customerId: session.customerId,
        monthlyBill: session.customerProfile.monthlyBill,
        tenure: session.customerProfile.tenure
      },
      conversationSummary: {
        duration: `${duration} minutes`,
        messageCount,
        intent: session.intent,
        sentiment: session.sentiment,
        urgency: `${session.urgency}/10`,
        language: session.language,
        keyConcerns: session.keyConcerns
      },
      offersPresented: session.offers,
      conversationHistory: session.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      })),
      recommendation: this.getTransferRecommendation(session)
    };

    session.status = 'transferred';
    console.log(`[ConversationManager] Generated handoff summary for session ${sessionId}`);
    
    return summary;
  }

  getTransferRecommendation(session) {
    if (session.urgency >= 8) {
      return 'HIGH PRIORITY: Customer is very upset. Immediate attention needed.';
    }
    if (session.sentiment === 'angry') {
      return 'URGENT: Customer is angry. Use empathy and escalate if needed.';
    }
    if (session.intent === 'competitor_offer') {
      return 'COMPETITIVE THREAT: Customer has competing offer. Review and counter.';
    }
    if (session.offers.length > 0) {
      return 'OFFERS PRESENTED: Customer shown retention offers but wants to speak with human.';
    }
    return 'GENERAL INQUIRY: Customer prefers human assistance.';
  }

  endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'ended';
      session.endTime = new Date();
      console.log(`[ConversationManager] Ended session ${sessionId}`);
    }
  }

  getActiveSessions() {
    return Array.from(this.sessions.values()).filter(s => s.status === 'active');
  }

  cleanupOldSessions() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [sessionId, session] of this.sessions.entries()) {
      const timeSinceActivity = now - session.lastActivity.getTime();
      if (timeSinceActivity > this.sessionTimeout * 2) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`[ConversationManager] Cleaned up ${cleaned} old sessions`);
    }
  }
}

module.exports = new ConversationManager();

