import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, FileText, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import CompanyLayout from '../../components/layout/CompanyLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function CreateAssessment() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    role: '',
    description: '',
    required_skills: '',
    duration_minutes: 60,
    difficulty_level: 'Medium',
    passing_score: 50
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (status = 'Draft') => {
    setLoading(true);
    setError('');
    try {
      if (!formData.title || !formData.role) {
        throw new Error('Title and Role are required.');
      }

      const skillsArray = formData.required_skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const { data, error: insertError } = await supabase
        .from('company_assessments')
        .insert({
          company_id: profile.id,
          title: formData.title,
          role: formData.role,
          description: formData.description,
          required_skills: skillsArray,
          duration_minutes: parseInt(formData.duration_minutes, 10),
          difficulty_level: formData.difficulty_level,
          passing_score: parseInt(formData.passing_score, 10),
          status: 'Draft' // Always start as Draft to allow adding questions
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      // Navigate to the question builder
      navigate(`/company-assessments/${data.id}/build`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CompanyLayout title="Create Assessment" subtitle="Configure a new hiring test">
      <div className="max-w-3xl mx-auto mb-6">
        <button 
          onClick={() => navigate('/company-dashboard')}
          className="flex items-center gap-2 text-sm text-brand-ink-500 hover:text-brand-ink-800 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-ink-100">
              <FileText className="text-brand-blue-600" size={24} />
              <h2 className="text-xl font-display font-bold text-brand-ink-900">Basic Details</h2>
            </div>
            
            <div className="space-y-5">
              <Input
                id="title"
                name="title"
                label="Assessment Title"
                placeholder="e.g. Senior Frontend Developer Test"
                required
                value={formData.title}
                onChange={handleChange}
              />
              <Input
                id="role"
                name="role"
                label="Job Role"
                placeholder="e.g. Frontend Developer"
                required
                value={formData.role}
                onChange={handleChange}
              />
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-brand-ink-900 mb-1.5">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full rounded-xl border border-brand-ink-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-blue-500 focus:ring-1 focus:ring-brand-blue-500 transition-shadow resize-y"
                  placeholder="Describe the assessment and its goals..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <Input
                id="required_skills"
                name="required_skills"
                label="Required Skills (comma separated)"
                placeholder="React, JavaScript, CSS"
                value={formData.required_skills}
                onChange={handleChange}
              />
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-ink-100">
              <SettingsIcon className="text-brand-purple-600" size={24} />
              <h2 className="text-xl font-display font-bold text-brand-ink-900">Test Configuration</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                label="Duration (minutes)"
                min="10"
                max="180"
                value={formData.duration_minutes}
                onChange={handleChange}
              />
              <div>
                <label htmlFor="difficulty_level" className="block text-sm font-semibold text-brand-ink-900 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  id="difficulty_level"
                  name="difficulty_level"
                  className="w-full rounded-xl border border-brand-ink-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-blue-500 focus:ring-1 focus:ring-brand-blue-500 transition-shadow bg-white"
                  value={formData.difficulty_level}
                  onChange={handleChange}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <Input
                id="passing_score"
                name="passing_score"
                type="number"
                label="Passing Score (%)"
                min="1"
                max="100"
                value={formData.passing_score}
                onChange={handleChange}
              />
            </div>
          </Card>

          <div className="flex justify-end pt-4">
            <Button 
              variant="primary" 
              icon={ArrowRight} 
              iconPosition="right"
              onClick={() => handleSave()} 
              loading={loading}
            >
              Save & Add Questions
            </Button>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
