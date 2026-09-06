import fs from 'fs';
import path from 'path';

const questionnaire = JSON.parse(fs.readFileSync('src/data/careerQuestionnaire.json', 'utf8'));
const dbModule = await import('../data/careerDatabase.js');
const scoringModule = await import('../lib/scoringEngine.js');

// Tech answers (picking EE / SW / AI / CY options)
const techAnswers = {
  1: 'A', // EE: 3, SW: 1
  2: 'B', // AI: 3, SW: 1
  3: 'A', // AI: 2, FIN: 2, RES: 1
  4: 'A', // SW: 3, AI: 1
  5: 'A', // EE: 3, SW: 1
  6: 'A', // SW: 3
  7: 'A', // SW: 2, EE: 2, CY: 1
  8: 'A', // SW: 3, EE: 2
  9: 'A', // SW: 3
  10: 'A', // SW: 2, CY: 2, EE: 1
  11: 'A', // SW: 3
  12: 'A', // SW: 2, AI: 2, CY: 1
  13: 'B', // MED: 2, UX: 2, SW: 1
  14: 'B', // SW: 2, EE: 2, CY: 2
  15: 'A', // SW: 2, EE: 2, AI: 1
  16: 'A', // AI: 2, RES: 1, FIN: 1
  17: 'A', // SW: 3, EE: 1
  18: 'A', // SW: 3, CY: 2
  19: 'A', // SW: 2, AI: 2
  20: 'A', // AI: 2, FIN: 2, RES: 1
  21: 'A', // SW: 2, AI: 2, CY: 1
  22: 'B', // SW: 1, MED: 1, BM: 1
  23: 'A', // SW: 2, AI: 1, MKT: 1
  24: 'B', // SW: 2, AI: 2, CY: 1
  25: 'A', // SW: 2, AI: 2
  26: 'C', // AI: 2, RES: 2, SW: 1
  27: 'A', // SW: 2, EE: 2
  28: 'A', // SW: 2, AI: 1, EE: 1
  29: 'A', // SW: 3
  30: 'A', // SW: 2, AI: 1
};

const scores = scoringModule.calculateCategoryScores(techAnswers);
console.log('Tech Scores - Top 3:', scores.strongestCategories.slice(0, 3));

const techProfile = {
  name: 'Rahul Dev',
  degree: 'B.Tech',
  branch: 'Computer Science',
  skills: ['React', 'Node.js', 'Python'],
  interests: ['Coding', 'AI', 'Software'],
};

function testMatchLogic(normalizedScores, categoryTotals, profile) {
  const userSkills = Array.isArray(profile?.skills)
    ? profile.skills.map((s) => s.toLowerCase().trim())
    : [];

  const userInterests = Array.isArray(profile?.interests)
    ? profile.interests.map((i) => i.toLowerCase().trim())
    : [];

  const sortedCategories = Object.entries(normalizedScores)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, score]) => ({ cat, score }));

  const topCategoryCodes = new Set(
    sortedCategories
      .filter((c) => c.score > 20)
      .slice(0, 4)
      .map((c) => c.cat)
  );

  if (topCategoryCodes.size === 0) {
    sortedCategories.slice(0, 3).forEach((c) => topCategoryCodes.add(c.cat));
  }

  const scoredCareers = dbModule.CAREER_DATABASE.map((career) => {
    const primaryCode = career.primaryCategory;
    const primaryScore = normalizedScores[primaryCode] || 0;

    let secondarySum = 0;
    const secondaries = career.secondaryCategories || [];
    secondaries.forEach((secCode) => {
      secondarySum += normalizedScores[secCode] || 0;
    });
    const secondaryAvg = secondaries.length > 0 ? secondarySum / secondaries.length : primaryScore;

    let skillBonus = 0;
    if (userSkills.length > 0 && career.requiredSkills) {
      const matchCount = career.requiredSkills.filter((req) =>
        userSkills.some((us) => req.name.toLowerCase().includes(us) || us.includes(req.name.toLowerCase()))
      ).length;
      skillBonus = Math.min(8, matchCount * 2.5);
    }

    let interestBonus = 0;
    if (userInterests.length > 0) {
      const catName = (scoringModule.CATEGORY_NAMES[primaryCode] || '').toLowerCase();
      const careerTitle = career.title.toLowerCase();
      if (
        userInterests.some((ui) => catName.includes(ui) || ui.includes(catName) || careerTitle.includes(ui) || ui.includes(careerTitle))
      ) {
        interestBonus = 4;
      }
    }

    const rawMatch = primaryScore * 0.70 + secondaryAvg * 0.25 + skillBonus + interestBonus;
    const matchScore = Math.min(98, Math.max(30, Math.round(rawMatch)));

    const primaryName = scoringModule.CATEGORY_NAMES[primaryCode] || primaryCode;
    const whyMatch = `Strongly aligns with your ${primaryScore}% fit in ${primaryName}, reflecting high aptitude in ${career.strengths?.slice(0, 2).join(' and ') || 'key skills'}.`;

    return {
      ...career,
      matchScore,
      whyMatch,
      primaryScore,
      secondaryAvg: Math.round(secondaryAvg),
      isTopCategory: topCategoryCodes.has(primaryCode),
    };
  });

  scoredCareers.sort((a, b) => {
    if (a.isTopCategory !== b.isTopCategory) {
      return a.isTopCategory ? -1 : 1;
    }
    return b.matchScore - a.matchScore;
  });

  const topMatches = [];
  const categoryCounts = {};

  for (const career of scoredCareers) {
    if (topMatches.length >= 6) break;
    if (career.primaryScore < 15 && topMatches.length >= 3) break;

    const count = categoryCounts[career.primaryCategory] || 0;
    if (count < 2) {
      categoryCounts[career.primaryCategory] = count + 1;
      topMatches.push(career);
    }
  }

  if (topMatches.length < 4) {
    for (const career of scoredCareers) {
      if (topMatches.length >= 4) break;
      if (!topMatches.some((m) => m.id === career.id)) {
        topMatches.push(career);
      }
    }
  }

  return topMatches;
}

const techMatches = testMatchLogic(scores.normalizedScores, scores.categoryTotals, techProfile);
console.log('\n--- MATCH RESULTS FOR TECH STUDENT ---');
techMatches.forEach((c, i) => {
  console.log(`${i+1}. [${c.primaryCategory}] ${c.title} (${c.field}) -> ${c.matchScore}% Match`);
});
