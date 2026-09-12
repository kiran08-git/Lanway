import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Sparkles,
  Target,
  Map as MapIcon,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
  Globe2,
  ClipboardList,
  Building2,
  FileCheck2,
  UserRoundCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const JOURNEY_STEPS = [
  { icon: ClipboardList, title: 'Take the assessment', desc: 'Quick skill, aptitude & interest tests — 15 minutes, no prep needed.' },
  { icon: Sparkles, title: 'Get AI recommendations', desc: 'See careers matched to you, ranked by fit — not by what\u2019s popular.' },
  { icon: MapIcon, title: 'Follow your roadmap', desc: 'A month-by-month learning plan with free resources for your path.' },
  { icon: Briefcase, title: 'Apply to opportunities', desc: 'Internships, scholarships & courses picked for your career goal.' },
];

const PATH_OPTIONS = [
  {
    label: 'I need direction',
    title: 'Start with what fits you',
    description: 'Answer a few thoughtful questions and discover career paths that match your strengths.',
    icon: Target,
  },
  {
    label: 'I want to build skills',
    title: 'Turn interest into a plan',
    description: 'Get a practical roadmap with the skills, projects, and free resources to move forward.',
    icon: MapIcon,
  },
  {
    label: 'I am ready to apply',
    title: 'Find your next opportunity',
    description: 'Explore internships, scholarships, and entry-level roles aligned with your career goal.',
    icon: Briefcase,
  },
];


