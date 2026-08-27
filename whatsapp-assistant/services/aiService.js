const axios = require('axios');
require('dotenv').config();

class AIMinimaxService {
  constructor() {
    this.minimaxApiKey = process.env.MINIMAX_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.baseUrl = 'https://api.minimax.chat/v1';
  }

  async generateResponse(messages, userContext = {}) {
    try {
      // Build system prompt with user context
      const systemPrompt = this.buildSystemPrompt(userContext);

      // Prepare messages array
      const allMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      // Try MiniMax first
      try {
        const response = await axios.post(
          `${this.baseUrl}/chat/completions`,
          {
            model: 'minimax-m2.5',
            messages: allMessages,
            temperature: 0.3,
            max_tokens: 200
          },
          {
            headers: {
              'Authorization': `Bearer ${this.minimaxApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        return {
          success: true,
          response: response.data.choices[0].message.content,
          model: 'minimax'
        };
      } catch (minimaxError) {
        console.log('MiniMax failed, trying OpenAI fallback...');

        // Fallback to OpenAI
        const openaiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: allMessages,
            temperature: 0.3,
            max_tokens: 200
          },
          {
            headers: {
              'Authorization': `Bearer ${this.openaiApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        return {
          success: true,
          response: openaiResponse.data.choices[0].message.content,
          model: 'openai'
        };
      }
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  buildSystemPrompt(userContext) {
    const {
      userName = 'Traveler',
      destination = '',
      remainingBudget = 0,
      dailyLimit = 0,
      nextActivity = null,
      hotelLocation = '',
      activities = [],
      isEmergencyMode = false
    } = userContext;

    let prompt = `You are a hyper-local Indian travel guide assistant. You communicate in Hinglish (Hindi + English mix).

CURRENT USER CONTEXT:
- Name: ${userName}
- Location: ${destination}
- Remaining Budget: ₹${remainingBudget.toLocaleString('en-IN')}
- Today's Budget Limit: ₹${dailyLimit.toLocaleString('en-IN')}
- Hotel: ${hotelLocation || 'Not set'}

`;

    if (isEmergencyMode) {
      prompt += `⚠️ EMERGENCY MODE: User's wallet is low. Only suggest free or ₹500 max activities.

`;
    }

    if (nextActivity) {
      prompt += `NEXT SCHEDULED ACTIVITY (in 30 mins):
- ${nextActivity.title}
- Location: ${nextActivity.location_name || 'TBD'}
- Est cost: ₹${nextActivity.estimated_cost || 0}

`;
    }

    if (activities.length > 0) {
      const activityList = activities
        .slice(0, 5)
        .map(a => `- ${a.name} (₹${a.price || 0})`)
        .join('\n');
      prompt += `AVAILABLE NEARBY OPTIONS (from Google Places):
${activityList}

`;
    }

    prompt += `RESPONSE RULES:
1. Keep responses under 50 words
2. Use emojis appropriately
3. Always consider remaining budget before suggesting places
4. If user asks for food, check if suggestion fits in remaining budget
5. If wallet is low, be honest and suggest budget options
6. NEVER invent fake restaurant or place names - only use provided data
7. Format responses with emojis for better readability
8. Always be helpful and friendly

Start with greeting if user says hi/namaste/hello.`;

    return prompt;
  }

  async classifyIntent(userMessage) {
    try {
      const response = await this.generateResponse([
        {
          role: 'user',
          content: `Classify this message into ONE of these intents: GENERAL_CHAT, FIND_FOOD, FIND_PLACE, COMMUTE_INQUIRY, WEATHER_CHECK, EXPENSE_LOG, SCHEDULE_INQUIRY, BUDGET_CHECK

Message: "${userMessage}"

Reply ONLY with the intent word, nothing else.`
        }
      ]);

      if (response.success) {
        const intent = response.response.trim().toUpperCase();
        return intent;
      }

      return 'GENERAL_CHAT';
    } catch (error) {
      console.error('Intent classification error:', error);
      return 'GENERAL_CHAT';
    }
  }
}

module.exports = new AIMinimaxService();