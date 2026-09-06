import questionnaireData from '../data/careerQuestionnaire.js';
import { CATEGORY_INFO, CAREER_DATABASE } from '../data/careerDatabase.js';

export { CATEGORY_INFO, CAREER_DATABASE };

export const MAX_SCORES = questionnaireData.max_scores_per_category || {
  SW: 56,
  AI: 43,
  CY: 30,
  UX: 45,
  EE: 28,
  BM: 51,
  FIN: 39,
  MKT: 23,
  HC: 48,
  EDU: 38,
  RES: 34,
  LAW: 38,
  MED: 47,
  GOV: 35,
};

export const CATEGORY_NAMES = questionnaireData.categories || {
  SW: 'Software / IT',
  AI: 'AI & Data Science',
  CY: 'Cybersecurity',
  UX: 'UI/UX & Design',
  EE: 'Electronics / Engineering',
  BM: 'Business & Management',
  FIN: 'Finance',
  MKT: 'Marketing',
  HC: 'Healthcare',
  EDU: 'Education',
  RES: 'Research',
  LAW: 'Law',
  MED: 'Media / Content / Creative',
  GOV: 'Government / Public Service',
};

/**
 * Calculates raw category totals and normalized percentages deterministically
 * from the student's 30 assessment answers.
 *
 * @param {Object} answers - Map of question id to selected option object or option label.
 *                           e.g. { 1: { label: 'A', ... }, 2: 'B' } or { "1": "A" }
 */
