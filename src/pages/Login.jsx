import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock auth — replace with Supabase auth later.
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
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
        <Card className="w-full max-w-md p-8 sm:p-10 animate-fade-up">
          <h1 className="text-2xl font-display font-bold text-brand-ink-900 mb-1.5">Welcome back</h1>
          <p className="text-sm text-brand-ink-500 mb-8">Log in to continue your career journey.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input id="email" type="email" label="Email address" icon={Mail} placeholder="you@example.com" required defaultValue="ananya.sharma@example.com" />
            <Input id="password" type="password" label="Password" icon={Lock} placeholder="••••••••" required defaultValue="password123" />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-brand-ink-600">
                <input type="checkbox" className="rounded border-brand-ink-300 text-brand-blue-600 focus:ring-brand-blue-400" />
                Remember me
              </label>
              <a href="#" className="text-brand-blue-600 font-medium hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" variant="primary" icon={ArrowRight} iconPosition="right" loading={loading} className="w-full">
              Log in
            </Button>
          </form>

          <p className="text-center text-sm text-brand-ink-500 mt-7">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-blue-600 font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
