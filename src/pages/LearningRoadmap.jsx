import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Lock, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { roadmapData } from '../data/mockData';

const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', badge: 'green', label: 'Completed' },
  'in-progress': { icon: Circle, color: 'text-brand-blue-600 bg-brand-blue-50', badge: 'blue', label: 'In progress' },
  locked: { icon: Lock, color: 'text-brand-ink-400 bg-brand-ink-100', badge: 'slate', label: 'Locked' },
};

export default function LearningRoadmap() {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const roadmap = roadmapData[careerId] || roadmapData.c1;

  const completedCount = roadmap.stages.filter((s) => s.status === 'completed').length;

  return (
    <DashboardLayout title="Learning Roadmap" subtitle={roadmap.title}>
      <button
        onClick={() => navigate(`/careers/${careerId}`)}
        className="flex items-center gap-1.5 text-sm font-medium text-brand-ink-500 hover:text-brand-blue-600 mb-6"
      >
        <ArrowLeft size={16} /> Back to career details
      </button>

      <Card className="p-6 sm:p-8 mb-8 bg-gradient-to-br from-brand-blue-600 to-brand-purple-600 border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-1.5">{roadmap.title}</h2>
            <p className="text-brand-blue-50 text-sm">
              Total duration: {roadmap.totalDuration} · {completedCount}/{roadmap.stages.length} stages complete
            </p>
          </div>
          <Button variant="secondary" icon={ArrowRight} iconPosition="right" className="!bg-white !border-none shrink-0" onClick={() => navigate('/opportunities')}>
            Explore opportunities
          </Button>
        </div>
      </Card>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-brand-ink-100 hidden sm:block" />
        <div className="space-y-6">
          {roadmap.stages.map((stage, i) => {
            const config = STATUS_CONFIG[stage.status];
            const StatusIcon = config.icon;
            return (
              <div key={stage.id} className="relative flex flex-col sm:flex-row gap-5">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white ${config.color}`}>
                  <StatusIcon size={20} />
                </div>
                <Card hover className="p-6 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-brand-purple-500 uppercase tracking-wide mb-1">Stage {i + 1} · {stage.duration}</p>
                      <h3 className="font-display font-bold text-lg text-brand-ink-900">{stage.phase}</h3>
                    </div>
                    <Badge color={config.badge}>{config.label}</Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-semibold text-brand-ink-500 uppercase tracking-wide mb-2">Topics covered</p>
                      <ul className="space-y-1.5">
                        {stage.topics.map((topic) => (
                          <li key={topic} className="text-sm text-brand-ink-700 flex gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-500 mt-1.5 shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-ink-500 uppercase tracking-wide mb-2">Resources</p>
                      <ul className="space-y-1.5">
                        {stage.resources.map((r) => (
                          <li key={r} className="text-sm text-brand-ink-600 flex gap-2 items-start">
                            <BookOpen size={14} className="text-brand-purple-500 shrink-0 mt-0.5" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
