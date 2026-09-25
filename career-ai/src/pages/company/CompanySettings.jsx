import { useState, useEffect } from 'react';
import {
  Building,
  Globe,
  MapPin,
  Mail,
  Users,
  Calendar,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Eye,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  HeartHandshake,
  Layers,
  Code2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import CompanyLayout from '../../components/layout/CompanyLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const INDUSTRY_OPTIONS = [
  'Software & SaaS',
  'FinTech & Payments',
  'Artificial Intelligence & ML',
  'EdTech & Learning',
  'HealthTech & Biotech',
  'E-Commerce & Retail',
  'Cybersecurity',
  'Cloud Infrastructure',
  'Gaming & Entertainment',
  'Consulting & Services',
];

const COMPANY_SIZE_OPTIONS = [
  '1 - 10 employees (Early Startup)',
  '11 - 50 employees (Growth Stage)',
  '51 - 200 employees (Mid-Sized)',
  '201 - 1,000 employees (Scale-Up)',
  '1,000+ employees (Enterprise)',
];

const PERK_SUGGESTIONS = [
  'Remote-First Culture',
  'Flexible Working Hours',
  'Health & Wellness Insurance',
  'Annual Learning Stipend',
  'Equity & ESOPs',
  'Latest M-Series MacBooks',
  'Paid Mentorship Programs',
  'Unlimited PTO / Leave',
  'Gym & Fitness Allowance',
];

const TECH_SUGGESTIONS = [
  'React',
  'Node.js',
  'Python',
  'TypeScript',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'Next.js',
  'GraphQL',
  'Tailwind CSS',
  'Go / Golang',
];

