/**
 * Server-side Google Gemini AI Service for Career Recommendations.
 * NOTE: This module runs ONLY on the server/middleware side.
 * Never import this file into frontend client bundles.
 */

export async function generateCareerRecommendations({ profile = {}, assessment = {} }, apiKey) {
  const {
    name = 'Student',
    degree = 'Undergraduate Degree',
    branch = 'General',
    year = 'Current Year',
    college = 'University',
    skills = [],
    interests = [],
    careerGoal = 'Not specified',
  } = profile;

  const {
    categoryTotals = {},
    normalizedScores = {},
    strongestCategories = [],
    matchedCareers = [],
    topStrengths: deterministicStrengths = [],
    areasForDevelopment: deterministicGaps = [],
    overallScore = 85,
    answers = {},
  } = assessment;

  // Format top categories summary for prompt
  const topCategoriesSummary = strongestCategories && strongestCategories.length > 0
    ? strongestCategories.slice(0, 5).map((c) => `${c.name} (${c.code}): ${c.percentage}% (raw: ${c.rawScore}/${c.maxScore})`).join(', ')
    : Object.entries(normalizedScores).map(([k, v]) => `${k}: ${v}%`).join(', ');

  // Format deterministically matched candidate careers for AI explanation
  const candidateCareersList = matchedCareers && matchedCareers.length > 0
    ? matchedCareers.map((c) => ({
        title: c.title,
        matchScore: c.matchScore,
        field: c.field,
        primaryCategory: c.primaryCategory,
        salaryRange: c.salaryRange,
        growth: c.growth,
        requiredSkills: c.requiredSkills?.map((s) => s.name) || [],
      }))
    : [];

  const prompt = `
You are an expert AI Career Guidance Engine for a comprehensive student career platform.
The application's deterministic scoring engine has evaluated the student's assessment across 14 RIASEC / Career Anchor dimensions.

CRITICAL INSTRUCTIONS:
1. ONLY recommend and contextualize careers from the student's STRONGEST CATEGORIES and Candidate Matched Careers list below.
2. If the student scored highest in Media / Content / Creative (MED), your recommendations MUST be Media/Creative careers (such as Content Creator, Video Editor, Copywriter, Graphic Designer, Media Producer). NEVER default to Software/IT, Data Science, or Tech roles unless the student actually scored high in those categories!
3. Keep the candidate matchScore (integer percentage) and career titles.
4. Ground all explanations directly in the student's academic background and actual category scores.

=== STUDENT PROFILE ===
- Full Name: ${name}
- Degree/Education: ${degree || 'Undergraduate'}
- Branch/Discipline: ${branch || 'General'}
- Year of Study: ${year || 'Current Year'}
- College/Institute: ${college || 'College/Institute'}
- Self-Reported Skills: ${skills.length > 0 ? skills.join(', ') : 'None specified yet'}
- Declared Interests: ${interests.length > 0 ? interests.join(', ') : 'None specified yet'}
- Stated Career Goal: ${careerGoal || 'Open to recommendations'}

=== ASSESSMENT RESULTS (14 CATEGORIES) ===
- Strongest Categories: ${topCategoriesSummary}
- Overall Assessment Score Index: ${overallScore}%
- Complete 14-Category Breakdown: ${JSON.stringify(normalizedScores)}
- Candidate Matched Careers to Contextualize: ${JSON.stringify(candidateCareersList)}

=== OUTPUT SCHEMA ===
Respond ONLY with a valid JSON object matching this schema:
{
  "overallScore": ${overallScore},
  "topStrengths": [
    "High creative storytelling and multimedia production intuition",
    "Engaging communication and audience empathy"
  ],
  "areasForDevelopment": [
    "Portfolio project showcase with modern tools",
    "Advanced workflow automation"
  ],
  "careers": [
    {
      "title": "${candidateCareersList[0]?.title || 'Content Creator / Digital Producer'}",
      "matchScore": ${candidateCareersList[0]?.matchScore || 85},
      "field": "${candidateCareersList[0]?.field || 'Media & Creative'}",
      "salaryRange": "${candidateCareersList[0]?.salaryRange || '₹3.5 – 10 LPA'}",
      "growth": "${candidateCareersList[0]?.growth || 'Rapidly Growing'}",
      "whyMatch": "Directly matches your strongest category score, reflecting high creative instincts and communication ability.",
      "strengths": ["Visual storytelling", "Creative expression", "Audience empathy"],
      "skillGaps": ["Long-form production", "Analytics optimization"],
      "recommendedSkills": ["Scriptwriting", "Video Editing", "Social Media Strategy"],
      "nextSteps": ["Build a showcase portfolio", "Practice with industry standard tools"],
      "alternativeOptions": ["Video Editor", "Brand Strategist"]
    }
  ]
}
`;

  // If no API key is provided, gracefully build the deterministic result
  if (!apiKey) {
    console.warn('[CareerAI Server] GEMINI_API_KEY not configured. Using deterministic engine synthesis.');
    return buildDeterministicFallback(assessment, profile);
  }

  const models = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.7-flash',
    'gemini-2.5-pro',
  ];
  let lastError = null;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            topK: 40,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[CareerAI] Model ${model} returned ${response.status}:`, errText);
        lastError = new Error(`AI API request failed (${response.status}): ${errText}`);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('No content returned from AI API');
      }

      const parsed = JSON.parse(rawText);

      if (!parsed.careers || !Array.isArray(parsed.careers) || parsed.careers.length === 0) {
        throw new Error('AI response did not include a valid careers array');
      }

      const formattedCareers = parsed.careers.map((career, idx) => ({
        id: `career-${idx + 1}-${Date.now()}`,
        title: career.title || 'Specialist',
        matchScore: typeof career.matchScore === 'number' ? career.matchScore : (matchedCareers[idx]?.matchScore || 85),
        whyMatch: career.whyMatch || `Strongly aligns with your top category assessment scores.`,
        strengths: Array.isArray(career.strengths) ? career.strengths : (matchedCareers[idx]?.strengths || []),
        skillGaps: Array.isArray(career.skillGaps) ? career.skillGaps : (matchedCareers[idx]?.skillGaps || []),
        recommendedSkills: Array.isArray(career.recommendedSkills) ? career.recommendedSkills : (matchedCareers[idx]?.recommendedSkills || []),
        nextSteps: Array.isArray(career.nextSteps) ? career.nextSteps : ['Build a portfolio project', 'Practice core fundamentals'],
        alternativeOptions: Array.isArray(career.alternativeOptions) ? career.alternativeOptions : [],
        field: career.field || (matchedCareers[idx]?.field || 'Technology'),
        salaryRange: career.salaryRange || (matchedCareers[idx]?.salaryRange || '₹4.5 – 12 LPA'),
        growth: career.growth || (matchedCareers[idx]?.growth || 'High Demand'),
      }));

      return {
        overallScore: typeof parsed.overallScore === 'number' ? parsed.overallScore : overallScore,
        topStrengths: Array.isArray(parsed.topStrengths) && parsed.topStrengths.length > 0
          ? parsed.topStrengths
          : deterministicStrengths,
        areasForDevelopment: Array.isArray(parsed.areasForDevelopment) && parsed.areasForDevelopment.length > 0
          ? parsed.areasForDevelopment
          : deterministicGaps,
        careers: formattedCareers,
      };
    } catch (err) {
      console.error(`[CareerAI] Error with model ${model}:`, err.message);
      lastError = err;
    }
  }

  // If AI API calls failed, fallback to rich deterministic synthesis
  console.warn('[CareerAI] AI API calls failed. Falling back to deterministic synthesis.');
  return buildDeterministicFallback(assessment, profile);
}

/**
 * Builds rich, deterministic recommendations directly from scoringEngine results.
 */
function buildDeterministicFallback(assessment = {}, profile = {}) {
  const {
    matchedCareers = [],
    topStrengths = [],
    areasForDevelopment = [],
    overallScore = 85,
    strongestCategories = [],
  } = assessment;

  const topCatNames = strongestCategories.slice(0, 2).map((c) => c.name).join(' and ');

  const formattedCareers = (matchedCareers.length > 0 ? matchedCareers : []).map((c, idx) => ({
    id: c.id || `career-${idx + 1}`,
    title: c.title,
    matchScore: c.matchScore || 85,
    field: c.field || 'Technology',
    salaryRange: c.salaryRange || '₹4.5 – 12 LPA',
    growth: c.growth || 'High Demand',
    whyMatch: c.whyMatch || `Directly aligns with your high performance in ${topCatNames || 'your top assessment categories'}.`,
    strengths: c.strengths || ['Problem Solving', 'Structured Reasoning'],
    skillGaps: c.skillGaps || ['Industry Frameworks', 'Portfolio Building'],
    recommendedSkills: c.recommendedSkills || ['Core Fundamentals', 'Project Practice'],
    nextSteps: ['Build 2 hands-on portfolio projects', 'Review standard interview topics'],
    alternativeOptions: [],
  }));

  return {
    overallScore,
    topStrengths: topStrengths.length > 0 ? topStrengths : ['Structured Analytical Thinking', 'Fast Technical Aptitude', 'Practical Problem Solving'],
    areasForDevelopment: areasForDevelopment.length > 0 ? areasForDevelopment : ['Industry-standard tool mastery', 'End-to-end project building'],
    careers: formattedCareers,
  };
}

/**
 * Server-side Google Gemini AI Service for CareerAI Assistant Chatbot.
 * Supports academic study, practice questions, 7/14/30-day study plans,
 * assessment explanations, skill gap bridging, and course recommendations.
 */
export async function generateChatResponse({ message, history = [], studentContext = {}, coursesContext = [] }, apiKey) {
  const profile = studentContext.profile || {};
  const assessment = studentContext.assessment || {};
  const recommendations = studentContext.recommendations || {};

  const name = profile.name || 'Student';
  const degree = profile.degree || 'Undergraduate';
  const branch = profile.branch || 'General / Not specified';
  const year = profile.year || 'Current Year';
  const college = profile.college || 'College/University';
  const skills = Array.isArray(profile.skills) ? profile.skills.join(', ') : (profile.skills || 'None listed yet');
  const interests = Array.isArray(profile.interests) ? profile.interests.join(', ') : (profile.interests || 'None listed yet');
  const careerGoal = profile.career_goal || profile.careerGoal || 'Open to recommendations';

  const overallScore = assessment.overall_score || assessment.overallScore || recommendations.overall_score || recommendations.overallScore || null;
  const strongestCategories = assessment.strongest_categories || assessment.strongestCategories || [];
  const normalizedScores = assessment.normalized_scores || assessment.normalizedScores || recommendations.category_breakdown || {};
  const topStrengths = recommendations.strengths || assessment.topStrengths || [];
  const areasForDevelopment = recommendations.areas_for_development || assessment.areasForDevelopment || [];

  const careersList = recommendations.careers || assessment.matchedCareers || [];
  const topCareer = careersList[0] || null;

  // Format Strongest Categories
  const topCatsText = strongestCategories.length > 0
    ? strongestCategories.map((c) => `${c.name || c.code} (${c.code}): ${c.percentage}%`).join(', ')
    : Object.entries(normalizedScores).map(([k, v]) => `${k}: ${v}%`).join(', ') || 'Assessment not taken yet';

  // Format Matched Careers Overview
  const careersSummaryText = careersList.length > 0
    ? careersList.map((c, i) => `${i + 1}. ${c.title} (${c.matchScore}% Match, Field: ${c.field || 'Tech'}) - Why: ${c.whyMatch || 'Direct match'} | Strengths: ${(c.strengths || []).join(', ')} | Skill Gaps: ${(c.skillGaps || []).join(', ')} | Recommended Skills: ${(c.recommendedSkills || []).join(', ')}`).join('\n')
    : 'No career assessment recommendations generated yet.';

  // Format Course Catalog Sample
  const coursesSummaryText = Array.isArray(coursesContext) && coursesContext.length > 0
    ? coursesContext.slice(0, 15).map((c) => `- [${c.category}] "${c.title}" by ${c.channel} (Level: ${c.level}, Topics: ${(c.topics || []).slice(0, 3).join(', ')})`).join('\n')
    : 'Curated courses in Software Engineering, AI & Machine Learning, UI/UX Design, Cybersecurity, and Business available on CareerAI Courses tab.';

  const systemInstruction = `
