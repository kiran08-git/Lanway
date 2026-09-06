import fs from 'fs';

const questionnaire = JSON.parse(fs.readFileSync('src/data/careerQuestionnaire.json', 'utf8'));

const catSums = {};
Object.keys(questionnaire.categories).forEach(c => { catSums[c] = 0; });

questionnaire.questions.forEach((q) => {
  const maxInQuestion = {};
  q.options.forEach((opt) => {
    Object.entries(opt.weights || {}).forEach(([cat, w]) => {
      maxInQuestion[cat] = Math.max(maxInQuestion[cat] || 0, w);
    });
  });
  Object.entries(maxInQuestion).forEach(([cat, w]) => {
    catSums[cat] = (catSums[cat] || 0) + w;
  });
});

console.log('Current max_scores_per_category in file:', questionnaire.max_scores_per_category);
console.log('Calculated theoretical max points per category:', catSums);
