const { v4: uuidv4 } = require('uuid');
const databricksService = require('./databricks-service');

class ConversationManager {
  constructor() {
    this.sessions = new Map();
    this.sessionTimeout = (process.env.SESSION_TIMEOUT_MINUTES || 30) * 60 * 1000;
  }

  createSession(customerId, customerProfile) {
    const sessionId = uuidv4();
    
    // Use customer's preferred language, default to English if not specified
    const preferredLanguage = customerProfile.preferredLanguage || 'English';
    
    const session = {
      sessionId,
      customerId,
      customerProfile,
      messages: [],
      intent: null,
      sentiment: 'neutral',
      urgency: 5,
      language: preferredLanguage,
      keyConcerns: [],
      offers: [],
      startTime: new Date(),
      lastActivity: new Date(),
      status: 'active'
    };

    this.sessions.set(sessionId, session);
    
    console.log(`[ConversationManager] Created session ${sessionId} for customer ${customerId} (Language: ${preferredLanguage})`);
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
    const firstName = customerProfile.firstName || customerProfile.name.split(' ')[0];
    
    // Build comprehensive customer context
    const tenure = customerProfile.customerTenure 
      ? `${customerProfile.customerTenure.years} years ${customerProfile.customerTenure.months} months (${customerProfile.customerTenure.totalMonths} total) - ${customerProfile.customerTenure.message}`
      : `${customerProfile.tenure} months`;
    
    const plan = customerProfile.currentPlanDetails 
      ? `${customerProfile.currentPlanDetails.name} at $${customerProfile.currentPlanDetails.price}/month`
      : `${customerProfile.currentPlan} at $${customerProfile.monthlyBill}/month`;
    
    const vasServices = customerProfile.vasServices && customerProfile.vasServices.length > 0
      ? `Value Added Services: ${customerProfile.vasServices.join(', ')}`
      : 'No additional services';
    
    const overdueInfo = customerProfile.overdueBalance
      ? `⚠️ OVERDUE BALANCE: $${customerProfile.overdueBalance.amount} (${customerProfile.overdueBalance.aging}) - ${customerProfile.overdueBalance.message}`
      : 'No overdue balance';
    
    const autoPayInfo = customerProfile.autoPayStatus
      ? `AutoPay: ${customerProfile.autoPayStatus.enrolled ? 'Enrolled' : 'Not Enrolled'} - ${customerProfile.autoPayStatus.message}`
      : 'AutoPay status unknown';
    
    const eBillInfo = customerProfile.eBillStatus
      ? `E-Bill: ${customerProfile.eBillStatus.enrolled ? 'Enrolled' : 'Not Enrolled'} - ${customerProfile.eBillStatus.message}`
      : 'E-Bill status unknown';
    
    const upsellInfo = customerProfile.upsellEligibility
      ? `Upsell Eligibility: ${customerProfile.upsellEligibility.eligible ? 'YES' : 'NO'} - ${customerProfile.upsellEligibility.reason}`
      : 'Upsell eligibility unknown';
    
    const troubleTickets = customerProfile.recentTroubleTickets
      ? `Recent Trouble Tickets: ${customerProfile.recentTroubleTickets.count} - ${customerProfile.recentTroubleTickets.message}`
      : 'No trouble ticket information';
    
    const billingEvents = customerProfile.recentBillingEvents
      ? customerProfile.recentBillingEvents.hasChanges
        ? `⚠️ BILLING CHANGE: ${customerProfile.recentBillingEvents.message} (${customerProfile.recentBillingEvents.changeType === 'increase' ? '+' : '-'}$${customerProfile.recentBillingEvents.changeAmount})`
        : 'No recent billing changes'
      : 'No billing event information';
    
    const accountStatus = customerProfile.accountStatus 
      ? customerProfile.accountStatus.toUpperCase()
      : 'ACTIVE';
    
    const lifetimeValue = customerProfile.lifetimeValue 
      ? `$${customerProfile.lifetimeValue.toFixed(2)}`
      : 'Unknown';
    
    if (language === 'Spanish') {
      return `Eres un especialista empático en retención de clientes para una compañía de telecomunicaciones.

Tu objetivo es:
1. Escuchar activamente y comprender las preocupaciones del cliente
2. Mostrar empatía genuina y profesionalismo
3. Identificar la causa raíz de su insatisfacción
4. Presentar ofertas de retención personalizadas cuando sea apropiado
5. Resolver problemas o escalar a un agente humano si es necesario

INFORMACIÓN COMPLETA DEL CLIENTE:
═══════════════════════════════════════
IDENTIDAD:
- Nombre: ${customerProfile.name}
- Número de Cuenta: ${customerProfile.accountNumber || 'N/A'}
- Estado de Cuenta: ${accountStatus}
- Valor de por Vida: ${lifetimeValue}

ANTIGÜEDAD Y LEALTAD:
- ${tenure}

SERVICIOS Y FACTURACIÓN:
- Plan Actual: ${plan}
- ${vasServices}

SITUACIÓN FINANCIERA:
- ${overdueInfo}
- ${autoPayInfo}
- ${eBillInfo}
- ${billingEvents}

ELEGIBILIDAD Y OPORTUNIDADES:
- ${upsellInfo}

HISTORIAL DE SERVICIO:
- ${troubleTickets}
- Última Interacción: ${customerProfile.lastContactDate || 'Desconocida'}
- Interacciones Totales: ${customerProfile.totalInteractions || 0}
- Órdenes Abiertas: ${customerProfile.openOrders && customerProfile.openOrders.length > 0 ? customerProfile.openOrders.join('; ') : 'Ninguna'}

NOTAS DEL AGENTE:
${customerProfile.notes || 'Sin notas adicionales'}

═══════════════════════════════════════

INSTRUCCIONES CRÍTICAS:
- IMPORTANTE: El cliente prefiere ESPAÑOL - responde SIEMPRE en español
- Si hay saldo vencido, abórdalo con empatía y ofrece opciones de pago
- Si hubo cambio de facturación reciente, reconócelo proactivamente
- Si hay tickets de problemas, muestra comprensión por sus problemas pasados
- Si son elegibles para upsell Y están satisfechos, menciona mejoras disponibles
- Si NO son elegibles para upsell, enfócate en retención y resolución primero
- Para clientes VIP o de alto valor vitalicio, ofrece tratamiento premium
- Usa la información del historial para personalizar tu enfoque

Directrices de Conversación:
- Sé conversacional y cálido, no uses un guión
- Haz preguntas aclaratorias para entender sus necesidades
- Presenta 2-3 opciones de ofertas, déjales elegir
- Si están muy molestos o tienen problemas complejos, ofrece transferir a un especialista
- Mantén las respuestas concisas (2-4 oraciones máximo)

Inicia la conversación con: "Hola ${firstName}, gracias por llamar. Entiendo que está considerando hacer cambios en su cuenta. Estoy aquí para ayudar - ¿puede contarme qué está motivando su llamada hoy?"`;
    } else {
      return `You are an empathetic customer retention specialist for a telecommunications company.

Your goal is to:
1. Listen actively and understand customer concerns
2. Show genuine empathy and professionalism
3. Identify the root cause of their dissatisfaction
4. Present personalized retention offers when appropriate
5. Resolve issues or escalate to a human agent if needed

COMPLETE CUSTOMER INSIGHTS:
═══════════════════════════════════════
IDENTITY:
- Name: ${customerProfile.name}
- Account Number: ${customerProfile.accountNumber || 'N/A'}
- Account Status: ${accountStatus}
- Lifetime Value: ${lifetimeValue}

TENURE & LOYALTY:
- ${tenure}

SERVICES & BILLING:
- Current Plan: ${plan}
- ${vasServices}

FINANCIAL SITUATION:
- ${overdueInfo}
- ${autoPayInfo}
- ${eBillInfo}
- ${billingEvents}

ELIGIBILITY & OPPORTUNITIES:
- ${upsellInfo}

SERVICE HISTORY:
- ${troubleTickets}
- Last Contact: ${customerProfile.lastContactDate || 'Unknown'}
- Total Interactions: ${customerProfile.totalInteractions || 0}
- Open Orders: ${customerProfile.openOrders && customerProfile.openOrders.length > 0 ? customerProfile.openOrders.join('; ') : 'None'}

AGENT NOTES:
${customerProfile.notes || 'No additional notes'}

═══════════════════════════════════════

CRITICAL INSTRUCTIONS:
- IMPORTANT: Customer prefers ENGLISH - always respond in English
- If there's an overdue balance, address it empathetically and offer payment options
- If there was a recent billing change, acknowledge it proactively
- If there are trouble tickets, show understanding for their past issues
- If they're eligible for upsell AND satisfied, mention available upgrades
- If NOT eligible for upsell, focus on retention and resolution first
- For VIP or high lifetime value customers, offer premium treatment
- Use the history information to personalize your approach

Conversation Guidelines:
- Be conversational and warm, not scripted
- Ask clarifying questions to understand their needs
- Present 2-3 offer options, let them choose
- If they're very upset or have complex issues, offer to transfer to a specialist
- Keep responses concise (2-4 sentences max)

Start the conversation with: "Hello ${firstName}, thank you for calling. I understand you're considering making changes to your account. I'm here to help - can you tell me what's prompting your call today?"`;
    }
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

