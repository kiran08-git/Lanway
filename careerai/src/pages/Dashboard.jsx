import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ArrowRight, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { currentUser, dashboardStats, recentActivity, careerMatches } from '../data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const topMatches = careerMatches.slice(0, 3);

  return (
    <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${currentUser.name.split(' ')[0]}`}>
      {/* Welcome banner */}
      <Card className="p-6 sm:p-8 mb-7 bg-gradient-to-br from-brand-blue-600 to-brand-purple-600 border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-1.5">
              Hi {currentUser.name.split(' ')[0]}, your top match is Full-Stack Developer 🎯
            </h2>
            <p className="text-brand-blue-50 text-sm max-w-lg">
              You're 72% done setting up your profile. Complete it to sharpen your recommendations.
            </p>
          </div>
          <Button variant="secondary" icon={ArrowRight} iconPosition="right" className="!bg-white !border-none shrink-0" onClick={() => navigate('/profile')}>
            Complete profile
          </Button>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top career matches */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-brand-ink-900">Top career matches</h3>
            <button onClick={() => navigate('/careers')} className="text-sm font-semibold text-brand-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {topMatches.map((career) => {
              const Icon = Icons[career.icon] || Icons.Briefcase;
              return (
                <Card
                  key={career.id}
                  hover
                  className="p-5 flex items-center gap-4 cursor-pointer"
                  onClick={() => navigate(`/careers/${career.id}`)}
                >
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                      career.color === 'purple' ? 'bg-brand-purple-50 text-brand-purple-600' : 'bg-brand-blue-50 text-brand-blue-600'
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-brand-ink-900">{career.title}</p>
                      <Badge color={career.color}>{career.matchScore}% match</Badge>
                    </div>
                    <p className="text-sm text-brand-ink-500 mt-0.5">{career.field} · {career.salaryRange}</p>
                  </div>
                  <ArrowRight size={18} className="text-brand-ink-300 shrink-0" />
                </Card>
              );
            })}
          </div>

          <Card hover className="p-6 mt-5 flex items-center gap-4 cursor-pointer" onClick={() => navigate('/assessment')}>
            <div className="h-12 w-12 rounded-xl bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center shrink-0">
              <Sparkles size={22} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-brand-ink-900">Retake your assessment</p>
              <p className="text-sm text-brand-ink-500">Skills change fast — refresh your matches every few months.</p>
            </div>
            <ArrowRight size={18} className="text-brand-ink-300 shrink-0" />
          </Card>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-display font-bold text-brand-ink-900 mb-4">Profile strength</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-brand-ink-500">Completion</span>
              <span className="text-sm font-semibold text-brand-ink-900">{currentUser.profileCompletion}%</span>
            </div>
            <ProgressBar value={currentUser.profileCompletion} color="mixed" />
            <Button variant="secondary" className="w-full mt-5" onClick={() => navigate('/profile')}>
              Update profile
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-bold text-brand-ink-900 mb-4">Recent activity</h3>
            <ul className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = Icons[activity.icon] || Icons.Activity;
                return (
                  <li key={activity.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-brand-ink-50 text-brand-ink-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-brand-ink-800 leading-snug">{activity.text}</p>
                      <p className="text-xs text-brand-ink-400 mt-0.5">{activity.time}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