You are Gemini Personal AI Assistant (CareerAI), an advanced, friendly, highly intelligent conversational AI assistant.

CORE CAPABILITIES & BEHAVIOR:
1. ANSWER ANY AND ALL QUESTIONS: Answer user inquiries across all domains with great clarity, depth, helpfulness, and nuance. This includes general knowledge, computer science, software engineering, science, mathematics, literature, daily questions, philosophy, career guidance, interview preparation, academic tutoring, creative writing, and study planning.
2. PERSONALIZED CAREER & ACADEMIC MENTORSHIP: When the user asks about their career matches, assessment scores, learning roadmaps, skills, or studies, draw seamlessly on their profile and assessment data below.
3. CLEAR FORMATTING: Use clean, beautiful Markdown formatting with headers (##, ###), bullet points, bold key terms, numbered steps, and syntax-highlighted code blocks (\`\`\`language).
4. INTERACTIVE QUIZZES & PRACTICE: If the student asks for practice questions or quizzes:
   - Provide clear numbered questions with multiple choice options or code exercises.
   - Separate the answers and explanations cleanly at the bottom using:
     ---
     **Answer & Explanation:**
     [Detailed solution and explanation]
5. STUDY PLANS & LEARNING SCHEDULES: If asked for study plans, organize them in structured daily or weekly milestones with actionable hands-on exercises.

STUDENT PROFILE CONTEXT (Use when relevant to career or academic inquiries):
- Student Name: ${name}
- Academic Background: ${degree} (${branch}), Year: ${year}
- College/Institute: ${college}
- Self-Reported Skills: ${skills}
- Declared Interests: ${interests}
- Career Goal: ${careerGoal}

ASSESSMENT & CAREER RECOMMENDATION DATA:
- Assessment Score: ${overallScore !== null ? `${overallScore}%` : 'Not completed yet'}
- Strongest Dimensions: ${topCatsText}
- Detailed Category Scores: ${JSON.stringify(normalizedScores)}
- Key Strengths: ${JSON.stringify(topStrengths)}
- Identified Skill Gaps: ${JSON.stringify(areasForDevelopment)}
- Top Recommended Career: ${topCareer ? `${topCareer.title} (${topCareer.matchScore}% match)` : 'Not yet calculated'}
- All Matched Pathways:
${careersSummaryText}

CURATED FREE COURSES (For course recommendations):
${coursesSummaryText}

TONE & STYLE:
Friendly, highly capable, encouraging, precise, and articulate. Answer promptly, thoroughly, and directly.
`;

  // Fallback if no API key is available
  if (!apiKey) {
    console.warn('[CareerAI Server] GEMINI_API_KEY not configured. Generating intelligent fallback chat response.');
    return generateFallbackChatResponse(message, studentContext);
  }

  const models = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.7-flash',
    'gemini-2.5-pro',
  ];
  let lastError = null;

  // Build conversation history contents for Gemini
  const contents = [];

  // Filter and sanitize previous turns (max last 16 turns for rich conversational memory)
  const sanitizedHistory = (history || []).slice(-16);
  for (const turn of sanitizedHistory) {
    if (!turn.message) continue;
    contents.push({
      role: turn.role === 'assistant' || turn.role === 'model' ? 'model' : 'user',
      parts: [{ text: turn.message }],
    });
  }

  // Append latest user message
  contents.push({
    role: 'user',
    parts: [{ text: message }],
  });

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents,
          generationConfig: {
            temperature: 0.5,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[CareerAI Chat] Model ${model} returned ${response.status}:`, errText);
        lastError = new Error(`AI Chat API error (${response.status}): ${errText}`);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('No reply text returned from Gemini API');
      }

      return {
        reply: rawText,
        model,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.error(`[CareerAI Chat] Error with model ${model}:`, err.message);
      lastError = err;
    }
  }

  console.warn('[CareerAI Chat] All Gemini models failed or throttled. Falling back to local assistant synthesis.');
  return generateFallbackChatResponse(message, studentContext);
}

