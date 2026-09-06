import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  HelpCircle,
  ShieldCheck,
  Compass,
  Briefcase,
  Heart,
  Activity,
  Layers,
  Smile,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { analyzeAndSaveCareerPath } from '../lib/careerService';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import questionnaireData from '../data/careerQuestionnaire.js';

const ANALYSIS_STEPS = [
  'Calculating 14-category RIASEC & Career Anchor scores...',
  'Normalizing category percentages against benchmark ceilings...',
  'Connecting to AI Career Counseling Engine...',
  'Evaluating 40+ career paths against your response profile...',
  'Generating personalized skill gap analysis & career roadmaps...',
];

const DIMENSION_ICONS = {
  Interests: Sparkles,
  Strengths: Zap,
  'Work Style': Compass,
  'Problem-Solving': Layers,
  'Work Environment': Briefcase,
  Motivation: Heart,
  'Activities Enjoyed': Activity,
};

export default function Assessment() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // State: 'intro' (Before You Begin), 'questionnaire' or 'analyzing'
  const [assessmentState, setAssessmentState] = useState('intro');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState(null);

  const questions = questionnaireData.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIdx];

  const answeredCount = Object.keys(answers).length;
  const overallProgress = totalQuestions > 0 ? Math.round(((currentQuestionIdx + 1) / totalQuestions) * 100) : 0;

  // Rotate through analysis loading steps
  useEffect(() => {
    let interval;
    if (assessmentState === 'analyzing' && !error) {
      interval = setInterval(() => {
        setStepIndex((prev) => (prev + 1) % ANALYSIS_STEPS.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [assessmentState, error]);

  const handleSelectOption = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleFinishAssessment = async (finalAnswers) => {
    setAssessmentState('analyzing');
    setError(null);
    setStepIndex(0);

    try {
      await analyzeAndSaveCareerPath({
        user,
        profile,
        answers: finalAnswers || answers,
      });

      // Smooth transition to results
      setTimeout(() => {
        navigate('/careers');
      }, 800);
    } catch (err) {
      console.error('Assessment submission error:', err);
      setError(err.message || 'Failed to generate your career analysis. Please try again.');
    }
  };

  const goNext = () => {
    if (!answers[currentQuestion?.id]) return;

    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      handleFinishAssessment(answers);
    }
  };

  const goBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    } else {
      setAssessmentState('intro');
    }
  };

  // =========================================================================
  // 1. BEFORE YOU BEGIN PAGE
  // =========================================================================
  if (assessmentState === 'intro') {
    return (
      <DashboardLayout title="Assessment" subtitle="AI Career Guidance Questionnaire">
        <div className="max-w-5xl mx-auto py-4 sm:py-8">
          <Card className="p-5 sm:p-8 shadow-sm border-brand-ink-100 bg-white">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6 pb-6 border-b border-brand-ink-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center shrink-0">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-display font-extrabold text-brand-ink-900 mb-1">
                    Before You Begin
                  </h1>
                  <p className="text-sm text-brand-ink-500">
                    This is a 30-question chat to figure out what career direction suits you.
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => setAssessmentState('questionnaire')}
                className="w-full sm:w-auto px-6 py-2.5 text-sm shadow-soft shrink-0"
              >
                Start Assessment
              </Button>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 mb-2">
              {/* Section 1 */}
              <div className="p-5 rounded-xl bg-brand-ink-50/60 border border-brand-ink-100 h-full">
                <Compass size={20} className="text-brand-blue-600 mb-3" />
                <h3 className="font-bold text-sm text-brand-ink-900 mb-1.5">What&apos;s coming</h3>
                <p className="text-xs text-brand-ink-600 leading-relaxed">
                  30 multiple-choice questions across different themes: interests, strengths, work styles, and motivation.
                </p>
              </div>
              
              {/* Section 2 */}
              <div className="p-5 rounded-xl bg-brand-ink-50/60 border border-brand-ink-100 h-full">
                <HelpCircle size={20} className="text-brand-purple-600 mb-3" />
                <h3 className="font-bold text-sm text-brand-ink-900 mb-1.5">Heads up</h3>
                <p className="text-xs text-brand-ink-600 leading-relaxed">
                  Some questions might feel a bit similar to double-check consistency. There are no right or wrong answers.
                </p>
              </div>
              
              {/* Section 3 */}
              <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-100 h-full">
                <ShieldCheck size={20} className="text-emerald-600 mb-3" />
                <h3 className="font-bold text-sm text-emerald-950 mb-1.5">Be yourself</h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Answer like no one&apos;s watching. Don&apos;t pick what sounds impressive—just go with your gut feeling.
                </p>
              </div>
            </div>

          </Card>
        </div>
      </DashboardLayout>
    );
  }


  // =========================================================================
  // 2. ANALYZING / LOADING SCREEN
  // =========================================================================
  if (assessmentState === 'analyzing') {
    return (
      <DashboardLayout title="Career AI Analysis" subtitle="Deterministic scoring & AI intelligence in progress">
        <div className="max-w-xl mx-auto py-10">
          <Card className="p-8 sm:p-12 text-center shadow-lg border-brand-blue-100">
            {error ? (
              <div className="space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-brand-ink-900 mb-2">
                    Analysis Encountered an Issue
                  </h2>
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg max-w-md mx-auto">
                    {error}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button
                    variant="primary"
                    icon={RefreshCw}
                    onClick={() => handleFinishAssessment(answers)}
                  >
                    Retry Analysis
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setAssessmentState('questionnaire');
                      setError(null);
                    }}
                  >
                    Return to Questions
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-brand-blue-100 border-t-brand-blue-600 rounded-full animate-spin" />
                  <Sparkles size={24} className="text-brand-blue-600 animate-pulse" />
                </div>

                <div>
                  <h2 className="font-display font-bold text-2xl text-brand-ink-900 mb-2">
                    Analyzing Your Career Profile…
                  </h2>
                  <p className="text-sm font-medium text-brand-blue-600 min-h-[24px] transition-all duration-300">
                    {ANALYSIS_STEPS[stepIndex]}
                  </p>
                  <p className="text-xs text-brand-ink-400 mt-2">
                    Evaluating your responses across 14 Holland RIASEC and Career Anchors dimensions.
                  </p>
                </div>

                <div className="w-full bg-brand-ink-100 h-2 rounded-full overflow-hidden mt-4">
                  <div className="bg-brand-blue-600 h-full w-3/4 animate-pulse rounded-full" />
                </div>

                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-brand-ink-500">
                  <Zap size={14} className="text-amber-500" />
                  <span>Matching real-time career paths & skill requirements</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================================
  // 3. 30-QUESTION ASSESSMENT INTERFACE
  // =========================================================================
  const DimensionIcon = (currentQuestion && DIMENSION_ICONS[currentQuestion.dimension]) || Sparkles;
  const isLastQuestion = currentQuestionIdx === totalQuestions - 1;
  const selectedOption = answers[currentQuestion?.id];

  return (
    <DashboardLayout title="Assessment" subtitle={`Question ${currentQuestionIdx + 1} of ${totalQuestions}`}>
      {/* Top Progress & Dimension Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between gap-4 mb-2 text-xs sm:text-sm">
          {/* Dimension badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue-50 text-brand-blue-700 font-semibold border border-brand-blue-200">
            <DimensionIcon size={14} className="text-brand-blue-600" />
            <span>{currentQuestion?.dimension || 'Dimension'}</span>
          </div>

          {/* Progress text */}
          <div className="text-brand-ink-500 font-medium">
            Question <span className="font-bold text-brand-ink-900">{currentQuestionIdx + 1}</span> of{' '}
            <span className="font-bold text-brand-ink-900">{totalQuestions}</span>
            <span className="ml-2 font-semibold text-brand-blue-600">({overallProgress}%)</span>
          </div>
        </div>

        <ProgressBar value={overallProgress} color="mixed" height="h-2" />
      </div>

      {/* Main Question Card */}
      <Card className="p-6 sm:p-10 max-w-2xl mx-auto shadow-sm border-brand-ink-100 bg-white">
        {/* Dimension & ID tag */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-purple-600">
            Theme: {currentQuestion?.dimension}
          </p>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-ink-100 text-brand-ink-600">
            #{currentQuestion?.id}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-2xl font-display font-bold text-brand-ink-900 mb-6 leading-snug">
          {currentQuestion?.text}
        </h2>

        {/* Answer Options List (Weights HIDDEN from student) */}
        <div className="space-y-3 mb-8">
          {currentQuestion?.options.map((option) => {
            const isSelected = selectedOption?.label === option.label || selectedOption?.text === option.text;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all duration-150 flex items-center justify-between gap-3 ${isSelected
                    ? 'border-brand-blue-500 bg-brand-blue-50/90 text-brand-blue-950 ring-2 ring-brand-blue-500 shadow-sm'
                    : 'border-brand-ink-200 text-brand-ink-700 hover:border-brand-blue-300 hover:bg-brand-ink-50/60'
                  }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${isSelected
                        ? 'bg-brand-blue-600 text-white shadow-soft'
                        : 'bg-brand-ink-100 text-brand-ink-600'
                      }`}
                  >
                    {option.label}
                  </span>
                  <span className="text-sm leading-relaxed">{option.text}</span>
                </div>

                {isSelected ? (
                  <CheckCircle2 size={19} className="text-brand-blue-600 shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-brand-ink-300 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-brand-ink-100">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={goBack}
          >
            {currentQuestionIdx === 0 ? 'Instructions' : 'Previous'}
          </Button>

          <Button
            variant="primary"
            icon={isLastQuestion ? Sparkles : ArrowRight}
            iconPosition="right"
            onClick={goNext}
            disabled={!selectedOption}
          >
            {isLastQuestion ? 'Generate Career Recommendations' : 'Next Question'}
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
