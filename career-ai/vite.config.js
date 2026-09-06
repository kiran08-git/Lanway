import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { createClient } from '@supabase/supabase-js';
import { generateCareerRecommendations, generateChatResponse } from './src/server/geminiService.js';
import { INITIAL_COURSES } from './src/data/coursesData.js';

// Custom Vite plugin to host server-side /api endpoints securely
function careerAiApiPlugin() {
  return {
    name: 'career-ai-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        // Only handle /api/analyze-career and /api/chat
        if (url !== '/api/analyze-career' && url !== '/api/chat') {
          return next();
        }

        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          });
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
          return;
        }

        try {
          // Read request body stream
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });

          req.on('end', async () => {
            try {
              const body = bodyStr ? JSON.parse(bodyStr) : {};
              const env = loadEnv('development', process.cwd(), '');
              const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

              // ----------------------------------------------------
              // 1. Handle /api/analyze-career
              // ----------------------------------------------------
              if (url === '/api/analyze-career') {
                const { profile = {}, assessment = {} } = body;

                if (!apiKey) {
                  console.warn('[CareerAI Server] GEMINI_API_KEY is not set in environment or .env.local');
                }

                console.log('[CareerAI Server] Generating AI career recommendations for:', profile?.name || 'Student');
                const aiResult = await generateCareerRecommendations({ profile, assessment }, apiKey);

                res.writeHead(200, {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                });
                res.end(JSON.stringify({ success: true, data: aiResult }));
                return;
              }

              // ----------------------------------------------------
              // 2. Handle /api/chat (CareerAI Assistant)
              // ----------------------------------------------------
              if (url === '/api/chat') {
                const { message, history = [], context = {} } = body;

                if (!message || typeof message !== 'string' || message.trim() === '') {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: false, error: 'Message is required.' }));
                  return;
                }

                // Verify user session if token provided
                const authHeader = req.headers.authorization || '';
                const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';

                let verifiedStudentContext = {
                  profile: context.profile || {},
                  assessment: context.assessment || {},
                  recommendations: context.recommendations || {},
                };

                const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
                const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

                if (token && supabaseUrl && supabaseKey) {
                  try {
                    const supabase = createClient(supabaseUrl, supabaseKey);
                    const { data: authData, error: authErr } = await supabase.auth.getUser(token);

                    if (!authErr && authData?.user) {
                      const userId = authData.user.id;

                      // Retrieve student profile from DB
                      const { data: dbProfile } = await supabase
                        .from('student_profiles')
                        .select('*')
                        .eq('id', userId)
                        .maybeSingle();

                      // Retrieve latest assessment results
                      const { data: dbAssessment } = await supabase
                        .from('assessment_results')
                        .select('*')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                      // Retrieve latest recommendations
                      const { data: dbRecs } = await supabase
                        .from('career_recommendations')
                        .select('*')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                      if (dbProfile) {
                        verifiedStudentContext.profile = {
                          ...verifiedStudentContext.profile,
                          ...dbProfile,
                        };
                      }
                      if (dbAssessment) {
                        verifiedStudentContext.assessment = {
                          ...verifiedStudentContext.assessment,
                          ...dbAssessment,
                        };
                      }
                      if (dbRecs) {
                        verifiedStudentContext.recommendations = {
                          ...verifiedStudentContext.recommendations,
                          ...dbRecs,
                        };
                      }
                    }
                  } catch (dbErr) {
                    console.warn('[CareerAI Server] Note: Supabase student context fetch skipped:', dbErr.message);
                  }
                }

                console.log(
                  `[CareerAI Chat] Processing message from: ${verifiedStudentContext.profile?.name || 'Student'}`
                );

                // Prepare course summaries for grounding
                const coursesContext = (INITIAL_COURSES || []).slice(0, 25).map((c) => ({
                  category: c.category,
                  title: c.title,
                  channel: c.channel,
                  level: c.level,
                  topics: c.topics,
                }));

                const chatResult = await generateChatResponse(
                  {
                    message: message.trim(),
                    history,
                    studentContext: verifiedStudentContext,
                    coursesContext,
                  },
                  apiKey
                );

                res.writeHead(200, {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                });
                res.end(
                  JSON.stringify({
                    success: true,
                    reply: chatResult.reply,
                    model: chatResult.model,
                    timestamp: chatResult.timestamp,
                  })
                );
                return;
              }
            } catch (innerErr) {
              console.error('[CareerAI Server] Error processing request:', innerErr);
              res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              res.end(
                JSON.stringify({
                  success: false,
                  error: innerErr.message || 'Internal server error processing AI request.',
                })
              );
            }
          });
        } catch (err) {
          console.error('[CareerAI Server] Request handling error:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    careerAiApiPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.png', 'icons.svg'],
      manifest: {
        name: 'CareerAI — Student Career Guidance Platform',
        short_name: 'CareerAI',
        description: 'CareerAI helps students discover the right career path.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
});

