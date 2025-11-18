// Global state
let currentSession = null;
let currentCustomer = null;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let recordingTimerInterval = null;

// Transcription settings
let transcriptionMethod = 'webspeech'; // 'webspeech' or 'backend'
let speechRecognition = null;
let recognitionSupported = false;

// Customer search state
let allCustomers = [];
let filteredCustomers = [];
let selectedSearchIndex = -1;

// API helper function
function getApiUrl(endpoint) {
    const apiUrl = window.APP_CONFIG?.API_URL || 'http://localhost:3001';
    return `${apiUrl}${endpoint}`;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    console.log('AI Voice Retention Agent - Initializing...');
    
    await loadCustomerScenarios();
    setupEventListeners();
    initializeTranscription();
    checkBrowserSupport();
});

/**
 * Load customer scenarios from API
 */
async function loadCustomerScenarios() {
    try {
        // Load scenarios for dropdown
        const scenariosResponse = await fetch(getApiUrl('/api/customer/scenarios/list'));
        const scenariosData = await scenariosResponse.json();
        
        if (scenariosData.success) {
            populateCustomerSelect(scenariosData.scenarios);
        }
        
        // Load all customers for search
        const customersResponse = await fetch(getApiUrl('/api/customer/list'));
        const customersData = await customersResponse.json();
        
        if (customersData.success) {
            allCustomers = customersData.customers;
            console.log(`Loaded ${allCustomers.length} customers for search`);
        }
    } catch (error) {
        console.error('Failed to load scenarios:', error);
        showError('Failed to load demo scenarios');
    }
}

/**
 * Populate customer select dropdown
 */
function populateCustomerSelect(scenarios) {
    const select = document.getElementById('customerSelect');
    
    scenarios.forEach(scenario => {
        const option = document.createElement('option');
        option.value = scenario.id;
        option.textContent = `${scenario.icon} ${scenario.name} - ${scenario.scenario}`;
        select.appendChild(option);
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    document.getElementById('customerSelect').addEventListener('change', handleCustomerSelect);
    document.getElementById('startCallBtn').addEventListener('click', startCall);
    document.getElementById('endCallBtn').addEventListener('click', endCall);
    document.getElementById('transferBtn').addEventListener('click', transferToAgent);
    
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('voiceBtn').addEventListener('click', toggleVoiceRecording);
    document.getElementById('transcriptionMethod').addEventListener('change', handleTranscriptionMethodChange);
    
    // Customer search event listeners
    const searchInput = document.getElementById('customerSearch');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleSearchKeydown);
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            searchResults.style.display = 'block';
        }
    });
    
    clearSearchBtn.addEventListener('click', clearSearch);
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

/**
 * Initialize transcription method
 */
function initializeTranscription() {
    // Check if Web Speech API is supported
    recognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    // Load saved preference
    const savedMethod = localStorage.getItem('transcriptionMethod');
    if (savedMethod && (savedMethod === 'webspeech' || savedMethod === 'backend')) {
        transcriptionMethod = savedMethod;
    }
    
    // If Web Speech not supported, force backend method
    if (!recognitionSupported && transcriptionMethod === 'webspeech') {
        console.warn('[Transcription] Web Speech API not supported, using backend method');
        transcriptionMethod = 'backend';
    }
    
    // Update UI
    const select = document.getElementById('transcriptionMethod');
    if (select) {
        select.value = transcriptionMethod;
        
        // Disable Web Speech option if not supported
        if (!recognitionSupported) {
            const option = select.querySelector('option[value="webspeech"]');
            if (option) {
                option.disabled = true;
                option.textContent += ' (Not Supported)';
            }
        }
    }
    
    // Update voice button text
    updateVoiceButtonText();
    
    console.log(`[Transcription] Method: ${transcriptionMethod}, Web Speech Supported: ${recognitionSupported}`);
}

/**
 * Handle transcription method change
 */
function handleTranscriptionMethodChange(e) {
    const newMethod = e.target.value;
    transcriptionMethod = newMethod;
    localStorage.setItem('transcriptionMethod', newMethod);
    console.log(`[Transcription] Switched to: ${newMethod}`);
    
    // Update voice button text
    updateVoiceButtonText();
}

/**
 * Update voice button text based on method
 */
function updateVoiceButtonText() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (transcriptionMethod === 'webspeech') {
        voiceBtn.title = 'Click to speak (Web Speech API - Free & Fast)';
    } else {
        voiceBtn.title = 'Hold to record audio (Backend Transcription)';
    }
}

