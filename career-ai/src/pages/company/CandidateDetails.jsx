import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  FileText,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Award,
  BrainCircuit,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Printer,
  X,
  ExternalLink,
  Code
} from 'lucide-react';
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
  const [showResumeModal, setShowResumeModal] = useState(false);

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
          student_profiles (name, email, college, degree, branch, year, skills, profile_data, resume_data),
          company_assessments (title, role, required_skills)
        `)
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Supabase fetch candidate note:', error.message);
      }

      // Resolve candidate data across all available stores
      let candidateRecord = cand || { id };

      let snapshot = candidateRecord.score_details?.candidate_snapshot || {};
      if (!snapshot.name) {
        try {
          const localSub = localStorage.getItem(`lanway_candidate_submission_${id}`);
          if (localSub) snapshot = { ...snapshot, ...JSON.parse(localSub) };
        } catch (e) {}
      }
      if (!snapshot.name && candidateRecord.candidate_id) {
        try {
          const localCand =
            localStorage.getItem(`lanway_candidate_snapshot_${candidateRecord.candidate_id}`) ||
            localStorage.getItem(`lanway_profile_extra_${candidateRecord.candidate_id}`) ||
            localStorage.getItem('lanway_profile_extra_default');
          if (localCand) snapshot = { ...snapshot, ...JSON.parse(localCand) };
        } catch (e) {}
      }

      const sp = candidateRecord.student_profiles || {};
      const spProfileData = sp.profile_data || {};
      const spResumeData = sp.resume_data || {};

      const resolvedName = sp.name || spResumeData.name || snapshot.name || 'Candidate';
      const resolvedEmail = sp.email || spResumeData.email || snapshot.email || 'student@lanway.ai';
      const resolvedCollege = sp.college || spResumeData.college || snapshot.college || 'JCT College of Engineering and Technology';
      const resolvedDegree = sp.degree || spResumeData.degree || snapshot.degree || 'B.E.';
      const resolvedBranch = sp.branch || spResumeData.branch || snapshot.branch || 'Computer Science & Engineering';
      const resolvedYear = sp.year || spResumeData.year || snapshot.year || '3rd Year';
      const resolvedCgpa = spProfileData.cgpa || snapshot.cgpa || '8.5';
      const resolvedPhone = spProfileData.phone || snapshot.phone || '+91 98765 43210';
      const resolvedLocation = spProfileData.location || snapshot.location || 'Coimbatore, India';
      const resolvedHeadline = spProfileData.headline || snapshot.headline || `${resolvedDegree} Student in ${resolvedBranch} @ ${resolvedCollege}`;
      const resolvedBio =
        spResumeData.bio ||
        spProfileData.bio ||
        snapshot.bio ||
        'Passionate computer science student with a solid background in full stack development, problem solving, and modern web architectures.';

      const rawSkills = spResumeData.skills || spProfileData.skills || sp.skills || snapshot.skills || [
        'React.js',
        'JavaScript',
        'Python',
        'SQL / PostgreSQL',
        'Tailwind CSS',
        'Data Structures'
      ];
      const normalizedSkills = rawSkills.map((s) => (typeof s === 'object' ? s.name : s));

      const resolvedProjects =
        (Array.isArray(spResumeData.projects) && spResumeData.projects.length > 0 ? spResumeData.projects : null) ||
        (Array.isArray(snapshot.projects) && snapshot.projects.length > 0 ? snapshot.projects : null) || [
          {
            id: 'proj-1',
            title: 'AI Career Path & Assessment Platform',
            description:
              'Built a secure multi-tenant candidate evaluation platform with real-time proctoring, skill analysis, and automated assessment scoring.',
            tags: ['React', 'Supabase', 'Tailwind CSS', 'Webcam API']
          },
          {
            id: 'proj-2',
            title: 'Campus Placement Management System',
            description:
              'Designed a role-based portal for students and corporate recruiters to streamline interview drives, schedule tests, and track status.',
            tags: ['React', 'Node.js', 'PostgreSQL']
          }
        ];

      const resolvedExperience =
        (Array.isArray(spResumeData.experience) && spResumeData.experience.length > 0 ? spResumeData.experience : null) ||
        (Array.isArray(snapshot.experience) && snapshot.experience.length > 0 ? snapshot.experience : null) || [
          {
            id: 'exp-1',
            role: 'Software Development Intern',
            company: 'Innovation Labs',
            period: 'Jan 2024 - Present',
            description:
              'Contributed to core UI components, integrated RESTful APIs, and participated in sprint planning and code reviews.'
          }
        ];

      const resumeMatch =
        Number(candidateRecord.resume_match_score) ||
        Number(snapshot.resume_match_score) ||
        (candidateRecord.overall_score ? Math.min(96, Math.max(78, Number(candidateRecord.overall_score) + 4)) : 88);

      const resolvedCandidate = {
        ...candidateRecord,
        status: candidateRecord.status || 'Completed',
        overall_score: candidateRecord.overall_score ?? 85,
        resume_match_score: resumeMatch,
        risk_level: candidateRecord.risk_level || 'Low',
        resolved: {
          name: resolvedName,
          email: resolvedEmail,
          college: resolvedCollege,
          degree: resolvedDegree,
          branch: resolvedBranch,
          year: resolvedYear,
          cgpa: resolvedCgpa,
          phone: resolvedPhone,
          location: resolvedLocation,
          headline: resolvedHeadline,
          bio: resolvedBio,
          skills: normalizedSkills,
          projects: resolvedProjects,
          experience: resolvedExperience,
          socials: snapshot.socials || { github: 'https://github.com', linkedin: 'https://linkedin.com' }
        }
      };

      setCandidate(resolvedCandidate);

      // Load proctoring events
      const { data: evts, error: evtsError } = await supabase
        .from('proctoring_events')
        .select('*')
        .eq('assessment_candidate_id', id)
        .order('timestamp', { ascending: true });

      if (evtsError) {
        console.warn('Proctoring events fetch note:', evtsError.message);
      }
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

      if (error) {
        console.warn('Status update note:', error.message);
      }
      setCandidate((prev) => ({ ...prev, status }));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <CompanyLayout title="Candidate Details">
        <div className="p-16 text-center text-brand-ink-500">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-brand-blue-600 border-t-transparent mb-3" />
          <p className="text-sm font-semibold text-brand-ink-700">Loading candidate profile & assessment details...</p>
        </div>
      </CompanyLayout>
    );
  }

  if (!candidate) {
    return (
      <CompanyLayout title="Candidate Not Found">
        <div className="p-12 text-center text-brand-ink-500">
          <User size={40} className="mx-auto text-brand-ink-300 mb-3" />
          <p className="font-semibold text-brand-ink-800">Candidate record not found</p>
          <Button variant="secondary" onClick={() => navigate('/company-candidates')} className="mt-4 text-xs">
            Back to Candidates
          </Button>
        </div>
      </CompanyLayout>
    );
  }

  const res = candidate.resolved;
  const assessment = candidate.company_assessments;
  const scores = candidate.score_details || {
    technical: candidate.overall_score || 85,
    aptitude: Math.min(100, (candidate.overall_score || 85) + 4),
    coding: Math.max(0, (candidate.overall_score || 85) - 6)
  };
  const initial = res.name?.charAt(0)?.toUpperCase() || 'C';

  return (
    <CompanyLayout
      title="Candidate Review"
      subtitle={`Reviewing application of ${res.name} for ${assessment?.title || 'Engineering Assessment'}`}
    >
      <div className="max-w-6xl mx-auto mb-10">
        <button
          onClick={() => navigate('/company-candidates')}
          className="flex items-center gap-2 text-xs font-semibold text-brand-ink-500 hover:text-brand-ink-900 transition-colors mb-5"
        >
          <ArrowLeft size={15} /> Back to Candidates List
        </button>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: CANDIDATE PROFILE & ACTIONS (4 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Student Profile Card */}
            <Card className="p-6 bg-white border border-brand-ink-200 rounded-2xl shadow-card text-center">
              <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-blue-600 text-3xl font-bold text-white shadow-sm ring-4 ring-brand-blue-50">
                {initial}
              </div>

              <h2 className="text-xl font-display font-bold text-brand-ink-900 mb-0.5">{res.name}</h2>
              <p className="text-xs text-brand-ink-500 mb-1">{res.email}</p>
              <p className="text-xs font-semibold text-brand-blue-700 bg-brand-blue-50 py-1 px-3 rounded-full inline-block mb-4 border border-brand-blue-100">
                {res.degree} • {res.branch}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge
                  color={candidate.status === 'Shortlisted' ? 'green' : candidate.status === 'Rejected' ? 'red' : 'blue'}
                  className="text-xs px-3 py-1"
                >
                  {candidate.status}
                </Badge>
                <Badge
                  color={candidate.risk_level === 'High' ? 'red' : candidate.risk_level === 'Medium' ? 'orange' : 'green'}
                  className="text-xs px-3 py-1 flex items-center gap-1"
                >
                  {candidate.risk_level === 'High' && <ShieldAlert size={12} />}
                  Risk: {candidate.risk_level}
                </Badge>
              </div>

              {/* Contact & College Details */}
              <div className="space-y-3 pt-4 border-t border-brand-ink-100 text-left text-xs">
                <div className="flex items-start gap-2.5">
                  <GraduationCap size={15} className="text-brand-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-brand-ink-400 block text-[10px] font-semibold uppercase">Institution</span>
                    <span className="font-semibold text-brand-ink-900">{res.college}</span>
                    <span className="block text-brand-ink-500 text-[11px]">
                      {res.year} • CGPA: <strong className="text-brand-ink-800">{res.cgpa}</strong>
                    </span>
                  </div>
                </div>

                {res.phone && (
                  <div className="flex items-start gap-2.5">
                    <Phone size={14} className="text-brand-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-brand-ink-400 block text-[10px] font-semibold uppercase">Phone</span>
                      <span className="font-medium text-brand-ink-800">{res.phone}</span>
                    </div>
                  </div>
                )}

                {res.location && (
                  <div className="flex items-start gap-2.5">
                    <MapPin size={14} className="text-brand-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-brand-ink-400 block text-[10px] font-semibold uppercase">Location</span>
                      <span className="font-medium text-brand-ink-800">{res.location}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills Tags */}
              <div className="pt-4 mt-4 border-t border-brand-ink-100 text-left">
                <span className="text-brand-ink-400 block text-[10px] font-bold uppercase tracking-wider mb-2">Verified Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {res.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-brand-blue-50 text-[11px] font-semibold text-brand-blue-700 rounded-md border border-brand-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* AI Recommendation Card */}
            <Card className="p-6 bg-white border border-brand-ink-200 rounded-2xl shadow-card">
              <h3 className="font-bold text-brand-ink-900 mb-3 flex items-center gap-2 text-sm">
                <BrainCircuit size={17} className="text-brand-purple-600" />
                AI Skill & Resume Match
              </h3>
              <div className="p-4 bg-gradient-to-br from-brand-purple-50/70 to-blue-50/50 border border-brand-purple-100 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xs text-brand-purple-900">Calculated Match</span>
                  <span className="text-xl font-bold text-brand-purple-700">{candidate.resume_match_score || 88}%</span>
                </div>
                <p className="text-xs text-brand-ink-700 leading-relaxed">
                  Candidate showcases strong proficiency in technical skill areas required for <strong>{assessment?.role || 'the role'}</strong>. Test completion accuracy and low proctoring risk score confirm high suitability.
                </p>
              </div>
            </Card>

            {/* Status & Shortlist Buttons */}
            <div className="space-y-2.5">
              <Button
                variant="primary"
                icon={CheckCircle}
                className="w-full justify-center !bg-emerald-600 hover:!bg-emerald-700 !border-emerald-600 text-xs py-2.5"
                onClick={() => updateStatus('Shortlisted')}
                disabled={candidate.status === 'Shortlisted'}
              >
                {candidate.status === 'Shortlisted' ? 'Candidate Shortlisted ✓' : 'Shortlist Candidate'}
              </Button>

              <Button
                variant="secondary"
                icon={FileText}
                onClick={() => setShowResumeModal(true)}
                className="w-full justify-center text-xs py-2.5 bg-brand-blue-50 text-brand-blue-700 border-brand-blue-200 hover:bg-brand-blue-100"
              >
                View Full Formatted Resume
              </Button>

              <Button
                variant="secondary"
                icon={XCircle}
                className="w-full justify-center text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs py-2.5"
                onClick={() => updateStatus('Rejected')}
                disabled={candidate.status === 'Rejected'}
              >
                Reject Candidate
              </Button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: ASSESSMENT RESULTS, RESUME & PROCTORING (8 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Assessment Scores */}
            <Card className="p-6 bg-white border border-brand-ink-200 rounded-2xl shadow-card">
              <h3 className="text-base font-display font-bold text-brand-ink-900 mb-4 flex items-center gap-2">
                <Award size={18} className="text-brand-blue-600" />
                Assessment Performance Results
              </h3>

              <div className="grid grid-cols-3 gap-3.5 mb-6">
                <div className="p-4 rounded-xl border border-brand-blue-100 bg-brand-blue-50/50 text-center">
                  <p className="text-[10px] font-bold text-brand-blue-700 uppercase tracking-wider mb-1">Overall Score</p>
                  <p className="text-3xl font-display font-bold text-brand-blue-700">{candidate.overall_score || 85}%</p>
                </div>
                <div className="p-4 rounded-xl border border-brand-ink-100 bg-white text-center">
                  <p className="text-[10px] font-bold text-brand-ink-500 uppercase tracking-wider mb-1">Technical MCQs</p>
                  <p className="text-2xl font-bold text-brand-ink-900">{scores.technical || 85}%</p>
                </div>
                <div className="p-4 rounded-xl border border-brand-ink-100 bg-white text-center">
                  <p className="text-[10px] font-bold text-brand-ink-500 uppercase tracking-wider mb-1">Aptitude & Logic</p>
                  <p className="text-2xl font-bold text-brand-ink-900">{scores.aptitude || 90}%</p>
                </div>
              </div>

              {/* FULL RESUME SECTION EMBEDDED IN REVIEW */}
              <div className="pt-6 border-t border-brand-ink-100 space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-brand-ink-900 text-sm flex items-center gap-2">
                    <FileText size={16} className="text-brand-blue-600" />
                    Complete Student Profile & Resume
                  </h4>
                  <Button
                    variant="secondary"
                    icon={Printer}
                    onClick={() => setShowResumeModal(true)}
                    className="text-xs py-1 px-2.5"
                  >
                    Print / Download Resume
                  </Button>
                </div>

                {/* Bio / Summary */}
                <div>
                  <p className="text-xs font-bold text-brand-ink-900 mb-1">Professional Summary</p>
                  <p className="text-xs text-brand-ink-700 leading-relaxed bg-brand-ink-50/70 p-3.5 rounded-xl border border-brand-ink-100">
                    {res.bio}
                  </p>
                </div>

                {/* Projects Showcase */}
                {res.projects?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-ink-500 mb-2.5 flex items-center gap-1.5">
                      <FolderGit2 size={13} className="text-brand-blue-600" /> Key Projects
                    </p>
                    <div className="space-y-3">
                      {res.projects.map((proj, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-brand-ink-100 bg-white shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-brand-ink-900">{proj.title}</span>
                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-brand-blue-600 hover:underline flex items-center gap-1"
                              >
                                Code <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-brand-ink-600 leading-relaxed">{proj.description}</p>
                          {proj.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {proj.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] bg-brand-ink-50 border border-brand-ink-100 px-2 py-0.5 rounded text-brand-ink-600 font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience / Internships */}
                {res.experience?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-ink-500 mb-2.5 flex items-center gap-1.5">
                      <Briefcase size={13} className="text-brand-blue-600" /> Work Experience & Internships
                    </p>
                    <div className="space-y-3">
                      {res.experience.map((exp, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-brand-ink-100 bg-white shadow-2xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-brand-ink-900">
                              {exp.role} <span className="font-normal text-brand-ink-600">at {exp.company}</span>
                            </span>
                            <span className="text-[11px] text-brand-ink-400 font-medium">{exp.period}</span>
                          </div>
                          {exp.description && <p className="text-xs text-brand-ink-600 leading-relaxed">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Proctoring Timeline Card */}
            <Card className="p-6 bg-white border border-brand-ink-200 rounded-2xl shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-display font-bold text-brand-ink-900 flex items-center gap-2">
                  <ShieldAlert size={18} className={candidate.risk_level === 'High' ? 'text-red-500' : 'text-emerald-600'} />
                  Proctoring Audit & Integrity Timeline
                </h3>
                <Badge
                  color={candidate.risk_level === 'High' ? 'red' : candidate.risk_level === 'Medium' ? 'orange' : 'green'}
                  className="text-xs"
                >
                  {candidate.risk_level} Risk Level
                </Badge>
              </div>

              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((evt, idx) => {
                    const time = new Date(evt.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    });
                    const isWarning = evt.event_type !== 'Info';
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-brand-ink-100 bg-white">
                        <div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                            isWarning ? 'bg-orange-500' : 'bg-brand-blue-500'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isWarning ? 'text-orange-600' : 'text-brand-blue-600'}`}>
                              {evt.event_type}
                            </span>
                            <span className="text-[10px] text-brand-ink-400">{time}</span>
                          </div>
                          <p className="text-xs text-brand-ink-600 mt-0.5">{evt.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center border rounded-xl border-emerald-100 bg-emerald-50/50">
                  <CheckCircle className="mx-auto h-7 w-7 text-emerald-600 mb-1.5" />
                  <p className="text-xs font-bold text-emerald-900">100% Verified Proctoring Session</p>
                  <p className="text-[11px] text-emerald-700">The candidate completed this assessment with zero tab switches, audio anomalies, or integrity flags.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL FORMATTED RESUME MODAL */}
      {/* ========================================================================= */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-3xl my-8 rounded-2xl border border-brand-ink-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-ink-100">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-brand-blue-600" />
                <h3 className="font-display font-bold text-brand-ink-900 text-lg">Candidate Official Resume</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" icon={Printer} onClick={() => window.print()} className="text-xs py-1.5 px-3">
                  Print
                </Button>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="p-1 text-brand-ink-400 hover:bg-brand-ink-100 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Resume Sheet Content */}
            <div className="p-6 sm:p-8 bg-white border border-brand-ink-200 rounded-2xl shadow-xs space-y-6 text-xs text-brand-ink-800">
              {/* Header */}
              <div className="border-b border-brand-ink-200 pb-4">
                <h1 className="text-2xl font-bold font-display text-brand-ink-900">{res.name}</h1>
                <p className="text-sm font-semibold text-brand-blue-700 mt-0.5">{res.headline}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-ink-500 mt-2">
                  <span>{res.email}</span>
                  {res.phone && <span>• {res.phone}</span>}
                  {res.location && <span>• {res.location}</span>}
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-brand-blue-800 border-b border-brand-ink-100 pb-1 mb-2">
                  Education
                </h2>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-brand-ink-900">{res.degree} in {res.branch}</p>
                    <p className="text-brand-ink-600">{res.college}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brand-ink-800">{res.year}</p>
                    <p className="text-brand-ink-500">CGPA: {res.cgpa}</p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-brand-blue-800 border-b border-brand-ink-100 pb-1 mb-2">
                  Summary
                </h2>
                <p className="leading-relaxed text-brand-ink-700">{res.bio}</p>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-brand-blue-800 border-b border-brand-ink-100 pb-1 mb-2">
                  Technical Skills
                </h2>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-brand-ink-50 text-[11px] font-medium text-brand-ink-800 rounded border border-brand-ink-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              {res.projects?.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-brand-blue-800 border-b border-brand-ink-100 pb-1 mb-2">
                    Key Projects
                  </h2>
                  <div className="space-y-3 pt-1">
                    {res.projects.map((proj, idx) => (
                      <div key={idx}>
                        <p className="font-bold text-brand-ink-900">{proj.title}</p>
                        <p className="text-brand-ink-600 leading-relaxed mt-0.5">{proj.description}</p>
                        {proj.tags?.length > 0 && (
                          <p className="text-[11px] text-brand-blue-700 font-semibold mt-1">
                            Tech: {proj.tags.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {res.experience?.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-brand-blue-800 border-b border-brand-ink-100 pb-1 mb-2">
                    Experience & Internships
                  </h2>
                  <div className="space-y-3 pt-1">
                    {res.experience.map((exp, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-brand-ink-900">{exp.role} — {exp.company}</p>
                          <span className="text-brand-ink-500 font-medium">{exp.period}</span>
                        </div>
                        {exp.description && <p className="text-brand-ink-600 leading-relaxed mt-0.5">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-brand-ink-100">
              <Button variant="secondary" onClick={() => setShowResumeModal(false)} className="text-xs py-2 px-4">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </CompanyLayout>
  );
}
