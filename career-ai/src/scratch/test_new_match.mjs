import fs from 'fs';
import path from 'path';

const questionnaire = JSON.parse(fs.readFileSync('src/data/careerQuestionnaire.json', 'utf8'));
const dbModule = await import('../data/careerDatabase.js');
const scoringModule = await import('../lib/scoringEngine.js');

// Arts answers
const artsAnswers = {};
questionnaire.questions.forEach((q) => {
  let bestOpt = q.options[0];
  let maxArtsWeight = -1;

  q.options.forEach((opt) => {
    const weights = opt.weights || {};
    const artsScore = (weights.MED || 0) * 3 + (weights.UX || 0) * 2 + (weights.EDU || 0) * 2 + (weights.LAW || 0) * 2 + (weights.MKT || 0) * 2 + (weights.GOV || 0);
    const techScore = (weights.SW || 0) * 3 + (weights.AI || 0) * 2 + (weights.CY || 0) * 2 + (weights.EE || 0) * 2;
    const net = artsScore - techScore;
    if (net > maxArtsWeight) {
      maxArtsWeight = net;
      bestOpt = opt;
    }
  });

  artsAnswers[q.id] = bestOpt;
});

const scores = scoringModule.calculateCategoryScores(artsAnswers);

const artsProfile = {
  name: 'Aarav Artiste',
  degree: 'Bachelor of Arts (BA)',
  branch: 'English Literature & Digital Media',
  year: '3rd Year',
  skills: ['Content Writing', 'Graphic Design', 'Storytelling'],
  interests: ['Media', 'Design', 'Creative Writing', 'Journalism'],
  careerGoal: 'Creative Director or Content Strategist',
};

// Let's test the new match logic:
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

const newMatches = testMatchLogic(scores.normalizedScores, scores.categoryTotals, artsProfile);
console.log('\n--- NEW MATCH RESULTS FOR ARTS STUDENT ---');
newMatches.forEach((c, i) => {
  console.log(`${i+1}. [${c.primaryCategory}] ${c.title} (${c.field}) -> ${c.matchScore}% Match`);
});
