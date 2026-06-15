const express = require('express');
const axios = require('axios');
const router = express.Router();

const chatbotApis = {
  openai: async (message, apiKey) => {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      temperature: 0.7
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return response.data.choices[0].message.content;
  },
  claude: async (message, apiKey) => {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [{ role: 'user', content: message }]
    }, {
      headers: { 'x-api-key': apiKey }
    });
    return response.data.content[0].text;
  },
  gemini: async (message, apiKey) => {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
      contents: [{ parts: [{ text: message }] }]
    });
    return response.data.candidates[0].content.parts[0].text;
  },
  huggingface: async (message, apiKey) => {
    const response = await axios.post('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
      inputs: message
    }, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    return response.data[0].generated_text;
  },
  cohere: async (message, apiKey) => {
    const response = await axios.post('https://api .cohere.ai/v1/chat', {
      message: message
    }, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    return response.data.text || '';
  }
};

router.post('/send', async (req, res) => {
  const { message, apiProvider, apiKey } = req.body;
  if (!chatbotApis[apiProvider]) {
    return res.status(400).json({ error: 'Invalid API provider' });
  }
  try {
    const response = await chatbotApis[apiProvider](message, apiKey);
    res.json({ response, provider: apiProvider, timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/providers', (req, res) => {
  res.json({ 
    providers: Object.keys(chatbotApis),
    details: {
      openai: { name: 'OpenAI', url: 'https://openai.com' },
      claude: { name: 'Anthropic Claude', url: 'https://anthropic.com' },
      gemini: { name: 'Google Gemini', url: 'https://ai.google.dev' },
      huggingface: { name: 'Hugging Face', url: 'https://huggingface.co' },
      cohere: { name: 'Cohere', url: 'https://cohere.ai' }
    }
  });
});

module.exports = router;
