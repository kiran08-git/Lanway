import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ArrowRight, SlidersHorizontal, TrendingUp } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { careerMatches } from '../data/mockData';

const FIELDS = ['All', 'Technology', 'Design', 'Business', 'Government'];

export default function CareerRecommendations() {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState('All');

  const filtered =
    activeField === 'All' ? careerMatches : careerMatches.filter((c) => c.field === activeField);

  return (
    <DashboardLayout title="Career Recommendations" subtitle="Matched to your assessment results">
      <Card className="p-6 mb-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-br from-brand-blue-50 to-brand-purple-50 border-none">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white text-brand-blue-600 flex items-center justify-center shadow-sm shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="font-semibold text-brand-ink-900">6 careers matched to your profile</p>
            <p className="text-sm text-brand-ink-600">Based on your skill, aptitude & interest assessment</p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <SlidersHorizontal size={16} className="text-brand-ink-400 shrink-0" />
        {FIELDS.map((field) => (
          <button
            key={field}
            onClick={() => setActiveField(field)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeField === field
                ? 'bg-brand-blue-600 text-white shadow-soft'
                : 'bg-white border border-brand-ink-200 text-brand-ink-600 hover:border-brand-blue-300'
            }`}
          >
            {field}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((career) => {
          const Icon = Icons[career.icon] || Icons.Briefcase;
          return (
            <Card
              key={career.id}
              hover
              className="p-6 cursor-pointer flex flex-col"
              onClick={() => navigate(`/careers/${career.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    career.color === 'purple' ? 'bg-brand-purple-50 text-brand-purple-600' : 'bg-brand-blue-50 text-brand-blue-600'
                  }`}
                >
                  <Icon size={22} />
                </div>
                <Badge color={career.color}>{career.matchScore}% match</Badge>
              </div>

              <h3 className="font-display font-bold text-brand-ink-900 mb-1.5">{career.title}</h3>
              <p className="text-sm text-brand-ink-600 leading-relaxed mb-4 flex-1">{career.description}</p>

              <div className="mb-4">
                <ProgressBar value={career.matchScore} color={career.color === 'purple' ? 'purple' : 'blue'} height="h-1.5" />
              </div>

              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-brand-ink-500">{career.salaryRange}</span>
                <Badge color="slate">{career.growth}</Badge>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {career.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-brand-ink-100 text-brand-ink-600">
                    {tag}
                  </span>
                ))}
              </div>

              <button className="mt-auto flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-blue-600 hover:gap-2.5 transition-all">
                View details <ArrowRight size={15} />
              </button>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
