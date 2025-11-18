# Movers Retention Flow Documentation

## 🏠 Overview

The **Movers Retention Flow** is a specialized conversation pathway designed to retain customers who are canceling service due to relocation. When the AI agent detects that a customer is moving, it automatically:

1. ✅ Asks for the new address
2. ✅ Verifies and confirms the address with the customer
3. ✅ Checks service availability in the new location
4. ✅ If available (FL, TX, CA), presents an attractive **1 Gig Movers Offer**
5. ✅ Emphasizes convenience of keeping the same provider

---

## 🎯 Purpose

**Primary Goal:** Convert cancellation attempts into service transfers when customers are moving to serviceable areas.

**Key Benefits:**
- 💰 Reduces churn from relocations
- 🎁 Creates upsell opportunity (1 Gig vs. current plan)
- 🤝 Maintains customer relationship
- ⚡ Provides seamless transition experience

---

## 🔄 Flow Diagram

```
Customer mentions moving
         ↓
Express empathy & ask for new address
         ↓
Customer provides address
         ↓
Verify & repeat address back
         ↓
Customer confirms address
         ↓
Check if state is FL, TX, or CA
         ↓
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    ↓         ↓
Great news!  Express regret
Service      Help with
available!   cancellation
    ↓
Present 1 Gig Movers Offer
    ↓
Highlight benefits & pricing
    ↓
Gauge interest
    ↓
Collect move date & schedule
```

---

## 📋 Detailed Steps

### **STEP 1: Detect Move Intent**

**Trigger Keywords:**
- "moving"
- "relocating"
- "new address"
- "new place"
- "different location"
- "I'm moving to..."

**Example Customer Statements:**
- "I need to cancel because I'm moving to another state"
- "We're relocating to Texas next month"
- "I'm moving and won't need service anymore"

---

### **STEP 2: Express Empathy & Ask for New Address**

**Agent Response (English):**
```
"I completely understand - moving can be such a big change! 
We might actually be able to help you keep your service at 
your new location. May I ask where you're moving to? 
What's the new address?"
```

**Agent Response (Spanish):**
```
"¡Entiendo completamente - mudarse es un gran cambio! 
Es posible que podamos ayudarte a mantener tu servicio 
en tu nueva ubicación. ¿Puedo preguntarte a dónde te mudas? 
¿Cuál es la nueva dirección?"
```

**Key Elements:**
- ✅ Validates customer's situation with empathy
- ✅ Creates hope ("we might be able to help")
- ✅ Politely asks for the new address

---

### **STEP 3: Verify & Repeat Address**

**Purpose:** Ensure accuracy and show attentiveness

**Agent Response (English):**
```
"Perfect, let me make sure I have this right. You're moving to 
[repeat full address including street, city, and state]. 
Is that correct?"
```

**Agent Response (Spanish):**
```
"Perfecto, déjame asegurarme de que tengo esto bien. 
Te estás mudando a [repetir dirección completa incluyendo 
calle, ciudad y estado]. ¿Es correcto?"
```

**Example:**
```
Customer: "I'm moving to 123 Oak Street, Miami, Florida 33101"
Agent: "Perfect, let me make sure I have this right. You're 
       moving to 123 Oak Street, Miami, Florida 33101. 
       Is that correct?"
Customer: "Yes, that's right."
```

---

### **STEP 4: Check Service Availability**

**Service Areas (Current Demo):**
- ✅ **Florida (FL)** - Full fiber service available
- ✅ **Texas (TX)** - Full fiber service available
- ✅ **California (CA)** - Full fiber service available
- ❌ **Other States** - Not currently serviced

**Logic:**
```
IF state === 'FL' OR state === 'TX' OR state === 'CA'
  THEN proceed to STEP 5 (Offer Service)
ELSE
  Express regret and assist with cancellation
END IF
```

---

### **STEP 5: Great News - We Serve That Area!**

