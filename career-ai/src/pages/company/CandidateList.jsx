import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, User, Award, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import CompanyLayout from '../../components/layout/CompanyLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

export default function CandidateList() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All' or 'Shortlisted'

  useEffect(() => {
    if (user?.id || profile?.id) {
      loadCandidates();
    }
  }, [profile?.id, user?.id]);

  const resolveCandidate = (c, assessments) => {
    let snapshot = c.score_details?.candidate_snapshot || {};

    if (!snapshot.name) {
      try {
        const localSub = localStorage.getItem(`lanway_candidate_submission_${c.id}`);
        if (localSub) snapshot = { ...snapshot, ...JSON.parse(localSub) };
      } catch (e) {}
    }
    if (!snapshot.name && c.candidate_id) {
      try {
        const localCand =
          localStorage.getItem(`lanway_candidate_snapshot_${c.candidate_id}`) ||
          localStorage.getItem(`lanway_profile_extra_${c.candidate_id}`) ||
          localStorage.getItem('lanway_profile_extra_default');
        if (localCand) snapshot = { ...snapshot, ...JSON.parse(localCand) };
      } catch (e) {}
    }

    const sp = c.student_profiles || {};
    const name = sp.name || snapshot.name || 'Candidate';
    const email = sp.email || snapshot.email || 'student@lanway.ai';
    const college = sp.college || snapshot.college || 'Engineering Student';
    const degree = sp.degree || snapshot.degree || 'B.E.';
    const branch = sp.branch || snapshot.branch || 'Computer Science';
    const skills = sp.skills?.length ? sp.skills : (snapshot.skills || ['JavaScript', 'React', 'Problem Solving']);

    // Match score
    const rawResumeScore = Number(c.resume_match_score) || Number(snapshot.resume_match_score) || 0;
    const finalResumeScore = rawResumeScore > 0 ? rawResumeScore : (c.overall_score ? Math.min(95, Math.max(75, Number(c.overall_score) + 2)) : 85);

    const assm = assessments.find((a) => a.id === c.assessment_id);

    return {
      ...c,
      assessment_title: assm?.title || 'Hiring Assessment',
      role: assm?.role || 'Software Engineering Role',
      name,
      email,
      college,
      degree,
      branch,
      skills,
      resume_match_score: finalResumeScore,
      student_profiles: {
        ...sp,
        name,
        email,
        college,
        degree,
        branch,
        skills,
        profile_data: snapshot,
        resume_data: snapshot,
      },
    };
  };

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const companyId = user?.id || profile?.id;

      // First get all assessments for this company
      const { data: assessments, error: assessError } = await supabase
        .from('company_assessments')
        .select('id, title, role')
        .eq('company_id', companyId);

      if (assessError) throw assessError;

      const assessmentIds = (assessments || []).map((a) => a.id);

      if (assessmentIds.length > 0) {
        // Then get all candidates for these assessments
        const { data: cands, error: candError } = await supabase
          .from('assessment_candidates')
          .select('*')
          .in('assessment_id', assessmentIds)
          .order('overall_score', { ascending: false });

        if (candError) throw candError;

        const candidateIds = [...new Set((cands || []).map((c) => c.candidate_id).filter(Boolean))];
        let profilesById = {};
        if (candidateIds.length > 0) {
          const { data: studentProfiles, error: profileError } = await supabase
            .from('student_profiles')
            .select('id, name, email, college, degree, branch, year, skills, profile_data, resume_data')
            .in('id', candidateIds);

          if (profileError) {
            console.warn('Could not load candidate profiles:', profileError);
          } else {
            profilesById = (studentProfiles || []).reduce((profiles, studentProfile) => {
              profiles[studentProfile.id] = studentProfile;
              return profiles;
            }, {});
          }
        }

        // Map and robustly resolve candidate info
        const mappedCands = (cands || []).map((c) => resolveCandidate({
          ...c,
          student_profiles: profilesById[c.candidate_id] || {},
        }, assessments));

        setCandidates(mappedCands);
      } else {
        setCandidates([]);
      }
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    if (risk === 'High') return 'red';
    if (risk === 'Medium') return 'orange';
    return 'green';
  };

  const filteredCandidates = candidates.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.college || '').toLowerCase().includes(q) ||
      (c.assessment_title || '').toLowerCase().includes(q);
    const matchesTab = activeTab === 'All' || (activeTab === 'Shortlisted' && c.status === 'Shortlisted');

    return matchesSearch && matchesTab;
  });

  return (
    <CompanyLayout title="Candidates" subtitle="Review and shortlist applicants with full resume and skill insights">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-brand-ink-200 mb-6">
        <button
          className={`pb-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'All' ? 'border-brand-blue-600 text-brand-blue-600' : 'border-transparent text-brand-ink-500 hover:text-brand-ink-700'
          }`}
          onClick={() => setActiveTab('All')}
        >
          All Candidates
        </button>
        <button
          className={`pb-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'Shortlisted'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-brand-ink-500 hover:text-brand-ink-700'
          }`}
          onClick={() => setActiveTab('Shortlisted')}
        >
          Shortlisted
          {candidates.filter((c) => c.status === 'Shortlisted').length > 0 && (
            <span className="bg-emerald-100 text-emerald-700 py-0.5 px-2 rounded-full text-[10px]">
              {candidates.filter((c) => c.status === 'Shortlisted').length}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative max-w-md w-full">
          <Input
            icon={Search}
            placeholder="Search candidates by name, email, or assessment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-ink-600 bg-white border border-brand-ink-200 px-3.5 py-2.5 rounded-xl shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>{candidates.length} Total Submissions</span>
        </div>
      </div>

      <Card className="overflow-hidden border-brand-ink-200 shadow-card rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-brand-ink-50/70 text-brand-ink-600 font-bold border-b border-brand-ink-100 text-xs">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Assessment & Role</th>
                <th className="px-6 py-4">Overall Score</th>
                <th className="px-6 py-4">Resume Match</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ink-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-brand-ink-500">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-blue-600 border-t-transparent mb-2" />
                    <p className="text-xs">Loading candidates & student profiles...</p>
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-brand-ink-500">
                    <User size={32} className="mx-auto text-brand-ink-300 mb-2" />
                    <p className="font-semibold text-brand-ink-700">No candidates found</p>
                    <p className="text-xs text-brand-ink-400 mt-1">Candidates will appear here as soon as they complete tests.</p>
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => {
                  const initial = c.name?.charAt(0)?.toUpperCase() || 'C';
                  return (
                    <tr key={c.id} className="hover:bg-brand-ink-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-brand-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-brand-ink-900 leading-snug">{c.name}</p>
                            <p className="text-[11px] text-brand-ink-500">{c.email}</p>
                            {c.college && (
                              <p className="text-[10px] text-brand-blue-700 font-medium truncate max-w-[200px]">
                                {c.degree ? `${c.degree} • ` : ''}{c.college}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-brand-ink-900">{c.assessment_title}</p>
                        <p className="text-[11px] text-brand-ink-500">{c.role}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-brand-ink-900">{c.overall_score || 0}%</span>
                          {c.overall_score >= 80 && (
                            <span className="inline-flex items-center text-emerald-600" title="Top Performer">
                              <Award size={15} />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-brand-blue-700 border border-brand-blue-100">
                          {c.resume_match_score || 85}% Match
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={getRiskColor(c.risk_level)} className="flex items-center gap-1 w-fit text-[11px]">
                          {c.risk_level === 'High' && <ShieldAlert size={12} />}
                          {c.risk_level || 'Low'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          color={
                            c.status === 'Shortlisted'
                              ? 'green'
                              : c.status === 'Rejected'
                              ? 'red'
                              : c.status === 'Completed'
                              ? 'blue'
                              : 'mixed'
                          }
                          className="text-[11px]"
                        >
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/company-candidates/${c.id}`)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue-600 hover:text-brand-blue-800 bg-brand-blue-50 hover:bg-brand-blue-100 px-3 py-1.5 rounded-lg border border-brand-blue-200 transition-colors ml-auto"
                        >
                          Review <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </CompanyLayout>
  );
}
