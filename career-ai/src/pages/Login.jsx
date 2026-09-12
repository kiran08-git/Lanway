import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authData = await login(formData.email, formData.password);
      const userRole = authData.user?.user_metadata?.role || 'student';
      if (userRole === 'recruiter') {
        navigate('/company-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to log in. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="container-app py-6">
        <Link to="/" className="inline-flex items-center gap-2.5 font-display font-bold text-[20px] text-brand-ink-900">
          <img src="/logo.png" alt="Lanway Logo" className="h-9 w-auto object-contain shrink-0" style={{ imageRendering: 'high-quality' }} />
          Lanway
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 pb-16">
        <Card className="w-full max-w-md p-8 sm:p-10 animate-fade-up">
          <h1 className="text-2xl font-display font-bold text-brand-ink-900 mb-1.5">Welcome back</h1>
          <p className="text-sm text-brand-ink-500 mb-8">Log in to continue your career journey.</p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email"
              type="email"
              label="Email address"
              icon={Mail}
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <Input
              id="password"
              type="password"
              label="Password"
              icon={Lock}
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-brand-ink-600">
                <input type="checkbox" className="rounded border-brand-ink-300 text-brand-blue-600 focus:ring-brand-blue-400" disabled={loading} />
                Remember me
              </label>
              <a href="#" className="text-brand-blue-600 font-medium hover:underline">
                Forgot password?
              </a>
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
