import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Target,
  Award,
  Compass,
  Zap,
  Briefcase,
  Check,
  RotateCcw,
  SlidersHorizontal,
  GraduationCap,
} from 'lucide-react';
import YoutubeIcon from '../components/ui/YoutubeIcon';
import { useAuth } from '../contexts/AuthContext';
import { getLatestCareerRecommendations } from '../lib/careerService';
import { generateRoadmapForCareer, getAllCategoriesWithCareers } from '../lib/roadmapService';
import { CATEGORY_INFO, CAREER_DATABASE } from '../data/careerDatabase';
import { CATEGORY_NAMES } from '../lib/scoringEngine';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';

export default function LearningRoadmap() {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState(null);
  const [selectedCareerId, setSelectedCareerId] = useState(careerId || null);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState('ALL');
  const [activeTab, setActiveTab] = useState('assessment'); // 'assessment' | 'all'
  const [completedTopics, setCompletedTopics] = useState({});

  const allCategoriesMap = getAllCategoriesWithCareers();

  // 1. Fetch user's assessment recommendations
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await getLatestCareerRecommendations(user?.id);
        setAssessmentData(result);

        if (careerId) {
          setSelectedCareerId(careerId);
        } else if (result?.careers && result.careers.length > 0) {
          setSelectedCareerId(result.careers[0].id || 'frontend-developer');
        } else {
          setSelectedCareerId('frontend-developer');
        }
      } catch (err) {
        console.warn('Failed to load assessment data for roadmaps:', err);
        setSelectedCareerId(careerId || 'frontend-developer');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, careerId]);

  // 2. Load saved progress from localStorage for current career
  useEffect(() => {
    if (!selectedCareerId) return;
    try {
      const saved = localStorage.getItem(`roadmap_progress_${selectedCareerId}`);
      if (saved) {
        setCompletedTopics(JSON.parse(saved));
      } else {
        setCompletedTopics({});
      }
    } catch (e) {
      console.warn('LocalStorage error reading roadmap progress:', e);
    }
  }, [selectedCareerId]);

  const toggleTopic = (topicKey) => {
    setCompletedTopics((prev) => {
      const updated = {
        ...prev,
        [topicKey]: !prev[topicKey],
      };
      if (selectedCareerId) {
        try {
          localStorage.setItem(`roadmap_progress_${selectedCareerId}`, JSON.stringify(updated));
        } catch (e) {
          console.warn('LocalStorage save error:', e);
        }
      }
      return updated;
    });
  };

  const resetProgress = () => {
    setCompletedTopics({});
    if (selectedCareerId) {
      localStorage.removeItem(`roadmap_progress_${selectedCareerId}`);
    }
  };

  // Find the selected career object from Database or Recommendations
  const matchedCareers = assessmentData?.careers || [];
  const activeRoadmap = generateRoadmapForCareer(selectedCareerId || 'frontend-developer');
  const matchingAssessmentCareer = matchedCareers.find(
    (c) => c.id === selectedCareerId || c.title?.toLowerCase() === activeRoadmap.careerTitle?.toLowerCase()
  );

  // Calculate total topics & completed topics count
  const allTopicsList = [];
  activeRoadmap.stages.forEach((stage, sIdx) => {
    stage.topics.forEach((t, tIdx) => {
      allTopicsList.push(`s${sIdx}_t${tIdx}`);
    });
  });

  const totalTopicsCount = allTopicsList.length;
  const completedCount = allTopicsList.filter((k) => !!completedTopics[k]).length;
  const progressPercent = totalTopicsCount > 0 ? Math.round((completedCount / totalTopicsCount) * 100) : 0;

  // Filter careers for the "Browse All" tab
  const filteredAllCareers =
    selectedCategoryCode === 'ALL'
      ? CAREER_DATABASE
      : (allCategoriesMap[selectedCategoryCode]?.careers || []);

  if (loading) {
    return (
      <DashboardLayout title="Learning Roadmap" subtitle="Loading your personalized learning path...">
        <div className="space-y-6">
          <Card className="p-8 animate-pulse bg-brand-ink-50 h-40 rounded-2xl" />
          <Card className="p-6 animate-pulse bg-brand-ink-50 h-96 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Learning Roadmaps"
      subtitle="Interactive step-by-step masterclasses tailored to your assessment results"
    >
      {/* ========================================================================= */}
      {/* 1. CATEGORY & CAREER SELECTOR BAR */}
      {/* ========================================================================= */}
      <Card className="p-5 sm:p-6 mb-8 shadow-xs border-brand-ink-100 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-ink-100">
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-brand-ink-900 flex items-center gap-2">
              <Compass className="text-brand-blue-600" size={20} />
              <span>Select Roadmap by Assessment & Category</span>
            </h2>
            <p className="text-xs text-brand-ink-500 mt-0.5">
              Choose a career from your aptitude results or browse all 14 career disciplines.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center p-1 bg-brand-ink-100/70 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'assessment'
                  ? 'bg-white text-brand-blue-700 shadow-xs'
                  : 'text-brand-ink-600 hover:text-brand-ink-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                From Your Assessment ({matchedCareers.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-brand-blue-700 shadow-xs'
                  : 'text-brand-ink-600 hover:text-brand-ink-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers size={13} />
                All 14 Categories
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: FROM YOUR ASSESSMENT */}
        {activeTab === 'assessment' && (
          <div className="pt-4">
            {matchedCareers.length > 0 ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-purple-600 mb-2.5">
                  Top Recommended Careers from Your Assessment:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {matchedCareers.map((career) => {
                    const isSelected =
                      selectedCareerId === career.id ||
                      activeRoadmap.careerTitle?.toLowerCase() === career.title?.toLowerCase();
                    const catInfo = CATEGORY_INFO[career.primaryCategory] || {};

                    return (
                      <button
                        key={career.id || career.title}
                        onClick={() => setSelectedCareerId(career.id || career.title)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                          isSelected
                            ? 'border-brand-blue-600 bg-brand-blue-50/90 text-brand-blue-950 ring-2 ring-brand-blue-500 shadow-xs font-bold'
                            : 'border-brand-ink-200 text-brand-ink-700 hover:border-brand-blue-300 hover:bg-brand-ink-50/50'
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-brand-blue-600 shrink-0" />
                        <span>{career.title}</span>
                        {career.matchScore && (
                          <span className="px-1.5 py-0.5 rounded bg-brand-blue-100/80 text-brand-blue-800 text-[10px] font-bold">
                            {career.matchScore}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-brand-blue-50/60 border border-brand-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-brand-blue-900">
                  <p className="font-bold mb-0.5">Take the 30-Question Assessment</p>
                  <p className="text-brand-blue-700">
                    Unlock personalized roadmaps ranked precisely by your strengths and RIASEC category scores.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => navigate('/assessment')}
                  className="shrink-0 text-xs"
                >
                  Start Assessment
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EXPLORE ALL 14 CATEGORIES */}
        {activeTab === 'all' && (
          <div className="pt-4 space-y-3">
            {/* Category Pills Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategoryCode('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategoryCode === 'ALL'
                    ? 'bg-brand-ink-900 text-white shadow-xs'
                    : 'bg-brand-ink-100 text-brand-ink-700 hover:bg-brand-ink-200'
                }`}
              >
                All Categories ({CAREER_DATABASE.length})
              </button>
              {Object.entries(allCategoriesMap).map(([code, cat]) => (
                <button
                  key={code}
                  onClick={() => setSelectedCategoryCode(code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategoryCode === code
                      ? 'bg-brand-blue-600 text-white shadow-xs font-bold'
                      : 'bg-brand-ink-100 text-brand-ink-700 hover:bg-brand-ink-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-75">({cat.careers.length})</span>
                </button>
              ))}
            </div>

            {/* Careers in this category */}
            <div className="flex flex-wrap gap-2 pt-1">
              {filteredAllCareers.map((c) => {
                const isSelected = selectedCareerId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCareerId(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                      isSelected
                        ? 'border-brand-purple-600 bg-brand-purple-50 text-brand-purple-950 font-bold ring-1 ring-brand-purple-500'
                        : 'border-brand-ink-200 text-brand-ink-700 hover:bg-brand-ink-50'
                    }`}
                  >
                    {c.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* ========================================================================= */}
      {/* 2. ROADMAP HERO CARD */}
      {/* ========================================================================= */}
      <Card className="p-6 sm:p-8 mb-8 bg-white border-brand-ink-100 shadow-xs relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-brand-blue-50 text-brand-blue-700 text-xs font-medium border border-brand-blue-100">
                {activeRoadmap.categoryName}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                {activeRoadmap.growth}
              </span>
              <span className="text-xs font-medium text-brand-ink-500">
                Avg. Salary: {activeRoadmap.salaryRange}
              </span>
            </div>

            {matchingAssessmentCareer && (
              <Badge color="blue" className="!bg-brand-blue-100 !text-brand-blue-800 !border-brand-blue-200">
                ⭐ {matchingAssessmentCareer.matchScore}% Assessment Fit
              </Badge>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-ink-900 mb-2">
                {activeRoadmap.title}
              </h1>
              <p className="text-brand-ink-500 text-sm leading-relaxed mb-6">
                {activeRoadmap.overview}
              </p>

              {/* Progress Summary */}
              <div className="space-y-2 max-w-md">
                <div className="flex items-center justify-between text-xs text-brand-ink-600">
                  <span className="font-medium">Your Roadmap Progress:</span>
                  <span className="font-bold text-brand-ink-900">
                    {completedCount} of {totalTopicsCount} skills checked ({progressPercent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-brand-ink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <Button
                variant="primary"
                icon={Briefcase}
                onClick={() => navigate('/opportunities')}
                className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !border-none shadow-soft text-xs sm:text-sm"
              >
                Explore Matching Jobs & Internships
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/careers/${selectedCareerId}`)}
                  className="text-xs flex-1"
                >
                  Role Details
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={GraduationCap}
                  onClick={() => navigate(`/courses?category=${activeRoadmap.categoryCode || 'SW'}`)}
                  className="text-xs flex-1"
                >
                  Free Courses
                </Button>
                {completedCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={RotateCcw}
                    onClick={resetProgress}
                    className="!text-brand-ink-400 hover:!text-brand-ink-700 text-xs"
                    title="Reset progress"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 3. ROADMAP 4-STAGE TIMELINE */}
      {/* ========================================================================= */}
      <div className="relative">
        {/* Timeline connector bar */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-brand-ink-200 hidden sm:block" />

        <div className="space-y-6 sm:space-y-8">
          {activeRoadmap.stages.map((stage, stageIdx) => {
            const stageTopicsCompleted = stage.topics.filter(
              (_, tIdx) => !!completedTopics[`s${stageIdx}_t${tIdx}`]
            ).length;
            const isStageDone = stageTopicsCompleted === stage.topics.length && stage.topics.length > 0;

            return (
              <div key={stage.id || stageIdx} className="relative flex flex-col sm:flex-row gap-5">
                {/* Stage Step Badge */}
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm transition-all duration-200 ${
                    isStageDone
                      ? 'bg-emerald-600 text-white'
                      : stageIdx === 0 || stageTopicsCompleted > 0
                      ? 'bg-brand-blue-600 text-white'
                      : 'bg-brand-ink-100 text-brand-ink-500'
                  }`}
                >
                  {isStageDone ? (
                    <CheckCircle2 size={22} />
                  ) : (
                    <span className="font-display font-extrabold text-base">
                      {stageIdx + 1}
                    </span>
                  )}
                </div>

                {/* Stage Card */}
                <Card hover className="p-6 sm:p-7 flex-1 border-brand-ink-100 bg-white shadow-xs">
                  {/* Stage Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3 pb-3 border-b border-brand-ink-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-purple-600">
                          {stage.duration}
                        </span>
                        {isStageDone && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ Stage Completed
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-brand-ink-900">
                        {stage.phase}
                      </h3>
                      {stage.objective && (
                        <p className="text-xs text-brand-ink-500 mt-1 leading-relaxed">
                          🎯 <span className="font-medium text-brand-ink-700">Goal:</span> {stage.objective}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-brand-ink-500">
                        {stageTopicsCompleted} / {stage.topics.length} completed
                      </span>
                    </div>
                  </div>

                  {/* Stage Body Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    {/* Left Column: Topics Checklist */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-3 flex items-center gap-1.5">
                        <Check size={14} className="text-brand-blue-600" /> Core Skills & Deliverables (Click to check off):
                      </p>
                      <ul className="space-y-2.5">
                        {stage.topics.map((topic, tIdx) => {
                          const topicKey = `s${stageIdx}_t${tIdx}`;
                          const isDone = !!completedTopics[topicKey];

                          return (
                            <li key={tIdx}>
                              <button
                                type="button"
                                onClick={() => toggleTopic(topicKey)}
                                className={`w-full text-left p-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${
                                  isDone
                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 line-through opacity-85'
                                    : 'bg-brand-ink-50/50 border-brand-ink-100 text-brand-ink-800 hover:bg-brand-blue-50/50 hover:border-brand-blue-200'
                                }`}
                              >
                                <div
                                  className={`h-4 w-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                                    isDone
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'border-brand-ink-300 bg-white'
                                  }`}
                                >
                                  {isDone && <Check size={12} strokeWidth={3} />}
                                </div>
                                <span className="leading-snug">{topic}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Right Column: Milestone Project & Resources */}
                    <div className="space-y-4">
                      {/* Milestone Project */}
                      {stage.milestoneProject && (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                          <p className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                            <Target size={14} className="text-amber-600" /> Stage Milestone Project:
                          </p>
                          <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                            {stage.milestoneProject}
                          </p>
                        </div>
                      )}

                      {/* Recommended Free Resources */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-2 flex items-center gap-1.5">
                          <BookOpen size={14} className="text-brand-purple-600" /> Curated Resources & Guides:
                        </p>
                        <ul className="space-y-1.5">
                          {stage.resources.map((res, rIdx) => (
                            <li
                              key={rIdx}
                              className="text-xs text-brand-ink-600 flex items-start gap-2 p-2 rounded-lg bg-brand-ink-50/40 border border-brand-ink-100/60"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-500 mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{res}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FOOTER ADVICE / NEXT STEPS */}
      {/* ========================================================================= */}
      <Card className="p-6 sm:p-8 mt-10 border-brand-blue-100 bg-brand-blue-50/60 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-lg text-brand-ink-900 mb-1 flex items-center gap-2">
              <Zap size={18} className="text-amber-500" />
              <span>Ready to put your learning into practice?</span>
            </h3>
            <p className="text-xs sm:text-sm text-brand-ink-600 max-w-2xl leading-relaxed">
              Companies and startups on CareerAI actively recruit for roles aligned with this roadmap. Check out current internships, scholarships, and project hackathons matching your path.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              onClick={() => navigate('/careers')}
              className="text-xs sm:text-sm"
            >
              All Recommendations
            </Button>
            <Button
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/opportunities')}
              className="shadow-soft text-xs sm:text-sm"
            >
              View Opportunities
            </Button>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
