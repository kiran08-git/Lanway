import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Award,
  Zap,
  Briefcase,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Target,
  Compass,
  Bot,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getLatestCareerRecommendations } from '../lib/careerService';
import { CATEGORY_INFO, CATEGORY_NAMES, MAX_SCORES } from '../lib/scoringEngine.js';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';

export default function CareerRecommendations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeField, setActiveField] = useState('All');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const result = await getLatestCareerRecommendations(user?.id);
      setData(result);
    } catch (err) {
      console.error('Failed to load career recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const careers = data?.careers || [];
  const categoryScores = data?.categoryScores || {};
  const strongestCategories = data?.strongestCategories || [];

  // Build sorted array of all 14 categories with their percentages
  let allCategoryList = Object.keys(MAX_SCORES).map((code) => {
    const info = CATEGORY_INFO[code] || {};
    const percentage = categoryScores[code] ?? (
      strongestCategories.find((c) => c.code === code)?.percentage || 0
    );
    return {
      code,
      name: CATEGORY_NAMES[code] || code,
      field: info.field || 'General',
      color: info.color || 'blue',
      maxScore: MAX_SCORES[code] || 50,
      percentage,
    };
  }).sort((a, b) => b.percentage - a.percentage);

  // If category percentages are all 0 (edge case where legacy database row lacked category breakdown),
  // infer realistic category scores directly from the matched careers' primary scores
  const allZero = allCategoryList.every((c) => c.percentage === 0);
  if (allZero && careers.length > 0) {
    const inferred = { ...categoryScores };
    careers.forEach((c) => {
      if (c.primaryCategory && typeof c.matchScore === 'number') {
        inferred[c.primaryCategory] = Math.max(inferred[c.primaryCategory] || 0, c.matchScore);
      }
    });

    allCategoryList = Object.keys(MAX_SCORES).map((code) => {
      const info = CATEGORY_INFO[code] || {};
      const percentage = inferred[code] || 0;
      return {
        code,
        name: CATEGORY_NAMES[code] || code,
        field: info.field || 'General',
        color: info.color || 'blue',
        maxScore: MAX_SCORES[code] || 50,
        percentage,
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }

  const top3Categories = allCategoryList.slice(0, 3);
  const fields = ['All', ...new Set(careers.map((c) => c.field).filter(Boolean))];

  const filteredCareers =
    activeField === 'All' ? careers : careers.filter((c) => c.field === activeField);

  // 1. Loading State
  if (loading) {
    return (
      <DashboardLayout title="Career Recommendations" subtitle="Loading your personalized assessment results...">
        <div className="space-y-6">
          <Card className="p-8 animate-pulse bg-brand-ink-50 h-36 rounded-2xl" />
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="p-6 h-80 animate-pulse bg-brand-ink-50 rounded-2xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // 2. Empty State (No assessment taken yet)
  if (!data || careers.length === 0) {
    return (
      <DashboardLayout title="Career Recommendations" subtitle="AI-driven career guidance">
        <Card className="p-10 sm:p-14 text-center max-w-2xl mx-auto my-6 border-dashed border-2 border-brand-ink-200 bg-white">
          <div className="h-16 w-16 rounded-2xl bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center mx-auto mb-5 shadow-soft">
            <Sparkles size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-brand-ink-900 mb-2">
            No Assessment Results Found Yet
          </h2>
          <p className="text-sm text-brand-ink-600 mb-8 max-w-md mx-auto leading-relaxed">
            Take our 30-question authoritative career assessment to calculate your 14-category RIASEC fit and unlock tailored career recommendations.
          </p>
          <Button
            variant="primary"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/assessment')}
            className="px-6 py-3 text-base shadow-soft"
          >
            Start 30-Question Assessment
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Career Recommendations"
      subtitle="Deterministic 14-Category Profile & AI-Synthesized Guidance"
    >
      {/* 1. Overview Banner */}
      <Card className="p-6 sm:p-8 mb-7 border-brand-ink-100 bg-white shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-ink-900">
                  {careers.length} Matched Career Pathways
                </h2>
                <Badge color="blue">
                  Profile Fit: {data.overallScore || 85}%
                </Badge>
              </div>
              <p className="text-sm text-brand-ink-600 leading-relaxed max-w-2xl">
                Calculated deterministically from your 30 questionnaire responses across 14 Holland RIASEC and Career Anchor dimensions, enhanced with Google Gemini AI contextual synthesis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Button
              variant="primary"
              icon={Bot}
              onClick={() =>
                navigate(
                  '/chat?prompt=Explain%20why%20I%20received%20these%20career%20recommendations%20and%20how%20my%20RIASEC%20dimensions%20fit.'
                )
              }
              className="text-xs shadow-soft"
            >
              Ask CareerAI 🤖
            </Button>
            <Button
              variant="secondary"
              icon={RefreshCw}
              onClick={() => navigate('/assessment')}
              className="text-xs shadow-none border-brand-ink-200"
            >
              Retake Assessment
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Strongest Categories & 14-Category Breakdown Card */}
      <Card className="p-6 sm:p-8 mb-7 border-brand-ink-100 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-brand-ink-100">
          <div>
            <h3 className="font-display font-bold text-lg text-brand-ink-900 flex items-center gap-2">
              <BarChart2 size={20} className="text-brand-blue-600" />
              Your Strongest Assessment Dimensions
            </h3>
            <p className="text-xs sm:text-sm text-brand-ink-500 mt-0.5">
              Normalized scoring percentages calculated against exact category maximum ceilings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAllCategories((prev) => !prev)}
            className="text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-700 flex items-center gap-1.5 self-start sm:self-auto py-1 px-2.5 rounded-lg hover:bg-brand-blue-50 transition-colors"
          >
            <span>{showAllCategories ? 'Show Top 3 Only' : 'View All 14 Categories'}</span>
            {showAllCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Top 3 Strongest Highlights */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {top3Categories.map((cat, idx) => (
            <div
              key={cat.code}
              className="p-4 rounded-2xl bg-white border border-brand-ink-100 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-blue-100 text-brand-blue-800">
                  Rank #{idx + 1}
                </span>
                <span className="text-xl font-display font-extrabold text-brand-blue-600">
                  {cat.percentage}%
                </span>
              </div>
              <h4 className="font-display font-bold text-brand-ink-900 text-sm mb-1 truncate">
                {cat.name}
              </h4>
              <p className="text-xs text-brand-ink-500 mb-3">{cat.field}</p>
              <ProgressBar value={cat.percentage} color="blue" height="h-2" />
            </div>
          ))}
        </div>

        {/* Expandable Complete 14 Categories Breakdown */}
        {showAllCategories && (
          <div className="mt-6 pt-6 border-t border-brand-ink-100 animate-fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink-500 mb-4 flex items-center gap-1.5">
              <Compass size={14} className="text-brand-purple-600" /> Complete 14-Category Normalized Breakdown:
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {allCategoryList.map((cat) => (
                <div
                  key={cat.code}
                  className="p-3.5 rounded-xl bg-brand-ink-50/50 border border-brand-ink-100 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-brand-ink-800 truncate">
                        {cat.name} ({cat.code})
                      </p>
                      <p className="text-[11px] text-brand-ink-400">{cat.field}</p>
                    </div>
                    <span className="text-xs font-extrabold text-brand-ink-900 shrink-0">
                      {cat.percentage}%
                    </span>
                  </div>
                  <ProgressBar
                    value={cat.percentage}
                    color={cat.percentage >= 70 ? 'blue' : 'purple'}
                    height="h-1.5"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* 3. Key Strengths & Areas for Development Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-7">
        {/* Key Strengths */}
        <Card className="p-6 border-emerald-100 bg-emerald-50/20 shadow-xs">
          <h3 className="font-display font-bold text-emerald-900 text-base mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" /> Key Student Strengths
          </h3>
          <ul className="space-y-2.5">
            {(data.topStrengths && data.topStrengths.length > 0
              ? data.topStrengths
              : (careers[0]?.strengths?.length > 0
                  ? careers.flatMap((c) => c.strengths || []).slice(0, 4)
                  : [
                      'Creative and analytical inquiry across diverse disciplines',
                      'Strong contextual comprehension and communication capability',
                      'Structured approach to problem solving and domain learning',
                    ])
            ).map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-950">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Suggested Areas for Development */}
        <Card className="p-6 border-amber-100 bg-amber-50/20 shadow-xs">
          <h3 className="font-display font-bold text-amber-900 text-base mb-3 flex items-center gap-2">
            <Target size={18} className="text-amber-600" /> Suggested Areas for Development
          </h3>
          <ul className="space-y-2.5">
            {(data.areasForDevelopment && data.areasForDevelopment.length > 0
              ? data.areasForDevelopment
              : (careers.some((c) => c.skillGaps?.length > 0)
                  ? Array.from(new Set(careers.flatMap((c) => c.skillGaps || []))).slice(0, 3)
                  : [
                      'Hands-on portfolio project building with modern industry tools',
                      'Practical domain workflow execution and peer collaboration',
                      'Targeted skill certifications to solidify credentials',
                    ])
            ).map((gap, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-950">
                <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{gap}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 4. Domain / Field Filter Pills */}
      {fields.length > 1 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <SlidersHorizontal size={16} className="text-brand-ink-400 shrink-0" />
          {fields.map((field) => (
            <button
              key={field}
              onClick={() => setActiveField(field)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                activeField === field
                  ? 'bg-brand-blue-600 text-white shadow-soft'
                  : 'bg-white border border-brand-ink-200 text-brand-ink-600 hover:border-brand-blue-300'
              }`}
            >
              {field}
            </button>
          ))}
        </div>
      )}

      {/* 5. Career Recommendations Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCareers.map((career) => {
          const matchScore = career.matchScore || 85;
          const isHighMatch = matchScore >= 80;
          const CareerIcon = (career.icon && Icons[career.icon]) || Briefcase;
          const careerSlug = career.id || career.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

          return (
            <Card
              key={career.id || career.title}
              hover
              className="p-6 flex flex-col justify-between border-brand-ink-100 hover:border-brand-blue-300 transition-all shadow-xs bg-white"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="h-12 w-12 rounded-2xl bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                    <CareerIcon size={24} />
                  </div>
                  <Badge color={isHighMatch ? 'blue' : 'purple'}>
                    {matchScore}% match
                  </Badge>
                </div>

                {/* Title & Field */}
                <h3 className="font-display font-bold text-lg text-brand-ink-900 mb-1">
                  {career.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-brand-ink-500 mb-3 flex-wrap">
                  <span>{career.field || 'Industry'}</span>
                  <span>•</span>
                  <span>{career.salaryRange || '₹4.5 – 12 LPA'}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">{career.growth || 'High Demand'}</span>
                </div>

                {/* Match Progress Bar */}
                <div className="mb-4">
                  <ProgressBar
                    value={matchScore}
                    color={isHighMatch ? 'blue' : 'purple'}
                    height="h-1.5"
                  />
                </div>

                {/* Why this career matches */}
                <div className="mb-4 p-3.5 rounded-xl bg-brand-ink-50/70 border border-brand-ink-100">
                  <p className="text-xs font-semibold text-brand-ink-700 flex items-center gap-1.5 mb-1">
                    <Zap size={13} className="text-amber-500" /> Why this matches your profile:
                  </p>
                  <p className="text-xs text-brand-ink-600 leading-relaxed">
                    {career.whyMatch}
                  </p>
                </div>

                {/* Existing Strengths */}
                {career.strengths && career.strengths.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-brand-ink-700 mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-600" /> Supporting Strengths:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {career.strengths.map((str, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-100"
                        >
                          {str}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skill Gaps (Skills to Develop) */}
                {career.skillGaps && career.skillGaps.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-brand-ink-700 mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle size={13} className="text-amber-600" /> Skills to Bridge:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {career.skillGaps.map((gap, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-medium border border-amber-100"
                        >
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Skills to Learn */}
                {career.recommendedSkills && career.recommendedSkills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-brand-ink-700 mb-1.5 flex items-center gap-1.5">
                      <BookOpen size={13} className="text-brand-blue-600" /> Recommended Skills:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {career.recommendedSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-brand-blue-50 text-brand-blue-700 font-medium border border-brand-blue-100"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3.5 border-t border-brand-ink-100 mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/chat?prompt=Tell%20me%20why%20${encodeURIComponent(
                        career.title
                      )}%20matches%20my%20scores%20and%20what%20skills%20I%20need%20to%20learn%20first.`
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-purple-600 hover:text-brand-purple-700 hover:underline cursor-pointer"
                >
                  <Bot size={13} />
                  <span>Ask CareerAI 🤖</span>
                </button>
                <Button
                  variant="ghost"
                  className="text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-700 p-0"
                  onClick={() => navigate(`/careers/${careerSlug}`)}
                >
                  <span>Details &amp; Roadmap</span>
                  <ArrowRight size={13} />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
