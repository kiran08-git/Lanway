import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileText, ShieldAlert, CheckCircle, XCircle, Award, BrainCircuit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CompanyLayout from '../../components/layout/CompanyLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState(null);
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    loadCandidateDetails();
  }, [id]);

  const loadCandidateDetails = async () => {
    setLoading(true);
    try {
      const { data: cand, error } = await supabase
        .from('assessment_candidates')
        .select(`
          *,
          student_profiles (name, email, college, degree, branch, year, skills),
          company_assessments (title, role, required_skills)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setCandidate(cand);

      // Load proctoring events
      const { data: evts, error: evtsError } = await supabase
        .from('proctoring_events')
        .select('*')
        .eq('assessment_candidate_id', id)
        .order('timestamp', { ascending: true });

      if (evtsError) throw evtsError;
      setEvents(evts || []);

    } catch (err) {
      console.error('Error loading candidate details:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      const { error } = await supabase
        .from('assessment_candidates')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      setCandidate(prev => ({ ...prev, status }));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <CompanyLayout title="Candidate Details">
        <div className="p-8 text-center text-brand-ink-500">Loading details...</div>
      </CompanyLayout>
    );
  }

  if (!candidate) {
    return (
      <CompanyLayout title="Candidate Not Found">
        <div className="p-8 text-center text-brand-ink-500">Candidate not found or you don't have permission to view.</div>
      </CompanyLayout>
    );
  }

  const profile = candidate.student_profiles;
  const assessment = candidate.company_assessments;
  const scores = candidate.score_details || { technical: 0, aptitude: 0, coding: 0 };

  return (
    <CompanyLayout title="Candidate Review" subtitle={`Reviewing application for ${assessment?.title}`}>
      <div className="max-w-5xl mx-auto mb-8">
        <button 
          onClick={() => navigate('/company-candidates')}
          className="flex items-center gap-2 text-sm text-brand-ink-500 hover:text-brand-ink-800 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Candidates
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 text-center">
              <div className="h-20 w-20 mx-auto rounded-full bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center font-bold text-2xl mb-4">
                {profile?.name?.charAt(0) || <User size={32} />}
              </div>
              <h2 className="text-xl font-bold text-brand-ink-900 mb-1">{profile?.name}</h2>
              <p className="text-sm text-brand-ink-500 mb-4">{profile?.email}</p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge color={candidate.status === 'Shortlisted' ? 'green' : candidate.status === 'Rejected' ? 'red' : 'blue'}>
                  {candidate.status}
                </Badge>
                <Badge color={candidate.risk_level === 'High' ? 'red' : candidate.risk_level === 'Medium' ? 'orange' : 'green'}>
                  Risk: {candidate.risk_level}
                </Badge>
              </div>

              <div className="space-y-3 pt-4 border-t border-brand-ink-100 text-left text-sm">
                <div>
                  <span className="text-brand-ink-500 block text-xs">Education</span>
                  <span className="font-semibold text-brand-ink-900">{profile?.degree} in {profile?.branch}</span>
                  <span className="block text-brand-ink-700">{profile?.college}</span>
                </div>
                <div>
                  <span className="text-brand-ink-500 block text-xs">Skills</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(profile?.skills || []).map((s, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-brand-ink-50 text-[10px] font-medium text-brand-ink-700 rounded border border-brand-ink-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-brand-ink-900 mb-4 flex items-center gap-2">
                <BrainCircuit size={18} className="text-brand-purple-600" />
                AI Recommendation
              </h3>
              <div className="p-4 bg-brand-purple-50 border border-brand-purple-100 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-brand-purple-900">Match Score</span>
                  <span className="text-lg font-bold text-brand-purple-700">{candidate.resume_match_score || 0}%</span>
                </div>
                <p className="text-xs text-brand-purple-800">
                  Candidate has a strong foundation in required skills and performed exceptionally well in the technical assessment. Low proctoring risk indicates high integrity.
                </p>
              </div>
            </Card>
            
            <div className="flex flex-col gap-3">
              <Button 
                variant="primary" 
                icon={CheckCircle} 
                className="w-full justify-center !bg-emerald-600 hover:!bg-emerald-700 !border-emerald-600"
                onClick={() => updateStatus('Shortlisted')}
                disabled={candidate.status === 'Shortlisted'}
              >
                Shortlist Candidate
              </Button>
              <Button 
                variant="secondary" 
                icon={XCircle} 
                className="w-full justify-center text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                onClick={() => updateStatus('Rejected')}
                disabled={candidate.status === 'Rejected'}
              >
                Reject Candidate
              </Button>
            </div>
          </div>

          {/* Right Column - Results & Proctoring */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-display font-bold text-brand-ink-900 mb-6 flex items-center gap-2">
                <Award size={20} className="text-brand-blue-600" />
                Assessment Results
              </h3>
              
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl border border-brand-ink-100 bg-brand-ink-50 text-center">
                  <p className="text-xs font-semibold text-brand-ink-500 uppercase tracking-wider mb-1">Overall Score</p>
                  <p className="text-3xl font-display font-bold text-brand-blue-600">{candidate.overall_score || 0}%</p>
                </div>
                <div className="p-4 rounded-xl border border-brand-ink-100 text-center">
                  <p className="text-xs font-semibold text-brand-ink-500 uppercase tracking-wider mb-1">Technical</p>
                  <p className="text-2xl font-bold text-brand-ink-900">{scores.technical || 0}%</p>
                </div>
                <div className="p-4 rounded-xl border border-brand-ink-100 text-center">
                  <p className="text-xs font-semibold text-brand-ink-500 uppercase tracking-wider mb-1">Aptitude</p>
                  <p className="text-2xl font-bold text-brand-ink-900">{scores.aptitude || 0}%</p>
                </div>
              </div>

              {candidate.resume_url && (
                <div className="pt-6 border-t border-brand-ink-100">
                  <h4 className="font-bold text-brand-ink-900 mb-3 text-sm">Resume</h4>
                  <a 
                    href={candidate.resume_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue-600 bg-brand-blue-50 px-4 py-2 rounded-lg hover:bg-brand-blue-100 transition-colors"
                  >
                    <FileText size={16} /> View Candidate Resume
                  </a>
                </div>
              )}
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-brand-ink-900 flex items-center gap-2">
                  <ShieldAlert size={20} className={candidate.risk_level === 'High' ? 'text-red-500' : 'text-orange-500'} />
                  Proctoring Timeline
                </h3>
                <Badge color={candidate.risk_level === 'High' ? 'red' : candidate.risk_level === 'Medium' ? 'orange' : 'green'}>
                  {candidate.risk_level} Risk Detected
                </Badge>
              </div>

              {events.length > 0 ? (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-ink-200 before:to-transparent">
                  {events.map((evt, idx) => {
                    const time = new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    const isWarning = evt.event_type !== 'Info';
                    return (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-5 h-5 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${isWarning ? 'bg-orange-500' : 'bg-brand-blue-500'}`}></div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-brand-ink-100 bg-white shadow-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold ${isWarning ? 'text-orange-600' : 'text-brand-blue-600'}`}>{evt.event_type}</span>
                            <span className="text-[10px] font-semibold text-brand-ink-400">{time}</span>
                          </div>
                          <p className="text-xs text-brand-ink-600">{evt.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center border rounded-xl border-brand-ink-100 bg-brand-ink-50">
                  <CheckCircle className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                  <p className="text-sm font-bold text-brand-ink-900">No Suspicious Activity Detected</p>
                  <p className="text-xs text-brand-ink-500">Candidate completed the test without any flags.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
