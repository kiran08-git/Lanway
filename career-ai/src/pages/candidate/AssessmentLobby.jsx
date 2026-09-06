import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Camera, Mic, Monitor, Upload, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function AssessmentLobby() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [candidateRecord, setCandidateRecord] = useState(null);
  const [consent, setConsent] = useState(false);
  const [checks, setChecks] = useState({
    camera: 'pending',
    mic: 'pending',
    fullscreen: 'pending'
  });

  useEffect(() => {
    loadAssessment();
  }, [id]);

  const loadAssessment = async () => {
    setLoading(true);
    try {
      // Load assessment details
      const { data: assm, error: assmError } = await supabase
        .from('company_assessments')
        .select(`
          *,
          company_profiles (company_name)
        `)
        .eq('id', id)
        .single();
        
      if (assmError) throw assmError;
      setAssessment(assm);

      // Check if candidate record exists
      if (profile?.id) {
        const { data: cand, error: candError } = await supabase
          .from('assessment_candidates')
          .select('*')
          .eq('assessment_id', id)
          .eq('candidate_id', profile.id)
          .maybeSingle();

        if (candError) throw candError;
        setCandidateRecord(cand);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runSystemChecks = async () => {
    setChecks({ camera: 'loading', mic: 'loading', fullscreen: 'pending' });
    
    try {
      // Request Camera & Mic
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (stream) {
        setChecks(prev => ({ ...prev, camera: 'success', mic: 'success' }));
        // Stop stream so it's not active in lobby
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.warn('System check failed:', err);
      setChecks(prev => ({ ...prev, camera: 'error', mic: 'error' }));
    }

    if (document.fullscreenEnabled) {
      setChecks(prev => ({ ...prev, fullscreen: 'success' }));
    } else {
      setChecks(prev => ({ ...prev, fullscreen: 'error' }));
    }
  };

  const handleStartTest = async () => {
    if (!consent) return;

    try {
      setLoading(true);
      let candId = candidateRecord?.id;

      // If no candidate record exists, create one
      if (!candId) {
        const { data, error } = await supabase
          .from('assessment_candidates')
          .insert({
            assessment_id: id,
            candidate_id: profile.id,
            status: 'InProgress',
            started_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        candId = data.id;
      } else {
        // Update to InProgress
        const { error } = await supabase
          .from('assessment_candidates')
          .update({ status: 'InProgress', started_at: new Date().toISOString() })
          .eq('id', candId);
        if (error) throw error;
      }

      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

      // Navigate to secure test mode
      navigate(`/test/${id}/session/${candId}`);
    } catch (err) {
      console.error('Failed to start test', err);
      alert('Failed to start test. Please try again.');
      setLoading(false);
    }
  };

  if (loading && !assessment) {
    return <DashboardLayout><div className="p-8 text-center">Loading Assessment...</div></DashboardLayout>;
  }

  if (!assessment) {
    return <DashboardLayout><div className="p-8 text-center text-red-500">Assessment not found.</div></DashboardLayout>;
  }

  const allPassed = checks.camera === 'success' && checks.mic === 'success' && checks.fullscreen === 'success';

  return (
    <DashboardLayout title="Assessment Lobby" subtitle="Prepare for your secure test">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 mb-6 bg-gradient-to-br from-brand-ink-900 to-brand-ink-800 text-white border-none">
          <Badge className="bg-white/20 text-white border-none mb-4">{assessment.company_profiles?.company_name}</Badge>
          <h1 className="text-3xl font-display font-bold mb-2">{assessment.title}</h1>
          <p className="text-brand-ink-200 mb-6">{assessment.role} • {assessment.duration_minutes} minutes</p>
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 text-sm leading-relaxed">
            {assessment.description || "No description provided."}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="font-display font-bold text-lg text-brand-ink-900 mb-4 flex items-center gap-2">
              <Shield className="text-brand-blue-600" size={20} />
              Proctoring Consent
            </h3>
            <p className="text-sm text-brand-ink-600 mb-4 leading-relaxed">
              This is a secure, AI-proctored assessment. To ensure academic integrity, the following activities will be monitored:
            </p>
            <ul className="space-y-3 mb-6 text-sm text-brand-ink-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Camera Monitoring:</strong> Verifies your presence.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Audio Monitoring:</strong> Detects suspicious background noise.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Screen & Browser:</strong> Tab switching, fullscreen exits, and copy-paste are restricted and recorded.</span>
              </li>
            </ul>

            <label className="flex items-start gap-3 p-4 bg-brand-ink-50 rounded-xl border border-brand-ink-100 cursor-pointer hover:bg-brand-blue-50 transition-colors">
              <input 
                type="checkbox" 
                className="mt-1"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span className="text-sm font-semibold text-brand-ink-900 leading-tight">
                I understand and consent to audio, video, and screen monitoring for the duration of this assessment.
              </span>
            </label>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-lg text-brand-ink-900">System Check</h3>
              <Button size="sm" variant="secondary" onClick={runSystemChecks}>Run Checks</Button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 rounded-lg border border-brand-ink-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${checks.camera === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-ink-50 text-brand-ink-500'}`}>
                    <Camera size={18} />
                  </div>
                  <span className="text-sm font-semibold text-brand-ink-900">Webcam</span>
                </div>
                {checks.camera === 'success' && <CheckCircle2 className="text-emerald-500" size={18} />}
                {checks.camera === 'error' && <AlertCircle className="text-red-500" size={18} />}
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg border border-brand-ink-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${checks.mic === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-ink-50 text-brand-ink-500'}`}>
                    <Mic size={18} />
                  </div>
                  <span className="text-sm font-semibold text-brand-ink-900">Microphone</span>
                </div>
                {checks.mic === 'success' && <CheckCircle2 className="text-emerald-500" size={18} />}
                {checks.mic === 'error' && <AlertCircle className="text-red-500" size={18} />}
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg border border-brand-ink-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${checks.fullscreen === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-ink-50 text-brand-ink-500'}`}>
                    <Monitor size={18} />
                  </div>
                  <span className="text-sm font-semibold text-brand-ink-900">Fullscreen Support</span>
                </div>
                {checks.fullscreen === 'success' && <CheckCircle2 className="text-emerald-500" size={18} />}
                {checks.fullscreen === 'error' && <AlertCircle className="text-red-500" size={18} />}
              </div>
            </div>

            <Button 
              variant="primary" 
              className="w-full justify-center" 
              icon={ArrowRight} 
              iconPosition="right"
              disabled={!consent || !allPassed || loading}
              onClick={handleStartTest}
            >
              Start Secure Assessment
            </Button>
            
            {!allPassed && (
              <p className="text-xs text-center text-brand-ink-500 mt-3">
                You must complete the system checks and grant consent to proceed.
              </p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