export default function CompanySettings() {
  const { profile, updateProfile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Input fields for tags
  const [techInput, setTechInput] = useState('');
  const [perkInput, setPerkInput] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    company_name: '',
    recruiter_name: '',
    tagline: '',
    industry: '',
    company_size: '',
    founded_year: '',
    website: '',
    contact_email: '',
    headquarters: '',
    about: '',
    culture_description: '',
    tech_stack: [],
    perks: [],
  });

  useEffect(() => {
    loadCompanyProfile();
  }, [profile, user]);

  const loadCompanyProfile = () => {
    const storageKey = `lanway_company_profile_${user?.id || 'default'}`;
    let extraData = {};
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        extraData = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading company profile extra:', e);
    }

    setFormData((prev) => ({
      ...prev,
      company_name: profile?.company_name || extraData.company_name || user?.user_metadata?.company_name || 'Acme Technologies',
      recruiter_name: profile?.recruiter_name || extraData.recruiter_name || user?.user_metadata?.full_name || 'Hiring Team',
      tagline: extraData.tagline || prev.tagline || '',
      industry: extraData.industry || prev.industry || '',
      company_size: extraData.company_size || prev.company_size || '',
      founded_year: extraData.founded_year || prev.founded_year || '',
      website: extraData.website || prev.website || '',
      contact_email: extraData.contact_email || prev.contact_email || '',
      headquarters: extraData.headquarters || prev.headquarters || '',
      about: extraData.about || prev.about || '',
      culture_description: extraData.culture_description || prev.culture_description || '',
      tech_stack: Array.isArray(extraData.tech_stack) ? extraData.tech_stack : prev.tech_stack,
      perks: Array.isArray(extraData.perks) ? extraData.perks : prev.perks,
    }));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Tech stack management
  const addTech = (techToAdd) => {
    const trimmed = (techToAdd || techInput).trim();
    if (!trimmed) return;
    if (!formData.tech_stack.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, trimmed],
      }));
      setTechInput('');
    }
  };

  const removeTech = (tech) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((t) => t !== tech),
    }));
  };

  // Perks management
  const addPerk = (perkToAdd) => {
    const trimmed = (perkToAdd || perkInput).trim();
    if (!trimmed) return;
    if (!formData.perks.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        perks: [...prev.perks, trimmed],
      }));
      setPerkInput('');
    }
  };

  const removePerk = (perk) => {
    setFormData((prev) => ({
      ...prev,
      perks: prev.perks.filter((p) => p !== perk),
    }));
  };

  // Save Company Profile
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!formData.company_name.trim()) {
        throw new Error('Company name is required');
      }

      // Update in Supabase company_profiles
      if (updateProfile) {
        try {
          await updateProfile({
            company_name: formData.company_name,
            recruiter_name: formData.recruiter_name,
          });
        } catch (supabaseErr) {
          console.warn('Supabase company profile note:', supabaseErr.message);
        }
      }

      // Save complete company profile in localStorage for instant synchronization across assessment lobby & candidate views
      const storageKey = `lanway_company_profile_${user?.id || 'default'}`;
      localStorage.setItem(storageKey, JSON.stringify(formData));

      // Also broadcast to public company storage so student assessment lobbies can resolve by company ID
      if (profile?.id) {
        localStorage.setItem(`lanway_public_company_${profile.id}`, JSON.stringify(formData));
      }

      showToast('Company profile saved and visible to assessment candidates! ✨');
    } catch (err) {
      setError(err.message || 'Failed to save company profile');
    } finally {
      setSaving(false);
    }
  };

  const companyInitials = formData.company_name
    ? formData.company_name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

  return (
    <CompanyLayout title="Company Profile" subtitle="Manage your organization details, tech stack, and candidate-facing showcase">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-900 px-4 py-3 text-white shadow-xl animate-fade-in text-xs font-medium">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner Card */}
      <div className="card p-5 sm:p-6 mb-6 bg-white border border-brand-ink-200 rounded-2xl shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Logo & Company Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-blue-600 text-2xl sm:text-3xl font-bold text-white shadow-sm ring-4 ring-brand-blue-50">
              {companyInitials}
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" title="Active Hiring Account" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="truncate font-display text-xl sm:text-2xl font-bold tracking-tight text-brand-ink-900">
                  {formData.company_name || 'Company Name'}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-brand-blue-700 border border-brand-blue-100">
                  <ShieldCheck size={12} /> Verified Employer
                </span>
              </div>

              <p className="text-xs sm:text-sm text-brand-ink-600 mt-0.5 truncate">
                {formData.tagline || 'Add your company tagline'}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-ink-500">
                <span className="flex items-center gap-1">
                  <Briefcase size={12} className="text-brand-blue-600" />
                  {formData.industry}
                </span>
                {formData.headquarters && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-brand-blue-600" />
                    {formData.headquarters}
                  </span>
                )}
                {formData.website && (
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-brand-blue-600 hover:underline"
                  >
                    <Globe size={12} />
                    Website
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            <Button
              variant="secondary"
              icon={Eye}
              onClick={() => setShowPreviewModal(true)}
              className="text-xs py-2 px-3"
            >
              Candidate View Preview
            </Button>

            <Button
              variant="primary"
              icon={saving ? CheckCircle : Save}
              onClick={handleSave}
              disabled={saving}
              className="text-xs py-2 px-4 shadow-sm"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 border-t border-brand-ink-100 pt-3 flex overflow-x-auto no-scrollbar gap-2">
          {[
            { id: 'overview', label: 'Company Overview', icon: Building },
            { id: 'culture', label: 'Culture & Benefits', icon: HeartHandshake },
            { id: 'tech', label: 'Tech Stack', icon: Code2 },
            { id: 'recruiter', label: 'Recruiter Details', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-200'
                    : 'text-brand-ink-600 hover:bg-brand-ink-50 hover:text-brand-ink-900'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-brand-blue-600' : 'text-brand-ink-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Form */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Side: Form Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* TAB 1: Company Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <Card className="p-6">
                <h3 className="font-display text-base font-bold text-brand-ink-900 mb-4">General Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    id="company_name"
                    label="Company Name *"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="e.g. Acme Technologies"
                    required
                  />
                  <Input
                    id="tagline"
                    label="Company Tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="e.g. Empowering developers worldwide"
                  />
                  <div>
                    <label className="block text-xs font-semibold text-brand-ink-700 mb-1.5">Industry Sector</label>
                    <select
                      id="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-brand-ink-200 bg-white px-3.5 py-2.5 text-xs text-brand-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
                    >
                      <option value="">Select industry</option>
                      {INDUSTRY_OPTIONS.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-ink-700 mb-1.5">Company Size</label>
                    <select
                      id="company_size"
                      value={formData.company_size}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-brand-ink-200 bg-white px-3.5 py-2.5 text-xs text-brand-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
                    >
                      <option value="">Select company size</option>
                      {COMPANY_SIZE_OPTIONS.map((sz) => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    id="website"
                    label="Official Website URL"
                    icon={Globe}
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://company.com"
                  />
                  <Input
                    id="headquarters"
                    label="Headquarters / Office Location"
                    icon={MapPin}
                    value={formData.headquarters}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru, India"
                  />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-display text-base font-bold text-brand-ink-900 mb-2">About the Company</h3>
                <p className="text-xs text-brand-ink-500 mb-3">
                  This description is displayed to students and candidates taking your assessments.
                </p>
                <textarea
                  id="about"
                  rows={4}
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Share your mission, product impact, and what makes your company exciting to work for..."
                  className="w-full rounded-xl border border-brand-ink-200 bg-white p-3 text-xs text-brand-ink-800 placeholder:text-brand-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
                />
              </Card>
            </div>
          )}

          {/* TAB 2: Culture & Benefits */}
          {activeTab === 'culture' && (
            <div className="space-y-6 animate-fade-in">
              <Card className="p-6">
                <h3 className="font-display text-base font-bold text-brand-ink-900 mb-2">Work Culture & Values</h3>
                <p className="text-xs text-brand-ink-500 mb-3">
                  Help candidates understand what it's like to work in your engineering team.
                </p>
                <textarea
                  id="culture_description"
                  rows={3}
                  value={formData.culture_description}
                  onChange={handleChange}
                  placeholder="Describe your collaboration style, mentorship programs, autonomy, and learning environment..."
                  className="w-full rounded-xl border border-brand-ink-200 bg-white p-3 text-xs text-brand-ink-800 placeholder:text-brand-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
                />
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-ink-900">Perks & Benefits</h3>
                    <p className="text-xs text-brand-ink-500">Highlight attractive benefits offered to hires.</p>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                    {formData.perks.length} Perks Listed
                  </span>
                </div>

                {/* Add perk form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addPerk();
                  }}
                  className="mb-4 flex gap-2"
                >
                  <div className="flex-1">
                    <Input
                      id="perkInput"
                      placeholder="Add a benefit e.g. Annual Learning Budget, Stock Options..."
                      value={perkInput}
                      onChange={(e) => setPerkInput(e.target.value)}
                    />
                  </div>
                  <Button type="submit" variant="primary" icon={Plus} className="text-xs py-2 px-3">
                    Add
                  </Button>
                </form>

                {/* Active perks */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.perks.map((perk) => (
                    <div
                      key={perk}
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs text-emerald-900"
                    >
                      <span className="font-medium">{perk}</span>
                      <button
                        type="button"
                        onClick={() => removePerk(perk)}
                        className="text-emerald-500 hover:text-red-600 transition-colors ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Suggested Perks */}
                <div className="border-t border-brand-ink-100 pt-3">
                  <p className="text-xs font-semibold text-brand-ink-500 mb-2">Suggested perks to add:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PERK_SUGGESTIONS.filter((p) => !formData.perks.includes(p)).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => addPerk(preset)}
                        className="flex items-center gap-1 rounded-lg border border-brand-ink-200 bg-white px-2.5 py-1 text-xs text-brand-ink-700 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                      >
                        <Plus size={11} /> {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: Tech Stack */}
          {activeTab === 'tech' && (
            <div className="space-y-6 animate-fade-in">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-ink-900">Engineering Tech Stack</h3>
                    <p className="text-xs text-brand-ink-500">Technologies, frameworks, and cloud platforms your company uses.</p>
                  </div>
                  <span className="text-xs font-semibold bg-brand-blue-50 text-brand-blue-700 px-2.5 py-1 rounded-full">
                    {formData.tech_stack.length} Technologies
                  </span>
                </div>

                {/* Add tech */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addTech();
                  }}
                  className="mb-4 flex gap-2"
                >
                  <div className="flex-1">
                    <Input
                      id="techInput"
                      placeholder="Type a technology e.g. React, Docker, FastAPI..."
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                    />
                  </div>
                  <Button type="submit" variant="primary" icon={Plus} className="text-xs py-2 px-3">
                    Add
                  </Button>
                </form>

                {/* Active tech pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.tech_stack.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-1.5 rounded-lg border border-brand-blue-200 bg-brand-blue-50/70 px-3 py-1.5 text-xs text-brand-blue-900"
                    >
                      <span className="font-semibold">{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="text-brand-blue-400 hover:text-red-600 transition-colors ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Suggested Tech */}
                <div className="border-t border-brand-ink-100 pt-3">
                  <p className="text-xs font-semibold text-brand-ink-500 mb-2">Popular tech tools:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TECH_SUGGESTIONS.filter((t) => !formData.tech_stack.includes(t)).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => addTech(preset)}
                        className="flex items-center gap-1 rounded-lg border border-brand-ink-200 bg-white px-2.5 py-1 text-xs text-brand-ink-700 hover:border-brand-blue-300 hover:bg-brand-blue-50 transition-all"
                      >
                        <Plus size={11} /> {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 4: Recruiter Details */}
          {activeTab === 'recruiter' && (
            <div className="space-y-6 animate-fade-in">
              <Card className="p-6">
                <h3 className="font-display text-base font-bold text-brand-ink-900 mb-4">Recruiting Contact</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    id="recruiter_name"
                    label="Primary Recruiter Name"
                    value={formData.recruiter_name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Jenkins"
                  />
                  <Input
                    id="contact_email"
                    label="Careers / Contact Email"
                    icon={Mail}
                    value={formData.contact_email}
                    onChange={handleChange}
                    placeholder="careers@company.com"
                  />
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Right Side: Quick Preview & Visibility Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-brand-ink-900 text-sm">Candidate Visibility</h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck size={12} /> Live to Students
              </span>
            </div>
            <p className="text-xs text-brand-ink-500 leading-relaxed mb-4">
              Your company overview, tech stack, and benefits are automatically presented to candidates in the <strong>Assessment Lobby</strong> before they begin testing.
            </p>

            <Button
              variant="secondary"
              icon={Eye}
              onClick={() => setShowPreviewModal(true)}
              className="w-full text-xs py-2 mb-3"
            >
              Preview Candidate Card
            </Button>

            <Button
              variant="primary"
              icon={saving ? CheckCircle : Save}
              onClick={handleSave}
              disabled={saving}
              className="w-full text-xs py-2"
            >
              {saving ? 'Saving...' : 'Save & Publish Profile'}
            </Button>
          </Card>

          {/* Mini Card Snapshot */}
          <Card className="p-5 bg-white border border-brand-ink-200 rounded-2xl shadow-card">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-brand-blue-50">
                  {companyInitials}
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight text-brand-ink-900">{formData.company_name || 'Company Name'}</p>
                  <p className="text-[11px] text-brand-ink-500">{formData.industry || 'Industry'}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-brand-blue-700 bg-brand-blue-50 px-2 py-0.5 rounded-md border border-brand-blue-100">
                Card Preview
              </span>
            </div>
            <p className="text-xs text-brand-ink-600 line-clamp-3 leading-relaxed mb-3 bg-brand-ink-50/60 p-3 rounded-xl border border-brand-ink-100">
              {formData.about || 'Company overview will appear here.'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {formData.tech_stack.slice(0, 3).map((t) => (
                <span key={t} className="text-[10px] bg-brand-blue-50 border border-brand-blue-100 px-2 py-0.5 rounded-md font-semibold text-brand-blue-700">
                  {t}
                </span>
              ))}
              {formData.tech_stack.length > 3 && (
                <span className="text-[10px] text-brand-ink-500 self-center font-medium">
                  +{formData.tech_stack.length - 3} more
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* MODAL: Live Candidate Preview */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl border border-brand-ink-200 bg-white p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-ink-100">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-brand-blue-600" />
                <h3 className="font-display font-bold text-brand-ink-900 text-base">Candidate Lobby View Preview</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 text-brand-ink-400 hover:bg-brand-ink-100 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Candidate Card representation */}
            <div className="my-5 rounded-2xl border border-brand-ink-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-14 w-14 rounded-2xl bg-brand-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {companyInitials}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-brand-ink-900">{formData.company_name}</h4>
                    <p className="text-xs text-brand-ink-500 font-medium">{formData.tagline}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-brand-ink-400 mt-1">
                      <span>{formData.industry}</span>
                      <span>• {formData.headquarters}</span>
                      <span>• {formData.company_size}</span>
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={12} /> Verified Company
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-brand-ink-900 mb-1">About Us</p>
                <p className="text-xs text-brand-ink-700 leading-relaxed bg-brand-ink-50/60 p-3 rounded-xl border border-brand-ink-100">
                  {formData.about || 'Company description.'}
                </p>
              </div>

              {formData.tech_stack.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-brand-ink-900 mb-1.5">Tech Stack You'll Work With</p>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.tech_stack.map((t) => (
                      <span key={t} className="rounded-md bg-brand-blue-50 px-2.5 py-1 text-xs font-semibold text-brand-blue-700 border border-brand-blue-100">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.perks.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-brand-ink-900 mb-1.5">Workplace Perks</p>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.perks.map((p) => (
                      <span key={p} className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-100">
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setShowPreviewModal(false)} className="text-xs">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </CompanyLayout>
  );
}
