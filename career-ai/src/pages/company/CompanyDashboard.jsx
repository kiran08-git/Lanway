import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Users, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import CompanyLayout from '../../components/layout/CompanyLayout';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({
    activeAssessments: 0,
    totalCandidates: 0,
    completedTests: 0,
    shortlisted: 0
  });

  useEffect(() => {
    if (profile?.id) {
      loadDashboardData();
    }
  }, [profile]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch assessments
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from('company_assessments')
        .select('*')
        .eq('company_id', profile.id)
        .order('created_at', { ascending: false });

      if (assessmentsError) throw assessmentsError;
      
      // Keep only top 5 for the recent assessments list
      setAssessments((assessmentsData || []).slice(0, 5));

      const activeCount = (assessmentsData || []).filter(a => a.status === 'Active').length;
      const assessmentIds = (assessmentsData || []).map(a => a.id);
      
      let totalCandidates = 0;
      let completedTests = 0;
      let shortlistedCount = 0;

      if (assessmentIds.length > 0) {
        const { data: cands, error: candError } = await supabase
          .from('assessment_candidates')
          .select('status')
          .in('assessment_id', assessmentIds);

        if (!candError && cands) {
          totalCandidates = cands.length;
          completedTests = cands.filter(c => c.status === 'Completed' || c.status === 'Shortlisted' || c.status === 'Rejected').length;
          shortlistedCount = cands.filter(c => c.status === 'Shortlisted').length;
        }
      }
      
      setStats({
        activeAssessments: activeCount,
        totalCandidates: totalCandidates,
        completedTests: completedTests,
        shortlisted: shortlistedCount
      });
    } catch (error) {
      console.error('Error loading company dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CompanyLayout title="Company Dashboard" subtitle="Manage your hiring assessments">
      {/* Action Banner */}
      <Card className="p-6 sm:p-8 mb-8 border border-brand-ink-100 shadow-xs bg-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-display font-bold mb-2 text-brand-ink-900">Hire the Best Talent With Lanway</h2>
          <p className="text-brand-ink-500 max-w-xl text-sm leading-relaxed">
            Create Assessments, evaluate candidates objectively, and find the perfect match for your roles with Recommendation Engine.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={Plus} 
          className="shrink-0 shadow-sm"
          onClick={() => navigate('/company-assessments/create')}
        >
          Create Assessment
        </Button>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Active Assessments"
          value={stats.activeAssessments.toString()}
          icon="ClipboardList"
          color="blue"
        />
        <StatCard
          label="Candidates Invited"
          value={stats.totalCandidates.toString()}
          icon="Users"
          color="purple"
        />
        <StatCard
          label="Tests Completed"
          value={stats.completedTests.toString()}
          icon="CheckCircle"
          color="green"
        />
        <StatCard
          label="Candidates Shortlisted"
          value={stats.shortlisted.toString()}
          icon="Award"
          color="orange"
        />
      </div>

      {/* Recent Assessments */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-brand-ink-900">Recent Assessments</h3>
          <button 
            onClick={() => navigate('/company-assessments')}
            className="text-sm font-semibold text-brand-blue-600 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-brand-ink-500">Loading assessments...</div>
        ) : assessments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assessments.map(assessment => (
              <Card key={assessment.id} className="p-5 flex flex-col justify-between border-brand-ink-200">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <Badge color={assessment.status === 'Active' ? 'green' : assessment.status === 'Draft' ? 'mixed' : 'purple'}>
                      {assessment.status}
                    </Badge>
                    <span className="text-xs text-brand-ink-400 flex items-center gap-1">
                      <Clock size={12} /> {assessment.duration_minutes} min
                    </span>
                  </div>
                  <h4 className="font-bold text-brand-ink-900 mb-1">{assessment.title}</h4>
                  <p className="text-sm text-brand-ink-500 mb-4">{assessment.role}</p>
                  
                  {assessment.status === 'Active' && (
                    <button 
                      onClick={() => {
                        const url = `${window.location.origin}/test-lobby/${assessment.id}`;
                        navigator.clipboard.writeText(url);
                        alert('Invite link copied to clipboard!');
                      }}
                      className="text-xs flex items-center gap-1 text-brand-blue-600 hover:text-brand-blue-800 bg-brand-blue-50 px-2 py-1 rounded-md w-fit mb-3"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      Copy Invite Link
                    </button>
                  )}
                </div>
                
                <div className="pt-4 border-t border-brand-ink-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-brand-ink-600">
                    {assessment.status === 'Active' ? 'Accepting candidates' : 'Setup pending'}
                  </span>
                  <button 
                    className="text-sm font-semibold text-brand-blue-600 hover:text-brand-blue-800"
                    onClick={() => navigate(assessment.status === 'Draft' ? `/company-assessments/${assessment.id}/build` : `/company-candidates`)}
                  >
                    Manage
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center border-dashed border-2 border-brand-ink-200 bg-brand-ink-50/50">
            <ClipboardList className="mx-auto h-12 w-12 text-brand-ink-300 mb-3" />
            <h4 className="text-brand-ink-900 font-bold mb-1">No assessments yet</h4>
            <p className="text-sm text-brand-ink-500 mb-4">Create your first assessment to start hiring.</p>
            <Button variant="secondary" icon={Plus} onClick={() => navigate('/company-assessments/create')}>
              Create Assessment
            </Button>
          </Card>
        )}
      </div>
    </CompanyLayout>
  );
}