**Agent Response (English):**
```
"You know what? That's fantastic news! We actually provide 
service in [state name], so you can keep your Frontier 
service at your new place!"
```

**Agent Response (Spanish):**
```
"¿Sabes qué? ¡Esas son noticias fantásticas! De hecho 
proporcionamos servicio en [nombre del estado], ¡así que 
puedes mantener tu servicio Frontier en tu nuevo lugar!"
```

**Delivery Tips:**
- 🎉 Be genuinely enthusiastic
- 💡 Create "aha moment" with "You know what?"
- ⚡ Emphasize continuity ("keep your service")

---

### **STEP 6: Present Movers Offer**

**Agent Script (English):**
```
"And here's even better news - we have an amazing movers 
offer just for customers like you! I can get you our 1 Gig 
high-speed fiber internet for a special promotional rate. 
That's lightning-fast speeds - perfect for setting up your 
new home."
```

**Agent Script (Spanish):**
```
"Y aquí hay noticias aún mejores - ¡tenemos una oferta 
increíble de mudanza solo para clientes como tú! Puedo darte 
nuestro internet de fibra de 1 Gig de alta velocidad a una 
tarifa promocional especial. Son velocidades ultra rápidas - 
perfectas para configurar tu nuevo hogar."
```

**Key Benefits to Highlight:**
- ✅ No need to switch providers (convenience)
- ✅ Keep existing account and billing (simplicity)
- ✅ Faster speeds than before (upgrade)
- ✅ Special movers pricing (value)
- ✅ Easy setup at new address (hassle-free)

---

### **STEP 7: Offer Details**

**Full Offer Breakdown:**

```
With our Movers Offer, you'll get:

📶 1 Gig Fiber Internet (1000 Mbps!)
   └─ Stream 4K, game, video call - all at once

💰 Special promotional pricing
   └─ Exclusive rate for relocating customers

🔧 Professional installation included
   └─ Expert setup, no DIY hassle

📅 Coordinated move schedule
   └─ We work around YOUR timeline

🚫 No early termination fees
   └─ Transferring service, not canceling
```

**Spanish Version:**
```
Con nuestra Oferta de Mudanza, obtendrás:

📶 Internet de Fibra de 1 Gig (¡1000 Mbps!)
   └─ Transmite en 4K, juega, videoconferencias - todo a la vez

💰 Precio promocional especial
   └─ Tarifa exclusiva para clientes en mudanza

🔧 Instalación profesional incluida
   └─ Configuración experta, sin complicaciones

📅 Programación de mudanza coordinada
   └─ Trabajamos según TU cronograma

🚫 Sin cargos por terminación anticipada
   └─ Transferencia de servicio, no cancelación
```

---

### **STEP 8: Gauge Interest & Next Steps**

**Agent Question (English):**
```
"How does that sound? Would you like me to set up the transfer 
and get you signed up for the 1 Gig service at your new address?"
```

**Agent Question (Spanish):**
```
"¿Qué te parece? ¿Te gustaría que configure la transferencia 
y te inscriba en el servicio de 1 Gig en tu nueva dirección?"
```

**If Customer is Interested:**
1. 📅 Collect move date
2. 🏠 Confirm new address again
3. 📞 Get contact number for installer
4. 🗓️ Schedule installation appointment
5. 📧 Confirm details via email

**If Customer Hesitates:**
- 💬 Ask what concerns they have
- 💰 Address pricing questions
- ⏰ Offer flexibility on timing
- 🎯 Re-emphasize convenience of not switching
- 📊 Compare to hassle of finding new provider

---

## 🎭 Example Conversation

### **Scenario:** Customer moving from Illinois to Florida

