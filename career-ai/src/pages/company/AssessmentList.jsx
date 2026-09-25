import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import CompanyLayout from '../../components/layout/CompanyLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function AssessmentList() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [assessmentToDelete, setAssessmentToDelete] = useState(null);

  const loadAssessments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('company_assessments')
        .select('*')
        .eq('company_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (profile?.id) {
      queueMicrotask(loadAssessments);
    }
  }, [profile, loadAssessments]);

  const deleteAssessment = async () => {
    const assessment = assessmentToDelete;
    if (!assessment) return;

    setAssessmentToDelete(null);
    setDeletingId(assessment.id);
    try {
      const { error } = await supabase
        .from('company_assessments')
        .delete()
        .eq('id', assessment.id)
        .eq('company_id', profile.id);

      if (error) throw error;
      setAssessments(prev => prev.filter(item => item.id !== assessment.id));
    } catch (error) {
      console.error('Error deleting assessment:', error);
      window.alert('Unable to delete this assessment. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <CompanyLayout title="Assessments" subtitle="Manage all your hiring tests">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-xl text-brand-ink-900">All Assessments</h2>
        <Button variant="primary" icon={Plus} onClick={() => navigate('/company-assessments/create')}>
          Create New
        </Button>
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
                <div className="flex items-center gap-3">
                  <button 
                    className="text-sm font-semibold text-brand-blue-600 hover:text-brand-blue-800"
                    onClick={() => navigate(assessment.status === 'Draft' ? `/company-assessments/${assessment.id}/build` : `/company-candidates`)}
                  >
                    Manage
                  </button>
                  <button
                    type="button"
                    className="text-brand-ink-400 hover:text-red-600 disabled:opacity-50"
                    onClick={() => setAssessmentToDelete(assessment)}
                    disabled={deletingId === assessment.id}
                    aria-label={`Delete ${assessment.title}`}
                    title="Delete assessment"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </Card>
          ))}

          {assessmentToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink-900/40 px-4" role="presentation">
              <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-assessment-title"
              >
                <h3 id="delete-assessment-title" className="text-lg font-bold text-brand-ink-900">
                  Reminder
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-600">
                  Delete &quot;{assessmentToDelete.title}&quot;? This will also remove its questions, candidate records, and results.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="rounded-lg border border-brand-ink-200 px-4 py-2 text-sm font-semibold text-brand-ink-700 hover:bg-brand-ink-50"
                    onClick={() => setAssessmentToDelete(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    onClick={deleteAssessment}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
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
    </CompanyLayout>
  );
}
