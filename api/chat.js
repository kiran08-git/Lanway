import { generateChatResponse } from '../career-ai/src/server/geminiService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { message, history = [], context = {} } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ success: false, error: 'Message is required.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const studentContext = {
      profile: context.profile || {},
      assessment: context.assessment || {},
      recommendations: context.recommendations || {},
    };

    const result = await generateChatResponse(
      {
        message,
        history,
        studentContext,
        coursesContext: [],
      },
      apiKey
    );

    res.status(200).json({
      success: true,
      reply: result.reply,
      model: result.model,
      timestamp: result.timestamp,
    });
  } catch (error) {
    console.error('[Vercel API /api/chat] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'AI Chat service error',
    });
  }
}
