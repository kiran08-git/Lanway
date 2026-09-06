import * as Icons from 'lucide-react';
import Card from './Card';

export default function StatCard({ label, value, icon, color = 'blue', trend }) {
  const Icon = Icons[icon] || Icons.Activity;
  const iconBg =
    color === 'purple'
      ? 'bg-brand-purple-50 text-brand-purple-600'
      : color === 'green'
      ? 'bg-emerald-50 text-emerald-600'
      : color === 'orange'
      ? 'bg-amber-50 text-amber-600'
      : 'bg-brand-blue-50 text-brand-blue-600';

  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-display font-bold text-brand-ink-900 leading-none">{value}</p>
        <p className="text-xs text-brand-ink-400 mt-1.5 truncate">{label}</p>
        {trend && <p className="text-xs text-emerald-600 font-medium mt-0.5">{trend}</p>}
      </div>
    </Card>
  );
}
