import fs from 'fs';
import path from 'path';

const questionnaire = JSON.parse(fs.readFileSync('src/data/careerQuestionnaire.json', 'utf8'));
const dbModule = await import('../data/careerDatabase.js');
const scoringModule = await import('../lib/scoringEngine.js');

// Create answers where student picks Media / Creative options
const mediaAnswers = {};
questionnaire.questions.forEach((q) => {
  // Find option that has MED weight or UX weight or Artistic
  const medOption = q.options.find(opt => opt.weights && opt.weights.MED) || q.options[0];
  mediaAnswers[q.id] = medOption;
});

console.log('Testing Media Answers...');
const scores = scoringModule.calculateCategoryScores(mediaAnswers);
console.log('Category Totals:', scores.categoryTotals);
console.log('Normalized Scores:', scores.normalizedScores);
console.log('Strongest Categories:', scores.strongestCategories.slice(0, 5));

const matched = scoringModule.matchCareersFromScores(scores.normalizedScores, scores.categoryTotals, {
  name: 'Creative Student',
  skills: ['Video Editing', 'Content Creation', 'Canva'],
  interests: ['Media', 'Filmmaking', 'Content Creation'],
});

console.log('\nTop Matched Careers:');
matched.topMatches.forEach((c, i) => {
  console.log(`${i+1}. ${c.title} (Primary: ${c.primaryCategory}, Match: ${c.matchScore}%, why: ${c.whyMatch})`);
});
