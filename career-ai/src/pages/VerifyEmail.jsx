import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Mail, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, resendVerificationEmail } = useAuth();
  const [email, setEmail] = useState(user?.email || searchParams.get('email') || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email_confirmed_at) {
      navigate(user.user_metadata?.role === 'recruiter' ? '/company-dashboard' : '/profile', { replace: true });
    }
  }, [user, navigate]);

  const handleResend = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      if (!email.trim()) throw new Error('Enter the email address you used to sign up.');
      const { error: resendError } = await resendVerificationEmail(email.trim());
      if (resendError) throw resendError;
      setMessage('A fresh verification link is on its way. Check your inbox and spam folder.');
    } catch (err) {
      setError(err.message || 'Unable to resend the verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0ea] flex flex-col">
      <div className="container-app py-6">
        <Link to="/" className="inline-flex items-center gap-2.5 font-display font-bold text-[20px] text-brand-ink-900">
          <img src="/logo.png" alt="Lanway Logo" className="h-9 w-auto object-contain shrink-0" />
          Lanway
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 pb-16">
        <Card className="w-full max-w-md p-8 sm:p-10 animate-fade-up">
          <div className="h-14 w-14 rounded-2xl bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center mb-5">
            <Mail size={27} />
          </div>
          <h1 className="text-2xl font-display font-bold text-brand-ink-900 mb-2">Verify your email</h1>
          <p className="text-sm text-brand-ink-600 leading-relaxed mb-7">
            We sent a verification link to your email address. Confirm it to unlock your CareerAI account.
          </p>
          <p className="text-xs text-brand-ink-500 leading-relaxed mb-6">
            Open the link in the email to complete verification. Your account will unlock automatically after Supabase confirms it.
          </p>

          {message && (
            <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-700">{message}</p>
            </div>
          )}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleResend} className="space-y-4">
            <Input id="email" type="email" label="Email address" icon={Mail} value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} required />
            <Button type="submit" variant="secondary" icon={RefreshCw} loading={loading} className="w-full">
              Resend verification email
            </Button>
          </form>

          <p className="text-center text-sm text-brand-ink-500 mt-7">
            Already verified?{' '}
            <Link to="/login" className="text-brand-blue-600 font-semibold hover:underline">Log in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
