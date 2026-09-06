import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const questionnaire = JSON.parse(fs.readFileSync('src/data/careerQuestionnaire.json', 'utf8'));
const scoringModule = await import('../lib/scoringEngine.js');

console.log('Total questions:', questionnaire.questions.length);

// Let's create an "Arts Student" who picks options with MED, UX, EDU, LAW, MKT, HC, GOV, BM
const artsAnswers = {};

questionnaire.questions.forEach((q) => {
  // Find the option with highest creative / arts / media / humanities weight
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

console.log('Simulated 30 Arts Answers. Sample Q1:', artsAnswers[1]);

const scores = scoringModule.calculateCategoryScores(artsAnswers);
console.log('\n--- Calculated Scores ---');
console.log('Category Totals:', scores.categoryTotals);
console.log('Normalized Scores:', scores.normalizedScores);
console.log('Strongest Categories:', scores.strongestCategories.slice(0, 5));

const artsProfile = {
  name: 'Aarav Artiste',
  degree: 'Bachelor of Arts (BA)',
  branch: 'English Literature & Digital Media',
  year: '3rd Year',
  skills: ['Content Writing', 'Copywriting', 'Graphic Design', 'Storytelling'],
  interests: ['Media', 'Design', 'Creative Writing', 'Journalism'],
  careerGoal: 'Creative Director or Content Strategist',
};

const matches = scoringModule.matchCareersFromScores(scores.normalizedScores, scores.categoryTotals, artsProfile);
console.log('\n--- Matched Careers ---');
matches.topMatches.forEach((c, idx) => {
  console.log(`${idx + 1}. ${c.title} (${c.field}) - ${c.matchScore}% Match [Primary: ${c.primaryCategory}]`);
});

console.log('\n--- Top Strengths ---');
console.log(matches.topStrengths);

console.log('\n--- Development Areas ---');
console.log(matches.areasForDevelopment);
