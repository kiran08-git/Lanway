import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Zap,
  Briefcase,
  ChevronRight,
  BarChart2,
  Target,
  Compass,
  Bot,
  X,
  Code,
  Megaphone,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getLatestCareerRecommendations } from '../lib/careerService';
import { CATEGORY_INFO, CATEGORY_NAMES, MAX_SCORES } from '../lib/scoringEngine.js';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';

export default function CareerRecommendations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeField, setActiveField] = useState('All');
  const [selectedCareerId, setSelectedCareerId] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const result = await getLatestCareerRecommendations(user?.id);
      setData(result);
      if (result?.careers?.length > 0) {
        setSelectedCareerId(result.careers[0].id || result.careers[0].title);
      }
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

  const selectedCareer =
    filteredCareers.find((c) => (c.id || c.title) === selectedCareerId) ||
    filteredCareers[0] ||
    careers[0];

  // Helper to pick icon based on field/title
  const getCareerIcon = (career) => {
    if (!career) return Briefcase;
    const title = (career.title || '').toLowerCase();
    const field = (career.field || '').toLowerCase();
    if (field.includes('tech') || title.includes('developer') || title.includes('code')) return Code;
    if (field.includes('market') || title.includes('seo') || title.includes('analyst')) return Megaphone;
    if (field.includes('engineer') || title.includes('robot')) return Cpu;
    return Briefcase;
  };

  // 1. Loading State
  if (loading) {
    return (
      <DashboardLayout title="Career Matches" subtitle="Analyzing your profile fit...">
        <div className="h-[calc(100vh-130px)] flex flex-col gap-4 animate-pulse">
          <div className="h-16 bg-slate-100 rounded-2xl" />
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5 bg-slate-100 rounded-2xl" />
            <div className="lg:col-span-7 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // 2. Empty State
  if (!data || careers.length === 0) {
    return (
      <DashboardLayout title="Career Matches" subtitle="AI-driven career guidance">
        <div className="h-[calc(100vh-130px)] flex items-center justify-center">
          <Card className="p-8 text-center max-w-md w-full border-dashed border-2 border-slate-200 bg-white shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center mx-auto mb-4 shadow-soft">
              <Sparkles size={28} />
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 mb-2">
              No Assessment Results Yet
            </h2>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Take our career assessment to calculate your RIASEC fit and unlock personalized recommendations.
            </p>
            <Button
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/assessment')}
              className="w-full py-2.5 text-sm shadow-soft"
            >
              Start Assessment
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const selectedMatchScore = selectedCareer?.matchScore || 85;
  const SelectedIcon = getCareerIcon(selectedCareer);
  const selectedSlug = selectedCareer?.id || selectedCareer?.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <DashboardLayout
      title="Career Matches"
      subtitle="Personalized Assessment Fit & Recommendations"
    >
      <div className="h-[calc(100vh-130px)] flex flex-col gap-3 min-h-[600px] overflow-hidden">
        {/* 1. Ultra-Clean Top Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 px-4 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
          {/* Overall Score & Top Traits */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2.5 pr-4 border-r border-slate-200">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-blue-500 to-brand-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Overall Profile Fit
                </p>
                <p className="text-base font-extrabold text-slate-900 leading-tight">
                  {data.overallScore || 85}% Match
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">Top Traits:</span>
              {top3Categories.map((cat, idx) => (
                <span
                  key={cat.code}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1.5"
                >
                  <span className="text-[10px] text-brand-blue-600 font-bold">#{idx + 1}</span>
                  <span>{cat.name}:</span>
                  <strong className="text-slate-900 font-bold">{cat.percentage}%</strong>
                </span>
              ))}
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="text-xs font-bold text-brand-blue-600 hover:text-brand-blue-700 hover:bg-brand-blue-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <BarChart2 size={13} />
                <span>All 14</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <Button
              variant="primary"
              icon={Bot}
              onClick={() =>
                navigate(
                  '/chat?prompt=Explain%20why%20I%20received%20these%20career%20recommendations%20and%20how%20my%20RIASEC%20dimensions%20fit.'
                )
              }
              className="text-xs py-1.5 px-3.5 shadow-soft"
            >
              Ask AI 🤖
            </Button>
            <Button
              variant="secondary"
              icon={RefreshCw}
              onClick={() => navigate('/assessment')}
              className="text-xs py-1.5 px-3 border-slate-200"
            >
              Retake
            </Button>
          </div>
        </div>

        {/* 2. Main Master-Detail Split Screen Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
          {/* Left Column: Career List & Domain Filters */}
          <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200/80 p-3.5 min-h-0 overflow-hidden shadow-xs">
            {/* Filter Pills Header */}
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <SlidersHorizontal size={14} className="text-slate-400 shrink-0" />
                {fields.map((field) => (
                  <button
                    key={field}
                    onClick={() => {
                      setActiveField(field);
                      const matched = field === 'All' ? careers : careers.filter((c) => c.field === field);
                      if (matched.length > 0) {
                        setSelectedCareerId(matched[0].id || matched[0].title);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      activeField === field
                        ? 'bg-brand-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {field}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-400 shrink-0">
                {filteredCareers.length} Match{filteredCareers.length !== 1 ? 'es' : ''}
              </span>
            </div>

            {/* Scrollable Master List */}
            <div className="flex-1 overflow-y-auto space-y-2 py-2.5 pr-1 custom-scrollbar">
              {filteredCareers.map((career) => {
                const matchScore = career.matchScore || 85;
                const isSelected = (career.id || career.title) === (selectedCareer?.id || selectedCareer?.title);
                const CareerIcon = getCareerIcon(career);

                return (
                  <div
                    key={career.id || career.title}
                    onClick={() => setSelectedCareerId(career.id || career.title)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-brand-blue-50/60 border-brand-blue-500 shadow-soft ring-1 ring-brand-blue-500/30 border-l-4 border-l-brand-blue-600'
                        : 'bg-white border-slate-200/70 hover:border-brand-blue-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-brand-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <CareerIcon size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-display font-bold text-xs text-slate-900 truncate">
                          {career.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate mt-0.5">
                          <span>{career.field || 'Industry'}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-700">{career.salaryRange || '₹4.5 – 12 LPA'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                          matchScore >= 50
                            ? 'bg-emerald-100/80 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {matchScore}%
                      </span>
                      <ChevronRight
                        size={15}
                        className={isSelected ? 'text-brand-blue-600' : 'text-slate-300'}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Student Profile Strengths Bar */}
            <div className="pt-2.5 border-t border-slate-100 shrink-0 flex items-center justify-between text-[11px] bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/60">
              <div className="min-w-0 flex-1 pr-2">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-600" /> Core Strength:
                </span>
                <p className="text-slate-600 text-[10px] truncate">
                  {data.topStrengths?.[0] || 'Analytical inquiry & domain learning'}
                </p>
              </div>
              <div className="min-w-0 flex-1 pl-2 border-l border-slate-200">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Target size={13} className="text-amber-600" /> Key Focus Gap:
                </span>
                <p className="text-slate-600 text-[10px] truncate">
                  {data.areasForDevelopment?.[0] || 'State management & scale'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Detail Panel for Selected Career */}
          {selectedCareer && (
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between min-h-0 overflow-y-auto custom-scrollbar shadow-xs">
              <div className="space-y-4">
                {/* Clean Header Card (Fixed Non-Wrapping Layout) */}
                <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-11 w-11 rounded-xl bg-brand-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                        <SelectedIcon size={22} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-display font-extrabold text-slate-900 truncate leading-tight">
                          {selectedCareer.title}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {selectedCareer.field || 'Industry'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-blue-100 text-brand-blue-800 text-xs font-extrabold">
                        <span>{selectedMatchScore}% Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Sub Info Row */}
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-3 text-xs text-slate-600 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200">
                        💰 {selectedCareer.salaryRange || '₹4.5 – 12 LPA'}
                      </span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                        🔥 {selectedCareer.growth || 'High Demand'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-36">
                      <ProgressBar value={selectedMatchScore} color="blue" height="h-2" />
                    </div>
                  </div>
                </div>

                {/* Why this career matches */}
                <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-100">
                  <p className="text-xs font-bold text-blue-950 flex items-center gap-1.5 mb-1">
                    <Zap size={14} className="text-amber-500" /> Match Rationale:
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedCareer.whyMatch || 'Direct alignment with your Holland RIASEC preferences and technical interest indicators.'}
                  </p>
                </div>

                {/* Supporting Strengths & Skill Gaps Grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Supporting Strengths */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 mb-2">
                      <CheckCircle2 size={14} className="text-emerald-600" /> Supporting Strengths
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedCareer.strengths && selectedCareer.strengths.length > 0
                        ? selectedCareer.strengths
                        : ['Visual thinking', 'Attention to interface detail', 'Structured coding']
                      ).map((str, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2.5 py-1 rounded-md bg-white text-emerald-800 font-semibold border border-emerald-200 shadow-2xs"
                        >
                          {str}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills to Bridge */}
                  <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-100">
                    <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-2">
                      <AlertTriangle size={14} className="text-amber-600" /> Skills to Bridge
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedCareer.skillGaps && selectedCareer.skillGaps.length > 0
                        ? selectedCareer.skillGaps
                        : ['State management at scale', 'Frontend performance']
                      ).map((gap, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2.5 py-1 rounded-md bg-white text-amber-800 font-semibold border border-amber-200 shadow-2xs"
                        >
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Recommended Skills */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                    <BookOpen size={14} className="text-brand-blue-600" /> Recommended Skills to Learn
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedCareer.recommendedSkills && selectedCareer.recommendedSkills.length > 0
                      ? selectedCareer.recommendedSkills
                      : ['React.js & Next.js', 'Tailwind CSS', 'TypeScript', 'State Management']
                    ).map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-brand-blue-50 text-brand-blue-700 font-bold border border-brand-blue-100"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/chat?prompt=Tell%20me%20why%20${encodeURIComponent(
                        selectedCareer.title
                      )}%20matches%20my%20scores%20and%20what%20skills%20I%20need%20to%20learn%20first.`
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple-600 hover:text-brand-purple-700 cursor-pointer hover:underline"
                >
                  <Bot size={15} />
                  <span>Discuss with AI Assistant 🤖</span>
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/careers/${selectedSlug}`)}
                    className="text-xs py-2 px-3 shadow-soft"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="primary"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => navigate(`/roadmap/${selectedSlug}`)}
                    className="text-xs py-2 px-3 shadow-soft"
                  >
                    View Roadmap
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Modal for Full 14-Category Breakdown */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Compass size={20} className="text-brand-purple-600" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Full 14-Category Assessment Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 pr-1 custom-scrollbar">
              <p className="text-xs text-slate-500 mb-4">
                Normalized scoring percentages calculated against Holland RIASEC and Career Anchor maximum ceilings.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {allCategoryList.map((cat) => (
                  <div
                    key={cat.code}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {cat.name} ({cat.code})
                        </p>
                        <p className="text-[11px] text-slate-400">{cat.field}</p>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900 shrink-0">
                        {cat.percentage}%
                      </span>
                    </div>
                    <ProgressBar
                      value={cat.percentage}
                      color={cat.percentage >= 50 ? 'blue' : 'purple'}
                      height="h-1.5"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowCategoryModal(false)}
                className="text-xs py-1.5 px-4"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
