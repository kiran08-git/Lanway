import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For students', href: '#students' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-ink-100">
      <div className="container-app flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-brand-ink-900">
          <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-blue-600 to-brand-purple-600 flex items-center justify-center text-white shadow-soft">
            <Compass size={19} />
          </span>
          Career<span className="gradient-text">AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-brand-ink-600 hover:text-brand-blue-700 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Log in
          </Button>
          <Button variant="primary" onClick={() => navigate('/register')}>
            Get started
          </Button>
        </div>

        <button className="md:hidden text-brand-ink-700" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-brand-ink-100 bg-white animate-fade-in">
          <div className="container-app py-4 flex flex-col gap-4">
            {LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-brand-ink-600" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="secondary" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button variant="primary" onClick={() => navigate('/register')}>
                Get started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