export function calculateCategoryScores(answers = {}) {
  // Initialize all 14 category totals to 0
  const categoryTotals = {};
  Object.keys(MAX_SCORES).forEach((cat) => {
    categoryTotals[cat] = 0;
  });

  const questionMap = new Map();
  questionnaireData.questions.forEach((q) => {
    questionMap.set(Number(q.id), q);
  });

  // Track dimension scores for nuanced insights
  const dimensionScores = {
    Interests: {},
    Strengths: {},
    'Work Style': {},
    'Problem-Solving': {},
    'Work Environment': {},
    Motivation: {},
    'Activities Enjoyed': {},
  };

  // Iterate over answers and accumulate weights
  Object.entries(answers).forEach(([qIdKey, selectedVal]) => {
    const qId = Number(qIdKey);
    const question = questionMap.get(qId);
    if (!question) return;

    let selectedOption = null;

    // Support both passing the full option object or passing option label / text
    if (typeof selectedVal === 'object' && selectedVal !== null) {
      selectedOption = selectedVal;
    } else if (typeof selectedVal === 'string') {
      selectedOption = question.options.find(
        (opt) => opt.label === selectedVal || opt.text === selectedVal
      );
    }

    if (selectedOption && selectedOption.weights) {
      const dim = question.dimension || 'Interests';
      if (!dimensionScores[dim]) dimensionScores[dim] = {};

      Object.entries(selectedOption.weights).forEach(([cat, weight]) => {
        if (typeof categoryTotals[cat] === 'number') {
          categoryTotals[cat] += weight;
        }
        dimensionScores[dim][cat] = (dimensionScores[dim][cat] || 0) + weight;
      });
    }
  });

  // Calculate normalized percentages: actualScore / maximumScore * 100
  const normalizedScores = {};
  Object.keys(MAX_SCORES).forEach((cat) => {
    const raw = categoryTotals[cat] || 0;
    const max = MAX_SCORES[cat] || 1;
    const pct = Math.min(100, Math.round((raw / max) * 100));
    normalizedScores[cat] = pct;
  });

  // Rank categories from strongest to weakest
  const strongestCategories = Object.keys(MAX_SCORES)
    .map((code) => {
      const info = CATEGORY_INFO[code] || {};
      return {
        code,
        name: CATEGORY_NAMES[code] || code,
        field: info.field || 'General',
        color: info.color || 'blue',
        rawScore: categoryTotals[code] || 0,
        maxScore: MAX_SCORES[code],
        percentage: normalizedScores[code] || 0,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  // Overall aggregate score index (weighted average of top 5 categories)
  const top5 = strongestCategories.slice(0, 5);
  const overallScore = top5.length > 0
    ? Math.round(top5.reduce((sum, item) => sum + item.percentage, 0) / top5.length)
    : 75;

  return {
    categoryTotals,
    normalizedScores,
    strongestCategories,
    dimensionScores,
    overallScore,
  };
}

/**
 * Deterministically calculates career matches using the student's category scores.
 *
 * @param {Object} normalizedScores - Normalized score percentages for all 14 categories.
 * @param {Object} categoryTotals - Raw category totals.
 * @param {Object} profile - Optional student profile details (skills, interests, degree).
 */
export function matchCareersFromScores(normalizedScores, categoryTotals = {}, profile = {}) {
  const userSkills = Array.isArray(profile?.skills)
    ? profile.skills.map((s) => s.toLowerCase().trim())
    : [];

  const userInterests = Array.isArray(profile?.interests)
    ? profile.interests.map((i) => i.toLowerCase().trim())
    : [];

  // 1. Sort all 14 categories by normalized score (highest first)
  const sortedCategories = Object.entries(normalizedScores)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, score], rank) => ({ cat, score, rank }));

  const categoryRankMap = {};
  sortedCategories.forEach((item) => {
    categoryRankMap[item.cat] = item.rank;
  });

  const topCategory = sortedCategories[0]?.cat;
  const topScore = sortedCategories[0]?.score || 0;

  // Always identify top 3 categories by ranking, plus 4th if within close score range
  const topCategoryCodes = new Set(sortedCategories.slice(0, 3).map((c) => c.cat));
  if (sortedCategories[3] && sortedCategories[3].score >= Math.max(15, topScore * 0.5)) {
    topCategoryCodes.add(sortedCategories[3].cat);
  }

  // 2. Score each career deterministically based on primary category fit
  const scoredCareers = CAREER_DATABASE.map((career) => {
    const primaryCode = career.primaryCategory;
    const primaryScore = normalizedScores[primaryCode] || 0;
    const rank = categoryRankMap[primaryCode] ?? 99;

    // Secondary categories contribution
    let secondarySum = 0;
    const secondaries = career.secondaryCategories || [];
    secondaries.forEach((secCode) => {
      secondarySum += normalizedScores[secCode] || 0;
    });
    const secondaryAvg = secondaries.length > 0 ? secondarySum / secondaries.length : primaryScore;

    // Profile skill overlap bonus (up to +6%)
    let skillBonus = 0;
    if (userSkills.length > 0 && career.requiredSkills) {
      const matchCount = career.requiredSkills.filter((req) =>
        userSkills.some((us) => req.name.toLowerCase().includes(us) || us.includes(req.name.toLowerCase()))
      ).length;
      skillBonus = Math.min(6, matchCount * 2);
    }

    // Profile interest overlap bonus (up to +4%)
    let interestBonus = 0;
    if (userInterests.length > 0) {
      const catName = (CATEGORY_NAMES[primaryCode] || '').toLowerCase();
      const careerTitle = career.title.toLowerCase();
      if (
        userInterests.some((ui) => catName.includes(ui) || ui.includes(catName) || careerTitle.includes(ui) || ui.includes(careerTitle))
      ) {
        interestBonus = 4;
      }
    }

    // Deterministic match formula:
    // 75% Primary Category Score + 20% Secondary Category Score + Skill/Interest Boost
    const rawMatch = primaryScore * 0.75 + secondaryAvg * 0.20 + skillBonus + interestBonus;
    
    // Scale and bound cleanly between 25% and 98%
    const matchScore = Math.min(98, Math.max(25, Math.round(rawMatch)));

    // Why it matches explanation template
    const primaryName = CATEGORY_NAMES[primaryCode] || primaryCode;
    const whyMatch = `Strongly aligns with your ${primaryScore}% fit in ${primaryName}, reflecting high aptitude in ${career.strengths?.slice(0, 2).join(' and ') || 'key areas'}.`;

    return {
      ...career,
      matchScore,
      whyMatch,
      primaryScore,
      secondaryAvg: Math.round(secondaryAvg),
      rank,
      isTopCategory: topCategoryCodes.has(primaryCode),
    };
  });

  // 3. Sort descending by:
  // 1. Is in student's top categories
  // 2. Category Rank (Rank 0 category first, Rank 1 second, etc.)
  // 3. matchScore descending
  scoredCareers.sort((a, b) => {
    if (a.isTopCategory !== b.isTopCategory) {
      return a.isTopCategory ? -1 : 1;
    }
    if (a.rank !== b.rank) {
      return a.rank - b.rank; // Lower rank index = higher category score
    }
    return b.matchScore - a.matchScore;
  });

  // 4. Select top 4-6 diverse matches directly from the student's highest scoring categories
  const topMatches = [];
  const categoryCounts = {};

  for (const career of scoredCareers) {
    if (topMatches.length >= 6) break;
    if (!career.isTopCategory && topMatches.length >= 3) break;

    const count = categoryCounts[career.primaryCategory] || 0;
    // Allow up to 3 roles for top #1 category, and up to 2 roles for runner-up categories
    const maxForThisCat = career.primaryCategory === topCategory ? 3 : 2;

    if (count < maxForThisCat) {
      categoryCounts[career.primaryCategory] = count + 1;
      topMatches.push(career);
    }
  }

  // Generate top strengths and key development areas
  const topStrengths = extractKeyStrengths(normalizedScores, topMatches);
  const areasForDevelopment = extractDevelopmentAreas(normalizedScores, topMatches);

  return {
    topMatches,
    allScoredCareers: scoredCareers,
    topStrengths,
    areasForDevelopment,
  };
}