export default function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activePath, setActivePath] = useState(0);

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-brand-blue-100 border-t-brand-blue-600 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-brand-ink-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-brand-ink-200 bg-[#f4f0ea]">
        <div className="container-app grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-center pt-14 pb-16 lg:pt-24 lg:pb-24">
          <div className="animate-fade-up">
            <span className="section-eyebrow mb-6"><Sparkles size={13} /> A clearer way forward</span>
            <h1 className="text-4xl sm:text-5xl lg:text-[4.25rem] font-display font-extrabold leading-[1.03] tracking-[-0.04em]">
              Build a career you can <span className="gradient-text">see yourself in.</span>
            </h1>
            <p className="mt-6 text-lg text-brand-ink-600 max-w-xl leading-relaxed">
              Find the right direction, learn the skills, and take the next step with a plan shaped around your strengths and your starting point.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
              <Button variant="primary" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/register')}>
                Start your assessment
              </Button>
              <Button variant="secondary" onClick={() => navigate('/login')}>Log in</Button>
            </div>
            <p className="mt-4 text-xs font-medium text-brand-ink-500">Free to start · 15 minute assessment · English and Hindi</p>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="absolute -top-5 -right-3 h-20 w-20 border-2 border-brand-blue-200 rounded-full" />
            <Card className="relative p-5 sm:p-7 shadow-card border-brand-ink-300 rotate-[1deg]">
              <div className="flex items-center justify-between border-b border-brand-ink-100 pb-4 mb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-ink-500">Your learning path</p>
                  <p className="font-display text-xl font-bold text-brand-ink-900 mt-1">Product Designer</p>
                </div>
                <div className="h-10 w-10 rounded-md bg-brand-blue-600 text-white flex items-center justify-center font-display font-bold">86</div>
              </div>
              <div className="space-y-4">
                {[
                  ['01', 'Understand your strengths', 'Complete'],
                  ['02', 'Learn the fundamentals', 'In progress'],
                  ['03', 'Build your first portfolio', 'Up next'],
                ].map(([number, title, status], index) => (
                  <div key={number} className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-md flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-emerald-100 text-emerald-700' : index === 1 ? 'bg-brand-blue-100 text-brand-blue-700' : 'bg-brand-ink-100 text-brand-ink-500'}`}>{number}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-ink-900">{title}</p>
                      <div className="h-1.5 bg-brand-ink-100 rounded-full mt-2 overflow-hidden"><div className={`h-full rounded-full ${index === 0 ? 'w-full bg-emerald-500' : index === 1 ? 'w-2/3 bg-brand-blue-600' : 'w-0'}`} /></div>
                    </div>
                    <span className="text-[11px] text-brand-ink-500 whitespace-nowrap">{status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-brand-ink-100 flex items-center justify-between">
                <span className="text-xs text-brand-ink-500">4 weeks · 6 milestones</span>
                <span className="text-xs font-bold text-brand-blue-600">View roadmap <ArrowRight size={13} className="inline ml-1" /></span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container-app py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-eyebrow mb-4">How it works</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold">From confused to confident in four steps</h2>
          <p className="mt-4 text-brand-ink-600">No generic advice — every recommendation is built from your own answers.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {JOURNEY_STEPS.map((step, i) => (
            <Card key={step.title} hover className="p-6 relative">
              <div className="h-11 w-11 rounded-lg bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center mb-4">
                <step.icon size={20} />
              </div>
              <p className="text-xs font-semibold text-brand-purple-500 mb-1">STEP {i + 1}</p>
              <h3 className="font-display font-bold text-brand-ink-900 mb-1.5">{step.title}</h3>
              <p className="text-sm text-brand-ink-600 leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* For students */}
      <section id="students" className="bg-white border-y border-brand-ink-100">
        <div className="container-app py-16 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-eyebrow mb-4">Built for you</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-5">
              Designed for students outside the metro bubble
            </h2>
            <p className="text-brand-ink-600 mb-7 leading-relaxed">
              Most career platforms assume you're in a big city with easy access to mentors and networks.
              CareerAI starts from where you actually are — your college, your resources, your language.
            </p>
            <ul className="space-y-4">
              {[
                'Recommendations that don\u2019t assume prior access to expensive coaching',
                'Roadmaps built entirely from free and low-cost resources',
                'Opportunities filtered for remote & hybrid roles you can do from home',
                'Simple, jargon-free explanations at every step',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={19} className="text-brand-blue-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-brand-ink-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Card className="p-6">
              <Users className="text-brand-blue-600 mb-3" size={26} />
              <p className="font-display font-bold text-brand-ink-900">Peer benchmarking</p>
              <p className="text-sm text-brand-ink-500 mt-1">See how you compare to students like you.</p>
            </Card>
            <Card className="p-6 mt-8">
              <TrendingUp className="text-brand-purple-600 mb-3" size={26} />
              <p className="font-display font-bold text-brand-ink-900">Growth-focused paths</p>
              <p className="text-sm text-brand-ink-500 mt-1">Only careers with real, growing demand.</p>
            </Card>
            <Card className="p-6">
              <Globe2 className="text-brand-purple-600 mb-3" size={26} />
              <p className="font-display font-bold text-brand-ink-900">Remote-friendly</p>
              <p className="text-sm text-brand-ink-500 mt-1">Work from your hometown, if you want to.</p>
            </Card>
            <Card className="p-6 mt-8">
              <Target className="text-brand-blue-600 mb-3" size={26} />
              <p className="font-display font-bold text-brand-ink-900">Precise matching</p>
              <p className="text-sm text-brand-ink-500 mt-1">Scored recommendations, not guesswork.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* For companies */}
      <section id="companies" className="bg-[#eef5f4] border-y border-brand-ink-100 overflow-hidden">
        <div className="container-app py-16 lg:py-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center">
          <div>
            <span className="section-eyebrow mb-4"><Building2 size={13} /> For hiring teams</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-5">
              Meet promising talent before they get lost in the crowd
            </h2>
            <p className="text-brand-ink-600 leading-relaxed mb-7">
              The CareerAI company portal helps you run focused assessments, understand candidate strengths,
              and move from first application to confident shortlist in one place.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { icon: FileCheck2, title: 'Create role-specific assessments', desc: 'Build skill and aptitude tests around the people you need.' },
                { icon: UserRoundCheck, title: 'Review candidates with context', desc: 'Compare results, profiles, and strengths without spreadsheet chaos.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-md bg-white text-brand-blue-600 border border-brand-ink-200 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-ink-900">{title}</p>
                    <p className="text-sm text-brand-ink-600 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="primary" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/recruiters')}>
              Explore the company portal
            </Button>
          </div>

          <div className="relative">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-2 border-brand-blue-200/70" />
            <Card className="relative p-5 sm:p-7 bg-white shadow-card border-brand-ink-300 rotate-[1deg]">
              <div className="flex items-center justify-between border-b border-brand-ink-100 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-brand-blue-600 text-white flex items-center justify-center">
                    <Building2 size={19} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-ink-500">Company portal</p>
                    <p className="font-display text-xl font-bold text-brand-ink-900 mt-1">Hiring overview</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Live</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  ['08', 'Assessments'],
                  ['124', 'Candidates'],
                  ['32', 'Shortlisted'],
                ].map(([value, label]) => (
                  <div key={label} className="bg-brand-ink-50 rounded-md p-3">
                    <p className="font-display text-2xl font-bold text-brand-ink-900">{value}</p>
                    <p className="text-[11px] text-brand-ink-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-brand-ink-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-brand-ink-900">Recent candidates</p>
                  <span className="text-xs font-semibold text-brand-blue-600">View all</span>
                </div>
                {[
                  ['AS', 'Aarav Sharma', 'Frontend assessment', '92%'],
                  ['NK', 'Nisha Kapoor', 'Product design test', '88%'],
                  ['RV', 'Rohan Verma', 'Data analyst screening', '84%'],
                ].map(([initials, name, role, score]) => (
                  <div key={name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 border-b last:border-0 border-brand-ink-100">
                    <div className="h-8 w-8 rounded-full bg-brand-blue-50 text-brand-blue-700 flex items-center justify-center text-[11px] font-bold">{initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-ink-900 truncate">{name}</p>
                      <p className="text-xs text-brand-ink-500 truncate">{role}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-700">{score}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white border-y border-brand-ink-100">
        <div className="container-app py-16 lg:py-20 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-eyebrow mb-4">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold">Common questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Is CareerAI free to use?', a: 'Yes, the core assessment, recommendations, and roadmaps are free for all students.' },
              { q: 'Do I need to know what career I want already?', a: 'No — that\u2019s exactly what the assessment is for. Most students start with no clear idea.' },
              { q: 'Is this only for engineering students?', a: 'Not at all. CareerAI covers technology, design, business, government, and more.' },
            ].map((item) => (
              <Card key={item.q} className="p-5">
                <p className="font-semibold text-brand-ink-900 mb-1.5">{item.q}</p>
                <p className="text-sm text-brand-ink-600">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-app py-14 lg:py-20">
        <Card className="overflow-hidden border-brand-ink-300 shadow-card">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-[#e9f3f2] p-8 sm:p-10 lg:p-12">
              <span className="section-eyebrow mb-5">Your next move</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight mb-4">
                Ready to find your path?
              </h2>
              <p className="text-brand-ink-600 leading-relaxed">
                Choose what you need most right now. We will help you turn that first thought into a clear next step.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-brand-blue-700">
                <span className="h-2 w-2 rounded-full bg-brand-blue-600 animate-pulse" />
                Personalised for where you are today
              </div>
            </div>

            <div className="p-8 sm:p-10 lg:p-12 bg-white">
              <div className="grid sm:grid-cols-3 gap-2 mb-8" role="tablist" aria-label="Choose your current goal">
                {PATH_OPTIONS.map((option, index) => {
                  const Icon = option.icon;
                  const isActive = activePath === index;

                  return (
                    <button
                      key={option.label}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActivePath(index)}
                      className={`flex sm:flex-col items-center sm:items-start gap-2 rounded-md border px-3 py-3 text-left text-sm font-semibold transition-colors ${
                        isActive
                          ? 'border-brand-blue-600 bg-brand-blue-50 text-brand-blue-700'
                          : 'border-brand-ink-200 text-brand-ink-600 hover:border-brand-blue-300 hover:bg-brand-ink-50'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="min-h-28" aria-live="polite">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink-400 mb-2">A good place to begin</p>
                <h3 className="text-xl font-display font-bold text-brand-ink-900 mb-2">{PATH_OPTIONS[activePath].title}</h3>
                <p className="text-sm text-brand-ink-600 leading-relaxed max-w-lg">{PATH_OPTIONS[activePath].description}</p>
              </div>

              <Button
                variant="primary"
                icon={ArrowRight}
                iconPosition="right"
                className="mt-6"
                onClick={() => navigate('/register')}
              >
                Start your free assessment
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
