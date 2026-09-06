import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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

const STATS = [
  { value: '50,000+', label: 'Students guided' },
  { value: '120+', label: 'Career paths mapped' },
  { value: '600+', label: 'Tier-2/3 colleges reached' },
  { value: '92%', label: 'Found it useful' },
];

const TESTIMONIALS = [
  {
    name: 'Rohit Verma',
    role: 'Diploma student, Kanpur',
    text: 'I didn\u2019t know data analysis was even an option for someone like me. The roadmap made it feel possible.',
  },
  {
    name: 'Priya Nair',
    role: 'B.Sc student, Coimbatore',
    text: 'The assessment actually felt like it understood me — not just another generic career quiz.',
  },
  {
    name: 'Amit Kushwaha',
    role: 'ITI student, Gorakhpur',
    text: 'Found an internship listed in my roadmap within two weeks of using CareerAI. Genuinely useful.',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[-5%] h-96 w-96 rounded-full bg-brand-blue-100/60 blur-3xl" />
          <div className="absolute top-[10%] left-[-10%] h-96 w-96 rounded-full bg-brand-purple-100/60 blur-3xl" />
        </div>

        <div className="container-app pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <span className="section-eyebrow mb-6">
              <Sparkles size={13} />
              AI-powered career guidance
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-[1.1] tracking-tight">
              Your next career move, <span className="gradient-text">clearly mapped out.</span>
            </h1>
            <p className="mt-6 text-lg text-brand-ink-600 max-w-2xl mx-auto">
              CareerAI helps students in Tier-2 and Tier-3 towns discover careers that actually fit them —
              backed by a simple assessment, real roadmaps, and opportunities that match where they're starting from.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/register')}>
                Start your assessment — it's free
              </Button>
              <Button variant="secondary" onClick={() => navigate('/login')}>
                I already have an account
              </Button>
            </div>
            <p className="mt-5 text-xs text-brand-ink-400">No credit card. Takes about 15 minutes. Available in English &amp; Hindi.</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="container-app pb-16">
          <Card className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-display font-extrabold gradient-text">{s.value}</p>
                <p className="text-xs sm:text-sm text-brand-ink-500 mt-1">{s.label}</p>
              </div>
            ))}
          </Card>
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

      {/* Testimonials */}
      <section className="container-app py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-eyebrow mb-4">Student stories</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold">Real students, real clarity</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} hover className="p-6">
              <p className="text-sm text-brand-ink-700 leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-ink-900">{t.name}</p>
                  <p className="text-xs text-brand-ink-500">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
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
      <section className="container-app py-16 lg:py-24">
        <Card className="p-10 sm:p-16 text-center bg-brand-blue-600 border-none">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Ready to find your path?
          </h2>
          <p className="text-brand-blue-50 max-w-xl mx-auto mb-8">
            Join thousands of students who've turned confusion into a clear, actionable career plan.
          </p>
          <Button
            variant="secondary"
            icon={ArrowRight}
            iconPosition="right"
            className="!bg-white !border-none mx-auto"
            onClick={() => navigate('/register')}
          >
            Start your free assessment
          </Button>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
