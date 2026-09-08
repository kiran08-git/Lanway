import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  ArrowRight,
  Sparkles,
  Briefcase,
  Bot,
  ChevronRight,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getLatestCareerRecommendations } from '../lib/careerService';
import { currentUser } from '../data/mockData';
import DashboardLayout from '../components/layout/DashboardLayout';
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

  // Compute profile completion percentage
  const displayName = profile?.name || user?.user_metadata?.full_name || currentUser.name;
  const firstName = displayName.split(' ')[0];

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

  return (
    <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${firstName}`}>
      {/* ========================================================================= */}
      {/* 1. HERO GREETING BANNER (COMPACT) */}
      {/* ========================================================================= */}
      <div className="card p-3.5 sm:p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-brand-ink-100 shadow-xs bg-white rounded-xl">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-blue-50 text-brand-blue-600">
              <Sparkles size={11} />
              + {hasAssessment ? 'AI Assessment Analyzed' : 'Standard Profile Active'}
            </span>
            <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
              Top Match: {topMatchScore}% Fit
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-display font-bold text-brand-ink-900 leading-snug">
            Hi {firstName}, your highest compatibility is in <span className="text-brand-blue-600">{topMatchTitle}</span> 🎯
          </h2>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={() =>
              navigate(
                `/chat?prompt=Explain%20why%20I%20matched%20with%20${encodeURIComponent(
                  topMatchTitle
                )}%20and%20create%20a%20step-by-step%20learning%20plan%20for%20me.`
              )
            }
            className="!bg-[#d97706] hover:!bg-[#b45309] !text-white text-xs py-1.5 shadow-none border-none font-semibold"
          >
            Ask AI
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronRight}
            iconPosition="right"
            onClick={() => navigate('/careers')}
            className="text-xs font-semibold py-1.5 border-brand-ink-100 shadow-xs"
          >
            All Matches ({rawCareers.length || 6})
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={hasAssessment ? RotateCcw : ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/assessment')}
            className="text-xs font-semibold py-1.5 border-brand-ink-100 shadow-xs"
          >
            {hasAssessment ? 'Retake' : 'Start Test'}
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CORE VISUALIZATION SECTION: PIE CHART & DIMENSIONS */}
      {/* ========================================================================= */}
      <div className="grid lg:grid-cols-12 gap-4 mb-4">
        {/* Left Column: Interactive Career Matches Pie Chart (7 cols) */}
        <Card className="lg:col-span-7 p-4 shadow-xs border-brand-ink-100 bg-white flex flex-col justify-between">
          <CareerMatchPieChart
            careers={rawCareers}
            selectedCategory={selectedPieFilter}
            onSelectCategory={(cat) => setSelectedPieFilter(cat)}
          />
        </Card>

        {/* Right Column: Holland RIASEC & Dimension Breakdown (5 cols) */}
        <Card className="lg:col-span-5 p-4 shadow-xs border-brand-ink-100 bg-white flex flex-col justify-between">
          <SkillRadarBar
            categoryScores={aiData?.categoryScores || {}}
            strongestCategories={aiData?.strongestCategories || []}
            careers={rawCareers}
          />
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. TOP MATCHED CAREER PATHWAYS (FILTERABLE BY PIE CHART) */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-sm text-brand-ink-900 flex items-center gap-1.5">
              <Briefcase size={16} className="text-brand-blue-600" />
              <span>Recommended Career Pathways</span>
            </h3>
            {selectedPieFilter !== 'ALL' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-200 flex items-center gap-1">
                <Filter size={10} /> Filter: {selectedPieFilter}
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
            className="text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View all {rawCareers.length || 6}</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Career Cards Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {displayedCareers.map((career) => {
            const score = career.matchScore || 85;
            const CareerIcon = (career.icon && Icons[career.icon]) || Briefcase;
            const slug = career.id || career.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            return (
              <Card
                key={career.id || career.title}
                hover
                className="p-3 flex flex-col justify-between border-brand-ink-100 bg-white shadow-xs hover:border-brand-blue-300 transition-all group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center shrink-0 group-hover:bg-brand-blue-600 group-hover:text-white transition-colors">
                      <CareerIcon size={16} />
                    </div>
                    <Badge color={score >= 90 ? 'green' : score >= 80 ? 'blue' : 'purple'}>
                      {score}% match
                    </Badge>
                  </div>

                  {/* Title & Domain */}
                  <h4 className="font-display font-bold text-xs text-brand-ink-900 group-hover:text-brand-blue-600 transition-colors mb-0.5 line-clamp-1">
                    {career.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-brand-ink-500 mb-2 flex-wrap">
                    <span>{career.field || 'Technology'}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">{career.growth || 'High Demand'}</span>
                  </div>

                  {/* Salary & Match Progress */}
                  <div className="space-y-1 mb-2 bg-brand-ink-50/50 p-2 rounded-lg border border-brand-ink-100/70">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-brand-ink-500">Compensation</span>
                      <span className="font-bold text-brand-ink-900">{career.salaryRange || '₹4.5 – 12 LPA'}</span>
                    </div>
                    <ProgressBar
                      value={score}
                      color={score >= 90 ? 'green' : score >= 80 ? 'blue' : 'purple'}
                      height="h-1"
                    />
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-brand-ink-100 flex items-center justify-between gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/chat?prompt=Tell%20me%20why%20I%20matched%20with%20${encodeURIComponent(
                          career.title
                        )}%20and%20what%20skills%20I%20should%20learn%20first.`
                      )
                    }
                    className="text-[10px] font-semibold text-brand-purple-600 hover:text-brand-purple-700 flex items-center gap-1"
                  >
                    <Bot size={11} /> AI Advice
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/roadmap/${slug}`)}
                    className="text-[10px] font-bold text-brand-blue-600 hover:text-brand-blue-700 flex items-center gap-1"
                  >
                    <span>Roadmap</span>
                    <ChevronRight size={11} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
