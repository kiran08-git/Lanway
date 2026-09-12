import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardList,
  Users,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const FEATURES = [
  {
    icon: ClipboardList,
    title: 'Build better assessments',
    description: 'Create focused tests for the skills and roles that matter to your team.',
  },
  {
    icon: Users,
    title: 'See the whole candidate',
    description: 'Review assessment results alongside candidate strengths and career context.',
  },
  {
    icon: BarChart3,
    title: 'Shortlist with confidence',
    description: 'Turn clear performance signals into faster, fairer hiring decisions.',
  },
];

const RECRUITER_GOALS = [
  {
    label: 'Build an assessment',
    title: 'Create a role-specific test',
    description: 'Design a focused assessment around the skills your next hire actually needs.',
    icon: ClipboardList,
  },
  {
    label: 'Find better matches',
    title: 'Move from applicants to shortlist',
    description: 'Compare candidates using consistent signals instead of relying on resumes alone.',
    icon: Users,
  },
  {
    label: 'Understand results',
    title: 'Make every signal useful',
    description: 'See clear candidate strengths and gaps so your team can make a confident decision.',
    icon: BarChart3,
  },
];

export default function Recruiters() {
  const navigate = useNavigate();
  const [activeGoal, setActiveGoal] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className="bg-[#f4f0ea] border-b border-brand-ink-200 overflow-hidden">
          <div className="container-app grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center pt-14 pb-16 lg:pt-24 lg:pb-24">
            <div className="animate-fade-up">
              <span className="section-eyebrow mb-6"><Building2 size={13} /> CareerAI for companies</span>
              <h1 className="text-4xl sm:text-5xl lg:text-[4.25rem] font-display font-extrabold leading-[1.03] tracking-[-0.04em]">
                Hire for potential, not just a perfect resume.
              </h1>
              <p className="mt-6 text-lg text-brand-ink-600 max-w-xl leading-relaxed">
                CareerAI gives recruiters a simple way to discover emerging talent, assess job-ready skills,
                and build a stronger shortlist without adding more noise to the process.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
                <Button variant="primary" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/register')}>
                  Create a recruiter account
                </Button>
                <Button variant="secondary" onClick={() => navigate('/login')}>Recruiter login</Button>
              </div>
              <p className="mt-4 text-xs font-medium text-brand-ink-500">Role-specific assessments · Clear candidate insights · One hiring workspace</p>
            </div>

            <div className="relative animate-fade-up [animation-delay:120ms]">
              <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full border-2 border-brand-blue-200" />
              <Card className="relative p-5 sm:p-7 shadow-card border-brand-ink-300 rotate-[1deg]">
                <div className="flex items-center justify-between border-b border-brand-ink-100 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-brand-blue-600 text-white flex items-center justify-center">
                      <Building2 size={19} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-ink-500">Recruiter workspace</p>
                      <p className="font-display text-xl font-bold text-brand-ink-900 mt-1">Talent pipeline</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Active</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    ['08', 'Open tests'],
                    ['124', 'Applicants'],
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
                    <p className="text-sm font-bold text-brand-ink-900">Top matches</p>
                    <span className="text-xs font-semibold text-brand-blue-600">View pipeline</span>
                  </div>
                  {[
                    ['AS', 'Aarav Sharma', 'Frontend developer', '92%'],
                    ['NK', 'Nisha Kapoor', 'Product designer', '88%'],
                    ['RV', 'Rohan Verma', 'Data analyst', '84%'],
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

        <section className="container-app py-16 lg:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-eyebrow mb-4">A clearer hiring workflow</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold">Everything you need to spot the right fit</h2>
            <p className="mt-4 text-brand-ink-600">Spend less time sorting applications and more time meeting candidates who can grow with your team.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="p-6" hover>
                <div className="h-11 w-11 rounded-lg bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center mb-4">
                  <Icon size={21} />
                </div>
                <h3 className="font-display font-bold text-brand-ink-900 mb-2">{title}</h3>
                <p className="text-sm text-brand-ink-600 leading-relaxed">{description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-[#eef5f4] border-y border-brand-ink-100">
          <div className="container-app py-16 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-eyebrow mb-4">Built for practical hiring</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-5">Make every assessment more useful.</h2>
              <p className="text-brand-ink-600 leading-relaxed">Give applicants a fair opportunity to show what they can do, while giving your team the evidence it needs to make a thoughtful decision.</p>
            </div>
            <ul className="space-y-4">
              {[
                'Create assessments tailored to each open role',
                'Compare candidates using consistent signals',
                'Keep assessments, applicants, and decisions together',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={19} className="text-brand-blue-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-brand-ink-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="container-app py-16 lg:py-24">
          <Card className="overflow-hidden border-brand-ink-300 shadow-card">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <div className="bg-[#e9f3f2] p-8 sm:p-10 lg:p-12">
                <span className="section-eyebrow mb-5"><Building2 size={13} /> Your hiring next step</span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight mb-4">Build a stronger talent pipeline.</h2>
                <p className="text-brand-ink-600 leading-relaxed">
                  Choose the part of your hiring workflow you want to improve, and start with a focused workspace built around it.
                </p>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-brand-blue-700">
                  <span className="h-2 w-2 rounded-full bg-brand-blue-600 animate-pulse" />
                  Clearer decisions for growing teams
                </div>
              </div>

              <div className="p-8 sm:p-10 lg:p-12 bg-white">
                <div className="grid sm:grid-cols-3 gap-2 mb-8" role="tablist" aria-label="Choose your hiring goal">
                  {RECRUITER_GOALS.map((goal, index) => {
                    const Icon = goal.icon;
                    const isActive = activeGoal === index;

                    return (
                      <button
                        key={goal.label}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveGoal(index)}
                        className={`flex sm:flex-col items-center sm:items-start gap-2 rounded-md border px-3 py-3 text-left text-sm font-semibold transition-colors ${
                          isActive
                            ? 'border-brand-blue-600 bg-brand-blue-50 text-brand-blue-700'
                            : 'border-brand-ink-200 text-brand-ink-600 hover:border-brand-blue-300 hover:bg-brand-ink-50'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{goal.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="min-h-28" aria-live="polite">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink-400 mb-2">A good place to begin</p>
                  <h3 className="text-xl font-display font-bold text-brand-ink-900 mb-2">{RECRUITER_GOALS[activeGoal].title}</h3>
                  <p className="text-sm text-brand-ink-600 leading-relaxed max-w-lg">{RECRUITER_GOALS[activeGoal].description}</p>
                </div>

                <Button variant="primary" icon={ArrowRight} iconPosition="right" className="mt-6" onClick={() => navigate('/register')}>
                  Get started as a recruiter
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