```
Customer: "I need to cancel my service. I'm moving to Florida 
          next month."

Agent: "I completely understand - moving can be such a big change! 
       We might actually be able to help you keep your service at 
       your new location. May I ask where you're moving to? 
       What's the new address?"

Customer: "Sure, it's 456 Palm Avenue, Tampa, Florida 33602"

Agent: "Perfect, let me make sure I have this right. You're moving 
       to 456 Palm Avenue, Tampa, Florida 33602. Is that correct?"

Customer: "Yes, that's right."

Agent: "You know what? That's fantastic news! We actually provide 
       service in Florida, so you can keep your Frontier service at 
       your new place! And here's even better news - we have an 
       amazing movers offer just for customers like you! I can get 
       you our 1 Gig high-speed fiber internet for a special 
       promotional rate. That's lightning-fast speeds - perfect for 
       setting up your new home.
       
       With our Movers Offer, you'll get 1 Gig Fiber Internet - 
       that's 1000 Mbps! - with special promotional pricing, 
       professional installation included, and we'll coordinate the 
       move with you. Plus, there are no early termination fees for 
       transferring service.
       
       How does that sound? Would you like me to set up the transfer 
       and get you signed up for the 1 Gig service at your new address?"

Customer: "That sounds great! What's the pricing?"

Agent: "I'm so glad you're interested! The promotional pricing is 
       designed specifically for movers like you, and you'll get 
       significantly faster speeds than most standard plans. When 
       would you like to have the service installed at your new home?"
```

---

## 🌍 Service Availability

### **Currently Serviced States (Demo):**

| State | Available | Notes |
|-------|-----------|-------|
| 🌴 **Florida** | ✅ Yes | Full fiber coverage |
| 🤠 **Texas** | ✅ Yes | Full fiber coverage |
| 🌞 **California** | ✅ Yes | Full fiber coverage |
| 🗺️ **Others** | ❌ No | Polite cancellation assistance |

### **Response for Non-Serviced Areas:**

**Agent Script (English):**
```
"I really appreciate you checking with me. Unfortunately, we 
don't currently provide service in [state name], but I want to 
make sure your transition is as smooth as possible. Let me help 
you with the cancellation process and ensure there are no final 
billing surprises."
```

**Agent Script (Spanish):**
```
"Realmente aprecio que verificaras conmigo. Desafortunadamente, 
actualmente no proporcionamos servicio en [nombre del estado], 
pero quiero asegurarme de que tu transición sea lo más suave 
posible. Déjame ayudarte con el proceso de cancelación y 
asegurarme de que no haya sorpresas de facturación final."
```

---

## 💡 Best Practices

### **DO:**
- ✅ Express genuine empathy for the customer's move
- ✅ Be enthusiastic when service IS available
- ✅ Verify the address carefully (repeat it back)
- ✅ Frame as "keeping" service, not getting "new" service
- ✅ Emphasize convenience of not switching providers
- ✅ Make the movers offer sound exclusive and special
- ✅ Address concerns about pricing and installation
- ✅ Coordinate move date and installation schedule

### **DON'T:**
- ❌ Rush through the address verification
- ❌ Sound scripted or mechanical
- ❌ Pressure if customer is hesitant
- ❌ Dismiss concerns about the new location
- ❌ Forget to confirm final details
- ❌ Be disappointed if area isn't serviced
- ❌ Miss the opportunity to create excitement

---

## 📊 Success Metrics

### **Key Performance Indicators:**

1. **Save Rate:** % of move-related cancellations converted to transfers
2. **Upsell Rate:** % of transfers that upgrade to 1 Gig
3. **Customer Satisfaction:** Post-move NPS score
4. **Installation Completion:** % of scheduled installs completed on time

### **Expected Outcomes:**

- 🎯 **Target Save Rate:** 60-70% for FL/TX/CA moves
- 📈 **Upsell Success:** 80%+ take 1 Gig offer
- 😊 **Customer Delight:** High satisfaction from seamless transition
- 💰 **Revenue Retention:** Save $50-80/month per customer

---

## 🛠️ Technical Implementation

