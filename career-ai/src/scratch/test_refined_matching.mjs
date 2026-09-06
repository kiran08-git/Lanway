import { CAREER_DATABASE } from '../data/careerDatabase.js';
import { CATEGORY_NAMES } from '../lib/scoringEngine.js';

export function testRefinedMatchCareers(normalizedScores, categoryTotals = {}, profile = {}) {
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

  // Determine valid top categories:
  // Always include top 3 categories. Include 4th if within range.
  const topCategoryCodes = new Set(sortedCategories.slice(0, 3).map((c) => c.cat));
  if (sortedCategories[3] && sortedCategories[3].score >= Math.max(15, topScore * 0.5)) {
    topCategoryCodes.add(sortedCategories[3].cat);
  }

  // 2. Score every career in the database
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

    // Skill overlap bonus (up to +6%)
    let skillBonus = 0;
    if (userSkills.length > 0 && career.requiredSkills) {
      const matchCount = career.requiredSkills.filter((req) =>
        userSkills.some((us) => req.name.toLowerCase().includes(us) || us.includes(req.name.toLowerCase()))
      ).length;
      skillBonus = Math.min(6, matchCount * 2);
    }

    // Interest overlap bonus (up to +4%)
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
    // 75% Primary Category + 20% Secondary Average + Skill/Interest Boost
    const rawMatch = primaryScore * 0.75 + secondaryAvg * 0.20 + skillBonus + interestBonus;
    
    // Scale match score: If primary category is high, match score is high
    const matchScore = Math.min(98, Math.max(25, Math.round(rawMatch)));

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

  // 3. Sort by:
  // - Category Rank (Rank 0 categories first, then Rank 1, etc.)
  // - matchScore descending
  scoredCareers.sort((a, b) => {
    if (a.isTopCategory !== b.isTopCategory) {
      return a.isTopCategory ? -1 : 1;
    }
    if (a.rank !== b.rank) {
      return a.rank - b.rank; // Lower rank index means higher category score
    }
    return b.matchScore - a.matchScore;
  });

  // 4. Select diverse top matches from student's top categories:
  // - Take up to 2-3 from Rank 0 (Top Category)
  // - Take up to 2 from Rank 1
  // - Take up to 1-2 from Rank 2
  const topMatches = [];
  const categoryCounts = {};

  for (const career of scoredCareers) {
    if (topMatches.length >= 6) break;
    if (!career.isTopCategory && topMatches.length >= 3) break;

    const count = categoryCounts[career.primaryCategory] || 0;
    const maxForThisCat = career.primaryCategory === topCategory ? 3 : 2;

    if (count < maxForThisCat) {
      categoryCounts[career.primaryCategory] = count + 1;
      topMatches.push(career);
    }
  }

  return {
    topMatches,
    allScoredCareers: scoredCareers,
  };
}

const mediaScores = {
  SW: 15,
  AI: 12,
  CY: 10,
  UX: 55,
  EE: 5,
  BM: 20,
  FIN: 10,
  MKT: 45,
  HC: 0,
  EDU: 10,
  RES: 8,
  LAW: 5,
  MED: 85,
  GOV: 0
};

const res = testRefinedMatchCareers(mediaScores, {}, {
  name: 'Ananya Sharma',
  skills: ['Video Editing', 'Storytelling'],
  interests: ['Media', 'Content Creation'],
});

console.log('Results with Media #1:');
res.topMatches.forEach((m, idx) => {
  console.log(`${idx + 1}. [${m.primaryCategory}] ${m.title} -> Match: ${m.matchScore}% | why: ${m.whyMatch}`);
});

const lawScores = {
  SW: 10, AI: 10, CY: 15, UX: 5, EE: 0, BM: 35, FIN: 20, MKT: 15, HC: 0, EDU: 10, RES: 25, LAW: 90, MED: 10, GOV: 60
};
const resLaw = testRefinedMatchCareers(lawScores, {}, {});
console.log('\nResults with Law #1:');
resLaw.topMatches.forEach((m, idx) => {
  console.log(`${idx + 1}. [${m.primaryCategory}] ${m.title} -> Match: ${m.matchScore}%`);
});

