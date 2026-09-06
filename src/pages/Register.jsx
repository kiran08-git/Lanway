import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const PERKS = [
  'A personalized skill, aptitude & interest assessment',
  'AI-matched career recommendations',
  'Step-by-step learning roadmaps',
  'Curated internships & scholarships',
];

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock signup — replace with Supabase auth later.
    setTimeout(() => {
      setLoading(false);
      navigate('/profile');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-brand-ink-50/50 flex flex-col">
      <div className="container-app py-6">
        <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-lg text-brand-ink-900">
          <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-blue-600 to-brand-purple-600 flex items-center justify-center text-white shadow-soft">
            <Compass size={19} />
          </span>
          Career<span className="gradient-text">AI</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 pb-16">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
          <Card className="p-8 sm:p-10 animate-fade-up order-2 lg:order-1">
            <h1 className="text-2xl font-display font-bold text-brand-ink-900 mb-1.5">Create your account</h1>
            <p className="text-sm text-brand-ink-500 mb-8">Start your free assessment in under a minute.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input id="name" type="text" label="Full name" icon={User} placeholder="Ananya Sharma" required />
              <Input id="email" type="email" label="Email address" icon={Mail} placeholder="you@example.com" required />
              <Input id="password" type="password" label="Password" icon={Lock} placeholder="Create a password" required />

              <label className="flex items-start gap-2 text-xs text-brand-ink-500">
                <input type="checkbox" required className="mt-0.5 rounded border-brand-ink-300 text-brand-blue-600 focus:ring-brand-blue-400" />
                I agree to the Terms of Service and Privacy Policy
              </label>

              <Button type="submit" variant="primary" icon={ArrowRight} iconPosition="right" loading={loading} className="w-full">
                Create account
              </Button>
            </form>

            <p className="text-center text-sm text-brand-ink-500 mt-7">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-blue-600 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </Card>

          <div className="order-1 lg:order-2 px-2">
            <span className="section-eyebrow mb-4">Why join CareerAI</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-brand-ink-900 mb-6">
              Everything you need to plan your career, in one place.
            </h2>
            <ul className="space-y-4">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-brand-blue-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-brand-ink-700">{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
