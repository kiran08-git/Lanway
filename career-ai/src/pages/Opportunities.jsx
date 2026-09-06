import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Briefcase, ChevronRight, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const DIFF_COLORS = {
  Easy: 'emerald',
  Medium: 'amber',
  Hard: 'red',
};

export default function Opportunities() {
  const navigate = useNavigate();
  const [activeDiff, setActiveDiff] = useState('All');
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('company_assessments')
        .select(`
          *,
          company_profiles (company_name)
        `)
        .eq('status', 'Active')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAssessments(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load opportunities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeDiff === 'All' 
    ? assessments 
    : assessments.filter((a) => a.difficulty_level === activeDiff);

  return (
    <DashboardLayout title="Opportunities" subtitle="Live assessments from top companies">
      {/* Filters */}
      <div className="flex items-center gap-2 mb-7 overflow-x-auto pb-1">
        <span className="text-sm font-semibold text-brand-ink-500 mr-2">Difficulty:</span>
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff}
            onClick={() => setActiveDiff(diff)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeDiff === diff
                ? 'bg-brand-blue-600 text-white shadow-soft'
                : 'bg-white border border-brand-ink-200 text-brand-ink-600 hover:border-brand-blue-300'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-brand-ink-500">Loading opportunities...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center">
          <AlertCircle className="mb-2" size={24} />
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 bg-brand-ink-50/50">
          <h3 className="text-brand-ink-900 font-bold mb-2">No active assessments found</h3>
          <p className="text-sm text-brand-ink-500">Check back later or try a different filter.</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((assessment) => (
            <Card key={assessment.id} hover className="p-6 flex flex-col border-brand-ink-200">
              <div className="flex items-start justify-between mb-4">
                <Badge className="bg-brand-blue-50 text-brand-blue-700 border-brand-blue-100">
                  {assessment.company_profiles?.company_name || 'Unknown Company'}
                </Badge>
                <Badge color={DIFF_COLORS[assessment.difficulty_level] || 'blue'}>
                  {assessment.difficulty_level}
                </Badge>
              </div>

              <h3 className="font-display font-bold text-lg text-brand-ink-900 mb-1 line-clamp-2">
                {assessment.title}
              </h3>
              
              <div className="space-y-2 mb-5 mt-4 text-sm text-brand-ink-600">
                <div className="flex items-center gap-2">
                  <Briefcase size={15} className="text-brand-ink-400 shrink-0" /> {assessment.role}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-brand-ink-400 shrink-0" /> {assessment.duration_minutes} Minutes
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                {(assessment.required_skills || []).slice(0, 3).map((skill) => (
                  <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-brand-ink-100 text-brand-ink-600">
                    {skill}
                  </span>
                ))}
                {(assessment.required_skills?.length > 3) && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-brand-ink-50 text-brand-ink-400">
                    +{assessment.required_skills.length - 3} more
                  </span>
                )}
              </div>

              <Button 
                variant="primary" 
                className="w-full justify-center" 
                icon={ChevronRight} 
                iconPosition="right"
                onClick={() => navigate(`/test-lobby/${assessment.id}`)}
              >
                Take Assessment
              </Button>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
