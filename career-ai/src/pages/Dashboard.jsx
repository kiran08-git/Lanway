import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  ArrowRight,
  Sparkles,
  Briefcase,
  Bot,
  MessageSquare,
  Zap,
  TrendingUp,
  MapPin,
  Bookmark,
  ExternalLink,
  PlayCircle,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Clock,
  Compass,
  Filter,
  RotateCcw,
  Target,
  Layers,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getLatestCareerRecommendations } from '../lib/careerService';
import { generateRoadmapForCareer } from '../lib/roadmapService';
import { INITIAL_COURSES } from '../data/coursesData';
import { opportunities as defaultOpportunities, currentUser, recentActivity } from '../data/mockData';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import CareerMatchPieChart from '../components/ui/CareerMatchPieChart';
import SkillRadarBar from '../components/ui/SkillRadarBar';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [aiData, setAiData] = useState(null);
  const [selectedPieFilter, setSelectedPieFilter] = useState('ALL');
  const [savedOpps, setSavedOpps] = useState(new Set(['o1', 'o3', 'o5']));
  const [roadmapProgress, setRoadmapProgress] = useState({ completed: 0, total: 10, percent: 0 });

  // 1. Load career recommendations & assessment results
  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const result = await getLatestCareerRecommendations(user?.id);
        if (result && result.careers && result.careers.length > 0) {
          setAiData(result);
        }
      } catch (err) {
        console.warn('Could not load AI recommendations on dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  // Derived careers & top match
  const rawCareers = aiData?.careers || [];
  const hasAssessment = rawCareers.length > 0;
  const topCareer = rawCareers[0] || {
    id: 'full-stack-developer',
    title: 'Full-Stack Web Developer',
    field: 'Technology',
    matchScore: 94,
    salaryRange: '₹4.5 – 12 LPA',
    growth: 'High Demand',
    primaryCategory: 'SW',
  };

  const topMatchTitle = topCareer.title || 'Full-Stack Web Developer';
  const topMatchScore = topCareer.matchScore || (aiData?.overallScore || 92);
  const topCategoryCode = topCareer.primaryCategory || 'SW';

  // 2. Load roadmap progress for top career
  useEffect(() => {
    if (!topCareer?.id) return;
    try {
      const activeRoadmap = generateRoadmapForCareer(topCareer.id);
      const saved = localStorage.getItem(`roadmap_progress_${topCareer.id}`);
      const completedMap = saved ? JSON.parse(saved) : {};

      let totalTopics = 0;
      activeRoadmap.stages.forEach((st) => {
        totalTopics += st.topics.length;
      });

      const completedCount = Object.values(completedMap).filter(Boolean).length;
      const pct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

      setRoadmapProgress({
        completed: completedCount,
        total: totalTopics || 12,
        percent: pct,
        roadmap: activeRoadmap,
      });
    } catch (e) {
      console.warn('Error computing roadmap progress:', e);
    }
  }, [topCareer?.id]);

  // Compute profile completion percentage
  const displayName = profile?.name || user?.user_metadata?.full_name || currentUser.name;
  const firstName = displayName.split(' ')[0];

  const profileAttributes = [
    profile?.name || user?.user_metadata?.full_name,
    profile?.degree,
    profile?.branch,
    profile?.college,
    profile?.year,
    profile?.skills && profile.skills.length > 0,
    profile?.interests && profile.interests.length > 0,
    profile?.career_goal,
  ];
  const filledCount = profileAttributes.filter(Boolean).length;
  const profileCompletion = Math.min(100, Math.max(35, Math.round((filledCount / 8) * 100)));

  // Filter careers according to Pie Chart selection
  const filteredCareers =
    selectedPieFilter === 'ALL'
      ? rawCareers
      : rawCareers.filter((c) => {
        // Check by field/domain
        if (c.field === selectedPieFilter) return true;
        // Check by Tier
        const score = c.matchScore || 75;
        if (selectedPieFilter === 'High Fit (90%+)' && score >= 90) return true;
        if (selectedPieFilter === 'Strong Fit (80–89%)' && score >= 80 && score < 90) return true;
        if (selectedPieFilter === 'Moderate Fit (70–79%)' && score >= 70 && score < 80) return true;
        if (selectedPieFilter === 'Emerging Fit (<70%)' && score < 70) return true;
        return false;
      });

  const displayedCareers = (filteredCareers.length > 0 ? filteredCareers : rawCareers).slice(0, 4);

  // Filter courses relevant to top matched career category
  const relevantCourses = INITIAL_COURSES.filter(
    (c) => c.category === topCategoryCode || c.category === 'SW' || c.featured
  ).slice(0, 3);

  // Toggle saving opportunities
  const toggleSaveOpp = (id) => {
    setSavedOpps((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const topOpportunities = defaultOpportunities.slice(0, 3);

  return (
    <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${firstName}`}>
      {/* ========================================================================= */}
      {/* 1. HERO GREETING BANNER */}
      {/* ========================================================================= */}
      {/* ── Clean hero recommendation panel ── */}
      <div className="card p-6 sm:p-8 mb-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-brand-ink-100 shadow-xs bg-white rounded-2xl">
        <div className="max-w-2xl">
          {/* Status badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-blue-50 text-brand-blue-600">
              <Sparkles size={12} />
              + {hasAssessment ? 'AI Assessment Analyzed' : 'Standard Profile Active'}
            </span>
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
              Top Match: {topMatchScore}% Fit
            </span>
          </div>

          {/* Greeting */}
          <h2 className="text-2xl sm:text-[28px] font-display font-bold text-brand-ink-900 mb-1.5 leading-snug">
            Hi {firstName}, your highest compatibility is in<br />
            <span className="text-brand-blue-600">{topMatchTitle}</span> 🎯
          </h2>

          <p className="text-sm text-brand-ink-500 leading-relaxed max-w-xl mt-3">
            {hasAssessment
              ? `Synthesized across 14 Holland RIASEC and Career Anchor dimensions with Google Gemini AI. You have ${rawCareers.length} personalized pathways matched.`
              : 'Complete your 30-question scientific assessment to calculate exact career suitability, skill gaps, and custom roadmaps.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-[280px]">
          <Button
            variant="primary"
            icon={Sparkles}
            onClick={() =>
              navigate(
                `/chat?prompt=Explain%20why%20I%20matched%20with%20${encodeURIComponent(
                  topMatchTitle
                )}%20and%20create%20a%20step-by-step%20learning%20plan%20for%20me.`
              )
            }
            className="w-full justify-center !bg-[#d97706] hover:!bg-[#b45309] !text-white text-sm py-2.5 shadow-none border-none rounded-none font-semibold"
          >
            Ask AI About {topMatchTitle}
          </Button>
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="secondary"
              icon={ChevronRight}
              iconPosition="right"
              onClick={() => navigate('/careers')}
              className="flex-1 justify-center text-xs font-semibold py-2.5 border-brand-ink-100 shadow-xs"
            >
              All Matches <br className="hidden lg:block" /> ({rawCareers.length || 6})
            </Button>
            <Button
              variant="secondary"
              icon={hasAssessment ? RotateCcw : ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/assessment')}
              className="flex-1 justify-center text-xs font-semibold py-2.5 border-brand-ink-100 shadow-xs"
            >
              {hasAssessment ? 'Retake Test' : 'Start Test'}
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS KPI GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Profile Completion"
          value={`${profileCompletion}%`}
          icon="User"
          color="blue"
        />
        <StatCard
          label="Assessment Readiness"
          value={hasAssessment ? `${topMatchScore}%` : '30'}
          icon="ClipboardCheck"
          color="green"
        />
        <StatCard
          label="Matched Career Pool"
          value={rawCareers.length > 0 ? `${rawCareers.length} Roles` : '6'}
          icon="Briefcase"
          color="purple"
        />
        <StatCard
          label="Roadmap Progress"
          value={`${roadmapProgress.percent}% Done`}
          icon="Map"
          color="orange"
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. CORE VISUALIZATION SECTION: PIE CHART & DIMENSIONS */}
      {/* ========================================================================= */}
      <div className="grid lg:grid-cols-12 gap-6 mb-7">
        {/* Left Column: Interactive Career Matches Pie Chart (7 cols) */}
        <Card className="lg:col-span-7 p-6 sm:p-7 shadow-xs border-brand-ink-100 bg-white flex flex-col justify-between">
          <CareerMatchPieChart
            careers={rawCareers}
            selectedCategory={selectedPieFilter}
            onSelectCategory={(cat) => setSelectedPieFilter(cat)}
          />
        </Card>

        {/* Right Column: Holland RIASEC & Dimension Breakdown (5 cols) */}
        <Card className="lg:col-span-5 p-6 sm:p-7 shadow-xs border-brand-ink-100 bg-white flex flex-col justify-between">
          <SkillRadarBar
            categoryScores={aiData?.categoryScores || {}}
            strongestCategories={aiData?.strongestCategories || []}
            careers={rawCareers}
          />
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 4. TOP MATCHED CAREER PATHWAYS (FILTERABLE BY PIE CHART) */}
      {/* ========================================================================= */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-lg text-brand-ink-900 flex items-center gap-2">
              <Briefcase size={20} className="text-brand-blue-600" />
              <span>Recommended Career Pathways</span>
            </h3>
            {selectedPieFilter !== 'ALL' && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-200 flex items-center gap-1.5">
                <Filter size={11} /> Filter: {selectedPieFilter}
                <button
                  type="button"
                  onClick={() => setSelectedPieFilter('ALL')}
                  className="ml-1 text-brand-blue-500 hover:text-brand-blue-800 font-extrabold"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/careers')}
            className="text-xs sm:text-sm font-semibold text-brand-blue-600 hover:text-brand-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View all {rawCareers.length || 6} recommendations</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Career Cards Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {displayedCareers.map((career) => {
            const score = career.matchScore || 85;
            const CareerIcon = (career.icon && Icons[career.icon]) || Briefcase;
            const slug = career.id || career.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            return (
              <Card
                key={career.id || career.title}
                hover
                className="p-5 flex flex-col justify-between border-brand-ink-100 bg-white shadow-xs hover:border-brand-blue-300 transition-all group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center shrink-0 group-hover:bg-brand-blue-600 group-hover:text-white transition-colors">
                      <CareerIcon size={20} />
                    </div>
                    <Badge color={score >= 90 ? 'green' : score >= 80 ? 'blue' : 'purple'}>
                      {score}% match
                    </Badge>
                  </div>

                  {/* Title & Domain */}
                  <h4 className="font-display font-bold text-base text-brand-ink-900 group-hover:text-brand-blue-600 transition-colors mb-1 line-clamp-1">
                    {career.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-brand-ink-500 mb-3 flex-wrap">
                    <span>{career.field || 'Technology'}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">{career.growth || 'High Demand'}</span>
                  </div>

                  {/* Salary & Match Progress */}
                  <div className="space-y-1.5 mb-3 bg-brand-ink-50/50 p-2.5 rounded-lg border border-brand-ink-100/70">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-brand-ink-500">Avg. Compensation</span>
                      <span className="font-bold text-brand-ink-900">{career.salaryRange || '₹4.5 – 12 LPA'}</span>
                    </div>
                    <ProgressBar
                      value={score}
                      color={score >= 90 ? 'green' : score >= 80 ? 'blue' : 'purple'}
                      height="h-1"
                    />
                  </div>

                  {/* Skills / Why snippet */}
                  {career.whyMatch ? (
                    <p className="text-xs text-brand-ink-600 line-clamp-2 leading-relaxed mb-3">
                      {career.whyMatch}
                    </p>
                  ) : career.recommendedSkills && career.recommendedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {career.recommendedSkills.slice(0, 3).map((sk, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-brand-blue-50 text-brand-blue-700 font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-brand-ink-100 flex items-center justify-between gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/chat?prompt=Tell%20me%20why%20I%20matched%20with%20${encodeURIComponent(
                          career.title
                        )}%20and%20what%20skills%20I%20should%20learn%20first.`
                      )
                    }
                    className="text-[11px] font-semibold text-brand-purple-600 hover:text-brand-purple-700 flex items-center gap-1"
                  >
                    <Bot size={12} /> AI Advice
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/roadmap/${slug}`)}
                    className="text-[11px] font-bold text-brand-blue-600 hover:text-brand-blue-700 flex items-center gap-1"
                  >
                    <span>Roadmap</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. ACTIVE LEARNING ROADMAP & AI QUICK-PROMPTS */}
      {/* ========================================================================= */}
      <div className="grid lg:grid-cols-12 gap-6 mb-7">
        {/* Active Learning Roadmap (7 cols) — clean white card */}
        <Card className="lg:col-span-7 p-6 sm:p-7 border-l-4 border-l-brand-blue-600 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-md bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center">
                  <MapPin size={15} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-ink-500">
                  Learning Roadmap
                </span>
              </div>
              <Badge color="blue">{topCareer.title}</Badge>
            </div>

            <h3 className="font-display font-semibold text-lg text-brand-ink-900 mb-1">
              {topCareer.title}
            </h3>
            <p className="text-sm text-brand-ink-500 leading-relaxed mb-5">
              Follow your step-by-step learning path from the basics to job-ready skills.
            </p>

            {/* Progress */}
            <div className="space-y-2 mb-4 p-3.5 rounded-lg bg-brand-ink-50 border border-brand-ink-200">
              <div className="flex items-center justify-between text-xs text-brand-ink-500">
                <span>Path progress</span>
                <span className="font-semibold text-brand-ink-800">
                  {roadmapProgress.completed} / {roadmapProgress.total} skills ({roadmapProgress.percent}%)
                </span>
              </div>
              <ProgressBar value={Math.max(2, roadmapProgress.percent)} color="blue" height="h-1.5" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-brand-ink-400 flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" /> Progress saved automatically
            </span>
            <Button
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate(`/roadmap/${topCareer.id}`)}
              className="text-xs"
            >
              Continue Roadmap
            </Button>
          </div>
        </Card>

        {/* AI Career Coach Quick-Prompt Assist (5 cols) */}
        <Card className="lg:col-span-5 p-6 sm:p-7 shadow-xs border-brand-ink-100 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-blue-600 to-brand-purple-600 text-white flex items-center justify-center shadow-xs">
                <Bot size={18} />
              </div>
              <div>
                <h4 className="font-display font-bold text-brand-ink-900 text-sm sm:text-base">
                  Ask CareerAI Coach
                </h4>
                <p className="text-[11px] text-brand-ink-500">
                  Instant guidance tailored to your profile
                </p>
              </div>
            </div>

            <p className="text-xs text-brand-ink-600 mb-4 leading-relaxed">
              Click any question below to immediately get advice, project roadmaps, and interview strategies:
            </p>

            <div className="space-y-2">
              {[
                {
                  label: `Why did I match with ${topMatchTitle}?`,
                  prompt: `Explain why I matched with ${topMatchTitle} and what makes this career suitable for my profile.`,
                  icon: Sparkles,
                },
                {
                  label: 'Generate a 7-day study schedule',
                  prompt: `Create an intensive 7-day study plan for me to start learning ${topMatchTitle} skills effectively.`,
                  icon: Target,
                },
                {
                  label: 'What skills should I prioritize next?',
                  prompt: `Based on my current aptitude assessment, what are the top 3 high-impact skills I need to learn next?`,
                  icon: Zap,
                },
                {
                  label: 'Compare my top matched careers',
                  prompt: `Compare the top 3 careers from my assessment in terms of difficulty, day-to-day work, and salary growth.`,
                  icon: Layers,
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => navigate(`/chat?prompt=${encodeURIComponent(item.prompt)}`)}
                  className="w-full text-left p-2.5 rounded-xl border border-brand-ink-100 bg-brand-ink-50/40 hover:bg-brand-blue-50 hover:border-brand-blue-200 text-brand-ink-800 hover:text-brand-blue-900 transition-all text-xs font-medium flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <item.icon size={13} className="text-brand-blue-600 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-brand-ink-400 group-hover:text-brand-blue-600 shrink-0 transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-ink-100">
            <Button
              variant="secondary"
              size="sm"
              icon={MessageSquare}
              onClick={() => navigate('/chat')}
              className="w-full text-xs font-semibold"
            >
              Open AI Chat Assistant
            </Button>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 6. RECOMMENDED FREE VIDEO COURSES & OPPORTUNITIES */}
      {/* ========================================================================= */}
      <div className="grid lg:grid-cols-12 gap-6 mb-7">
        {/* Free Video Courses for Student's Stream (7 cols) */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap size={20} className="text-brand-blue-600" />
              <h3 className="font-display font-bold text-lg text-brand-ink-900">
                Recommended Free Masterclasses
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/courses?category=${topCategoryCode}`)}
              className="text-xs sm:text-sm font-semibold text-brand-blue-600 hover:underline flex items-center gap-1"
            >
              Browse all <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3.5">
            {relevantCourses.map((course) => (
              <Card
                key={course.id}
                hover
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-brand-ink-100 bg-white shadow-xs cursor-pointer group"
                onClick={() => navigate('/courses')}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="relative h-16 w-24 sm:h-18 sm:w-28 rounded-xl overflow-hidden bg-brand-ink-900 shrink-0 shadow-xs">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <PlayCircle size={22} className="text-white drop-shadow-md" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-blue-50 text-brand-blue-700">
                      {course.level} · {course.duration}
                    </span>
                    <h4 className="font-display font-bold text-sm text-brand-ink-900 group-hover:text-brand-blue-600 transition-colors mt-1 line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-xs text-brand-ink-500 truncate mt-0.5">
                      {course.channel} · ⭐ {course.rating} ({course.reviewsCount?.toLocaleString()} reviews)
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="text-xs font-semibold text-brand-blue-600 shrink-0 self-end sm:self-center"
                >
                  Watch
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Matched Opportunities & Internships (5 cols) */}
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-brand-purple-600" />
              <h3 className="font-display font-bold text-lg text-brand-ink-900">
                Matched Opportunities
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/opportunities')}
              className="text-xs sm:text-sm font-semibold text-brand-blue-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3.5">
            {topOpportunities.map((opp) => (
              <Card
                key={opp.id}
                hover
                className="p-4 sm:p-5 border-brand-ink-100 bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge color={opp.type === 'Internship' ? 'blue' : 'purple'}>
                      {opp.type}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => toggleSaveOpp(opp.id)}
                      className={`transition-colors p-1 ${savedOpps.has(opp.id)
                          ? 'text-brand-purple-600'
                          : 'text-brand-ink-300 hover:text-brand-purple-500'
                        }`}
                      aria-label="Save opportunity"
                    >
                      <Bookmark size={16} fill={savedOpps.has(opp.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <h4 className="font-display font-bold text-sm text-brand-ink-900 mb-0.5 line-clamp-1">
                    {opp.title}
                  </h4>
                  <p className="text-xs text-brand-ink-500 mb-2">{opp.org}</p>

                  <div className="flex items-center justify-between text-xs text-brand-ink-600 mb-2">
                    <span>{opp.stipend}</span>
                    <span className="text-brand-ink-400">Deadline: {opp.deadline}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/opportunities')}
                  className="pt-2 border-t border-brand-ink-100 text-xs font-semibold text-brand-blue-600 hover:underline flex items-center justify-between mt-1"
                >
                  <span>Apply &amp; Details</span>
                  <ExternalLink size={12} />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. PROFILE READINESS CHECKLIST & RECENT ACTIVITY */}
      {/* ========================================================================= */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Profile Readiness Booster (6 cols) */}
        <Card className="lg:col-span-6 p-6 sm:p-7 shadow-xs border-brand-ink-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-bold text-base text-brand-ink-900">
              Career Readiness Checklist
            </h4>
            <span className="text-xs font-bold text-brand-blue-600">
              {profileCompletion}% Ready
            </span>
          </div>

          <ProgressBar value={profileCompletion} color="mixed" height="h-2" />

          <div className="space-y-2.5 mt-5">
            {[
              {
                text: 'Complete 30-question assessment',
                done: hasAssessment,
                action: () => navigate('/assessment'),
              },
              {
                text: 'Update college, branch, and education stream',
                done: !!profile?.college,
                action: () => navigate('/profile'),
              },
              {
                text: 'Select career goal & add key skills',
                done: !!(profile?.skills?.length > 0),
                action: () => navigate('/profile'),
              },
              {
                text: 'Complete your first roadmap milestone',
                done: roadmapProgress.completed > 0,
                action: () => navigate(`/roadmap/${topCareer.id}`),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-brand-ink-50/50 border border-brand-ink-100 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${item.done
                        ? 'bg-emerald-600 text-white'
                        : 'border border-brand-ink-300 bg-white'
                      }`}
                  >
                    {item.done && <CheckCircle2 size={12} />}
                  </div>
                  <span className={item.done ? 'line-through text-brand-ink-500' : 'font-medium text-brand-ink-800'}>
                    {item.text}
                  </span>
                </div>

                {!item.done && (
                  <button
                    type="button"
                    onClick={item.action}
                    className="text-[11px] font-bold text-brand-blue-600 hover:underline shrink-0"
                  >
                    Action →
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity Timeline (6 cols) */}
        <Card className="lg:col-span-6 p-6 sm:p-7 shadow-xs border-brand-ink-100 bg-white">
          <h4 className="font-display font-bold text-base text-brand-ink-900 mb-4">
            Recent Activity &amp; Milestones
          </h4>

          <ul className="space-y-3.5">
            {recentActivity.map((activity) => {
              const Icon = Icons[activity.icon] || Icons.Activity;
              return (
                <li key={activity.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-brand-ink-800 leading-snug">
                      {activity.text}
                    </p>
                    <p className="text-[11px] text-brand-ink-400 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {activity.time}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
