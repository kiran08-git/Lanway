import { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Globe,
  Save,
  Plus,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  BriefcaseBusiness,
  Target,
  UserRound,
  Share2,
  FileText,
  Code,
  ExternalLink,
  Check,
  Printer,
  ShieldCheck,
  FolderGit2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';

function GithubIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const INTEREST_OPTIONS = [
  'Artificial Intelligence',
  'Web Development',
  'Cloud & DevOps',
  'Data Science',
  'UI/UX Design',
  'Product Management',
  'Cybersecurity',
  'Mobile Apps',
  'Problem Solving',
  'Competitive Coding',
];

const SKILL_PRESETS = [
  'React.js',
  'JavaScript',
  'TypeScript',
  'Python',
  'Node.js',
  'Tailwind CSS',
  'SQL / PostgreSQL',
  'Docker',
  'Git & GitHub',
  'Data Structures & Algorithms',
  'AWS',
  'REST APIs',
];

const AVAILABILITY_OPTIONS = [
  { id: 'actively_looking', label: 'Open to Work / Internships', color: 'bg-emerald-500' },
  { id: 'interviewing', label: 'Actively Interviewing', color: 'bg-blue-500' },
  { id: 'upskilling', label: 'Focused on Upskilling', color: 'bg-amber-500' },
  { id: 'closed', label: 'Exploring Privately', color: 'bg-zinc-400' },
];

const TABS = [
  { id: 'personal', label: 'Personal & Academics', icon: UserRound },
  { id: 'skills', label: 'Skills & Tech Stack', icon: Code },
  { id: 'projects', label: 'Projects & Experience', icon: FolderGit2 },
  { id: 'preferences', label: 'Career Goals & Links', icon: Target },
];

export default function Profile() {
  const { profile, updateProfile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Skill input
  const [skillInput, setSkillInput] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');

  // Tag inputs per project { [projectId]: string }
  const [projectTagInputs, setProjectTagInputs] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    headline: '',
    phone: '',
    location: '',
    college: '',
    degree: '',
    branch: '',
    year: '',
    cgpa: '',
    bio: '',
    availability: 'actively_looking',
    careerGoal: '',
    workMode: 'Hybrid / Remote',
    expectedCompensation: '',
    skills: [],
    interests: [],
    socials: {
      github: '',
      linkedin: '',
      portfolio: '',
      leetcode: '',
    },
    projects: [],
    experience: [],
  });

  // Load profile from auth & localStorage
  useEffect(() => {
    const storageKey = `lanway_profile_extra_${user?.id || 'default'}`;
    let extraData = {};
    try {
      const savedExtra = localStorage.getItem(storageKey);
      if (savedExtra) {
        extraData = JSON.parse(savedExtra);
      }
    } catch (e) {
      console.error('Error loading extra profile data:', e);
    }

    // Clean out any old hardcoded seeded projects / experience
    const cleanProjects = Array.isArray(extraData.projects)
      ? extraData.projects.filter(
          (p) =>
            p.title !== 'Career AI Platform' &&
            !p.githubUrl?.includes('kiran08-git') &&
            !p.liveUrl?.includes('lanway-career-ai')
        )
      : [];

    const cleanExperience = Array.isArray(extraData.experience)
      ? extraData.experience.filter((e) => e.company !== 'Innovate Labs')
      : [];

    if (profile) {
      const storedProfileData = profile.profile_data || {};
      extraData = { ...storedProfileData, ...extraData };
      const rawSkills = profile.skills || extraData.skills || [];
      const normalizedSkills = rawSkills.map((s) => {
        if (typeof s === 'object' && s !== null) return s;
        return { name: s, level: 'Intermediate' };
      });

      setFormData((prev) => ({
        ...prev,
        name: profile.name || prev.name,
        email: profile.email || user?.email || prev.email,
        college: profile.college || prev.college,
        degree: profile.degree || prev.degree,
        branch: profile.branch || prev.branch,
        year: profile.year || prev.year,
        careerGoal: profile.career_goal || prev.careerGoal,
        interests: profile.interests?.length ? profile.interests : prev.interests,
        skills: normalizedSkills.length ? normalizedSkills : prev.skills,
        headline: extraData.headline || prev.headline || (profile.degree ? `${profile.degree} Student @ ${profile.college || 'Lanway'}` : 'Aspiring Software Engineer'),
        phone: extraData.phone || prev.phone,
        location: extraData.location || prev.location || 'India',
        cgpa: extraData.cgpa || prev.cgpa,
        bio: extraData.bio || prev.bio || 'Passionate student eager to learn, build projects, and solve meaningful real-world problems.',
        availability: extraData.availability || prev.availability || 'actively_looking',
        workMode: extraData.workMode || prev.workMode,
        expectedCompensation: extraData.expectedCompensation || prev.expectedCompensation,
        socials: extraData.socials ? { ...prev.socials, ...extraData.socials } : prev.socials,
        projects: cleanProjects,
        experience: cleanExperience,
      }));
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        name: user.user_metadata?.full_name || prev.name || user.email?.split('@')[0] || 'Student',
        ...extraData,
        projects: cleanProjects,
        experience: cleanExperience,
      }));
    }
  }, [profile, user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSocialChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      socials: { ...prev.socials, [key]: value },
    }));
  };

  // Skill management
  const addSkill = (nameToAdd, levelToAdd = skillLevel) => {
    const trimmed = (nameToAdd || skillInput).trim();
    if (!trimmed) return;
    if (!formData.skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, { name: trimmed, level: levelToAdd }],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillName) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== skillName),
    }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  // Projects management
  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: `proj-${Date.now()}`,
          title: 'New Project',
          description: '',
          tags: [],
          liveUrl: '',
          githubUrl: '',
        },
      ],
    }));
  };

  const updateProject = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const removeProject = (id) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Project Tag / Skill management
  const addProjectTag = (projectId, tag) => {
    const trimmed = (tag || projectTagInputs[projectId] || '').trim();
    if (!trimmed) return;

    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id === projectId) {
          const currentTags = Array.isArray(p.tags) ? p.tags : [];
          if (!currentTags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
            return { ...p, tags: [...currentTags, trimmed] };
          }
        }
        return p;
      }),
    }));

    setProjectTagInputs((prev) => ({ ...prev, [projectId]: '' }));
  };

  const removeProjectTag = (projectId, tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id === projectId) {
          const currentTags = Array.isArray(p.tags) ? p.tags : [];
          return { ...p, tags: currentTags.filter((t) => t !== tagToRemove) };
        }
        return p;
      }),
    }));
  };

  // Experience management
  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now()}`,
          role: 'Intern / Developer',
          company: '',
          period: '2024',
          description: '',
        },
      ],
    }));
  };

  const updateExperience = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const removeExperience = (id) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  // Save changes
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('Full name is required');
      }

      if (updateProfile) {
        try {
          await updateProfile({
            name: formData.name,
            college: formData.college,
            degree: formData.degree,
            branch: formData.branch,
            year: formData.year,
            skills: formData.skills.map((s) => (typeof s === 'object' ? s.name : s)),
            interests: formData.interests,
            career_goal: formData.careerGoal,
          });
        } catch (supabaseErr) {
          console.warn('Supabase profile update note:', supabaseErr.message);
        }
      }

      const storageKey = `lanway_profile_extra_${user?.id || 'default'}`;
      const extraPayload = {
        headline: formData.headline,
        phone: formData.phone,
        location: formData.location,
        cgpa: formData.cgpa,
        bio: formData.bio,
        availability: formData.availability,
        workMode: formData.workMode,
        expectedCompensation: formData.expectedCompensation,
        skills: formData.skills,
        socials: formData.socials,
        projects: formData.projects,
        experience: formData.experience,
      };
      localStorage.setItem(storageKey, JSON.stringify(extraPayload));

      if (updateProfile) {
        try {
          await updateProfile({
            profile_data: extraPayload,
            resume_data: {
              name: formData.name,
              email: formData.email,
              headline: formData.headline,
              location: formData.location,
              college: formData.college,
              degree: formData.degree,
              branch: formData.branch,
              year: formData.year,
              bio: formData.bio,
              skills: formData.skills,
              projects: formData.projects,
              experience: formData.experience,
            },
          });
        } catch (supabaseErr) {
          console.warn('Supabase detailed profile update note:', supabaseErr.message);
        }
      }

      showToast('Profile saved successfully! ✨');
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // Profile strength calculation
  const completionDetails = useMemo(() => {
    const checklist = [
      { key: 'name', label: 'Full name', met: Boolean(formData.name), tab: 'personal', weight: 15 },
      { key: 'college', label: 'College & Degree', met: Boolean(formData.college && formData.degree), tab: 'personal', weight: 25 },
      { key: 'bio', label: 'Bio / Summary', met: Boolean(formData.bio && formData.bio.length > 15), tab: 'personal', weight: 20 },
      { key: 'skills', label: 'At least 3 Skills', met: formData.skills.length >= 3, tab: 'skills', weight: 25 },
      { key: 'careerGoal', label: 'Career Goal', met: Boolean(formData.careerGoal), tab: 'preferences', weight: 15 },
    ];
    const currentScore = checklist.reduce((sum, item) => (item.met ? sum + item.weight : sum), 0);
    return { checklist, currentScore };
  }, [formData]);

  const profileCompletion = completionDetails.currentScore;
  const activeAvailability = AVAILABILITY_OPTIONS.find((a) => a.id === formData.availability) || AVAILABILITY_OPTIONS[0];

  const avatarInitials = formData.name
    ? formData.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const copyProfileLink = () => {
    const url = window.location.origin + `/profile?view=${user?.id || 'demo'}`;
    navigator.clipboard?.writeText(url);
    showToast('Profile link copied! 📋');
  };

  return (
    <DashboardLayout title="Profile" subtitle="Manage your academic background, skills, and portfolio">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-900 px-4 py-3 text-white shadow-xl animate-fade-in text-xs font-medium">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CLEAN & PERFECT HERO PROFILE HEADER */}
      {/* ========================================================================= */}
      <div className="card p-5 sm:p-6 mb-6 bg-white border border-brand-ink-200 rounded-2xl shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Avatar and Info */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-blue-600 text-2xl sm:text-3xl font-bold text-white shadow-sm ring-4 ring-brand-blue-50">
              {avatarInitials}
              <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${activeAvailability.color}`} title={activeAvailability.label} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="truncate font-display text-xl sm:text-2xl font-bold tracking-tight text-brand-ink-900">
                  {formData.name || 'Student Profile'}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-brand-blue-700 border border-brand-blue-100">
                  <ShieldCheck size={12} /> Verified Student
                </span>
              </div>

              <p className="text-xs sm:text-sm text-brand-ink-600 mt-0.5 truncate">
                {formData.headline || 'Student at ' + (formData.college || 'Lanway')}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-ink-500">
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-brand-blue-600" />
                  {formData.email || 'Email missing'}
                </span>
                {formData.college && (
                  <span className="flex items-center gap-1">
                    <GraduationCap size={12} className="text-brand-blue-600" />
                    {formData.degree ? `${formData.degree}, ` : ''}{formData.college}
                  </span>
                )}
                {formData.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-brand-blue-600" />
                    {formData.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status Selector & Save Button */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            <select
              value={formData.availability}
              onChange={(e) => setFormData((prev) => ({ ...prev, availability: e.target.value }))}
              className="rounded-xl border border-brand-ink-200 bg-brand-ink-50 px-3 py-2 text-xs font-semibold text-brand-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-400 cursor-pointer"
            >
              {AVAILABILITY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  ● {opt.label}
                </option>
              ))}
            </select>

            <Button
              variant="secondary"
              icon={FileText}
              onClick={() => setShowResumeModal(true)}
              className="text-xs py-2 px-3"
            >
              Resume
            </Button>

            <Button
              variant="secondary"
              icon={Share2}
              onClick={copyProfileLink}
              className="text-xs py-2 px-3"
            >
              Share
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
          {TABS.map((tab) => {
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

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE WITH SIDEBAR */}
      {/* ========================================================================= */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Side: Active Form Tab (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* TAB 1: Personal & Academics */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-display text-base font-bold text-brand-ink-900 mb-4">Basic Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    id="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Saikiran"
                    required
                  />
                  <Input
                    id="email"
                    type="email"
                    label="Email Address"
                    icon={Mail}
                    value={formData.email}
                    disabled
                  />
                  <Input
                    id="headline"
                    label="Headline / Tagline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="e.g. BE Student @ JCT College of Engineering and Technology"
                    className="sm:col-span-2"
                  />
                  <Input
                    id="phone"
                    label="Phone Number"
                    icon={Phone}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                  <Input
                    id="location"
                    label="Location"
                    icon={MapPin}
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Coimbatore, India"
                  />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-display text-base font-bold text-brand-ink-900 mb-4">Academic Background</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    id="college"
                    label="College / Institution"
                    icon={GraduationCap}
                    placeholder="e.g. JCT College of Engineering and Technology"
                    value={formData.college}
                    onChange={handleChange}
                  />
                  <Input
                    id="degree"
                    label="Degree"
                    placeholder="e.g. B.E. / B.Tech"
                    value={formData.degree}
                    onChange={handleChange}
                  />
                  <Input
                    id="branch"
                    label="Branch / Major"
                    placeholder="e.g. Computer Science & Engineering"
                    value={formData.branch}
                    onChange={handleChange}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      id="year"
                      label="Year"
                      placeholder="e.g. 3rd Year"
                      value={formData.year}
                      onChange={handleChange}
                    />
                    <Input
                      id="cgpa"
                      label="CGPA / Score"
                      placeholder="e.g. 8.5"
                      value={formData.cgpa}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-display text-base font-bold text-brand-ink-900 mb-2">About Me</h3>
                <p className="text-xs text-brand-ink-500 mb-3">A brief summary of your core interests and goals.</p>
                <textarea
                  id="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell recruiters about your key passions and what you love building..."
                  className="w-full rounded-xl border border-brand-ink-200 bg-white p-3 text-xs text-brand-ink-800 placeholder:text-brand-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-400 transition-all"
                />
              </Card>
            </div>
          )}

          {/* TAB 2: Skills & Tech Stack */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-ink-900">Your Skills</h3>
                    <p className="text-xs text-brand-ink-500">Skills you know or are actively learning.</p>
                  </div>
                  <span className="text-xs font-semibold bg-brand-blue-50 text-brand-blue-700 px-2.5 py-1 rounded-full">
                    {formData.skills.length} added
                  </span>
                </div>

                {/* Add Skill Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addSkill();
                  }}
                  className="mb-5 flex gap-2"
                >
                  <div className="flex-1">
                    <Input
                      id="skillInput"
                      placeholder="Type a skill e.g. React, Python, SQL..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                    />
                  </div>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="rounded-xl border border-brand-ink-200 bg-white px-3 py-2 text-xs font-medium text-brand-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <Button type="submit" variant="primary" icon={Plus} className="text-xs py-2 px-3">
                    Add
                  </Button>
                </form>

                {/* Skills tags */}
                {formData.skills.length === 0 ? (
                  <p className="text-xs text-brand-ink-400 text-center py-6">No skills added yet. Pick from the suggestions below.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {formData.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center gap-1.5 rounded-lg border border-brand-blue-200 bg-brand-blue-50/70 px-3 py-1.5 text-xs text-brand-blue-900"
                      >
                        <span className="font-semibold">{skill.name}</span>
                        <span className="text-[10px] text-brand-blue-600 bg-white px-1.5 py-0.5 rounded">
                          {skill.level}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill.name)}
                          className="text-brand-blue-400 hover:text-red-600 transition-colors ml-1"
                          aria-label={`Remove ${skill.name}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                <div className="border-t border-brand-ink-100 pt-4">
                  <p className="text-xs font-semibold text-brand-ink-500 mb-2.5">Suggested skills:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SKILL_PRESETS.filter((p) => !formData.skills.some((s) => s.name.toLowerCase() === p.toLowerCase())).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => addSkill(preset, 'Intermediate')}
                        className="flex items-center gap-1 rounded-lg border border-brand-ink-200 bg-white px-2.5 py-1 text-xs text-brand-ink-700 hover:border-brand-blue-300 hover:bg-brand-blue-50 transition-all"
                      >
                        <Plus size={11} /> {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Areas of Interest */}
              <Card className="p-6">
                <h3 className="font-display text-base font-bold text-brand-ink-900 mb-1">Career Interests</h3>
                <p className="text-xs text-brand-ink-500 mb-3">Select fields that match your aspirations.</p>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => {
                    const active = formData.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          active
                            ? 'bg-brand-blue-600 text-white'
                            : 'bg-brand-ink-100 text-brand-ink-700 hover:bg-brand-ink-200'
                        }`}
                      >
                        {active && <Check size={11} className="inline mr-1" />}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: Projects & Experience */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-ink-900">Projects</h3>
                    <p className="text-xs text-brand-ink-500">Add your personal, academic, or open-source projects.</p>
                  </div>
                  <Button variant="secondary" icon={Plus} onClick={addProject} className="text-xs py-1.5 px-3">
                    Add Project
                  </Button>
                </div>

                {formData.projects.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-brand-ink-200 rounded-xl bg-brand-ink-50/40">
                    <FolderGit2 size={28} className="mx-auto text-brand-ink-300 mb-2" />
                    <p className="text-xs font-semibold text-brand-ink-700">No projects added yet</p>
                    <p className="text-[11px] text-brand-ink-400 mt-0.5">Click "Add Project" above to list your projects, skills used, and links.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {formData.projects.map((proj) => (
                      <div key={proj.id} className="rounded-xl border border-brand-ink-200 bg-brand-ink-50/40 p-4 sm:p-5 space-y-4">
                        {/* Project Title & Delete */}
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                            placeholder="Project Title (e.g. Real-Time Chat App)"
                            className="font-bold text-sm text-brand-ink-900 bg-transparent border-b border-brand-ink-200 focus:outline-none focus:border-brand-blue-500 flex-1 mr-3 py-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeProject(proj.id)}
                            className="text-brand-ink-400 hover:text-red-600 transition-colors p-1"
                            title="Remove project"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Project Description */}
                        <div>
                          <label className="block text-xs font-semibold text-brand-ink-700 mb-1">
                            Description & Key Achievements
                          </label>
                          <textarea
                            rows={2}
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                            placeholder="Describe what problem this solves, architectural decisions, and impact..."
                            className="w-full rounded-lg border border-brand-ink-200 bg-white p-2.5 text-xs text-brand-ink-700 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
                          />
                        </div>

                        {/* ========================================================================= */}
                        {/* DEDICATED SECTION TO ADD SKILLS TO THIS PROJECT */}
                        {/* ========================================================================= */}
                        <div className="rounded-xl border border-brand-ink-200/80 bg-white p-3.5 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-brand-ink-800 flex items-center gap-1.5">
                              <Code size={13} className="text-brand-blue-600" />
                              Technologies & Skills Used
                            </span>
                            <span className="text-[11px] text-brand-ink-400">
                              {(proj.tags || []).length} skills added
                            </span>
                          </div>

                          {/* Render current project tags */}
                          {(proj.tags || []).length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {proj.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-brand-blue-50 px-2.5 py-1 text-xs font-semibold text-brand-blue-700 border border-brand-blue-100"
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => removeProjectTag(proj.id, tag)}
                                    className="text-brand-blue-400 hover:text-red-600 transition-colors"
                                    title={`Remove ${tag}`}
                                  >
                                    <X size={12} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Input to type and add skill */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={projectTagInputs[proj.id] || ''}
                              onChange={(e) =>
                                setProjectTagInputs((prev) => ({ ...prev, [proj.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addProjectTag(proj.id);
                                }
                              }}
                              placeholder="Type skill & press enter (e.g. React, Docker, FastAPI)..."
                              className="flex-1 rounded-lg border border-brand-ink-200 px-3 py-1.5 text-xs text-brand-ink-800 placeholder:text-brand-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              icon={Plus}
                              onClick={() => addProjectTag(proj.id)}
                              className="text-xs py-1.5 px-2.5"
                            >
                              Add
                            </Button>
                          </div>

                          {/* Quick suggestions */}
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            <span className="text-[10px] font-semibold text-brand-ink-400 mr-1">Quick pick:</span>
                            {['React', 'Node.js', 'Python', 'Tailwind CSS', 'SQL', 'MongoDB', 'Docker', 'TypeScript']
                              .filter((t) => !(proj.tags || []).includes(t))
                              .slice(0, 5)
                              .map((quickTag) => (
                                <button
                                  key={quickTag}
                                  type="button"
                                  onClick={() => addProjectTag(proj.id, quickTag)}
                                  className="text-[10px] font-medium text-brand-ink-600 hover:text-brand-blue-700 bg-brand-ink-100 hover:bg-brand-blue-50 px-2 py-0.5 rounded transition-colors"
                                >
                                  + {quickTag}
                                </button>
                              ))}
                          </div>
                        </div>

                        {/* Project Links */}
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Input
                            id={`proj-live-${proj.id}`}
                            label="Live Demo Link"
                            icon={ExternalLink}
                            placeholder="https://my-app.vercel.app"
                            value={proj.liveUrl}
                            onChange={(e) => updateProject(proj.id, 'liveUrl', e.target.value)}
                          />
                          <Input
                            id={`proj-git-${proj.id}`}
                            label="GitHub Link"
                            icon={GithubIcon}
                            placeholder="https://github.com/username/repo"
                            value={proj.githubUrl}
                            onChange={(e) => updateProject(proj.id, 'githubUrl', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-ink-900">Work Experience & Internships</h3>
                    <p className="text-xs text-brand-ink-500">Internships, training programs, or past roles.</p>
                  </div>
                  <Button variant="secondary" icon={Plus} onClick={addExperience} className="text-xs py-1.5 px-3">
                    Add Experience
                  </Button>
                </div>

                {formData.experience.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-brand-ink-200 rounded-xl bg-brand-ink-50/40">
                    <BriefcaseBusiness size={28} className="mx-auto text-brand-ink-300 mb-2" />
                    <p className="text-xs font-semibold text-brand-ink-700">No work experience added yet</p>
                    <p className="text-[11px] text-brand-ink-400 mt-0.5">Click "Add Experience" to list internships or roles.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.experience.map((exp) => (
                      <div key={exp.id} className="rounded-xl border border-brand-ink-200 bg-brand-ink-50/40 p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="grid sm:grid-cols-3 gap-2 flex-1 mr-3">
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                              placeholder="Role / Title"
                              className="font-semibold text-xs text-brand-ink-900 bg-transparent border-b border-brand-ink-200 py-0.5 focus:outline-none focus:border-brand-blue-500"
                            />
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="Company"
                              className="text-xs text-brand-ink-700 bg-transparent border-b border-brand-ink-200 py-0.5 focus:outline-none focus:border-brand-blue-500"
                            />
                            <input
                              type="text"
                              value={exp.period}
                              onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                              placeholder="Dates (e.g. May - Jul 2024)"
                              className="text-xs text-brand-ink-500 bg-transparent border-b border-brand-ink-200 py-0.5 focus:outline-none focus:border-brand-blue-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExperience(exp.id)}
                            className="text-brand-ink-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Key responsibilities and achievements..."
                          className="w-full rounded-lg border border-brand-ink-200 bg-white p-2 text-xs text-brand-ink-700 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB 4: Career Goals & Links */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-display text-base font-bold text-brand-ink-900 mb-4">Career Targets</h3>
                <div className="space-y-4">
                  <Input
                    id="careerGoal"
                    label="Primary Career Objective"
                    placeholder="e.g. Full-Stack Software Engineer"
                    value={formData.careerGoal}
                    onChange={handleChange}
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-ink-700 mb-1">
                        Work Mode Preference
                      </label>
                      <select
                        id="workMode"
                        value={formData.workMode}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-brand-ink-200 bg-white px-3 py-2.5 text-xs text-brand-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
                      >
                        <option value="Hybrid / Remote">Hybrid / Remote</option>
                        <option value="Remote Only">Remote Only</option>
                        <option value="On-Site / In-Office">On-Site / In-Office</option>
                      </select>
                    </div>
                    <Input
                      id="expectedCompensation"
                      label="Target Stipend / CTC"
                      placeholder="e.g. ₹35,000 / month or ₹8-12 LPA"
                      value={formData.expectedCompensation}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-display text-base font-bold text-brand-ink-900 mb-4">Online Links</h3>
                <div className="space-y-4">
                  <Input
                    id="github"
                    label="GitHub Profile"
                    icon={GithubIcon}
                    placeholder="https://github.com/your-username"
                    value={formData.socials.github}
                    onChange={(e) => handleSocialChange('github', e.target.value)}
                  />
                  <Input
                    id="linkedin"
                    label="LinkedIn Profile"
                    icon={LinkedinIcon}
                    placeholder="https://linkedin.com/in/your-profile"
                    value={formData.socials.linkedin}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  />
                  <Input
                    id="portfolio"
                    label="Personal Portfolio Website"
                    icon={Globe}
                    placeholder="https://yourportfolio.dev"
                    value={formData.socials.portfolio}
                    onChange={(e) => handleSocialChange('portfolio', e.target.value)}
                  />
                  <Input
                    id="leetcode"
                    label="LeetCode / HackerRank"
                    icon={Code}
                    placeholder="https://leetcode.com/u/your-handle"
                    value={formData.socials.leetcode}
                    onChange={(e) => handleSocialChange('leetcode', e.target.value)}
                  />
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Right Side: Profile Strength Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-brand-ink-900 text-sm">Profile Strength</h3>
              <span className="text-xs font-bold text-brand-blue-700 bg-brand-blue-50 px-2.5 py-0.5 rounded-full">
                {profileCompletion}%
              </span>
            </div>

            <ProgressBar value={profileCompletion} color="mixed" className="mb-3" />

            <div className="space-y-2 border-t border-brand-ink-100 pt-3">
              {completionDetails.checklist.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full text-left flex items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors ${
                    item.met ? 'text-emerald-800' : 'text-brand-ink-600 hover:bg-brand-blue-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.met ? <CheckCircle size={14} className="text-emerald-600" /> : <div className="h-3.5 w-3.5 rounded-full border border-brand-ink-300" />}
                    {item.label}
                  </span>
                  <span className="text-[10px] text-brand-ink-400">+{item.weight}%</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5 text-center">
            <div className="h-16 w-16 rounded-full bg-brand-blue-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
              {avatarInitials}
            </div>
            <h4 className="font-bold text-brand-ink-900 text-sm">{formData.name || 'Student'}</h4>
            <p className="text-xs text-brand-ink-500 mb-3">{formData.degree || 'Degree'} · {formData.college || 'College'}</p>
            <Button
              variant="primary"
              icon={saving ? CheckCircle : Save}
              onClick={handleSave}
              disabled={saving}
              className="w-full text-xs py-2"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </Card>
        </div>
      </div>

      {/* MODAL: Clean Printable ATS Resume */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl my-6 rounded-2xl border border-brand-ink-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-ink-100">
              <h3 className="font-display font-bold text-brand-ink-900 text-base">Resume Preview</h3>
              <div className="flex items-center gap-2">
                <Button variant="primary" icon={Printer} onClick={() => window.print()} className="text-xs py-1 px-3">
                  Print / Save PDF
                </Button>
                <button onClick={() => setShowResumeModal(false)} className="p-1 text-brand-ink-400 hover:bg-brand-ink-100 rounded-lg">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="my-4 p-5 rounded-lg border border-brand-ink-200 bg-white text-brand-ink-900 space-y-4 text-xs">
              <div className="text-center border-b border-brand-ink-100 pb-3">
                <h2 className="text-xl font-bold">{formData.name || 'Candidate Name'}</h2>
                <p className="text-brand-ink-600 mt-0.5">{formData.headline}</p>
                <p className="text-brand-ink-500 text-[11px] mt-1">{formData.email} • {formData.location}</p>
              </div>

              {formData.bio && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[11px] border-b border-brand-ink-100 pb-1 mb-1">Summary</h4>
                  <p className="text-brand-ink-700 leading-relaxed">{formData.bio}</p>
                </div>
              )}

              <div>
                <h4 className="font-bold uppercase tracking-wider text-[11px] border-b border-brand-ink-100 pb-1 mb-1">Education</h4>
                <p className="font-semibold">{formData.college}</p>
                <p className="text-brand-ink-600">{formData.degree} {formData.branch ? `in ${formData.branch}` : ''} {formData.year ? `(${formData.year})` : ''}</p>
              </div>

              {formData.skills.length > 0 && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[11px] border-b border-brand-ink-100 pb-1 mb-1">Skills</h4>
                  <p className="text-brand-ink-700">{formData.skills.map((s) => s.name).join(' • ')}</p>
                </div>
              )}

              {formData.projects.length > 0 && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[11px] border-b border-brand-ink-100 pb-1 mb-1">Projects</h4>
                  <div className="space-y-2">
                    {formData.projects.map((proj) => (
                      <div key={proj.id}>
                        <p className="font-semibold">{proj.title} {proj.tags?.length > 0 && <span className="font-normal text-brand-ink-500">({proj.tags.join(', ')})</span>}</p>
                        <p className="text-brand-ink-600">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
