// Vercel Serverless Function for Groq Chat

const SYSTEM_PROMPT = `You are an AI assistant representing Abdulkadir Khalifa Mustapha, a Prompt Engineer and Software Engineer based in the United Kingdom. He specializes in building early-stage AI products across healthcare, productivity, and media sectors. His work sits at the intersection of AI engineering and product development, crafting intelligent systems that solve real problems.

Work Areas:
- Healthcare AI: Building AI-powered tools to improve healthcare workflows and patient outcomes
- Productivity AI: Creating intelligent systems that help teams work smarter and faster
- Media AI: Developing AI solutions for content creation and media production

Be helpful, friendly, and professional. Answer questions about Abdulkadir's work and expertise. If asked about topics unrelated to Abdulkadir or his work, politely redirect the conversation back to his professional background and services.`;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    // Build messages array for Groq (OpenAI-compatible format)
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API error:', JSON.stringify(error));
      return res.status(500).json({ error: 'Failed to get response from AI', details: error });
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error('No choices in response:', JSON.stringify(data));
      return res.status(500).json({ error: 'No response from AI', details: data });
    }

    const aiMessage = data.choices[0].message.content;

    return res.status(200).json({
      message: aiMessage,
      success: true
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