### **Location:** `backend/services/conversation-manager.js`

### **System Prompt Section:**
- Lines 371-432 (English version)
- Lines 218-279 (Spanish version)

### **How It Works:**

1. **AI Detection:** LLM detects move-related keywords in customer message
2. **Flow Activation:** Triggers specialized movers retention logic
3. **Address Collection:** AI asks for and verifies new address
4. **State Check:** Compares state against FL, TX, CA list
5. **Offer Presentation:** Delivers scripted movers offer with enthusiasm
6. **Next Steps:** Collects move date and schedules installation

---

## 🧪 Testing the Flow

### **Test Scenarios:**

#### **Scenario 1: Move to Florida (Success)**
```
Test Input: "I need to cancel because I'm moving to Miami, Florida"
Expected: Agent asks for address, verifies service availability, 
          presents 1 Gig movers offer
```

#### **Scenario 2: Move to Texas (Success)**
```
Test Input: "We're relocating to Austin, Texas next month"
Expected: Agent expresses empathy, asks for address, confirms 
          it's serviceable, makes movers offer
```

#### **Scenario 3: Move to California (Success)**
```
Test Input: "I'm moving to San Diego, California"
Expected: Agent gets excited, verifies address, presents 
          exclusive movers deal
```

#### **Scenario 4: Move to Non-Serviced State**
```
Test Input: "I'm moving to New York"
Expected: Agent politely explains service unavailability, 
          offers to help with smooth cancellation
```

---

## 📞 Customer Service Tips

### **Handling Common Objections:**

**"What's the pricing?"**
```
Response: "The promotional pricing is designed specifically for 
movers like you. You'll get 1 Gig speeds at a special rate that's 
competitive with anything you'd find in [state]. Plus, professional 
installation is included, so there's no DIY hassle!"
```

**"I'm not sure about my exact move date yet"**
```
Response: "No problem at all! We can schedule the installation for 
a flexible date, and if things change, we can easily adjust. What's 
your approximate timeline? We'll work around you!"
```

**"How long does installation take?"**
```
Response: "Professional installation typically takes 2-3 hours. Our 
tech will set everything up, test it to make sure it's perfect, and 
walk you through everything. You'll be streaming in no time!"
```

**"Can I keep my current pricing?"**
```
Response: "The movers offer actually gives you significantly faster 
speeds - we're talking 1 Gig fiber! - at a promotional rate. It's 
designed to give you more value while making your move easier. 
Let me share the details..."
```

---

## 🚀 Quick Start

### **For Agents:**
1. Listen for move-related keywords
2. Express empathy immediately
3. Ask for new address
4. Verify address by repeating it back
5. Check if FL, TX, or CA
6. Get excited if available!
7. Present 1 Gig movers offer
8. Schedule installation

### **For Developers:**
- Location: `backend/services/conversation-manager.js`
- Lines: 371-432 (English), 218-279 (Spanish)
- Keywords: moving, relocating, new address
- States: FL, TX, CA

---

## 📚 Related Documentation

- [Conversation Manager](./backend/services/conversation-manager.js)
- [Customer Insights](./ENHANCED_CUSTOMER_PROFILES.md)
- [Spanish Language Support](./SPANISH_LANGUAGE_SUPPORT.md)
- [Authentication Flow](./README.md#authentication)

---

## 🎉 Success Story Example

```
Customer: Sarah Johnson (FTR-200456)
Situation: Moving from Illinois to Tampa, FL
Outcome: Retained + Upgraded

Before: 500 Mbps @ $54.99/month
After: 1 Gig @ promotional rate
Result: Happy customer, saved churn, increased revenue

Sarah's Feedback: "I was going to cancel, but when I found out 
you serve Tampa AND could upgrade me, it was a no-brainer! 
The install was seamless too!"
```

---

**Last Updated:** 2025-01-18  
**Version:** 1.0  
**Contact:** Frontier Retention Team

