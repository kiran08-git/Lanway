import fs from 'fs';

const questionnaire = JSON.parse(fs.readFileSync('src/data/careerQuestionnaire.json', 'utf8'));

console.log('Total Questions:', questionnaire.questions.length);

questionnaire.questions.forEach((q) => {
  const medOptions = q.options.filter(opt => opt.weights && (opt.weights.MED || opt.weights.UX || opt.weights.MKT));
  console.log(`Q${q.id} [${q.dimension}]: "${q.text.substring(0, 45)}..."`);
  q.options.forEach(opt => {
    const weightsStr = Object.entries(opt.weights || {}).map(([k, v]) => `${k}:${v}`).join(', ');
    console.log(`  Option ${opt.label}: "${opt.text.substring(0, 40)}..." -> [${weightsStr}]`);
  });
  console.log('---');
});
