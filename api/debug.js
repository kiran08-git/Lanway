export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Test if the Gemini API key actually works
  let geminiStatus = 'NOT_TESTED';
  let geminiError = null;

  if (apiKey) {
    try {
      const testRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Say "OK" in one word.' }] }],
            generationConfig: { maxOutputTokens: 10 },
          }),
        }
      );
      if (testRes.ok) {
        const data = await testRes.json();
        geminiStatus = 'SUCCESS';
        geminiError = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'no text';
      } else {
        const errText = await testRes.text();
        geminiStatus = `FAILED_${testRes.status}`;
        geminiError = errText;
      }
    } catch (e) {
      geminiStatus = 'FETCH_ERROR';
      geminiError = e.message;
    }
  }

  res.status(200).json({
    env: {
      GEMINI_API_KEY: apiKey ? `SET (length: ${apiKey.length}, starts with: ${apiKey.substring(0, 6)}...)` : 'NOT SET',
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET',
      VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    },
    geminiTest: {
      status: geminiStatus,
      response: geminiError,
    },
  });
}
