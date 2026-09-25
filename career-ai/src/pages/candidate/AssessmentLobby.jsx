import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Shield,
  Camera,
  Mic,
  Monitor,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Building,
  Globe,
  MapPin,
  ExternalLink,
  Code2,
  HeartHandshake,
  Users,
  Info,
  X,
  Clock,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function AssessmentLobby() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [candidateRecord, setCandidateRecord] = useState(null);
  const [consent, setConsent] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [checks, setChecks] = useState({
    camera: 'pending',
    mic: 'pending',
    fullscreen: 'pending',
  });

  useEffect(() => {
    loadAssessment();
  }, [id, profile?.id]);

  const loadAssessment = async () => {
    setLoading(true);
    try {
      // 1. Load assessment details
      const { data: assm, error: assmError } = await supabase
        .from('company_assessments')
        .select(`
          *,
          company_profiles (*)
        `)
        .eq('id', id)
        .single();

      if (assmError) throw assmError;
      setAssessment(assm);

      // 2. Resolve complete company profile
      let resolvedCompany = assm.company_profiles || {};

      // Check if local public storage has extended company profile details
      if (assm.company_id) {
        try {
          const publicData = localStorage.getItem(`lanway_public_company_${assm.company_id}`);
          if (publicData) {
            resolvedCompany = { ...resolvedCompany, ...JSON.parse(publicData) };
          }
        } catch (e) {
          console.warn('Could not read public company data:', e);
        }
      }

      // Check fallback company data if fields missing
      try {
        const defaultCompanyData = localStorage.getItem('lanway_company_profile_default');
        if (defaultCompanyData && !resolvedCompany.about) {
          resolvedCompany = { ...JSON.parse(defaultCompanyData), ...resolvedCompany };
        }
      } catch (e) {
        console.warn('Could not read default company data:', e);
      }

      // Ensure defaults for rich presentation
      if (!resolvedCompany.company_name) {
        resolvedCompany.company_name = assm.company_profiles?.company_name || 'Hiring Partner';
      }
      if (!resolvedCompany.industry) resolvedCompany.industry = 'Software & Technology';
      if (!resolvedCompany.tagline) resolvedCompany.tagline = 'Innovating next-generation software products';
      if (!resolvedCompany.about) {
        resolvedCompany.about = `${resolvedCompany.company_name} is evaluating candidates for open engineering positions. Complete this assessment to showcase your skills directly to hiring managers.`;
      }
      if (!resolvedCompany.tech_stack || !resolvedCompany.tech_stack.length) {
        resolvedCompany.tech_stack = ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'Cloud'];
      }
      if (!resolvedCompany.perks || !resolvedCompany.perks.length) {
        resolvedCompany.perks = ['Mentorship & Growth', 'Competitive Stipend / Compensation', 'Hybrid & Remote Options'];
      }

      setCompanyProfile(resolvedCompany);

      // 3. Check if candidate record exists
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
        setChecks((prev) => ({ ...prev, camera: 'success', mic: 'success' }));
        // Stop stream so it's not active in lobby
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.warn('System check failed:', err);
      setChecks((prev) => ({ ...prev, camera: 'error', mic: 'error' }));
    }

    if (document.fullscreenEnabled) {
      setChecks((prev) => ({ ...prev, fullscreen: 'success' }));
    } else {
      setChecks((prev) => ({ ...prev, fullscreen: 'error' }));
    }
  };

  const handleStartTest = async () => {
    if (!consent) return;

    try {
      setLoading(true);
      const effectiveCandidateId = profile?.id || user?.id || 'demo-candidate';
      let candId = candidateRecord?.id;

      // Extract candidate profile details for snapshot
      let profileExtra = {};
      try {
        profileExtra = JSON.parse(localStorage.getItem(`lanway_profile_extra_${effectiveCandidateId}`) || localStorage.getItem('lanway_profile_extra_default') || '{}');
      } catch (e) {}

      const candidateName = profile?.name || profileExtra.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Candidate';
      const candidateEmail = profile?.email || user?.email || profileExtra.email || 'candidate@lanway.ai';
      const candidateCollege = profile?.college || profileExtra.college || 'JCT College of Engineering and Technology';
      const candidateDegree = profile?.degree || profileExtra.degree || 'B.E.';
      const candidateBranch = profile?.branch || profileExtra.branch || 'Computer Science & Engineering';
      const candidateYear = profile?.year || profileExtra.year || '3rd Year';
      const candidateSkills = (profile?.skills && profile.skills.length > 0) ? profile.skills : (profileExtra.skills || ['JavaScript', 'React.js', 'Python', 'SQL']);

      // Calculate initial resume match against assessment required skills
      const requiredSkills = assessment?.required_skills || [];
      let matchScore = 85;
      if (requiredSkills.length > 0 && candidateSkills.length > 0) {
        const studentSkillNames = candidateSkills.map(s => (typeof s === 'object' ? s.name : s).toLowerCase());
        const matched = requiredSkills.filter(req => 
          studentSkillNames.some(s => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))
        );
        matchScore = Math.max(70, Math.min(98, Math.round((matched.length / requiredSkills.length) * 100)));
      }

      const initialSnapshot = {
        name: candidateName,
        email: candidateEmail,
        college: candidateCollege,
        degree: candidateDegree,
        branch: candidateBranch,
        year: candidateYear,
        cgpa: profileExtra.cgpa || '8.5',
        skills: candidateSkills,
        headline: profileExtra.headline || `${candidateDegree} Student in ${candidateBranch}`,
        bio: profileExtra.bio || 'Passionate student eager to learn, build projects, and solve meaningful real-world problems.',
        phone: profileExtra.phone || '+91 98765 43210',
        location: profileExtra.location || 'Coimbatore, India',
        projects: profileExtra.projects || [
          {
            id: 'proj-1',
            title: 'Full Stack Web Application',
            description: 'Developed modern full-stack web applications with authentication and database integration.',
            tags: ['React', 'Node.js', 'PostgreSQL']
          }
        ],
        experience: profileExtra.experience || [
          {
            id: 'exp-1',
            role: 'Software Intern',
            company: 'Tech Solutions',
            period: '2024',
            description: 'Contributed to web frontend components and REST APIs.'
          }
        ],
        socials: profileExtra.socials || {},
        resume_match_score: matchScore
      };

      // If no candidate record exists, create one
      if (!candId) {
        const { data, error } = await supabase
          .from('assessment_candidates')
          .insert({
            assessment_id: id,
            candidate_id: effectiveCandidateId,
            status: 'InProgress',
            started_at: new Date().toISOString(),
            resume_match_score: matchScore,
            score_details: {
              candidate_snapshot: initialSnapshot
            }
          })
          .select()
          .single();

        if (error) {
          console.warn('Supabase candidate record insert note:', error.message);

          // A second lobby tab can win the insert race. Reuse its persisted row.
          const { data: existingCandidate, error: existingError } = await supabase
            .from('assessment_candidates')
            .select('id')
            .eq('assessment_id', id)
            .eq('candidate_id', effectiveCandidateId)
            .maybeSingle();

          if (existingError || !existingCandidate?.id) {
            throw error;
          }

          candId = existingCandidate.id;
        } else {
          candId = data.id;
        }
      } else {
        // Update to InProgress
        try {
          await supabase
            .from('assessment_candidates')
            .update({ 
              status: 'InProgress', 
              started_at: new Date().toISOString(),
              resume_match_score: matchScore,
              score_details: {
                candidate_snapshot: initialSnapshot
              }
            })
            .eq('id', candId);
        } catch (e) {
          console.warn('Update candidate error:', e);
        }
      }

      // Save initial snapshot locally for immediate syncing
      localStorage.setItem(`lanway_candidate_submission_${candId}`, JSON.stringify(initialSnapshot));

      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (fsErr) {
          console.warn('Fullscreen request bypassed:', fsErr);
        }
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
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-sm text-brand-ink-500">Loading assessment & company details...</div>
      </DashboardLayout>
    );
  }

  if (!assessment) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-500 font-semibold">Assessment not found or expired.</div>
      </DashboardLayout>
    );
  }

  const allPassed = checks.camera === 'success' && checks.mic === 'success' && checks.fullscreen === 'success';

  const companyInitials = companyProfile?.company_name
    ? companyProfile.company_name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

  return (
    <DashboardLayout title="Assessment Lobby" subtitle="Prepare for your secure candidate assessment">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ========================================================================= */}
        {/* 1. ASSESSMENT HERO HEADER */}
        {/* ========================================================================= */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-brand-ink-900 via-brand-ink-950 to-slate-900 text-white border-none rounded-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30 backdrop-blur-md">
                <Building size={13} />
                {companyProfile?.company_name}
              </span>
              <button
                type="button"
                onClick={() => setShowCompanyModal(true)}
                className="text-xs text-brand-blue-300 hover:text-white underline underline-offset-2 flex items-center gap-1 ml-1"
              >
                View Company Profile
                <ExternalLink size={11} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-brand-ink-300">
              <Clock size={13} />
              <span>{assessment.duration_minutes || 45} minutes duration</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2 tracking-tight text-white">
            {assessment.title}
          </h1>

          <p className="text-brand-ink-200 text-sm mb-4">
            Position: <span className="font-semibold text-white">{assessment.role || 'Software Engineering Role'}</span>
          </p>

          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 text-xs sm:text-sm leading-relaxed text-brand-ink-100">
            {assessment.description || 'Welcome to this hiring assessment. Please review the company profile and proctoring rules below before starting.'}
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 2. DEDICATED COMPANY PROFILE CARD (VISIBLE TO STUDENTS) */}
        {/* ========================================================================= */}
        <Card className="p-6 border border-brand-ink-200 bg-white shadow-card">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-brand-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {companyInitials}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-base text-brand-ink-900">
                    About {companyProfile?.company_name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Hiring Partner
                  </span>
                </div>
                <p className="text-xs text-brand-ink-500 mt-0.5">{companyProfile?.tagline}</p>
              </div>
            </div>

            {companyProfile?.website && (
              <a
                href={companyProfile.website}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-800 bg-brand-blue-50 px-3 py-1.5 rounded-lg border border-brand-blue-100 transition-colors"
              >
                <Globe size={13} />
                Visit Website
                <ExternalLink size={11} />
              </a>
            )}
          </div>

          <p className="text-xs text-brand-ink-700 leading-relaxed mb-4 bg-brand-ink-50/60 p-3.5 rounded-xl border border-brand-ink-100">
            {companyProfile?.about}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            {/* Tech Stack */}
            {companyProfile?.tech_stack?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-brand-ink-800 mb-2 flex items-center gap-1.5">
                  <Code2 size={13} className="text-brand-blue-600" />
                  Technologies Used at {companyProfile.company_name}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {companyProfile.tech_stack.map((t) => (
                    <span key={t} className="rounded-md bg-brand-blue-50 px-2.5 py-1 text-[11px] font-semibold text-brand-blue-700 border border-brand-blue-100">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Perks & Benefits */}
            {companyProfile?.perks?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-brand-ink-800 mb-2 flex items-center gap-1.5">
                  <HeartHandshake size={13} className="text-emerald-600" />
                  Candidate Perks & Highlights
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {companyProfile.perks.map((p) => (
                    <span key={p} className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 border border-emerald-100">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-brand-ink-100 flex items-center justify-between text-[11px] text-brand-ink-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-brand-blue-600" />
              Location: {companyProfile?.headquarters || 'Remote / Hybrid'}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={12} className="text-brand-blue-600" />
              Size: {companyProfile?.company_size || 'Growing Tech Team'}
            </span>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 3. PROCTORING & SYSTEM CHECKS */}
        {/* ========================================================================= */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-display font-bold text-base text-brand-ink-900 mb-3 flex items-center gap-2">
              <Shield className="text-brand-blue-600" size={18} />
              Proctoring Consent
            </h3>
            <p className="text-xs text-brand-ink-600 mb-3 leading-relaxed">
              To ensure fairness and authenticity for {companyProfile?.company_name}, this assessment monitors:
            </p>
            <ul className="space-y-2 mb-5 text-xs text-brand-ink-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Webcam Verification:</strong> Confirms candidate presence.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Audio Sensor:</strong> Detects multi-voice interference.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Fullscreen Lock:</strong> Prevents unauthorized tab switching.</span>
              </li>
            </ul>

            <label className="flex items-start gap-2.5 p-3 bg-brand-ink-50 rounded-xl border border-brand-ink-200 cursor-pointer hover:bg-brand-blue-50/60 transition-colors">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span className="text-xs font-semibold text-brand-ink-900 leading-tight">
                I understand and consent to video, audio, and screen monitoring during this test.
              </span>
            </label>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-display font-bold text-base text-brand-ink-900">System Readiness</h3>
              <Button size="sm" variant="secondary" onClick={runSystemChecks} className="text-xs py-1 px-2.5">
                Run Checks
              </Button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between items-center p-2.5 rounded-lg border border-brand-ink-100 bg-white">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-md ${checks.camera === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-ink-50 text-brand-ink-500'}`}>
                    <Camera size={16} />
                  </div>
                  <span className="text-xs font-semibold text-brand-ink-900">Camera</span>
                </div>
                {checks.camera === 'success' && <CheckCircle2 className="text-emerald-500" size={16} />}
                {checks.camera === 'error' && <AlertCircle className="text-red-500" size={16} />}
                {checks.camera === 'pending' && <span className="text-[11px] text-brand-ink-400">Not checked</span>}
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg border border-brand-ink-100 bg-white">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-md ${checks.mic === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-ink-50 text-brand-ink-500'}`}>
                    <Mic size={16} />
                  </div>
                  <span className="text-xs font-semibold text-brand-ink-900">Microphone</span>
                </div>
                {checks.mic === 'success' && <CheckCircle2 className="text-emerald-500" size={16} />}
                {checks.mic === 'error' && <AlertCircle className="text-red-500" size={16} />}
                {checks.mic === 'pending' && <span className="text-[11px] text-brand-ink-400">Not checked</span>}
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg border border-brand-ink-100 bg-white">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-md ${checks.fullscreen === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-ink-50 text-brand-ink-500'}`}>
                    <Monitor size={16} />
                  </div>
                  <span className="text-xs font-semibold text-brand-ink-900">Fullscreen</span>
                </div>
                {checks.fullscreen === 'success' && <CheckCircle2 className="text-emerald-500" size={16} />}
                {checks.fullscreen === 'error' && <AlertCircle className="text-red-500" size={16} />}
                {checks.fullscreen === 'pending' && <span className="text-[11px] text-brand-ink-400">Not checked</span>}
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full justify-center text-xs py-2.5"
              icon={ArrowRight}
              iconPosition="right"
              disabled={!consent || !allPassed || loading}
              onClick={handleStartTest}
            >
              Start Assessment
            </Button>

            {!allPassed && (
              <p className="text-[11px] text-center text-brand-ink-500 mt-2">
                Click <strong>"Run Checks"</strong> and accept proctoring consent to enable test start.
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FULL COMPANY PROFILE MODAL */}
      {/* ========================================================================= */}
      {showCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl border border-brand-ink-200 bg-white p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-ink-100">
              <div className="flex items-center gap-2">
                <Building size={18} className="text-brand-blue-600" />
                <h3 className="font-display font-bold text-brand-ink-900 text-base">Company Profile</h3>
              </div>
              <button
                onClick={() => setShowCompanyModal(false)}
                className="p-1 text-brand-ink-400 hover:bg-brand-ink-100 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="my-4 space-y-4 text-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-brand-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {companyInitials}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-brand-ink-900">{companyProfile?.company_name}</h4>
                    <p className="text-xs text-brand-ink-500">{companyProfile?.tagline}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-brand-ink-400 mt-1">
                      <span>{companyProfile?.industry}</span>
                      <span>• {companyProfile?.headquarters}</span>
                      <span>• {companyProfile?.company_size}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-bold text-brand-ink-900 text-xs mb-1">About the Organization</p>
                <p className="text-brand-ink-700 leading-relaxed bg-brand-ink-50 p-3 rounded-xl border border-brand-ink-100">
                  {companyProfile?.about}
                </p>
              </div>

              {companyProfile?.culture_description && (
                <div>
                  <p className="font-bold text-brand-ink-900 text-xs mb-1">Work Culture</p>
                  <p className="text-brand-ink-700 leading-relaxed bg-brand-ink-50 p-3 rounded-xl border border-brand-ink-100">
                    {companyProfile.culture_description}
                  </p>
                </div>
              )}

              {companyProfile?.tech_stack?.length > 0 && (
                <div>
                  <p className="font-bold text-brand-ink-900 text-xs mb-1.5">Technologies You'll Work With</p>
                  <div className="flex flex-wrap gap-1.5">
                    {companyProfile.tech_stack.map((t) => (
                      <span key={t} className="rounded-md bg-brand-blue-50 px-2.5 py-1 text-xs font-semibold text-brand-blue-700 border border-brand-blue-100">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {companyProfile?.perks?.length > 0 && (
                <div>
                  <p className="font-bold text-brand-ink-900 text-xs mb-1.5">Benefits & Perks</p>
                  <div className="flex flex-wrap gap-1.5">
                    {companyProfile.perks.map((p) => (
                      <span key={p} className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-100">
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-brand-ink-100">
              <Button variant="secondary" onClick={() => setShowCompanyModal(false)} className="text-xs">
                Back to Lobby
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