/**
 * Intelligent deterministic fallback response if Gemini API key is missing or unavailable.
 */
function generateFallbackChatResponse(message, studentContext = {}) {
  const msg = (message || '').trim();
  const msgLower = msg.toLowerCase();
  const profile = studentContext.profile || {};
  const assessment = studentContext.assessment || {};
  const recommendations = studentContext.recommendations || {};
  const name = profile.name || 'there';
  const careers = recommendations.careers || assessment.matchedCareers || [];
  const topCareer = careers[0] || null;

  if (msgLower.includes('career') || msgLower.includes('why') || msgLower.includes('recommend') || msgLower.includes('result') || msgLower.includes('match')) {
    if (topCareer) {
      return {
        reply: `### 🎯 Why You Matched With **${topCareer.title}** (${topCareer.matchScore}% Match)\n\nHi **${name}**, based on your comprehensive 14-dimension assessment:\n\n- **Primary Alignment:** ${topCareer.whyMatch || 'Direct alignment with your top category scores.'}\n- **Key Strengths:** ${(topCareer.strengths || ['Analytical Reasoning', 'Problem Solving']).join(', ')}\n- **Skill Gaps to Bridge:** ${(topCareer.skillGaps || ['Advanced Frameworks', 'Portfolio Building']).join(', ')}\n- **Recommended Next Skills:** ${(topCareer.recommendedSkills || ['Core Fundamentals', 'Project Practice']).join(', ')}\n\n💡 **Next Step:** Check out the **Learning Roadmap** tab to follow your milestone journey!`,
        model: 'fallback-engine',
        timestamp: new Date().toISOString(),
      };
    }
    return {
      reply: `Hi **${name}**! You haven't completed the CareerAI assessment yet. Head over to the **Assessment** tab to take the 30-question diagnostic and unlock your personalized career matches and skill gap breakdown!`,
      model: 'fallback-engine',
      timestamp: new Date().toISOString(),
    };
  }

  if (msgLower.includes('plan') || msgLower.includes('study plan') || msgLower.includes('roadmap') || msgLower.includes('schedule')) {
    const targetTitle = topCareer ? topCareer.title : 'Software & Tech Fundamentals';
    return {
      reply: `### 📅 7-Day Targeted Study Plan for **${targetTitle}**\n\nHere is a structured learning schedule designed for you:\n\n- **Day 1: Foundations & Architecture**\n  * Review core concepts and industry fundamentals.\n  * Set up your development environment / toolchain.\n- **Day 2: Core Principles & Syntax**\n  * Work through practical tutorials on primary tools.\n- **Day 3: Hands-on Mini Challenge**\n  * Build a standalone practice component or exercise.\n- **Day 4: Addressing Skill Gaps**\n  * Focus specifically on: ${(topCareer?.skillGaps || ['Framework Mastery', 'Database Design']).slice(0, 2).join(' & ')}.\n- **Day 5: Intermediate Integration**\n  * Connect data flow, API requests, and user interactions.\n- **Day 6: Portfolio Project Prototype**\n  * Create a functional GitHub repo showcasing your build.\n- **Day 7: Review & Assessment Quiz**\n  * Test your knowledge and document key takeaways.\n\n*Would you like me to dive deeper into any specific day or concept?*`,
      model: 'fallback-engine',
      timestamp: new Date().toISOString(),
    };
  }

  if (msgLower.includes('practice') || msgLower.includes('quiz') || msgLower.includes('question')) {
    return {
      reply: `### ❓ Practice Quiz: Core Conceptual Knowledge\n\n**Question 1:** Which data structure operates on a First-In, First-Out (FIFO) principle?\n- **A)** Stack\n- **B)** Queue\n- **C)** Binary Search Tree\n- **D)** Hash Map\n\n**Question 2:** In web development and API architecture, which HTTP method is considered idempotent for updating existing resources?\n- **A)** POST\n- **B)** PATCH\n- **C)** PUT\n- **D)** CONNECT\n\n---\n**Answer & Explanation:**\n1. **B (Queue)**: Queues follow FIFO where elements are added at the rear and removed from the front.\n2. **C (PUT)**: A PUT request replaces the target resource entirely, producing the same result regardless of how many times it is executed.`,
      model: 'fallback-engine',
      timestamp: new Date().toISOString(),
    };
  }

  if (msgLower.includes('code') || msgLower.includes('python') || msgLower.includes('javascript') || msgLower.includes('react') || msgLower.includes('function') || msgLower.includes('algorithm')) {
    return {
      reply: `### 💻 Technical Guide & Solution\n\nHere is an explanation and example for **"${msg}"**:\n\n\`\`\`javascript\n// Clean modern implementation example\nfunction solveProblem(input) {\n  console.log('Processing input:', input);\n  return { success: true, processedAt: new Date().toISOString() };\n}\n\n// Example usage\nconst result = solveProblem('${msg.slice(0, 20)}');\nconsole.log(result);\n\`\`\`\n\n**Key Takeaways:**\n- Ensure proper input validation and error handling.\n- Maintain clean separation of concerns and modularity.\n- Keep algorithms optimized for time and space complexity.\n\n*Feel free to ask follow-up questions or request modifications!*`,
      model: 'fallback-engine',
      timestamp: new Date().toISOString(),
    };
  }

  // Open-ended synthesized response for any general question
  return {
    reply: `### 🤖 Gemini Personal AI Assistant\n\nHere is a comprehensive breakdown on **${msg}**:\n\n1. **Overview & Key Concepts:**\n   * Understanding the core principles and context around your question.\n   * Breaking down the problem step-by-step for maximum clarity.\n\n2. **Actionable Insights:**\n   * Apply best practices and structured approaches to master this topic.\n   * Practice with real-world examples and interactive exercises.\n\n3. **Recommended Next Steps:**\n   * Let me know if you would like code examples, practice quiz questions, or a customized study plan on this!\n\n*How else can I assist you today?*`,
    model: 'fallback-engine',
    timestamp: new Date().toISOString(),
  };
}

