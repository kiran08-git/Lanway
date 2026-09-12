import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    companyName: '',
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
      if (!formData.name.trim()) {
        throw new Error('Please enter your full name');
      }
      if (formData.role === 'recruiter' && !formData.companyName.trim()) {
        throw new Error('Please enter your company name');
      }
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      await signup(formData.email, formData.password, formData.name, formData.role, formData.companyName);
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
      console.error('Signup error:', err);
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
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
          <Card className="p-8 sm:p-10 animate-fade-up order-2 lg:order-1">
            <h1 className="text-2xl font-display font-bold text-brand-ink-900 mb-1.5">Create your account</h1>
            <p className="text-sm text-brand-ink-500 mb-8">Start your free assessment in under a minute.</p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex bg-brand-ink-50 p-1 rounded-xl">
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    formData.role === 'student'
                      ? 'bg-white text-brand-ink-900 shadow-sm'
                      : 'text-brand-ink-500 hover:text-brand-ink-700'
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'student' }))}
                >
                  Student
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    formData.role === 'recruiter'
                      ? 'bg-white text-brand-ink-900 shadow-sm'
                      : 'text-brand-ink-500 hover:text-brand-ink-700'
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'recruiter' }))}
                >
                  Company/Recruiter
                </button>
              </div>

              <Input
                id="name"
                type="text"
                label={formData.role === 'recruiter' ? "Recruiter name" : "Full name"}
                icon={User}
                placeholder="Ananya Sharma"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
              
              {formData.role === 'recruiter' && (
                <Input
                  id="companyName"
                  type="text"
                  label="Company Name"
                  icon={Target}
                  placeholder="Acme Corp"
                  required={formData.role === 'recruiter'}
                  value={formData.companyName}
                  onChange={handleChange}
                  disabled={loading}
                />
              )}

              <Input
                id="email"
                type="email"
                label={formData.role === 'recruiter' ? "Work email address" : "Email address"}
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
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />

              <label className="flex items-start gap-2 text-xs text-brand-ink-500">
                <input type="checkbox" required className="mt-0.5 rounded border-brand-ink-300 text-brand-blue-600 focus:ring-brand-blue-400" disabled={loading} />
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