/**
 * Handle customer selection
 */
async function handleCustomerSelect(e) {
    const customerId = e.target.value;
    
    if (!customerId) {
        document.getElementById('startCallBtn').disabled = true;
        document.getElementById('customerInfo').style.display = 'none';
        return;
    }
    
    try {
        const response = await fetch(getApiUrl(`/api/customer/${customerId}`));
        const data = await response.json();
        
        if (data.success) {
            currentCustomer = data.customer;
            displayCustomerInfo(currentCustomer);
            document.getElementById('startCallBtn').disabled = false;
        }
    } catch (error) {
        console.error('Failed to load customer:', error);
        showError('Failed to load customer data');
    }
}

/**
 * Display customer information
 */
function displayCustomerInfo(customer) {
    const customerInfoDiv = document.getElementById('customerInfo');
    
    // Build comprehensive customer profile HTML
    let html = `
        <!-- Section 1: Account Overview -->
        <div class="info-section">
            <h3 class="section-header">📋 Account Overview</h3>
            <div class="info-grid">
                <div class="info-item">
                    <label>Customer Name</label>
                    <span class="info-value">${customer.firstName} ${customer.lastName}</span>
                </div>
                <div class="info-item">
                    <label>Account Number</label>
                    <span class="info-value">${customer.accountNumber}</span>
                </div>
                <div class="info-item full-width">
                    <label>Service Address</label>
                    <span class="info-value">${customer.serviceAddress}</span>
                </div>
                <div class="info-item">
                    <label>Customer Scope</label>
                    <span class="info-value">${customer.customerScope}</span>
                </div>
                <div class="info-item">
                    <label>Core Services</label>
                    <span class="info-value">${customer.coreServices.join(', ')}</span>
                </div>
            </div>
        </div>

        <!-- Section 2: Service & Billing -->
        <div class="info-section">
            <h3 class="section-header">💳 Service & Billing</h3>
            <div class="info-grid">
                <div class="info-item">
                    <label>Current Plan</label>
                    <span class="info-value">${customer.currentPlanDetails.name}</span>
                </div>
                <div class="info-item">
                    <label>Monthly Bill</label>
                    <span class="info-value price">$${customer.currentPlanDetails.price.toFixed(2)}</span>
                </div>
                <div class="info-item full-width">
                    <label>Value Added Services (VAS)</label>
                    <div class="vas-badges">
                        ${customer.vasServices.map(vas => `<span class="badge badge-vas">${vas}</span>`).join(' ')}
                    </div>
                </div>
                ${customer.overdueBalance ? `
                <div class="info-item full-width">
                    <label>⚠️ Overdue Balance</label>
                    <div class="overdue-warning">
                        <span class="overdue-amount">$${customer.overdueBalance.amount.toFixed(2)}</span>
                        <span class="overdue-aging">${customer.overdueBalance.aging}</span>
                        <div class="overdue-message">${customer.overdueBalance.message}</div>
                    </div>
                </div>
                ` : ''}
                <div class="info-item">
                    <label>AutoPay Status</label>
                    <span class="badge ${customer.autoPayStatus.enrolled ? 'badge-success' : 'badge-warning'}">
                        ${customer.autoPayStatus.enrolled ? '✓ Enrolled' : '✗ Not Enrolled'}
                    </span>
                    <div class="info-note">${customer.autoPayStatus.message}</div>
                </div>
                <div class="info-item">
                    <label>E-Bill Status</label>
                    <span class="badge ${customer.eBillStatus.enrolled ? 'badge-success' : 'badge-warning'}">
                        ${customer.eBillStatus.enrolled ? '✓ Enrolled' : '✗ Not Enrolled'}
                    </span>
                    <div class="info-note">${customer.eBillStatus.message}</div>
                </div>
                ${customer.recentBillingEvents ? `
                <div class="info-item full-width">
                    <label>Recent Billing Events</label>
                    <div class="billing-events ${customer.recentBillingEvents.hasChanges ? 'has-changes' : 'no-changes'}">
                        ${customer.recentBillingEvents.hasChanges && customer.recentBillingEvents.changeType === 'increase' ? 
                            `<span class="billing-icon">📈</span>` : 
                            `<span class="billing-icon">✅</span>`
                        }
                        <span class="billing-message">${customer.recentBillingEvents.message}</span>
                        ${customer.recentBillingEvents.changeAmount > 0 ? 
                            `<span class="billing-amount ${customer.recentBillingEvents.changeType === 'increase' ? 'increase' : 'decrease'}">
                                ${customer.recentBillingEvents.changeType === 'increase' ? '+' : '-'}$${customer.recentBillingEvents.changeAmount.toFixed(2)}
                            </span>` : ''
                        }
                    </div>
                </div>
                ` : ''}
            </div>
        </div>

        <!-- Section 3: Account Health -->
        <div class="info-section">
            <h3 class="section-header">💪 Account Health</h3>
            <div class="info-grid">
                <div class="info-item">
                    <label>Customer Tenure</label>
                    <span class="info-value">${customer.customerTenure.years} year${customer.customerTenure.years !== 1 ? 's' : ''} ${customer.customerTenure.months} month${customer.customerTenure.months !== 1 ? 's' : ''}</span>
                    <div class="info-note tenure-note">${customer.customerTenure.message}</div>
                </div>
                <div class="info-item">
                    <label>Lifetime Value</label>
                    <span class="info-value price">$${customer.lifetimeValue.toFixed(2)}</span>
                </div>
                <div class="info-item">
                    <label>Account Status</label>
                    <span class="badge ${customer.accountStatus === 'vip' ? 'badge-vip' : 'badge-success'}">${customer.accountStatus.toUpperCase()}</span>
                </div>
                <div class="info-item">
                    <label>Payment History</label>
                    <span class="badge ${
                        customer.paymentHistory === 'excellent' ? 'badge-success' :
                        customer.paymentHistory === 'good' ? 'badge-info' :
                        'badge-warning'
                    }">${customer.paymentHistory.toUpperCase()}</span>
                </div>
                <div class="info-item full-width">
                    <label>Upsell Eligibility</label>
                    <span class="badge ${customer.upsellEligibility.eligible ? 'badge-success' : 'badge-danger'}">
                        ${customer.upsellEligibility.eligible ? '✓ Eligible' : '✗ Not Eligible'}
                    </span>
                    <div class="info-note">${customer.upsellEligibility.reason}</div>
                </div>
            </div>
        </div>

        <!-- Section 4: Recent Activity -->
        <div class="info-section">
            <h3 class="section-header">📊 Recent Activity</h3>
            <div class="info-grid">
                <div class="info-item">
                    <label>Trouble Tickets</label>
                    <span class="badge ${customer.recentTroubleTickets.count === 0 ? 'badge-success' : 'badge-warning'}">
                        ${customer.recentTroubleTickets.count} Ticket${customer.recentTroubleTickets.count !== 1 ? 's' : ''}
                    </span>
                    <div class="info-note">${customer.recentTroubleTickets.message}</div>
                </div>
                <div class="info-item">
                    <label>Last Contact</label>
                    <span class="info-value">${formatDate(customer.lastContactDate)}</span>
                </div>
                <div class="info-item">
                    <label>Total Interactions</label>
                    <span class="info-value">${customer.totalInteractions}</span>
                </div>
                <div class="info-item">
                    <label>Preferred Language</label>
                    <span class="badge badge-info">${customer.preferredLanguage}</span>
                </div>
                ${customer.openOrders.length > 0 ? `
                <div class="info-item full-width">
                    <label>Open Orders</label>
                    <ul class="open-orders-list">
                        ${customer.openOrders.map(order => `<li>${order}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    customerInfoDiv.innerHTML = html;
    customerInfoDiv.style.display = 'block';
}

/**
 * Format date string to readable format
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Start a new call
 */
async function startCall() {
    if (!currentCustomer) {
        showError('Please select a customer first');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(getApiUrl('/api/conversation/start'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerId: currentCustomer.customerId,
                customerProfile: currentCustomer
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentSession = data.sessionId;
            
            document.getElementById('callStatus').classList.add('active');
            document.getElementById('callStatusText').textContent = 'Call Active';
            document.getElementById('startCallBtn').disabled = true;
            document.getElementById('endCallBtn').disabled = false;
            document.getElementById('transferBtn').disabled = false;
            document.getElementById('messageInput').disabled = false;
            document.getElementById('sendBtn').disabled = false;
            
            document.getElementById('conversationArea').innerHTML = '';
            document.getElementById('inputArea').style.display = 'block';
            document.getElementById('conversationState').style.display = 'block';
            
            addMessage('agent', data.greeting);
            speak(data.greeting, currentCustomer.preferredLanguage);
        }
    } catch (error) {
        console.error('Failed to start call:', error);
        showError('Failed to start call');
    } finally {
        showLoading(false);
    }
}

/**
 * End the current call
 */
async function endCall() {
    if (!currentSession) return;
    
    try {
        await fetch(getApiUrl(`/api/conversation/${currentSession}/end`), {
            method: 'POST'
        });
        
        resetUI();
        showSuccess('Call ended successfully');
    } catch (error) {
        console.error('Failed to end call:', error);
    }
}

/**
 * Send a message
 */
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || !currentSession) return;
    
    addMessage('user', message);
    input.value = '';
    
    const typingId = showTypingIndicator();
    
    try {
        const response = await fetch(getApiUrl('/api/conversation/message'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: currentSession,
                message: message
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            removeTypingIndicator(typingId);
            addMessage('agent', data.response.message);
            updateConversationState(data.response);
            speak(data.response.message, data.response.language);
        }
    } catch (error) {
        removeTypingIndicator(typingId);
        console.error('Failed to send message:', error);
        showError('Failed to send message');
    }
}

/**
 * Toggle voice recording
 */
async function toggleVoiceRecording() {
    if (transcriptionMethod === 'webspeech') {
        await toggleWebSpeechRecognition();
    } else {
        if (isRecording) {
            stopRecording();
        } else {
            await startRecording();
        }
    }
}

/**
 * Toggle Web Speech Recognition
 */
async function toggleWebSpeechRecognition() {
    if (isRecording) {
        stopWebSpeechRecognition();
    } else {
        await startWebSpeechRecognition();
    }
}

/**
 * Start Web Speech Recognition
 */
async function startWebSpeechRecognition() {
    try {
        // Check if Web Speech API is available
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            throw new Error('Web Speech API not supported in this browser');
        }
        
        // Request microphone permission first
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop immediately, just checking permission
            console.log('[Web Speech] Microphone permission granted');
        } catch (permError) {
            console.error('[Web Speech] Microphone permission denied:', permError);
            showError('Microphone access denied. Please allow microphone access and try again.');
            return;
        }
        
        speechRecognition = new SpeechRecognition();
        
        // Configure recognition
        speechRecognition.continuous = true; // Keep listening
        speechRecognition.interimResults = true; // Show interim results
        speechRecognition.lang = 'en-US'; // Default to English
        speechRecognition.maxAlternatives = 1;
        
        // These settings help with detection
        if (speechRecognition.interimResults !== undefined) {
            speechRecognition.interimResults = true;
        }
        
        // Handle results
        let fullTranscript = '';
        speechRecognition.onresult = (event) => {
            // Build full transcript from all results
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = 0; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Combine final and interim
            const displayTranscript = (finalTranscript + interimTranscript).trim();
            
            console.log(`[Web Speech] Transcript: "${displayTranscript}"`);
            
            // Update voice status and input field in real-time
            const statusText = document.getElementById('recordingText');
            if (statusText) {
                statusText.textContent = `Listening... "${displayTranscript}"`;
            }
            
            // Update input field in real-time
            document.getElementById('messageInput').value = displayTranscript;
            
            // Keep the full final transcript
            if (finalTranscript) {
                fullTranscript = finalTranscript.trim();
                console.log(`[Web Speech] ✓ Final so far: "${fullTranscript}"`);
            }
        };
        
        // Handle errors
        speechRecognition.onerror = (event) => {
            console.error('[Web Speech] Error:', event.error, event);
            
            // Don't stop for "no-speech" error - it's normal when user pauses
            if (event.error === 'no-speech') {
                console.log('[Web Speech] No speech detected, still listening...');
                return; // Keep listening
            }
            
            // Stop for other errors
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                showError('Microphone access denied. Please allow microphone access.');
                stopWebSpeechRecognition();
            } else if (event.error === 'network') {
                showError('Network error. Please check your internet connection.');
                stopWebSpeechRecognition();
            } else {
                console.error('[Web Speech] Error:', event.error);
                // Don't show error for aborted - that's intentional
                if (event.error !== 'aborted') {
                    showError(`Speech recognition error: ${event.error}`);
                }
                stopWebSpeechRecognition();
            }
        };
        
        // Handle end - auto-restart if needed
        speechRecognition.onend = () => {
            console.log('[Web Speech] Recognition ended');
            
            // If user is still "recording" (button still active), restart
            if (isRecording) {
                console.log('[Web Speech] Auto-restarting recognition...');
                try {
                    speechRecognition.start();
                } catch (error) {
                    console.error('[Web Speech] Failed to restart:', error);
                    stopWebSpeechRecognition();
                }
            }
        };
        
        // Handle start
        speechRecognition.onstart = () => {
            console.log('[Web Speech] Recognition started successfully');
        };
        
        // Handle audio start (when actually hearing audio)
        speechRecognition.onaudiostart = () => {
            console.log('[Web Speech] Audio capture started');
        };
        
        // Handle sound start (when detecting sound)
        speechRecognition.onsoundstart = () => {
            console.log('[Web Speech] Sound detected');
        };
        
        // Handle speech start (when detecting speech)
        speechRecognition.onspeechstart = () => {
            console.log('[Web Speech] Speech detected!');
        };
        
        // Start recognition
        speechRecognition.start();
        isRecording = true;
        
        document.getElementById('voiceBtn').classList.add('recording');
        document.getElementById('voiceStatus').style.display = 'flex';
        const statusText = document.getElementById('recordingText');
        if (statusText) {
            statusText.innerHTML = '🎤 Listening... <strong>Speak now!</strong> (Click mic to stop)';
        }
        
        console.log('[Web Speech] Initialization complete, waiting for recognition to start...');
    } catch (error) {
        console.error('[Web Speech] Failed to start:', error);
        showError('Speech recognition not available. Please use backend transcription.');
    }
}

/**
 * Stop Web Speech Recognition
 */
function stopWebSpeechRecognition() {
    if (speechRecognition) {
        speechRecognition.stop();
        speechRecognition = null;
    }
    
    isRecording = false;
    document.getElementById('voiceBtn').classList.remove('recording');
    document.getElementById('voiceStatus').style.display = 'none';
}

/**
 * Start voice recording
 */
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Try to use WAV format if supported, otherwise fall back to WebM
        let mimeType = 'audio/webm'; // default fallback
        const supportedTypes = [
            'audio/wav',
            'audio/mpeg', // MP3
            'audio/mp4',
            'audio/webm;codecs=opus',
            'audio/webm'
        ];
        
        for (const type of supportedTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
                mimeType = type;
                console.log(`[Recording] Using MIME type: ${mimeType}`);
                break;
            }
        }
        
        mediaRecorder = new MediaRecorder(stream, { mimeType });
        audioChunks = [];
        console.log(`[Recording] Recording with format: ${mimeType}`);
        
        const recordingStartTime = Date.now();
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                console.log(`[Recording] Chunk received: ${event.data.size} bytes`);
                audioChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = async () => {
            const recordingDuration = Date.now() - recordingStartTime;
            console.log(`[Recording] Stopped. Duration: ${recordingDuration}ms, Chunks: ${audioChunks.length}`);
            
            // Clear the timer
            if (recordingTimerInterval) {
                clearInterval(recordingTimerInterval);
                recordingTimerInterval = null;
            }
            
            if (recordingDuration < 500) {
                showError('Recording too short. Please hold the button for at least 1 second.');
                stream.getTracks().forEach(track => track.stop());
                return;
            }
            
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            console.log(`[Recording] Final blob size: ${audioBlob.size} bytes`);
            
            if (audioBlob.size < 1000) {
                showError('Recording failed - no audio data captured. Please try again.');
                stream.getTracks().forEach(track => track.stop());
                return;
            }
            
            await transcribeAudio(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        };
        
        // Start recording with timeslice to ensure data is captured
        mediaRecorder.start(100); // Capture chunks every 100ms
        isRecording = true;
        
        document.getElementById('voiceBtn').classList.add('recording');
        document.getElementById('voiceStatus').style.display = 'flex';
        
        // Start recording timer
        const timerElement = document.getElementById('recordingTimer');
        recordingTimerInterval = setInterval(() => {
            const elapsed = ((Date.now() - recordingStartTime) / 1000).toFixed(1);
            timerElement.textContent = `${elapsed}s`;
        }, 100);
        
        console.log('[Recording] Started with timeslice=100ms');
    } catch (error) {
        console.error('Failed to start recording:', error);
        showError('Microphone access denied or unavailable');
    }
}

/**
 * Stop voice recording
 */
function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        // Clear the recording timer
        if (recordingTimerInterval) {
            clearInterval(recordingTimerInterval);
            recordingTimerInterval = null;
        }
        
        document.getElementById('voiceBtn').classList.remove('recording');
        document.getElementById('voiceStatus').style.display = 'none';
        document.getElementById('recordingTimer').textContent = '0.0s';
    }
}

/**
 * Transcribe audio using Whisper
 */
async function transcribeAudio(audioBlob) {
    showLoading(true, 'Transcribing audio...');
    
    try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('sessionId', currentSession);
        formData.append('language', currentCustomer.preferredLanguage || 'auto');
        
        const response = await fetch(getApiUrl('/api/conversation/transcribe'), {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success && data.transcription.text) {
            document.getElementById('messageInput').value = data.transcription.text;
            await sendMessage();
        }
    } catch (error) {
        console.error('Failed to transcribe audio:', error);
        showError('Failed to transcribe audio');
    } finally {
        showLoading(false);
    }
}

/**
 * Transfer to human agent
 */
async function transferToAgent() {
    if (!currentSession) return;
    
    showLoading(true, 'Generating handoff summary...');
    
    try {
        const response = await fetch(getApiUrl(`/api/conversation/${currentSession}/transfer`), {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayTransferSummary(data.summary);
        }
    } catch (error) {
        console.error('Failed to generate transfer summary:', error);
        showError('Failed to generate transfer summary');
    } finally {
        showLoading(false);
    }
}

/**
 * Display transfer summary in modal
 */
function displayTransferSummary(summary) {
    const modalContent = `
        <div class="summary-item">
            <strong>Customer:</strong> ${summary.customer.name}<br>
            <strong>Account ID:</strong> ${summary.customer.customerId}<br>
            <strong>Monthly Bill:</strong> $${summary.customer.monthlyBill}<br>
            <strong>Tenure:</strong> ${summary.customer.tenure} months
        </div>
        
        <h3>Conversation Summary</h3>
        <div class="summary-item">
            <strong>Duration:</strong> ${summary.conversationSummary.duration}<br>
            <strong>Messages:</strong> ${summary.conversationSummary.messageCount}<br>
            <strong>Intent:</strong> ${summary.conversationSummary.intent || 'Unknown'}<br>
            <strong>Sentiment:</strong> ${summary.conversationSummary.sentiment}<br>
            <strong>Urgency:</strong> ${summary.conversationSummary.urgency}<br>
            <strong>Language:</strong> ${summary.conversationSummary.language}
        </div>
        
        <h3>Key Concerns</h3>
        <ul>
            ${summary.conversationSummary.keyConcerns.map(c => `<li>${c}</li>`).join('')}
        </ul>
        
        ${summary.offersPresented.length > 0 ? `
            <h3>Offers Presented</h3>
            <ul>
                ${summary.offersPresented.map(o => `<li>${o.description}</li>`).join('')}
            </ul>
        ` : ''}
        
        <h3>Recommendation</h3>
        <div class="summary-item">
            ${summary.recommendation}
        </div>
    `;
    
    document.getElementById('transferSummary').innerHTML = modalContent;
    document.getElementById('transferModal').style.display = 'flex';
}

/**
 * Close transfer modal
 */
function closeTransferModal() {
    document.getElementById('transferModal').style.display = 'none';
}

/**
 * Confirm transfer
 */
function confirmTransfer() {
    closeTransferModal();
    endCall();
    showSuccess('Call transferred to human agent successfully');
}

/**
 * Add message to conversation area
 */
function addMessage(role, content) {
    const conversationArea = document.getElementById('conversationArea');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-content">${content}</div>
        <div class="message-time">${timeStr}</div>
    `;
    
    conversationArea.appendChild(messageDiv);
    conversationArea.scrollTop = conversationArea.scrollHeight;
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const conversationArea = document.getElementById('conversationArea');
    const id = 'typing-' + Date.now();
    
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = 'message agent';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    conversationArea.appendChild(typingDiv);
    conversationArea.scrollTop = conversationArea.scrollHeight;
    
    return id;
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

/**
 * Update conversation state display
 */
function updateConversationState(response) {
    if (response.intent) {
        const intentBadge = document.getElementById('intentBadge');
        intentBadge.textContent = response.intent.replace(/_/g, ' ');
        intentBadge.className = 'badge badge-info';
    }
    
    if (response.sentiment) {
        const sentimentBadge = document.getElementById('sentimentBadge');
        const sentimentEmoji = {
            'positive': '😊',
            'neutral': '😐',
            'frustrated': '😟',
            'angry': '😠'
        };
        sentimentBadge.textContent = `${sentimentEmoji[response.sentiment] || ''} ${response.sentiment}`;
        
        const sentimentClass = {
            'positive': 'badge-success',
            'neutral': 'badge-neutral',
            'frustrated': 'badge-warning',
            'angry': 'badge-danger'
        };
        sentimentBadge.className = `badge ${sentimentClass[response.sentiment] || 'badge-neutral'}`;
    }
    
    if (response.urgency) {
        const urgencyBar = document.getElementById('urgencyBar');
        const urgencyText = document.getElementById('urgencyText');
        urgencyBar.style.width = `${response.urgency * 10}%`;
        urgencyText.textContent = `${response.urgency}/10`;
    }
    
    if (response.language) {
        document.getElementById('languageBadge').textContent = response.language;
    }
    
    if (response.offers && response.offers.length > 0) {
        displayOffers(response.offers);
    }
}

/**
 * Display retention offers
 */
function displayOffers(offers) {
    const offersPanel = document.getElementById('offersPanel');
    const offersList = document.getElementById('offersList');
    
    offersList.innerHTML = '';
    
    offers.forEach(offer => {
        const offerCard = document.createElement('div');
        offerCard.className = 'offer-card';
        offerCard.innerHTML = `
            <h4>${offer.type.replace(/_/g, ' ').toUpperCase()}</h4>
            <p>${offer.description}</p>
            <span class="offer-value">${offer.value} ${offer.duration ? `for ${offer.duration} month${offer.duration > 1 ? 's' : ''}` : ''}</span>
        `;
        offersList.appendChild(offerCard);
    });
    
    offersPanel.style.display = 'block';
}

/**
 * Text-to-Speech using browser API
 */
function speak(text, language = 'English') {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'Spanish' ? 'es-US' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
}

/**
 * Reset UI to initial state
 */
function resetUI() {
    currentSession = null;
    
    document.getElementById('callStatus').classList.remove('active');
    document.getElementById('callStatusText').textContent = 'No active call';
    document.getElementById('startCallBtn').disabled = false;
    document.getElementById('endCallBtn').disabled = true;
    document.getElementById('transferBtn').disabled = true;
    document.getElementById('messageInput').disabled = true;
    document.getElementById('sendBtn').disabled = true;
    
    document.getElementById('conversationArea').innerHTML = `
        <div class="welcome-message">
            <h2>Call Ended</h2>
            <p>Select another customer to start a new demo.</p>
        </div>
    `;
    
    document.getElementById('inputArea').style.display = 'none';
    document.getElementById('conversationState').style.display = 'none';
    document.getElementById('offersPanel').style.display = 'none';
    
    document.getElementById('intentBadge').textContent = '-';
    document.getElementById('intentBadge').className = 'badge badge-neutral';
    document.getElementById('sentimentBadge').textContent = '-';
    document.getElementById('sentimentBadge').className = 'badge badge-neutral';
    document.getElementById('urgencyBar').style.width = '0%';
    document.getElementById('urgencyText').textContent = '0/10';
    document.getElementById('languageBadge').textContent = '-';
}

/**
 * Show loading overlay
 */
function showLoading(show, message = 'Processing...') {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.querySelector('p').textContent = message;
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

/**
 * Show error message
 */
function showError(message) {
    alert('Error: ' + message);
}

/**
 * Show success message
 */
function showSuccess(message) {
    alert(message);
}

/**
 * Check browser support for required features
 */
function checkBrowserSupport() {
    const features = {
        mediaRecorder: !!window.MediaRecorder,
        speechSynthesis: !!window.speechSynthesis,
        getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    };
    
    console.log('Browser support:', features);
    
    if (!features.getUserMedia || !features.mediaRecorder) {
        console.warn('Voice recording not fully supported in this browser');
    }
    
    if (!features.speechSynthesis) {
        console.warn('Text-to-speech not supported in this browser');
    }
}

/**
 * Customer Search Functions
 */

/**
 * Handle search input with type-ahead
 */
function handleSearchInput(e) {
    const searchTerm = e.target.value.trim();
    const clearBtn = document.getElementById('clearSearchBtn');
    const searchResults = document.getElementById('searchResults');
    
    // Show/hide clear button
    clearBtn.style.display = searchTerm ? 'block' : 'none';
    
    if (!searchTerm) {
        searchResults.style.display = 'none';
        filteredCustomers = [];
        selectedSearchIndex = -1;
        return;
    }
    
    // Filter customers
    filteredCustomers = filterCustomers(searchTerm);
    
    // Display results
    displaySearchResults(filteredCustomers, searchTerm);
    searchResults.style.display = filteredCustomers.length > 0 ? 'block' : 'block'; // Always show to display "no results"
    selectedSearchIndex = -1; // Reset keyboard selection
}

/**
 * Filter customers by search term
 */
function filterCustomers(searchTerm) {
    const term = searchTerm.toLowerCase();
    
    return allCustomers.filter(customer => {
        const firstName = (customer.firstName || '').toLowerCase();
        const lastName = (customer.lastName || '').toLowerCase();
        const fullName = `${firstName} ${lastName}`;
        const accountNumber = (customer.accountNumber || '').toLowerCase();
        const email = (customer.email || '').toLowerCase();
        
        return fullName.includes(term) || 
               accountNumber.includes(term) || 
               email.includes(term);
    }).slice(0, 10); // Limit to 10 results
}

/**
 * Display search results with highlighting
 */
function displaySearchResults(customers, searchTerm) {
    const searchResults = document.getElementById('searchResults');
    
    if (customers.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No customers found</div>';
        return;
    }
    
    const resultsHTML = customers.map((customer, index) => {
        const fullName = `${customer.firstName} ${customer.lastName}`;
        const highlightedName = highlightMatch(fullName, searchTerm);
        const highlightedAccount = highlightMatch(customer.accountNumber, searchTerm);
        const plan = customer.currentPlanDetails?.name || customer.currentPlan || 'N/A';
        const bill = customer.currentPlanDetails?.price || customer.monthlyBill || 0;
        
        return `
            <div class="search-result-item" data-customer-id="${customer.customerId}" data-index="${index}">
                <div class="search-result-main">
                    <div class="search-result-name">${highlightedName}</div>
                    <div class="search-result-details">${plan}</div>
                </div>
                <div class="search-result-meta">
                    <div class="search-result-account">${highlightedAccount}</div>
                    <div class="search-result-plan">$${bill.toFixed(2)}/mo</div>
                </div>
            </div>
        `;
    }).join('');
    
    searchResults.innerHTML = resultsHTML;
    
    // Add click event listeners
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => selectSearchResult(item.dataset.customerId));
    });
}

/**
 * Highlight matching text
 */
function highlightMatch(text, searchTerm) {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

/**
 * Escape regex special characters
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Handle keyboard navigation in search results
 */
function handleSearchKeydown(e) {
    const searchResults = document.getElementById('searchResults');
    
    if (searchResults.style.display === 'none' || filteredCustomers.length === 0) {
        return;
    }
    
    const items = searchResults.querySelectorAll('.search-result-item');
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            selectedSearchIndex = Math.min(selectedSearchIndex + 1, items.length - 1);
            updateSearchSelection(items);
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            selectedSearchIndex = Math.max(selectedSearchIndex - 1, -1);
            updateSearchSelection(items);
            break;
            
        case 'Enter':
            e.preventDefault();
            if (selectedSearchIndex >= 0 && items[selectedSearchIndex]) {
                const customerId = items[selectedSearchIndex].dataset.customerId;
                selectSearchResult(customerId);
            }
            break;
            
        case 'Escape':
            searchResults.style.display = 'none';
            selectedSearchIndex = -1;
            break;
    }
}

/**
 * Update visual selection in search results
 */
function updateSearchSelection(items) {
    items.forEach((item, index) => {
        if (index === selectedSearchIndex) {
            item.classList.add('active');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Select a customer from search results
 */
async function selectSearchResult(customerId) {
    try {
        const response = await fetch(getApiUrl(`/api/customer/${customerId}`));
        const data = await response.json();
        
        if (data.success) {
            currentCustomer = data.customer;
            displayCustomerInfo(currentCustomer);
            document.getElementById('startCallBtn').disabled = false;
            
            // Update dropdown to match selection
            const select = document.getElementById('customerSelect');
            select.value = customerId;
            
            // Clear and hide search
            clearSearch();
            
            console.log(`Selected customer from search: ${currentCustomer.name}`);
        }
    } catch (error) {
        console.error('Failed to load customer:', error);
        showError('Failed to load customer data');
    }
}

/**
 * Clear search input and results
 */
function clearSearch() {
    const searchInput = document.getElementById('customerSearch');
    const searchResults = document.getElementById('searchResults');
    const clearBtn = document.getElementById('clearSearchBtn');
    
    searchInput.value = '';
    searchResults.style.display = 'none';
    clearBtn.style.display = 'none';
    filteredCustomers = [];
    selectedSearchIndex = -1;
}

// Make functions available globally for modal
window.closeTransferModal = closeTransferModal;
window.confirmTransfer = confirmTransfer;

