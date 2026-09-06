import fs from 'fs';

const questionnaire = JSON.parse(fs.readFileSync('src/data/careerQuestionnaire.json', 'utf8'));

const questionsWithMed = [];
const questionsWithoutMed = [];

questionnaire.questions.forEach((q) => {
  const hasMed = q.options.some(opt => opt.weights && opt.weights.MED > 0);
  if (hasMed) {
    questionsWithMed.push(q.id);
  } else {
    questionsWithoutMed.push(q.id);
  }
});

console.log('Questions WITH MED option (' + questionsWithMed.length + '):', questionsWithMed);
console.log('Questions WITHOUT MED option (' + questionsWithoutMed.length + '):', questionsWithoutMed);
