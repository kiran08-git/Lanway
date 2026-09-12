export default function Footer() {
  return (
    <footer className="border-t border-brand-ink-200 bg-white">
      <div className="container-app py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2.5 font-display font-bold text-brand-ink-900">
          <img src="/logo.png" alt="Lanway logo" className="h-10 w-10 rounded-lg object-cover" />
          Lanway
        </div>
        <p className="text-xs text-brand-ink-400 whitespace-nowrap">© 2026 Lanway · All rights reserved</p>
      </div>
    </footer>
  );
}
