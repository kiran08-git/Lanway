import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Calculator, Heart, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { assessmentQuestions } from '../data/mockData';

const SECTIONS = [
  { key: 'skill', label: 'Skill Assessment', icon: Brain, color: 'blue' },
  { key: 'aptitude', label: 'Aptitude Test', icon: Calculator, color: 'purple' },
  { key: 'interest', label: 'Interest Profiling', icon: Heart, color: 'blue' },
];

export default function Assessment() {
  const navigate = useNavigate();
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);

  const section = SECTIONS[sectionIdx];
  const questions = assessmentQuestions[section.key];
  const question = questions[questionIdx];

  const totalQuestions = SECTIONS.reduce((sum, s) => sum + assessmentQuestions[s.key].length, 0);
  const answeredCount = Object.keys(answers).length;
  const overallProgress = Math.round((answeredCount / totalQuestions) * 100);

  const selectAnswer = (option) => {
    setAnswers((prev) => ({ ...prev, [question.id]: option }));
  };

  const goNext = () => {
    if (questionIdx < questions.length - 1) {
      setQuestionIdx(questionIdx + 1);
    } else if (sectionIdx < SECTIONS.length - 1) {
      setSectionIdx(sectionIdx + 1);
      setQuestionIdx(0);
    } else {
      setAnalyzing(true);
      setTimeout(() => navigate('/careers'), 1800);
    }
  };

  const goBack = () => {
    if (questionIdx > 0) {
      setQuestionIdx(questionIdx - 1);
    } else if (sectionIdx > 0) {
      setSectionIdx(sectionIdx - 1);
      setQuestionIdx(assessmentQuestions[SECTIONS[sectionIdx - 1].key].length - 1);
    }
  };

  if (analyzing) {
    return (
      <DashboardLayout title="Assessment" subtitle="Analyzing your responses">
        <Card className="p-16 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-blue-600 to-brand-purple-600 flex items-center justify-center text-white mb-6 animate-pulse">
            <Sparkles size={28} />
          </div>
          <h2 className="font-display font-bold text-xl text-brand-ink-900 mb-2">Analyzing your responses…</h2>
          <p className="text-sm text-brand-ink-500">Our AI is matching your answers against 120+ career paths.</p>
        </Card>
      </DashboardLayout>
    );
  }

  const isLastQuestion = sectionIdx === SECTIONS.length - 1 && questionIdx === questions.length - 1;
  const selected = answers[question.id];

  return (
    <DashboardLayout title="Assessment" subtitle="Skill, Aptitude & Interest evaluation">
      {/* Section tabs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-7">
        {SECTIONS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === sectionIdx;
          const isDone = i < sectionIdx;
          return (
            <Card
              key={s.key}
              className={`flex-1 p-4 flex items-center gap-3 ${isActive ? 'ring-2 ring-brand-blue-400 border-transparent' : ''}`}
            >
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                  isDone
                    ? 'bg-emerald-50 text-emerald-600'
                    : isActive
                    ? 'bg-brand-blue-50 text-brand-blue-600'
                    : 'bg-brand-ink-100 text-brand-ink-400'
                }`}
              >
                {isDone ? <CheckCircle2 size={19} /> : <Icon size={19} />}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold truncate ${isActive ? 'text-brand-ink-900' : 'text-brand-ink-500'}`}>{s.label}</p>
                <p className="text-xs text-brand-ink-400">{assessmentQuestions[s.key].length} questions</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-brand-ink-500">Overall progress</span>
          <span className="font-semibold text-brand-ink-900">{overallProgress}%</span>
        </div>
        <ProgressBar value={overallProgress} color="mixed" />
      </div>

      {/* Question card */}
      <Card className="p-6 sm:p-10 max-w-2xl mx-auto animate-fade-up">
        <p className="text-xs font-semibold text-brand-purple-500 uppercase tracking-wide mb-3">
          {section.label} · Question {questionIdx + 1} of {questions.length}
        </p>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-ink-900 mb-7 leading-snug">
          {question.question}
        </h2>

        <div className="space-y-3 mb-8">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => selectAnswer(option)}
              className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                selected === option
                  ? 'border-brand-blue-500 bg-brand-blue-50 text-brand-blue-800'
                  : 'border-brand-ink-200 text-brand-ink-700 hover:border-brand-blue-300 hover:bg-brand-ink-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" icon={ArrowLeft} onClick={goBack} disabled={sectionIdx === 0 && questionIdx === 0}>
            Back
          </Button>
          <Button variant="primary" icon={isLastQuestion ? Sparkles : ArrowRight} iconPosition="right" onClick={goNext} disabled={!selected}>
            {isLastQuestion ? 'Get my results' : 'Next question'}
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
