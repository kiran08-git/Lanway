const COLOR_MAP = {
  blue: 'bg-brand-blue-50 text-brand-blue-700',
  purple: 'bg-brand-purple-50 text-brand-purple-700',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  slate: 'bg-brand-ink-100 text-brand-ink-600',
};

export default function Badge({ children, color = 'blue', icon: Icon, className = '' }) {
  return (
    <span className={`badge ${COLOR_MAP[color] || COLOR_MAP.blue} ${className}`}>
      {Icon && <Icon size={13} />}
      {children}
    </span>
  );
}
