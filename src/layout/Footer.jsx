import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-brand-ink-100 bg-brand-ink-50/50">
      <div className="container-app py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-display font-bold text-brand-ink-900">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-blue-600 to-brand-purple-600 flex items-center justify-center text-white">
            <Compass size={16} />
          </span>
          CareerAI
        </div>
        <p className="text-sm text-brand-ink-500 text-center">
          Built for students in Tier-2 &amp; Tier-3 towns to discover the right career path — no jargon, no gatekeeping.
        </p>
        <p className="text-xs text-brand-ink-400">© 2026 CareerAI · Hackathon Prototype</p>
      </div>
    </footer>
  );
}
