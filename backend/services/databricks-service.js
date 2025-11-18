const axios = require('axios');

class DatabricksService {
  constructor() {
    this.host = process.env.DATABRICKS_HOST;
    this.token = process.env.DATABRICKS_TOKEN;
    this.llmModel = process.env.DATABRICKS_LLM_MODEL || 'databricks-claude-sonnet-4-5';
    this.whisperModel = process.env.DATABRICKS_WHISPER_MODEL || 'whisper-large-v3';
    this.openaiApiKey = process.env.OPENAI_API_KEY; // Fallback for Whisper
    this.useOpenAIWhisper = process.env.USE_OPENAI_WHISPER === 'true';
    
    if (!this.host || !this.token) {
      throw new Error('Databricks credentials not configured. Check .env file.');
    }
  }

  getEndpointUrl(modelName) {
    return `${this.host}/serving-endpoints/${modelName}/invocations`;
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  async chatCompletion(messages, options = {}) {
    const {
      model = this.llmModel,
      temperature = 0.7,
      maxTokens = 1000,
      systemPrompt = null
    } = options;

    try {
      const url = this.getEndpointUrl(model);
      
      const fullMessages = [];
      if (systemPrompt) {
        fullMessages.push({
          role: 'system',
          content: systemPrompt
        });
      }
      fullMessages.push(...messages);

      const payload = {
        messages: fullMessages,
        temperature,
        max_tokens: maxTokens
      };

      console.log(`[Databricks] Calling ${model}...`);
      const response = await axios.post(url, payload, {
        headers: this.getHeaders(),
        timeout: 60000
      });

      const content = response.data.choices?.[0]?.message?.content 
                   || response.data.response 
                   || response.data.text
                   || JSON.stringify(response.data);

      return {
        content,
        model,
        usage: response.data.usage || {}
      };
    } catch (error) {
      console.error('[Databricks] LLM Error:', error.response?.data || error.message);
      throw new Error(`Databricks LLM failed: ${error.response?.data?.error || error.message}`);
    }
  }

  async transcribeAudio(audioBuffer, options = {}) {
    const {
      language = 'auto',
      model = this.whisperModel
    } = options;

    const audioSizeKB = (audioBuffer.length / 1024).toFixed(2);

    // Check audio format
    const formatBytes = audioBuffer.slice(0, 12).toString('hex');
    const isWebM = formatBytes.startsWith('1a45dfa3');
    
    console.log(`[Audio] Size: ${audioSizeKB} KB, Format signature: ${formatBytes.substring(0, 16)}`);
    
    // Use OpenAI Whisper if:
    // 1. Explicitly enabled via USE_OPENAI_WHISPER=true
    // 2. WebM detected and OpenAI API key is available (fallback)
    if (this.useOpenAIWhisper || (isWebM && this.openaiApiKey)) {
      if (isWebM) {
        console.warn('[Audio] WebM format detected - Databricks Whisper may not support this.');
      }
      console.log('[Audio] Using OpenAI Whisper for transcription');
      return await this.transcribeWithOpenAI(audioBuffer, options);
    }
    
    // Warn if WebM but no OpenAI fallback available
    if (isWebM && !this.openaiApiKey) {
      console.warn('[Audio] WebM format detected but Databricks Whisper may not support it. Set OPENAI_API_KEY in .env for fallback transcription.');
    }
    
    // Otherwise try Databricks Whisper
    const url = this.getEndpointUrl(model);
    console.log(`[Databricks] Transcribing audio with ${model}...`);
    console.log(`[Databricks] Whisper endpoint: ${url}`);

    const audioBase64 = audioBuffer.toString('base64');
    console.log(`[Databricks] Base64 length: ${audioBase64.length} chars (first 50: ${audioBase64.substring(0, 50)}...)`);

    // Try multiple payload formats that Databricks Whisper might accept
    const payloadFormats = [
      // Format 1: Raw binary bytes in dataframe_split (string "0" column)
      {
        name: 'dataframe_split_bytes_string_0',
        payload: {
          dataframe_split: {
            columns: ["0"],
            data: [[Array.from(audioBuffer)]]
          }
        }
      },
      // Format 2: dataframe_split with string "0" as column name (base64)
      {
        name: 'dataframe_split_string_0',
        payload: {
          dataframe_split: {
            columns: ["0"],
            data: [[audioBase64]]
          }
        }
      },
      // Format 3: dataframe_records with string "0" key
      {
        name: 'dataframe_records_string_0',
        payload: {
          dataframe_records: [{ "0": audioBase64 }]
        }
      },
      // Format 4: dataframe_split with indexed column (numeric)
      {
        name: 'dataframe_split_indexed',
        payload: {
          dataframe_split: {
            columns: [0],
            data: [[audioBase64]]
          }
        }
      },
      // Format 5: dataframe_records with numeric indexed input
      {
        name: 'dataframe_records_indexed',
        payload: {
          dataframe_records: [{ 0: audioBase64 }]
        }
      },
      // Format 6: inputs as 2D array (position-based)
      {
        name: 'inputs_2d_array',
        payload: {
          inputs: [[audioBase64]]
        }
      },
      // Format 7: dataframe_records (common for pandas-style inputs)
      {
        name: 'dataframe_records',
        payload: {
          dataframe_records: [{ audio: audioBase64 }]
        }
      },
      // Format 8: dataframe_split (alternative pandas format)
      {
        name: 'dataframe_split',
        payload: {
          dataframe_split: {
            columns: ['audio'],
            data: [[audioBase64]]
          }
        }
      },
      // Format 9: instances (TensorFlow serving style)
      {
        name: 'instances',
        payload: {
          instances: [{ audio: audioBase64 }]
        }
      },
      // Format 10: simple inputs array
      {
        name: 'inputs_array',
        payload: {
          inputs: [audioBase64]
        }
      }
    ];

    let lastError = null;

    for (const format of payloadFormats) {
      try {
        console.log(`[Databricks] Trying payload format: ${format.name}`);

        const response = await axios.post(url, format.payload, {
          headers: this.getHeaders(),
          timeout: 60000,
          maxContentLength: 10 * 1024 * 1024,
          maxBodyLength: 10 * 1024 * 1024
        });

        console.log(`[Databricks] ✓ Success with format: ${format.name}`);

        // Try different response formats
        const transcription = response.data.predictions?.[0]?.text
                           || response.data.predictions?.[0]
                           || response.data.text 
                           || response.data.transcription 
                           || response.data.output
                           || '';

        if (!transcription) {
          console.log('[Databricks] Whisper response format:', JSON.stringify(response.data));
          throw new Error('No transcription in response');
        }

        const detectedLanguage = response.data.language 
                              || response.data.predictions?.[0]?.language
                              || 'unknown';

        return {
          text: typeof transcription === 'string' ? transcription.trim() : String(transcription).trim(),
          language: detectedLanguage,
          model
        };

      } catch (error) {
        lastError = error;
        console.log(`[Databricks] ✗ Format ${format.name} failed: ${error.response?.data?.message || error.message}`);
        // Continue to next format
      }
    }

    // If all formats failed, throw the last error
    if (lastError) {
      if (lastError.code === 'ECONNABORTED') {
        console.error('[Databricks] Whisper timeout after 60s');
        throw new Error('Audio transcription timed out. Please try with a shorter recording.');
      }
      
      console.error('[Databricks] Whisper Error (all formats failed):', {
        status: lastError.response?.status,
        data: lastError.response?.data,
        message: lastError.message
      });
      
      throw new Error(`Whisper transcription failed: ${lastError.response?.data?.message || lastError.message}`);
    }
  }

  async transcribeWithOpenAI(audioBuffer, options = {}) {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY or USE_OPENAI_WHISPER=true in .env');
    }

    try {
      const FormData = require('form-data');
      const form = new FormData();
      
      form.append('file', audioBuffer, {
        filename: 'audio.webm',
        contentType: 'audio/webm'
      });
      form.append('model', 'whisper-1');
      
      if (options.language && options.language !== 'auto') {
        form.append('language', options.language);
      }

      console.log('[OpenAI Whisper] Sending audio for transcription...');
      
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        form,
        {
          headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${this.openaiApiKey}`
          },
          maxBodyLength: Infinity,
          timeout: 60000
        }
      );

      console.log('[OpenAI Whisper] ✓ Transcription successful');

      return {
        text: response.data.text.trim(),
        language: response.data.language || 'unknown',
        model: 'whisper-1'
      };
    } catch (error) {
      console.error('[OpenAI Whisper] Error:', error.response?.data || error.message);
      throw new Error(`OpenAI Whisper transcription failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async analyzeConversation(conversationHistory, currentMessage) {
    const analysisPrompt = `Analyze this customer service conversation and provide:
1. Primary Intent (choose one): price_complaint, competitor_offer, service_quality, billing_issue, technical_support, general_inquiry
2. Sentiment (choose one): positive, neutral, frustrated, angry
3. Urgency Score (1-10): How urgent is the customer's concern?
4. Language: English or Spanish
5. Key Concerns: Brief list of main issues

Conversation History:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current Message: ${currentMessage}

Respond in JSON format:
{
  "intent": "...",
  "sentiment": "...",
  "urgency": ...,
  "language": "...",
  "key_concerns": ["..."]
}`;

    try {
      const response = await this.chatCompletion([
        { role: 'user', content: analysisPrompt }
      ], {
        temperature: 0.3,
        maxTokens: 300
      });

      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        intent: 'general_inquiry',
        sentiment: 'neutral',
        urgency: 5,
        language: 'English',
        key_concerns: ['Unable to analyze']
      };
    } catch (error) {
      console.error('[Databricks] Analysis Error:', error.message);
      return {
        intent: 'general_inquiry',
        sentiment: 'neutral',
        urgency: 5,
        language: 'English',
        key_concerns: ['Analysis failed']
      };
    }
  }

  async generateOffers(customerProfile, intent, sentiment, urgency) {
    const offerPrompt = `Based on this customer profile and situation, suggest 2-3 retention offers:

Customer Profile:
- Name: ${customerProfile.name}
- Monthly Bill: $${customerProfile.monthlyBill}
- Tenure: ${customerProfile.tenure} months
- Payment History: ${customerProfile.paymentHistory}
- Current Plan: ${customerProfile.currentPlan}

Situation:
- Intent: ${intent}
- Sentiment: ${sentiment}
- Urgency: ${urgency}/10

Provide 2-3 offers ranked by effectiveness. Each offer should include:
- Type (discount, bill_credit, upgrade, loyalty_reward)
- Value (percentage or dollar amount)
- Duration (months)
- Description (friendly, concise)

Respond in JSON format:
{
  "offers": [
    {
      "type": "...",
      "value": "...",
      "duration": ...,
      "description": "..."
    }
  ]
}`;

    try {
      const response = await this.chatCompletion([
        { role: 'user', content: offerPrompt }
      ], {
        temperature: 0.4,
        maxTokens: 500
      });

      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        offers: [
          {
            type: 'discount',
            value: '15%',
            duration: 6,
            description: 'Save 15% on your monthly bill for 6 months'
          }
        ]
      };
    } catch (error) {
      console.error('[Databricks] Offer Generation Error:', error.message);
      return {
        offers: [
          {
            type: 'discount',
            value: '10%',
            duration: 3,
            description: 'Get 10% off your monthly bill for 3 months'
          }
        ]
      };
    }
  }
}

module.exports = new DatabricksService();

