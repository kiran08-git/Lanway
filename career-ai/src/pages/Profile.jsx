import { useState, useEffect } from 'react';
import { GraduationCap, MapPin, Mail, Save, Plus, X, Award, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';

const INTEREST_OPTIONS = ['Technology', 'Design', 'Business', 'Government', 'Healthcare', 'Problem Solving', 'Writing', 'Teaching'];

export default function Profile() {
  const { profile, updateProfile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    degree: '',
    branch: '',
    year: '',
    skills: [],
    interests: [],
    careerGoal: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        college: profile.college || '',
        degree: profile.degree || '',
        branch: profile.branch || '',
        year: profile.year || '',
        skills: profile.skills || [],
        interests: profile.interests || [],
        careerGoal: profile.career_goal || '',
      });
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
      }));
    }
  }, [profile, user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
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

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('Full name is required');
      }

      await updateProfile({
        name: formData.name,
        college: formData.college,
        degree: formData.degree,
        branch: formData.branch,
        year: formData.year,
        skills: formData.skills,
        interests: formData.interests,
        career_goal: formData.careerGoal,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
      console.error('Profile save error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    const total = 8;

    if (formData.name) completed++;
    if (formData.email) completed++;
    if (formData.college) completed++;
    if (formData.degree) completed++;
    if (formData.branch) completed++;
    if (formData.year) completed++;
    if (formData.skills.length > 0) completed++;
    if (formData.interests.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateCompletion();
  const avatarInitials = formData.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <DashboardLayout title="Profile" subtitle="Keep your details up to date for sharper recommendations">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8">
            <h3 className="font-display font-bold text-brand-ink-900 mb-6">Basic information</h3>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  id="name"
                  label="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />
                <Input
                  id="email"
                  type="email"
                  label="Email address"
                  icon={Mail}
                  value={formData.email}
                  disabled
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  id="college"
                  label="College / Institution"
                  icon={GraduationCap}
                  placeholder="e.g., IIT Delhi"
                  value={formData.college}
                  onChange={handleChange}
                  disabled={saving}
                />
                <Input
                  id="degree"
                  label="Degree"
                  placeholder="e.g., B.Tech"
                  value={formData.degree}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  id="branch"
                  label="Branch / Stream"
                  placeholder="e.g., Computer Science"
                  value={formData.branch}
                  onChange={handleChange}
                  disabled={saving}
                />
                <Input
                  id="year"
                  label="Year of study"
                  placeholder="e.g., 2nd Year"
                  value={formData.year}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
              <Input
                id="careerGoal"
                label="Career Goal"
                placeholder="e.g., Become a Full-Stack Developer"
                value={formData.careerGoal}
                onChange={handleChange}
                disabled={saving}
              />

              <Button
                type="submit"
                variant="primary"
                icon={saved ? CheckCircle : Save}
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save changes'}
              </Button>
            </form>
          </Card>

          <Card className="p-6 sm:p-8">
            <h3 className="font-display font-bold text-brand-ink-900 mb-1.5">Your skills</h3>
            <p className="text-sm text-brand-ink-500 mb-5">Add skills you already have — even basic ones count.</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {formData.skills.map((skill) => (
                <span key={skill} className="badge bg-brand-blue-50 text-brand-blue-700 pr-2">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-600"
                    aria-label={`Remove ${skill}`}
                    disabled={saving}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={addSkill} className="flex gap-2">
              <Input
                id="skillInput"
                placeholder="e.g. Public speaking"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1"
                disabled={saving}
              />
              <Button type="submit" variant="secondary" icon={Plus} disabled={saving}>
                Add
              </Button>
            </form>
          </Card>

          <Card className="p-6 sm:p-8">
            <h3 className="font-display font-bold text-brand-ink-900 mb-1.5">Areas of interest</h3>
            <p className="text-sm text-brand-ink-500 mb-5">Select all that genuinely interest you.</p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const active = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    disabled={saving}
                    className={`badge transition-all disabled:opacity-50 ${active
                        ? 'bg-brand-purple-600 text-white'
                        : 'bg-brand-ink-100 text-brand-ink-600 hover:bg-brand-ink-200'
                      }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card className="p-6 text-center">
            <div className="h-20 w-20 rounded-full bg-brand-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {avatarInitials || 'U'}
            </div>
            <p className="font-display font-bold text-brand-ink-900">{formData.name || 'Student'}</p>
            <p className="text-sm text-brand-ink-500 mb-4">{formData.degree || 'Course'}</p>
            <Badge color="blue">Active</Badge>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-bold text-brand-ink-900 mb-4">Profile strength</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-brand-ink-500">Completion</span>
              <span className="text-sm font-semibold text-brand-ink-900">{profileCompletion}%</span>
            </div>
            <ProgressBar value={profileCompletion} color="mixed" className="mb-4" />
            <ul className="space-y-2 text-sm text-brand-ink-600">
              {profileCompletion < 100 && (
                <>
                  {!formData.college && <li className="flex items-center gap-2"><Award size={14} className="text-brand-blue-600" /> Add your college</li>}
                  {!formData.degree && <li className="flex items-center gap-2"><Award size={14} className="text-brand-blue-600" /> Add your degree</li>}
                  {formData.skills.length === 0 && <li className="flex items-center gap-2"><Award size={14} className="text-brand-blue-600" /> Add some skills</li>}
                  {formData.interests.length === 0 && <li className="flex items-center gap-2"><Award size={14} className="text-brand-blue-600" /> Select interests</li>}
                </>
              )}
              {profileCompletion === 100 && (
                <li className="flex items-center gap-2 text-brand-blue-600"><CheckCircle size={14} /> Profile complete!</li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
