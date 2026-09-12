import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronDown,
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
  LayoutGrid,
  Maximize2,
  X,
  Search,
  Info,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getLatestCareerRecommendations } from '../lib/careerService';
import { generateRoadmapForCareer, getAllCategoriesWithCareers } from '../lib/roadmapService';
import { CATEGORY_INFO, CAREER_DATABASE } from '../data/careerDatabase';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function LearningRoadmap() {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState(null);
  const [selectedCareerId, setSelectedCareerId] = useState(careerId || null);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState('ALL');
  const [completedTopics, setCompletedTopics] = useState({});

  // View preferences
  const [viewMode, setViewMode] = useState('board'); // 'board' (4-columns) | 'focus' (stepper)
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  // Modals / popovers
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [careerModalTab, setCareerModalTab] = useState('assessment'); // 'assessment' | 'all'
  const [careerSearchQuery, setCareerSearchQuery] = useState('');
  const [showOverview, setShowOverview] = useState(false);
  const [activeDetailModal, setActiveDetailModal] = useState(null); // { type: 'milestone' | 'resources', stageIdx: number } | null

  const allCategoriesMap = useMemo(() => getAllCategoriesWithCareers(), []);

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
    if (window.confirm('Reset all progress for this career roadmap?')) {
      setCompletedTopics({});
      if (selectedCareerId) {
        localStorage.removeItem(`roadmap_progress_${selectedCareerId}`);
      }
    }
  };

  // Find the selected career object from Database or Recommendations
  const matchedCareers = assessmentData?.careers || [];
  const activeRoadmap = useMemo(
    () => generateRoadmapForCareer(selectedCareerId || 'frontend-developer'),
    [selectedCareerId]
  );
  const matchingAssessmentCareer = matchedCareers.find(
    (c) => c.id === selectedCareerId || c.title?.toLowerCase() === activeRoadmap.careerTitle?.toLowerCase()
  );

  // Calculate total topics & completed topics count
  const allTopicsList = useMemo(() => {
    const list = [];
    activeRoadmap.stages.forEach((stage, sIdx) => {
      stage.topics.forEach((_, tIdx) => {
        list.push(`s${sIdx}_t${tIdx}`);
      });
    });
    return list;
  }, [activeRoadmap]);

  const totalTopicsCount = allTopicsList.length;
  const completedCount = allTopicsList.filter((k) => !!completedTopics[k]).length;
  const progressPercent = totalTopicsCount > 0 ? Math.round((completedCount / totalTopicsCount) * 100) : 0;

  // Filter careers for the Career Switcher Modal
  const modalFilteredCareers = useMemo(() => {
    let list = [];
    if (careerModalTab === 'assessment') {
      list = matchedCareers;
    } else {
      list = selectedCategoryCode === 'ALL'
        ? CAREER_DATABASE
        : (allCategoriesMap[selectedCategoryCode]?.careers || []);
    }

    if (careerSearchQuery.trim()) {
      const q = careerSearchQuery.toLowerCase();
      return list.filter((c) => c.title.toLowerCase().includes(q) || c.primaryCategory?.toLowerCase().includes(q));
    }
    return list;
  }, [careerModalTab, matchedCareers, selectedCategoryCode, allCategoriesMap, careerSearchQuery]);

  if (loading) {
    return (
      <DashboardLayout title="Learning Roadmap" subtitle="Loading your personalized learning path...">
        <div className="space-y-4">
          <Card className="p-6 animate-pulse bg-brand-ink-50 h-24 rounded-2xl" />
          <Card className="p-6 animate-pulse bg-brand-ink-50 h-[500px] rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Learning Roadmap"
      subtitle="Interactive single-page masterclass tailored to your assessment results"
    >
      <div className="flex flex-col gap-3">
        {/* ========================================================================= */}
        {/* 1. COMPACT CONSOLIDATED CONTROL HEADER */}
        {/* ========================================================================= */}
        <div className="bg-white border border-brand-ink-100 rounded-2xl p-3.5 sm:p-4 shadow-xs">
          {/* Top Row: Title, Badges, Career Switcher & Quick Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Left: Role Title & Meta Badges */}
            <div className="flex items-center gap-2.5 flex-wrap min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-xl bg-brand-blue-50 border border-brand-blue-200 text-brand-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                  <Compass size={18} />
                </span>
                <h1 className="text-lg sm:text-xl font-display font-bold text-brand-ink-900 truncate">
                  {activeRoadmap.title || activeRoadmap.careerTitle}
                </h1>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-brand-blue-50 text-brand-blue-700 text-[11px] font-semibold border border-brand-blue-100">
                  {activeRoadmap.categoryName}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                  {activeRoadmap.growth}
                </span>
                <span className="text-[11px] font-medium text-brand-ink-600 bg-brand-ink-50 px-2 py-0.5 rounded-md border border-brand-ink-100">
                  {activeRoadmap.salaryRange}
                </span>
                {matchingAssessmentCareer && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                    ⭐ {matchingAssessmentCareer.matchScore}% Fit
                  </span>
                )}
                {/* Overview popover toggle */}
                <button
                  type="button"
                  onClick={() => setShowOverview((prev) => !prev)}
                  className="flex items-center gap-1 text-[11px] font-medium text-brand-blue-600 hover:text-brand-blue-800 hover:underline px-1.5 py-0.5 rounded transition-colors"
                  title="View Role Overview"
                >
                  <Info size={13} />
                  <span>Overview</span>
                </button>
              </div>
            </div>

            {/* Right: Career Switcher & Nav Buttons */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {/* Quick switch chips for top assessment recommendations */}
              {matchedCareers.length > 0 && (
                <div className="hidden 2xl:flex items-center gap-1.5 border-r border-brand-ink-100 pr-2 mr-1">
                  <span className="text-[10px] uppercase font-bold text-brand-ink-400">Quick:</span>
                  {matchedCareers.slice(0, 3).map((career) => (
                    <button
                      key={career.id}
                      onClick={() => setSelectedCareerId(career.id)}
                      className={`text-[11px] px-2 py-1 rounded-md border transition-all truncate max-w-[120px] ${
                        selectedCareerId === career.id
                          ? 'bg-brand-blue-600 text-white border-brand-blue-600 font-semibold'
                          : 'bg-white text-brand-ink-700 border-brand-ink-200 hover:border-brand-blue-300'
                      }`}
                      title={career.title}
                    >
                      {career.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Change Career Modal Trigger */}
              <button
                type="button"
                onClick={() => setShowCareerModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-blue-300 bg-brand-blue-50/70 text-brand-blue-900 text-xs font-semibold hover:bg-brand-blue-100 transition-colors shadow-2xs"
              >
                <SlidersHorizontal size={14} className="text-brand-blue-600" />
                <span>Switch Career</span>
                <ChevronDown size={13} className="text-brand-blue-500" />
              </button>

              {/* Link: Role Details */}
              <button
                type="button"
                onClick={() => navigate(`/careers/${selectedCareerId}`)}
                className="px-2.5 py-1.5 rounded-xl border border-brand-ink-200 text-brand-ink-700 hover:bg-brand-ink-50 text-xs font-medium transition-colors"
                title="View full career details"
              >
                Role Details
              </button>

              {/* Link: Free Courses */}
              <button
                type="button"
                onClick={() => navigate(`/courses?category=${activeRoadmap.categoryCode || 'SW'}`)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-brand-ink-200 text-brand-ink-700 hover:bg-brand-ink-50 text-xs font-medium transition-colors"
                title="Browse relevant free courses"
              >
                <GraduationCap size={14} className="text-brand-purple-600" />
                <span className="hidden sm:inline">Courses</span>
              </button>

              {/* Link: Matching Jobs / Opportunities */}
              <button
                type="button"
                onClick={() => navigate('/opportunities')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-2xs"
                title="Explore jobs and internships matching this path"
              >
                <Briefcase size={13} />
                <span>Jobs & Internships</span>
              </button>
            </div>
          </div>

          {/* Collapsible Overview Box */}
          {showOverview && activeRoadmap.overview && (
            <div className="mt-3 p-3 rounded-xl bg-brand-blue-50/70 border border-brand-blue-100 text-xs text-brand-ink-700 flex items-start justify-between gap-3 animate-fade-in">
              <p className="leading-relaxed">
                <span className="font-bold text-brand-blue-950">About this Pathway: </span>
                {activeRoadmap.overview}
              </p>
              <button
                onClick={() => setShowOverview(false)}
                className="text-brand-ink-400 hover:text-brand-ink-700 shrink-0 p-1"
                aria-label="Close overview"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Sub Row: Progress Bar + View Mode Toggle */}
          <div className="mt-3 pt-3 border-t border-brand-ink-100/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Left: Overall Progress Indicator */}
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="text-xs font-semibold text-brand-ink-800 whitespace-nowrap flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>
                  {completedCount}/{totalTopicsCount} skills ({progressPercent}%)
                </span>
              </div>
              <div className="flex-1 h-2 bg-brand-ink-100 rounded-full overflow-hidden min-w-[120px]">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={resetProgress}
                  className="text-brand-ink-400 hover:text-red-600 transition-colors p-1"
                  title="Reset saved progress"
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </div>

            {/* Right: Stage Stepper Pills & View Switcher */}
            <div className="flex items-center gap-2 self-end md:self-center">
              {/* Quick stage indicator tabs */}
              <div className="flex items-center p-0.5 bg-brand-ink-100/70 rounded-lg">
                {activeRoadmap.stages.map((stage, sIdx) => {
                  const sCompleted = stage.topics.filter((_, tIdx) => !!completedTopics[`s${sIdx}_t${tIdx}`]).length;
                  const isDone = sCompleted === stage.topics.length && stage.topics.length > 0;
                  const isActive = viewMode === 'focus' && activeStageIdx === sIdx;

                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => {
                        setActiveStageIdx(sIdx);
                        if (viewMode !== 'focus') setViewMode('focus');
                      }}
                      className={`px-2 py-1 text-[11px] rounded-md transition-all font-medium flex items-center gap-1 ${
                        isActive
                          ? 'bg-white text-brand-blue-700 shadow-2xs font-bold'
                          : 'text-brand-ink-600 hover:text-brand-ink-900'
                      }`}
                      title={`${stage.phase}: ${sCompleted}/${stage.topics.length} done`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isDone ? 'bg-emerald-500' : sCompleted > 0 ? 'bg-brand-blue-500' : 'bg-brand-ink-300'
                        }`}
                      />
                      <span>S{sIdx + 1}</span>
                      <span className="text-[9px] opacity-75">
                        ({sCompleted}/{stage.topics.length})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* View Mode Toggle: Board vs Focus */}
              <div className="flex items-center p-0.5 bg-brand-ink-100/80 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('board')}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-all flex items-center gap-1.5 font-semibold ${
                    viewMode === 'board'
                      ? 'bg-white text-brand-blue-700 shadow-2xs'
                      : 'text-brand-ink-600 hover:text-brand-ink-900'
                  }`}
                  title="4-Column Board View"
                >
                  <LayoutGrid size={13} />
                  <span className="hidden sm:inline">All Stages</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('focus')}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-all flex items-center gap-1.5 font-semibold ${
                    viewMode === 'focus'
                      ? 'bg-white text-brand-blue-700 shadow-2xs'
                      : 'text-brand-ink-600 hover:text-brand-ink-900'
                  }`}
                  title="Step-by-Step Focus View"
                >
                  <Maximize2 size={13} />
                  <span className="hidden sm:inline">Focus Mode</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ROADMAP STAGES CONTAINER (FIT-TO-PAGE) */}
        {/* ========================================================================= */}
        {viewMode === 'board' ? (
          /* ======================================================================= */
          /* MODE A: 4-COLUMN BOARD VIEW (All 4 stages simultaneously visible)        */
          /* ======================================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {activeRoadmap.stages.map((stage, stageIdx) => {
              const stageTopicsCompleted = stage.topics.filter(
                (_, tIdx) => !!completedTopics[`s${stageIdx}_t${tIdx}`]
              ).length;
              const isStageDone = stageTopicsCompleted === stage.topics.length && stage.topics.length > 0;
              const stageProgress = stage.topics.length > 0 ? Math.round((stageTopicsCompleted / stage.topics.length) * 100) : 0;

              return (
                <div
                  key={stage.id || stageIdx}
                  className="bg-white border border-brand-ink-100 rounded-2xl p-3.5 flex flex-col shadow-xs hover:border-brand-blue-200 transition-all h-[calc(100vh-250px)] min-h-[480px] max-h-[640px]"
                >
                  {/* Column Header */}
                  <div className="pb-2.5 border-b border-brand-ink-100/80 shrink-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                            isStageDone
                              ? 'bg-emerald-600 text-white'
                              : stageTopicsCompleted > 0
                              ? 'bg-brand-blue-600 text-white'
                              : 'bg-brand-ink-100 text-brand-ink-600'
                          }`}
                        >
                          {isStageDone ? <Check size={14} strokeWidth={3} /> : stageIdx + 1}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-purple-600">
                          {stage.duration}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-brand-ink-700 bg-brand-ink-50 px-2 py-0.5 rounded border border-brand-ink-100">
                        {stageTopicsCompleted}/{stage.topics.length}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-sm text-brand-ink-900 line-clamp-1" title={stage.phase}>
                      {stage.phase}
                    </h3>

                    {stage.objective && (
                      <p className="text-[11px] text-brand-ink-500 line-clamp-2 mt-1 leading-snug" title={stage.objective}>
                        🎯 <span className="font-semibold text-brand-ink-700">Goal:</span> {stage.objective}
                      </p>
                    )}

                    {/* Stage Mini Progress Bar */}
                    <div className="h-1.5 w-full bg-brand-ink-100 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isStageDone ? 'bg-emerald-500' : 'bg-brand-blue-500'
                        }`}
                        style={{ width: `${stageProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Column Topics Checklist (Scrollable) */}
                  <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-1.5 scrollbar-thin">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-brand-ink-400 mb-1">
                      Skills & Milestones ({stage.topics.length}):
                    </div>
                    {stage.topics.map((topic, tIdx) => {
                      const topicKey = `s${stageIdx}_t${tIdx}`;
                      const isDone = !!completedTopics[topicKey];

                      return (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => toggleTopic(topicKey)}
                          className={`w-full text-left p-2 rounded-xl border text-xs font-medium transition-all flex items-start gap-2 ${
                            isDone
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 opacity-90'
                              : 'bg-brand-ink-50/30 border-brand-ink-100/90 text-brand-ink-800 hover:bg-brand-blue-50/40 hover:border-brand-blue-200'
                          }`}
                        >
                          <div
                            className={`h-4 w-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                              isDone
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-brand-ink-300 bg-white'
                            }`}
                          >
                            {isDone && <Check size={11} strokeWidth={3} />}
                          </div>
                          <span className={`leading-snug flex-1 ${isDone ? 'line-through text-emerald-900' : ''}`}>
                            {topic}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Column Footer: Milestone & Resources Buttons */}
                  <div className="pt-2 border-t border-brand-ink-100 shrink-0 space-y-1.5">
                    {stage.milestoneProject && (
                      <button
                        type="button"
                        onClick={() => setActiveDetailModal({ type: 'milestone', stageIdx })}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200 hover:bg-amber-100/80 transition-colors flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-amber-900 flex items-center gap-1.5 truncate">
                          <Target size={13} className="text-amber-600 shrink-0" />
                          <span className="truncate">Project: {stage.milestoneProject}</span>
                        </span>
                        <ChevronRight size={13} className="text-amber-600 shrink-0" />
                      </button>
                    )}

                    {stage.resources && stage.resources.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveDetailModal({ type: 'resources', stageIdx })}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg bg-brand-ink-50 border border-brand-ink-200 hover:bg-brand-ink-100 transition-colors flex items-center justify-between text-xs text-brand-ink-700"
                      >
                        <span className="font-medium flex items-center gap-1.5 truncate">
                          <BookOpen size={13} className="text-brand-purple-600 shrink-0" />
                          <span>Curated Resources ({stage.resources.length})</span>
                        </span>
                        <ChevronRight size={13} className="text-brand-ink-400 shrink-0" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ======================================================================= */
          /* MODE B: FOCUS / STEPPER VIEW (Detailed 1-stage deep dive)                */
          /* ======================================================================= */
          <div className="bg-white border border-brand-ink-100 rounded-2xl p-5 shadow-xs flex flex-col h-[calc(100vh-250px)] min-h-[480px] max-h-[640px]">
            {/* Stage Progress Stepper Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-4 border-b border-brand-ink-100 shrink-0">
              {activeRoadmap.stages.map((st, idx) => {
                const sCompleted = st.topics.filter((_, tIdx) => !!completedTopics[`s${idx}_t${tIdx}`]).length;
                const isDone = sCompleted === st.topics.length && st.topics.length > 0;
                const isCurrent = idx === activeStageIdx;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStageIdx(idx)}
                    className={`text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
                      isCurrent
                        ? 'border-brand-blue-600 bg-brand-blue-50/80 ring-2 ring-brand-blue-500 text-brand-blue-950'
                        : 'border-brand-ink-200 hover:border-brand-blue-200 bg-white text-brand-ink-700'
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-brand-blue-600 text-white'
                          : 'bg-brand-ink-100 text-brand-ink-600'
                      }`}
                    >
                      {isDone ? <Check size={14} strokeWidth={3} /> : idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-purple-600 truncate">
                        {st.duration}
                      </p>
                      <p className="text-xs font-bold text-brand-ink-900 truncate">{st.phase}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Body: 2 Columns */}
            {(() => {
              const stage = activeRoadmap.stages[activeStageIdx];
              if (!stage) return null;
              const sCompleted = stage.topics.filter((_, tIdx) => !!completedTopics[`s${activeStageIdx}_t${tIdx}`]).length;

              return (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 py-4 overflow-hidden min-h-0">
                  {/* Left Column: Topics Checklist (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between pb-2">
                      <h3 className="font-display font-bold text-base text-brand-ink-900 flex items-center gap-2">
                        <span>{stage.phase}</span>
                        <span className="text-xs font-normal text-brand-ink-500">
                          ({sCompleted}/{stage.topics.length} completed)
                        </span>
                      </h3>
                      {stage.objective && (
                        <span className="text-xs text-brand-ink-600 italic truncate max-w-xs">
                          Goal: {stage.objective}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                      {stage.topics.map((topic, tIdx) => {
                        const topicKey = `s${activeStageIdx}_t${tIdx}`;
                        const isDone = !!completedTopics[topicKey];

                        return (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={() => toggleTopic(topicKey)}
                            className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition-all flex items-start gap-3 ${
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
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Milestone Project & Curated Resources (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col gap-3 h-full overflow-y-auto pr-1 scrollbar-thin">
                    {/* Milestone Project */}
                    {stage.milestoneProject && (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shrink-0">
                        <p className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                          <Target size={15} className="text-amber-600" /> Stage Milestone Project:
                        </p>
                        <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                          {stage.milestoneProject}
                        </p>
                      </div>
                    )}

                    {/* Curated Resources */}
                    {stage.resources && stage.resources.length > 0 && (
                      <div className="p-4 rounded-xl bg-brand-ink-50/70 border border-brand-ink-100 flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-2 flex items-center gap-1.5">
                          <BookOpen size={14} className="text-brand-purple-600" /> Curated Free Resources:
                        </p>
                        <ul className="space-y-2">
                          {stage.resources.map((res, rIdx) => (
                            <li
                              key={rIdx}
                              className="text-xs text-brand-ink-700 flex items-start gap-2 p-2 rounded-lg bg-white border border-brand-ink-100 shadow-2xs"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-500 mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{res}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Stepper Footer Controls */}
            <div className="pt-3 border-t border-brand-ink-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                disabled={activeStageIdx === 0}
                onClick={() => setActiveStageIdx((p) => Math.max(0, p - 1))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-ink-200 text-xs font-medium text-brand-ink-700 hover:bg-brand-ink-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft size={14} />
                <span>Previous Stage</span>
              </button>

              <div className="text-xs text-brand-ink-500 font-medium">
                Stage {activeStageIdx + 1} of {activeRoadmap.stages.length}
              </div>

              <button
                type="button"
                disabled={activeStageIdx === activeRoadmap.stages.length - 1}
                onClick={() => setActiveStageIdx((p) => Math.min(activeRoadmap.stages.length - 1, p + 1))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-semibold disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <span>Next Stage</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. SLIM STATUS FOOTER BAR */}
        {/* ========================================================================= */}
        <div className="px-4 py-2.5 rounded-xl bg-brand-blue-50/60 border border-brand-blue-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-ink-600">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-amber-500 shrink-0" />
            <span>
              All progress is automatically saved to your browser. Prepare your portfolio to match current industry openings.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/careers')}
              className="text-brand-blue-700 hover:underline font-semibold"
            >
              All Recommendations
            </button>
            <span className="text-brand-ink-300">•</span>
            <button
              onClick={() => navigate('/opportunities')}
              className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Explore Opportunities</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL: CAREER SWITCHER & DISCIPLINE BROWSER */}
      {/* ========================================================================= */}
      {showCareerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-white rounded-2xl max-w-2xl w-full border border-brand-ink-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-brand-ink-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="text-brand-blue-600" size={18} />
                <h2 className="font-display font-bold text-base text-brand-ink-900">
                  Switch Learning Roadmap
                </h2>
              </div>
              <button
                onClick={() => setShowCareerModal(false)}
                className="text-brand-ink-400 hover:text-brand-ink-700 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Subhead: Tabs & Search Input */}
            <div className="p-4 pb-3 border-b border-brand-ink-100 bg-brand-ink-50/40 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center p-1 bg-brand-ink-100 rounded-xl">
                  <button
                    onClick={() => setCareerModalTab('assessment')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      careerModalTab === 'assessment'
                        ? 'bg-white text-brand-blue-700 shadow-2xs'
                        : 'text-brand-ink-600 hover:text-brand-ink-900'
                    }`}
                  >
                    <Sparkles size={13} className="text-amber-500" />
                    <span>From Assessment ({matchedCareers.length})</span>
                  </button>
                  <button
                    onClick={() => setCareerModalTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      careerModalTab === 'all'
                        ? 'bg-white text-brand-blue-700 shadow-2xs'
                        : 'text-brand-ink-600 hover:text-brand-ink-900'
                    }`}
                  >
                    <Layers size={13} />
                    <span>All 14 Disciplines</span>
                  </button>
                </div>

                <div className="text-xs text-brand-ink-400 font-medium">
                  {modalFilteredCareers.length} pathways
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink-400" />
                <input
                  type="text"
                  value={careerSearchQuery}
                  onChange={(e) => setCareerSearchQuery(e.target.value)}
                  placeholder="Search by career title or industry..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-ink-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                />
                {careerSearchQuery && (
                  <button
                    onClick={() => setCareerSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-ink-400 hover:text-brand-ink-700"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Category Filter Pills when on 'all' tab */}
              {careerModalTab === 'all' && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  <button
                    onClick={() => setSelectedCategoryCode('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                      selectedCategoryCode === 'ALL'
                        ? 'bg-brand-ink-900 text-white shadow-2xs'
                        : 'bg-white border border-brand-ink-200 text-brand-ink-700 hover:bg-brand-ink-100'
                    }`}
                  >
                    All Disciplines
                  </button>
                  {Object.entries(allCategoriesMap).map(([code, cat]) => (
                    <button
                      key={code}
                      onClick={() => setSelectedCategoryCode(code)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                        selectedCategoryCode === code
                          ? 'bg-brand-blue-600 text-white shadow-2xs font-bold'
                          : 'bg-white border border-brand-ink-200 text-brand-ink-700 hover:bg-brand-ink-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-75">({cat.careers.length})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Careers List */}
            <div className="flex-1 overflow-y-auto p-4 max-h-[50vh] space-y-2 scrollbar-thin">
              {modalFilteredCareers.length === 0 ? (
                <div className="text-center py-8 text-xs text-brand-ink-400">
                  No careers found matching &quot;{careerSearchQuery}&quot;.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {modalFilteredCareers.map((c) => {
                    const isSelected = selectedCareerId === c.id;
                    const catInfo = CATEGORY_INFO[c.primaryCategory] || {};

                    return (
                      <button
                        key={c.id || c.title}
                        onClick={() => {
                          setSelectedCareerId(c.id);
                          setShowCareerModal(false);
                        }}
                        className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'border-brand-blue-600 bg-brand-blue-50 text-brand-blue-950 font-bold ring-2 ring-brand-blue-500'
                            : 'border-brand-ink-200 hover:border-brand-blue-300 hover:bg-brand-ink-50/60 text-brand-ink-800'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate">{c.title}</p>
                          <p className="text-[11px] text-brand-ink-500 truncate">
                            {catInfo.name || c.primaryCategory || 'Specialization'}
                          </p>
                        </div>
                        {c.matchScore && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-blue-100 text-brand-blue-800 text-[10px] font-bold shrink-0">
                            {c.matchScore}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: MILESTONE OR RESOURCES DETAIL (FOR BOARD VIEW)                  */}
      {/* ========================================================================= */}
      {activeDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-white rounded-2xl max-w-lg w-full border border-brand-ink-200 shadow-2xl overflow-hidden p-5 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const stage = activeRoadmap.stages[activeDetailModal.stageIdx];
              if (!stage) return null;

              if (activeDetailModal.type === 'milestone') {
                return (
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-brand-ink-100 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                          <Target size={16} />
                        </span>
                        <div>
                          <h3 className="font-display font-bold text-sm text-brand-ink-900">
                            Stage {activeDetailModal.stageIdx + 1} Milestone Project
                          </h3>
                          <p className="text-[11px] text-brand-ink-500">{stage.phase}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveDetailModal(null)}
                        className="text-brand-ink-400 hover:text-brand-ink-700 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed mb-4">
                      {stage.milestoneProject}
                    </div>

                    {stage.objective && (
                      <p className="text-xs text-brand-ink-600 mb-4">
                        🎯 <span className="font-semibold text-brand-ink-800">Key Objective:</span> {stage.objective}
                      </p>
                    )}

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setActiveDetailModal(null)}
                        className="text-xs"
                      >
                        Got it
                      </Button>
                    </div>
                  </div>
                );
              }

              // Resources modal
              return (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-brand-ink-100 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-7 w-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                        <BookOpen size={16} />
                      </span>
                      <div>
                        <h3 className="font-display font-bold text-sm text-brand-ink-900">
                          Stage {activeDetailModal.stageIdx + 1} Curated Resources
                        </h3>
                        <p className="text-[11px] text-brand-ink-500">{stage.phase}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveDetailModal(null)}
                      className="text-brand-ink-400 hover:text-brand-ink-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {stage.resources.map((res, rIdx) => (
                      <li
                        key={rIdx}
                        className="text-xs text-brand-ink-800 flex items-start gap-2.5 p-2.5 rounded-xl bg-brand-ink-50/70 border border-brand-ink-100"
                      >
                        <span className="h-2 w-2 rounded-full bg-brand-purple-500 mt-1 shrink-0" />
                        <span className="leading-relaxed font-medium">{res}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => navigate(`/courses?category=${activeRoadmap.categoryCode || 'SW'}`)}
                      className="text-xs text-brand-purple-700 hover:underline font-semibold flex items-center gap-1"
                    >
                      <GraduationCap size={14} />
                      <span>Browse Video Courses</span>
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveDetailModal(null)}
                      className="text-xs"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
