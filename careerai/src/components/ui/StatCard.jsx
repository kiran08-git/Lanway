import * as Icons from 'lucide-react';
import Card from './Card';

export default function StatCard({ label, value, icon, color = 'blue', trend }) {
  const Icon = Icons[icon] || Icons.Activity;
  const bg = color === 'purple' ? 'bg-brand-purple-50 text-brand-purple-600' : 'bg-brand-blue-50 text-brand-blue-600';

  return (
    <Card hover className="p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-display font-bold text-brand-ink-900 leading-none">{value}</p>
        <p className="text-sm text-brand-ink-500 mt-1.5 truncate">{label}</p>
        {trend && <p className="text-xs text-emerald-600 font-medium mt-0.5">{trend}</p>}
      </div>
    </Card>
  );
}
