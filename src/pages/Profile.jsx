import { useState } from 'react';
import { GraduationCap, MapPin, Mail, Save, Plus, X, Award } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { currentUser } from '../data/mockData';

const INITIAL_SKILLS = ['HTML/CSS', 'MS Excel', 'Basic Python', 'Communication'];
const INITIAL_INTERESTS = ['Technology', 'Design', 'Problem Solving'];

export default function Profile() {
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [interests, setInterests] = useState(INITIAL_INTERESTS);
  const [skillInput, setSkillInput] = useState('');
  const [saved, setSaved] = useState(false);

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const toggleInterest = (interest) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const INTEREST_OPTIONS = ['Technology', 'Design', 'Business', 'Government', 'Healthcare', 'Problem Solving', 'Writing', 'Teaching'];

  return (
    <DashboardLayout title="Profile" subtitle="Keep your details up to date for sharper recommendations">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8">
            <h3 className="font-display font-bold text-brand-ink-900 mb-6">Basic information</h3>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input id="fullName" label="Full name" defaultValue={currentUser.name} />
                <Input id="email" type="email" label="Email address" icon={Mail} defaultValue={currentUser.email} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input id="college" label="College / Institution" icon={GraduationCap} defaultValue={currentUser.college} />
                <Input id="course" label="Course" defaultValue={currentUser.course} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input id="year" label="Year of study" defaultValue={currentUser.year} />
                <Input id="city" label="City" icon={MapPin} defaultValue={currentUser.city} />
              </div>

              <Button type="submit" variant="primary" icon={saved ? undefined : Save} className="w-full sm:w-auto">
                {saved ? 'Saved ✓' : 'Save changes'}
              </Button>
            </form>
          </Card>

          <Card className="p-6 sm:p-8">
            <h3 className="font-display font-bold text-brand-ink-900 mb-1.5">Your skills</h3>
            <p className="text-sm text-brand-ink-500 mb-5">Add skills you already have — even basic ones count.</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {skills.map((skill) => (
                <span key={skill} className="badge bg-brand-blue-50 text-brand-blue-700 pr-2">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-600" aria-label={`Remove ${skill}`}>
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
              />
              <Button type="submit" variant="secondary" icon={Plus}>
                Add
              </Button>
            </form>
          </Card>

          <Card className="p-6 sm:p-8">
            <h3 className="font-display font-bold text-brand-ink-900 mb-1.5">Areas of interest</h3>
            <p className="text-sm text-brand-ink-500 mb-5">Select all that genuinely interest you.</p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const active = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`badge transition-all ${
                      active
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
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-brand-blue-500 to-brand-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {currentUser.avatarInitials}
            </div>
            <p className="font-display font-bold text-brand-ink-900">{currentUser.name}</p>
            <p className="text-sm text-brand-ink-500 mb-4">{currentUser.course}</p>
            <Badge color="blue">{currentUser.tier} Student</Badge>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-bold text-brand-ink-900 mb-4">Profile strength</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-brand-ink-500">Completion</span>
              <span className="text-sm font-semibold text-brand-ink-900">{currentUser.profileCompletion}%</span>
            </div>
            <ProgressBar value={currentUser.profileCompletion} color="mixed" className="mb-4" />
            <ul className="space-y-2 text-sm text-brand-ink-600">
              <li className="flex items-center gap-2"><Award size={14} className="text-brand-blue-600" /> Add a profile photo</li>
              <li className="flex items-center gap-2"><Award size={14} className="text-brand-blue-600" /> Link a portfolio or GitHub</li>
              <li className="flex items-center gap-2"><Award size={14} className="text-brand-blue-600" /> Complete interest assessment</li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
