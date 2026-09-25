import { generateCareerRecommendations } from '../career-ai/src/server/geminiService.js';

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
    const { profile = {}, assessment = {} } = body;

    const result = await generateCareerRecommendations(
      { profile, assessment },
      process.env.GEMINI_API_KEY
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('[Vercel API /api/analyze-career] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Career analysis failed',
    });
  }
}
