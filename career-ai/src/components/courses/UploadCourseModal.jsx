import { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Play,
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  BookOpen,
} from 'lucide-react';
import YoutubeIcon from '../ui/YoutubeIcon';
import { CATEGORY_INFO } from '../../data/careerDatabase';
import { extractYouTubeId, getYouTubeThumbnail } from '../../lib/courseService';
import Button from '../ui/Button';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const LANGUAGES = ['English', 'Hindi', 'Hinglish', 'Spanish', 'Other'];

export default function UploadCourseModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    youtubeId: '',
    channel: '',
    category: 'SW',
    level: 'Beginner',
    duration: '2h 30m',
    language: 'English',
    description: '',
    topics: '',
    careerMatch: '',
  });

  const [parsedId, setParsedId] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        url: initialData.url || (initialData.youtubeId ? `https://www.youtube.com/watch?v=${initialData.youtubeId}` : ''),
        youtubeId: initialData.youtubeId || '',
        channel: initialData.channel || '',
        category: initialData.category || 'SW',
        level: initialData.level || 'Beginner',
        duration: initialData.duration || '2h 30m',
        language: initialData.language || 'English',
        description: initialData.description || '',
        topics: Array.isArray(initialData.topics) ? initialData.topics.join(', ') : (initialData.topics || ''),
        careerMatch: initialData.careerMatch || '',
      });
      if (initialData.youtubeId) {
        setParsedId(initialData.youtubeId);
        setThumbnailPreview(getYouTubeThumbnail(initialData.youtubeId));
      }
    } else {
      setFormData({
        title: '',
        url: '',
        youtubeId: '',
        channel: '',
        category: 'SW',
        level: 'Beginner',
        duration: '2h 30m',
        language: 'English',
        description: '',
        topics: '',
        careerMatch: '',
      });
      setParsedId('');
      setThumbnailPreview('');
    }
    setError('');
  }, [initialData, isOpen]);

  // Handle URL change & live parse YouTube ID
  const handleUrlChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, url: val }));
    const id = extractYouTubeId(val);
    setParsedId(id);
    if (id) {
      setThumbnailPreview(getYouTubeThumbnail(id));
      setError('');
    } else if (val.trim()) {
      setThumbnailPreview('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a course title.');
      return;
    }

    const videoId = parsedId || extractYouTubeId(formData.url);
    if (!videoId) {
      setError('Please provide a valid YouTube Video Link (e.g., https://www.youtube.com/watch?v=...) or Video ID.');
      return;
    }

    if (!formData.channel.trim()) {
      setError('Please specify the YouTube Channel or Instructor name.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        youtubeId: videoId,
        thumbnail: thumbnailPreview || getYouTubeThumbnail(videoId),
        topics: formData.topics
          ? formData.topics.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };

      onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save course.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 border border-brand-ink-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-ink-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-500 to-brand-purple-600 flex items-center justify-center text-white shadow-soft">
              <YoutubeIcon size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-brand-ink-900">
                {initialData ? 'Edit YouTube Course' : 'Upload / Add YouTube Course'}
              </h2>
              <p className="text-xs text-brand-ink-500">
                Share free educational courses by category for learners
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-brand-ink-400 hover:text-brand-ink-800 hover:bg-brand-ink-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* YouTube URL Input & Live Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-1.5">
              YouTube Video URL or Video ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.url}
                onChange={handleUrlChange}
                placeholder="https://www.youtube.com/watch?v=nu_pCVPKzTk or youtu.be/..."
                className="input-field pr-10"
                required
              />
              <div className="absolute right-3 top-2.5 text-brand-ink-400">
                <YoutubeIcon size={20} />
              </div>
            </div>
            <p className="text-[11px] text-brand-ink-400 mt-1">
              Paste standard YouTube link, short link, or 11-digit video code.
            </p>

            {/* Live Video Preview Card */}
            {parsedId && (
              <div className="mt-3 p-3 rounded-xl bg-brand-ink-50 border border-brand-ink-200 flex items-center gap-3 animate-fade-in">
                <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-black shrink-0 shadow-xs">
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://img.youtube.com/vi/${parsedId}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play size={16} className="fill-white text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Valid YouTube Video ID
                  </div>
                  <code className="text-[11px] text-brand-ink-600 font-mono block truncate">
                    ID: {parsedId}
                  </code>
                </div>
              </div>
            )}
          </div>

          {/* Course Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-1.5">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Modern Full-Stack Web Development Masterclass 2025"
              className="input-field"
              required
            />
          </div>

          {/* Channel & Language */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-1.5">
                Channel / Instructor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                placeholder="e.g. freeCodeCamp.org / CS50"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-1.5">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="input-field"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category, Level & Duration */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                {Object.entries(CATEGORY_INFO).map(([code, info]) => (
                  <option key={code} value={code}>
                    {info.name} ({code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-1.5">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="input-field"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-1.5">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 6h 30m"
                className="input-field"
              />
            </div>
          </div>

          {/* Target Career / Role */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-1.5">
              Recommended for Career / Role
            </label>
            <input
              type="text"
              value={formData.careerMatch}
              onChange={(e) => setFormData({ ...formData, careerMatch: e.target.value })}
              placeholder="e.g. Frontend Developer / UI/UX Designer"
              className="input-field"
            />
          </div>

          {/* Topics / Syllabus Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-1.5">
              Key Topics / Syllabus (Comma-separated)
            </label>
            <input
              type="text"
              value={formData.topics}
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
              placeholder="e.g. React 19, Tailwind CSS, API Integration, State Management"
              className="input-field"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink-700 mb-1.5">
              Description & Highlights
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary of what students will learn in this video course..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-brand-ink-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              <Upload size={16} />
              {initialData ? 'Update Course' : 'Save & Publish Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
