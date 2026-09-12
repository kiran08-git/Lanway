import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Zap,
  Briefcase,
  TrendingUp,
  Bot,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getLatestCareerRecommendations } from '../lib/careerService';
import { CAREER_DATABASE } from '../data/careerDatabase.js';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import YoutubeIcon from '../components/ui/YoutubeIcon';

export default function CareerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [aiCareer, setAiCareer] = useState(null);

  // Find static catalog match
  const dbMatch = CAREER_DATABASE.find(
    (c) =>
      c.id === id ||
      c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id?.toLowerCase() ||
      c.title.toLowerCase() === id?.toLowerCase()
  ) || CAREER_DATABASE[0];

  useEffect(() => {
    async function findAiCareer() {
      try {
        const result = await getLatestCareerRecommendations(user?.id);
        if (result?.careers) {
          const found = result.careers.find(
            (c) =>
              c.id === id ||
              c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id?.toLowerCase() ||
              c.title.toLowerCase() === id?.toLowerCase()
          );
          if (found) {
            setAiCareer(found);
          }
        }
      } catch (err) {
        console.warn('Error fetching career detail:', err);
      }
    }
    findAiCareer();
  }, [id, user]);

  const title = aiCareer?.title || dbMatch.title;
  const matchScore = aiCareer?.matchScore || dbMatch.matchScore || 88;
  const field = aiCareer?.field || dbMatch.field || 'Technology';
  const salaryRange = aiCareer?.salaryRange || dbMatch.salaryRange || '₹4.5 – 12 LPA';
  const growth = aiCareer?.growth || dbMatch.growth || 'High Demand';
  const whyMatch = aiCareer?.whyMatch || dbMatch.overview;
  const strengths = (aiCareer?.strengths && aiCareer.strengths.length > 0) ? aiCareer.strengths : (dbMatch.strengths || []);
  const skillGaps = (aiCareer?.skillGaps && aiCareer.skillGaps.length > 0) ? aiCareer.skillGaps : (dbMatch.skillGaps || []);
  const recommendedSkills = (aiCareer?.recommendedSkills && aiCareer.recommendedSkills.length > 0) ? aiCareer.recommendedSkills : (dbMatch.recommendedSkills || []);
  const CareerIcon = (dbMatch.icon && Icons[dbMatch.icon]) || Briefcase;
  const careerRouteId = dbMatch.id || id;

  return (
    <DashboardLayout title="Career Details" subtitle={title}>
      <button
        onClick={() => navigate('/careers')}
        className="flex items-center gap-1.5 text-sm font-medium text-brand-ink-500 hover:text-brand-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to recommendations
      </button>

      {/* Header */}
      <Card className="p-6 sm:p-8 mb-7 shadow-xs border-brand-blue-100 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center shrink-0 shadow-xs">
              <CareerIcon size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-display font-bold text-brand-ink-900">{title}</h2>
                <Badge color="purple">
                  {aiCareer ? 'AI Personalized' : 'Verified Pathway'}
                </Badge>
              </div>
              <p className="text-sm text-brand-ink-500 mt-1">
                {field} · {salaryRange} · <span className="text-emerald-600 font-medium">{growth}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
            <div className="text-center">
              <p className="text-3xl font-display font-extrabold gradient-text">{matchScore}%</p>
              <p className="text-xs text-brand-ink-500">profile match</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon={Bot}
                onClick={() =>
                  navigate(
                    `/chat?prompt=Tell%20me%20how%20to%20prepare%20for%20a%20career%20as%20${encodeURIComponent(
                      title
                    )}%20and%20what%20study%20plan%20I%20should%20follow.`
                  )
                }
                className="text-xs border-brand-ink-200"
              >
                Ask CareerAI 🤖
              </Button>
              <Button
                variant="primary"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate(`/roadmap/${careerRouteId}`)}
                className="shadow-soft text-xs"
              >
                View Roadmap
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Why this career matches */}
          <Card className="p-6 sm:p-8 border-brand-ink-100 bg-white shadow-xs">
            <h3 className="font-display font-bold text-brand-ink-900 mb-3 flex items-center gap-2 text-base">
              <Zap size={18} className="text-amber-500" /> Why this career matches your profile
            </h3>
            <p className="text-sm text-brand-ink-700 leading-relaxed bg-brand-ink-50/80 p-4 rounded-xl border border-brand-ink-100">
              {whyMatch}
            </p>
          </Card>

          {/* Student's Existing Strengths */}
          {strengths.length > 0 && (
            <Card className="p-6 sm:p-8 border-emerald-100 bg-emerald-50/20 shadow-xs">
              <h3 className="font-display font-bold text-emerald-900 mb-4 flex items-center gap-2 text-base">
                <CheckCircle2 size={18} className="text-emerald-600" /> Supporting Strengths for this Role
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {strengths.map((str, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-emerald-950">{str}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Skill Gaps & What's Missing */}
          {skillGaps.length > 0 && (
            <Card className="p-6 sm:p-8 border-amber-100 bg-amber-50/20 shadow-xs">
              <h3 className="font-display font-bold text-amber-900 mb-4 flex items-center gap-2 text-base">
                <AlertTriangle size={18} className="text-amber-600" /> Identified Skill Gaps to Bridge
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {skillGaps.map((gap, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-amber-950">{gap}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recommended Skills to Learn */}
          {recommendedSkills.length > 0 && (
            <Card className="p-6 sm:p-8 border-brand-ink-100 bg-white shadow-xs">
              <h3 className="font-display font-bold text-brand-ink-900 mb-4 flex items-center gap-2 text-base">
                <BookOpen size={18} className="text-brand-blue-600" /> Recommended Skills to Learn Next
              </h3>
              <div className="flex flex-wrap gap-2">
                {recommendedSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-lg bg-brand-blue-50 text-brand-blue-700 font-semibold border border-brand-blue-200"
                  >
                    + {sk}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Role Overview and Daily Routine */}
          <Card className="p-6 sm:p-8 border-brand-ink-100 bg-white shadow-xs">
            <h3 className="font-display font-bold text-brand-ink-900 mb-3 text-base">Role Overview</h3>
            <p className="text-sm text-brand-ink-600 leading-relaxed mb-5">
              {dbMatch.overview}
            </p>

            {dbMatch.dayInLife && (
              <>
                <h4 className="font-semibold text-brand-ink-900 text-sm mb-2">A typical day in this role:</h4>
                <p className="text-xs sm:text-sm text-brand-ink-600 leading-relaxed mb-5 p-3 rounded-xl bg-brand-ink-50/60 border border-brand-ink-100">
                  {dbMatch.dayInLife}
                </p>
              </>
            )}

            {dbMatch.dailyLife && (
              <>
                <h4 className="font-semibold text-brand-ink-900 text-sm mb-2">Core responsibilities:</h4>
                <ul className="space-y-2">
                  {dbMatch.dailyLife.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-brand-ink-700">
                      <CheckCircle2 size={16} className="text-brand-blue-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Salary Progression */}
          {dbMatch.salaryProgression && (
            <Card className="p-6 border-brand-ink-100 bg-white shadow-xs">
              <h3 className="font-display font-bold text-brand-ink-900 mb-4 flex items-center gap-2 text-base">
                <TrendingUp size={18} className="text-brand-blue-600" /> Salary Progression
              </h3>
              <div className="space-y-3">
                {dbMatch.salaryProgression.map((s) => (
                  <div
                    key={s.level}
                    className="flex items-center justify-between text-xs sm:text-sm py-2 border-b border-brand-ink-100 last:border-0"
                  >
                    <span className="text-brand-ink-600">{s.level}</span>
                    <span className="font-semibold text-brand-ink-900">{s.range}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Pros & Cons */}
          {dbMatch.pros && dbMatch.cons && (
            <Card className="p-6 border-brand-ink-100 bg-white shadow-xs">
              <h3 className="font-display font-bold text-brand-ink-900 mb-3 text-base">Career Trade-offs</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-bold text-emerald-800 mb-1">Advantages:</p>
                  <ul className="space-y-1 text-brand-ink-600">
                    {dbMatch.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-brand-ink-100">
                  <p className="font-bold text-amber-800 mb-1">Considerations:</p>
                  <ul className="space-y-1 text-brand-ink-600">
                    {dbMatch.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {/* Ask CareerAI Assistant CTA Card */}
          <Card className="p-6 bg-brand-blue-600 border-none text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-brand-blue-500/20 blur-xl pointer-events-none" />
            <div className="flex items-center gap-2.5 mb-2">
              <div className="h-8 w-8 rounded-lg bg-brand-blue-500 text-white flex items-center justify-center shadow-xs">
                <Bot size={18} />
              </div>
              <h3 className="font-display font-bold text-white text-sm">Ask CareerAI 🤖</h3>
            </div>
            <p className="text-xs text-brand-blue-100/90 mb-4 leading-relaxed">
              Have questions about {title}? Ask CareerAI Assistant for personalized study roadmaps, interview questions, or skill gap guidance.
            </p>
            <Button
              variant="secondary"
              className="w-full !bg-white !text-brand-ink-900 !border-none text-xs !py-2 shadow-soft hover:!bg-brand-blue-50 font-semibold"
              onClick={() =>
                navigate(
                  `/chat?prompt=Tell%20me%20how%20to%20prepare%20for%20a%20career%20as%20${encodeURIComponent(
                    title
                  )}%20and%20what%20study%20plan%20I%20should%20follow.`
                )
              }
            >
              Discuss {title} with AI
            </Button>
          </Card>

          {/* Free Video Courses CTA */}
          <Card className="p-6 bg-white border-red-100 shadow-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="h-8 w-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
                <YoutubeIcon size={17} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-brand-ink-900 text-sm">Free YouTube Courses</h3>
            </div>
            <p className="text-xs text-brand-ink-600 mb-4 leading-relaxed">
              Watch full free video tutorials and crash courses curated for {title}.
            </p>
            <Button
              variant="secondary"
              className="w-full text-xs !py-2 border-brand-ink-200"
              onClick={() => navigate(`/courses?category=${dbMatch.primaryCategory || 'SW'}`)}
            >
              Watch {CATEGORY_INFO[dbMatch.primaryCategory]?.name || 'Video'} Courses
            </Button>
          </Card>

          {/* Roadmap CTA */}
          <Card className="p-6 bg-brand-blue-600 border-none text-center shadow-md text-white">
            <p className="text-white font-display font-bold mb-2 text-lg">Personalized Roadmap</p>
            <p className="text-brand-blue-50 text-xs sm:text-sm mb-5">
              Follow step-by-step milestone guidance to build these skills.
            </p>
            <Button
              variant="secondary"
              className="!bg-white !text-brand-ink-900 !border-none w-full shadow-sm hover:!bg-brand-blue-50"
              onClick={() => navigate(`/roadmap/${careerRouteId}`)}
            >
              View learning roadmap
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
