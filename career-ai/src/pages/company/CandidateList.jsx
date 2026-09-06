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
  const { profile } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All' or 'Shortlisted'

  useEffect(() => {
    if (profile?.id) {
      loadCandidates();
    }
  }, [profile]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      // First get all assessments for this company
      const { data: assessments, error: assessError } = await supabase
        .from('company_assessments')
        .select('id, title, role')
        .eq('company_id', profile.id);

      if (assessError) throw assessError;

      const assessmentIds = assessments.map(a => a.id);
      
      if (assessmentIds.length > 0) {
        // Then get all candidates for these assessments
        const { data: cands, error: candError } = await supabase
          .from('assessment_candidates')
          .select(`
            *,
            student_profiles (name, email, college)
          `)
          .in('assessment_id', assessmentIds)
          .order('overall_score', { ascending: false });

        if (candError) throw candError;

        // Map assessment info onto candidates
        const mappedCands = cands.map(c => {
          const assm = assessments.find(a => a.id === c.assessment_id);
          return {
            ...c,
            assessment_title: assm?.title || 'Unknown',
            role: assm?.role || 'Unknown'
          };
        });

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

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.student_profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.student_profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.assessment_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || (activeTab === 'Shortlisted' && c.status === 'Shortlisted');
    
    return matchesSearch && matchesTab;
  });

  return (
    <CompanyLayout title="Candidates" subtitle="Review and shortlist applicants">
      
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-brand-ink-200 mb-6">
        <button
          className={`pb-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'All' ? 'border-brand-blue-600 text-brand-blue-600' : 'border-transparent text-brand-ink-500 hover:text-brand-ink-700'}`}
          onClick={() => setActiveTab('All')}
        >
          All Candidates
        </button>
        <button
          className={`pb-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'Shortlisted' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-brand-ink-500 hover:text-brand-ink-700'}`}
          onClick={() => setActiveTab('Shortlisted')}
        >
          Shortlisted
          {candidates.filter(c => c.status === 'Shortlisted').length > 0 && (
            <span className="bg-emerald-100 text-emerald-700 py-0.5 px-2 rounded-full text-[10px]">
              {candidates.filter(c => c.status === 'Shortlisted').length}
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
        <button className="flex items-center gap-2 text-sm font-semibold text-brand-ink-600 bg-white border border-brand-ink-200 px-4 py-2.5 rounded-xl shadow-sm hover:bg-brand-ink-50 transition-colors shrink-0">
          <Filter size={16} /> Filter
        </button>
      </div>

      <Card className="overflow-hidden border-brand-ink-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-brand-ink-50/50 text-brand-ink-500 font-semibold border-b border-brand-ink-100">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Assessment</th>
                <th className="px-6 py-4">Overall Score</th>
                <th className="px-6 py-4">Resume Match</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ink-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-brand-ink-500">
                    Loading candidates...
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-brand-ink-500">
                    No candidates found.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-brand-ink-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center font-bold">
                          {c.student_profiles?.name?.charAt(0) || <User size={18} />}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-ink-900">{c.student_profiles?.name || 'Unknown'}</p>
                          <p className="text-[11px] text-brand-ink-500">{c.student_profiles?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-brand-ink-900">{c.assessment_title}</p>
                      <p className="text-[11px] text-brand-ink-500">{c.role}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-brand-ink-900">{c.overall_score || 0}%</div>
                        {c.overall_score >= 80 && <Award size={14} className="text-emerald-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-brand-ink-700">{c.resume_match_score || 0}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge color={getRiskColor(c.risk_level)} className="flex items-center gap-1 w-fit">
                        {c.risk_level === 'High' && <ShieldAlert size={12} />}
                        {c.risk_level || 'Low'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge color={c.status === 'Shortlisted' ? 'green' : c.status === 'Rejected' ? 'red' : c.status === 'Completed' ? 'blue' : 'mixed'}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/company-candidates/${c.id}`)}
                        className="text-brand-blue-600 hover:text-brand-blue-800 font-semibold text-sm flex items-center gap-1 ml-auto"
                      >
                        Review <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </CompanyLayout>
  );
}
