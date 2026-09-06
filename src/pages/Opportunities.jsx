import { useState } from 'react';
import { MapPin, Wallet, CalendarClock, Bookmark, ExternalLink } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { opportunities } from '../data/mockData';

const TYPES = ['All', 'Internship', 'Scholarship', 'Course', 'Hackathon'];

const TYPE_COLORS = {
  Internship: 'blue',
  Scholarship: 'purple',
  Course: 'green',
  Hackathon: 'amber',
};

export default function Opportunities() {
  const [activeType, setActiveType] = useState('All');
  const [saved, setSaved] = useState(new Set(['o1', 'o2', 'o3', 'o5']));

  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = activeType === 'All' ? opportunities : opportunities.filter((o) => o.type === activeType);

  return (
    <DashboardLayout title="Opportunities" subtitle="Internships, scholarships & courses matched to your path">
      {/* Filters */}
      <div className="flex items-center gap-2 mb-7 overflow-x-auto pb-1">
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeType === type
                ? 'bg-brand-blue-600 text-white shadow-soft'
                : 'bg-white border border-brand-ink-200 text-brand-ink-600 hover:border-brand-blue-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((opp) => (
          <Card key={opp.id} hover className="p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <Badge color={TYPE_COLORS[opp.type]}>{opp.type}</Badge>
              <button
                onClick={() => toggleSave(opp.id)}
                className={`transition-colors ${saved.has(opp.id) ? 'text-brand-purple-600' : 'text-brand-ink-300 hover:text-brand-purple-500'}`}
                aria-label="Save opportunity"
              >
                <Bookmark size={19} fill={saved.has(opp.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <h3 className="font-display font-bold text-brand-ink-900 mb-1">{opp.title}</h3>
            <p className="text-sm text-brand-ink-500 mb-4">{opp.org}</p>

            <div className="space-y-2 mb-5 text-sm text-brand-ink-600">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-brand-ink-400 shrink-0" /> {opp.location}
              </div>
              <div className="flex items-center gap-2">
                <Wallet size={15} className="text-brand-ink-400 shrink-0" /> {opp.stipend}
              </div>
              <div className="flex items-center gap-2">
                <CalendarClock size={15} className="text-brand-ink-400 shrink-0" /> Deadline: {opp.deadline}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {opp.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-brand-ink-100 text-brand-ink-600">
                  {tag}
                </span>
              ))}
            </div>

            <button className="mt-auto flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-blue-600 hover:gap-2.5 transition-all">
              Learn more <ExternalLink size={14} />
            </button>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
