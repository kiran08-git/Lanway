import { generateChatResponse } from '../career-ai/src/server/geminiService.js';
import { INITIAL_COURSES } from '../career-ai/src/data/coursesData.js';

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

    if (!apiKey) {
      console.error('[Vercel API /api/chat] GEMINI_API_KEY is not set in Vercel environment variables!');
    }

    const studentContext = {
      profile: context.profile || {},
      assessment: context.assessment || {},
      recommendations: context.recommendations || {},
    };

    // Pass courses context to match local dev server behavior
    const coursesContext = (INITIAL_COURSES || []).slice(0, 25).map((c) => ({
      category: c.category,
      title: c.title,
      channel: c.channel,
      level: c.level,
      topics: c.topics,
    }));

    const result = await generateChatResponse(
      {
        message: message.trim(),
        history,
        studentContext,
        coursesContext,
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
