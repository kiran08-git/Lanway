import { useParams, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { careerDetails, careerMatches } from '../data/mockData';

export default function CareerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data only covers 'c1' in depth; fall back gracefully for other ids.
  const detail = careerDetails[id] || careerDetails.c1;
  const summary = careerMatches.find((c) => c.id === id) || careerMatches[0];
  const Icon = Icons[detail.icon] || Icons.Briefcase;

  return (
    <DashboardLayout title="Career Details" subtitle={detail.title}>
      <button
        onClick={() => navigate('/careers')}
        className="flex items-center gap-1.5 text-sm font-medium text-brand-ink-500 hover:text-brand-blue-600 mb-6"
      >
        <ArrowLeft size={16} /> Back to recommendations
      </button>

      {/* Header */}
      <Card className="p-6 sm:p-8 mb-7">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 ${
                detail.color === 'purple' ? 'bg-brand-purple-50 text-brand-purple-600' : 'bg-brand-blue-50 text-brand-blue-600'
              }`}
            >
              <Icon size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-brand-ink-900">{detail.title}</h2>
              <p className="text-sm text-brand-ink-500 mt-1">{detail.field} · {summary.salaryRange}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-display font-extrabold gradient-text">{detail.matchScore}%</p>
              <p className="text-xs text-brand-ink-500">match score</p>
            </div>
            <Button variant="primary" icon={ArrowRight} iconPosition="right" onClick={() => navigate(`/roadmap/${detail.id}`)}>
              View roadmap
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8">
            <h3 className="font-display font-bold text-brand-ink-900 mb-3">Overview</h3>
            <p className="text-sm text-brand-ink-600 leading-relaxed">{detail.overview}</p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h3 className="font-display font-bold text-brand-ink-900 mb-4">A day in this role</h3>
            <p className="text-sm text-brand-ink-600 leading-relaxed mb-5">{detail.dayInLife}</p>
            <ul className="space-y-3">
              {detail.dailyLife.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-brand-ink-700">
                  <CheckCircle2 size={17} className="text-brand-blue-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 sm:p-8">
            <h3 className="font-display font-bold text-brand-ink-900 mb-5">Required skills</h3>
            <div className="space-y-4">
              {detail.requiredSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="text-brand-ink-700 font-medium">{skill.name}</span>
                    <span className="text-brand-ink-500">{skill.level}%</span>
                  </div>
                  <ProgressBar value={skill.level} color="mixed" />
                </div>
              ))}
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="p-6 sm:p-8">
              <h3 className="font-display font-bold text-emerald-700 mb-4 flex items-center gap-2">
                <CheckCircle2 size={19} /> Pros
              </h3>
              <ul className="space-y-2.5">
                {detail.pros.map((p) => (
                  <li key={p} className="text-sm text-brand-ink-600 flex gap-2">
                    <span className="text-emerald-500">+</span> {p}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6 sm:p-8">
              <h3 className="font-display font-bold text-amber-700 mb-4 flex items-center gap-2">
                <XCircle size={19} /> Things to consider
              </h3>
              <ul className="space-y-2.5">
                {detail.cons.map((c) => (
                  <li key={c} className="text-sm text-brand-ink-600 flex gap-2">
                    <span className="text-amber-500">−</span> {c}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-display font-bold text-brand-ink-900 mb-4">Salary progression</h3>
            <div className="space-y-3">
              {detail.salaryProgression.map((s) => (
                <div key={s.level} className="flex items-center justify-between text-sm py-2 border-b border-brand-ink-100 last:border-0">
                  <span className="text-brand-ink-600">{s.level}</span>
                  <span className="font-semibold text-brand-ink-900">{s.range}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-bold text-brand-ink-900 mb-4 flex items-center gap-2">
              <Clock size={17} /> Path to get here
            </h3>
            <ul className="space-y-3">
              {detail.education.map((e) => (
                <li key={e} className="text-sm text-brand-ink-600 flex gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-purple-500 mt-1.5 shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-brand-blue-600 to-brand-purple-600 border-none text-center">
            <p className="text-white font-display font-bold mb-2">Ready to start?</p>
            <p className="text-brand-blue-50 text-sm mb-5">See your month-by-month plan to become job-ready.</p>
            <Button variant="secondary" className="!bg-white !border-none w-full" onClick={() => navigate(`/roadmap/${detail.id}`)}>
              View learning roadmap
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