/**
 * Extracts key overarching student strengths based on their highest scoring categories.
 */
function extractKeyStrengths(normalizedScores, topCareers) {
  const strengthsMap = {
    SW: 'Algorithmic logic and systematic code troubleshooting',
    AI: 'Data-driven pattern detection and quantitative reasoning',
    CY: 'Adversarial vigilance and systems protection mindset',
    UX: 'User-centered design empathy and visual hierarchy',
    EE: 'Hands-on hardware experimentation and physical engineering',
    BM: 'Strategic business organization and cross-functional leadership',
    FIN: 'Financial forecasting, valuation, and numerical precision',
    MKT: 'Persuasive audience communication and growth strategy',
    HC: 'Patient-first healthcare dedication and biological empathy',
    EDU: 'Clear pedagogical breakdown and mentorship instincts',
    RES: 'Investigative discovery and first-principles scientific inquiry',
    LAW: 'Structured legal argumentation and statutory compliance',
    MED: 'Creative visual storytelling and multimedia production',
    GOV: 'Public service leadership and policy administration',
  };

  const sortedCats = Object.entries(normalizedScores).sort((a, b) => b[1] - a[1]);
  const strengths = [];

  for (const [code] of sortedCats) {
    if (strengthsMap[code] && strengths.length < 4 && (normalizedScores[code] || 0) > 10) {
      strengths.push(strengthsMap[code]);
    }
  }

  // If no strengths found due to all 0s, default safely based on top matched careers
  if (strengths.length === 0 && topCareers && topCareers.length > 0) {
    topCareers.forEach((c) => {
      if (c.strengths && strengths.length < 4) {
        c.strengths.slice(0, 1).forEach((s) => {
          if (!strengths.includes(s) && strengths.length < 4) strengths.push(s);
        });
      }
    });
  }

  return strengths.length > 0
    ? strengths
    : [
        'Creative and analytical inquiry across diverse disciplines',
        'Strong contextual comprehension and communication capability',
        'Structured approach to problem solving and domain learning',
      ];
}

/**
 * Extracts suggested areas for development from lower scoring categories and career requirements.
 */
function extractDevelopmentAreas(normalizedScores, topMatches) {
  const gaps = new Set();

  topMatches.forEach((career) => {
    if (Array.isArray(career.skillGaps)) {
      career.skillGaps.slice(0, 2).forEach((gap) => gaps.add(gap));
    }
  });

  const result = Array.from(gaps).slice(0, 4);

  return result.length > 0
    ? result
    : [
        'Hands-on portfolio project building with modern industry tools',
        'Practical domain workflow execution and peer collaboration',
        'Targeted skill certifications to solidify credentials',
      ];
}
