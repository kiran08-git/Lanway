import { useState, useEffect } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  Share2,
  Clock,
  Star,
  Tv,
  Check,
  FileText,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  getYouTubeEmbedUrl,
  getCourseNotes,
  saveCourseNote,
} from '../../lib/courseService';
import { CATEGORY_INFO } from '../../data/careerDatabase';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function CoursePlayerModal({
  course,
  isOpen,
  onClose,
  isBookmarked,
  isCompleted,
  onToggleBookmark,
  onToggleCompleted,
}) {
  const [activeTab, setActiveTab] = useState('topics'); // 'topics' | 'notes'
  const [notes, setNotes] = useState('');
  const [savedNoteSuccess, setSavedNoteSuccess] = useState(false);
  const [completedSubTopics, setCompletedSubTopics] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (course && isOpen) {
      setNotes(getCourseNotes(course.id));
      try {
        const saved = localStorage.getItem(`course_topics_${course.id}`);
        setCompletedSubTopics(saved ? JSON.parse(saved) : {});
      } catch {
        setCompletedSubTopics({});
      }
    }
  }, [course, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  const categoryMeta = CATEGORY_INFO[course.category] || {
    name: course.category,
    color: 'blue',
  };

  const handleSaveNotes = () => {
    saveCourseNote(course.id, notes);
    setSavedNoteSuccess(true);
    setTimeout(() => setSavedNoteSuccess(false), 2500);
  };

  const toggleSubTopic = (idx) => {
    const next = { ...completedSubTopics, [idx]: !completedSubTopics[idx] };
    setCompletedSubTopics(next);
    try {
      localStorage.setItem(`course_topics_${course.id}`, JSON.stringify(next));
    } catch (e) {
      console.warn('Could not save topic state:', e);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(course.url || `https://www.youtube.com/watch?v=${course.youtubeId}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const completedTopicsCount = Object.values(completedSubTopics).filter(Boolean).length;
  const totalTopicsCount = course.topics?.length || 1;
  const progressPercent = Math.min(
    100,
    Math.round((completedTopicsCount / totalTopicsCount) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 border border-brand-ink-200/80">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-brand-ink-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <Badge color={categoryMeta.color || 'blue'}>{categoryMeta.name}</Badge>
            <span className="text-xs text-brand-ink-400 font-medium hidden sm:inline">•</span>
            <span className="text-xs text-brand-ink-600 font-medium truncate max-w-[280px] sm:max-w-md">
              {course.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleBookmark(course.id)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isBookmarked
                  ? 'border-brand-purple-300 bg-brand-purple-50 text-brand-purple-700'
                  : 'border-brand-ink-200 text-brand-ink-600 hover:bg-brand-ink-50'
              }`}
              title="Bookmark Course"
            >
              <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
              <span className="hidden md:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-brand-ink-200 text-brand-ink-600 hover:bg-brand-ink-50 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Copy YouTube Link"
            >
              {copiedLink ? <Check size={15} className="text-emerald-600" /> : <Share2 size={15} />}
              <span className="hidden md:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <a
              href={course.url || `https://www.youtube.com/watch?v=${course.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-brand-ink-200 text-brand-ink-600 hover:bg-brand-ink-50 hover:text-brand-blue-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Open directly in YouTube"
            >
              <ExternalLink size={15} />
              <span className="hidden md:inline">YouTube</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-brand-ink-400 hover:text-brand-ink-800 hover:bg-brand-ink-100 transition-colors ml-1"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 flex flex-col">
          {/* 16:9 Video Player Container */}
          <div className="w-full bg-black aspect-video max-h-[52vh] sm:max-h-[58vh] flex items-center justify-center relative shadow-inner">
            <iframe
              src={getYouTubeEmbedUrl(course.youtubeId, true)}
              title={course.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Details & Controls Grid */}
          <div className="p-5 sm:p-7 grid lg:grid-cols-3 gap-6 bg-brand-ink-50/30 flex-1">
            {/* Left 2 Cols: Info & Overview */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge color={categoryMeta.color || 'blue'}>{categoryMeta.name}</Badge>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-ink-100 text-brand-ink-600 font-semibold">
                    {course.level}
                  </span>
                  <span className="text-xs flex items-center gap-1 text-brand-ink-500 font-medium">
                    <Clock size={13} /> {course.duration}
                  </span>
                  <span className="text-xs flex items-center gap-1 text-amber-500 font-semibold">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    {course.rating.toFixed(1)} ({course.reviewsCount?.toLocaleString()} reviews)
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-ink-900 leading-snug">
                  {course.title}
                </h2>

                <div className="flex items-center gap-3 mt-2 text-sm text-brand-ink-600">
                  <div className="flex items-center gap-1.5 font-medium text-brand-ink-800">
                    <Tv size={16} className="text-brand-ink-400" />
                    <span>{course.channel}</span>
                  </div>
                  <span>•</span>
                  <span>Language: {course.language}</span>
                </div>
              </div>

              {/* Career Matching Banner */}
              {course.careerMatch && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 border border-brand-purple-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-brand-purple-600 text-white flex items-center justify-center shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-purple-900">
                        Recommended for Career Path
                      </p>
                      <p className="text-xs text-brand-purple-700 font-medium">
                        {course.careerMatch}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-brand-ink-900 uppercase tracking-wider mb-2">
                  About this Course
                </h3>
                <p className="text-sm text-brand-ink-600 leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </div>

              {/* Topics Checklist */}
              {course.topics && course.topics.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-brand-ink-900 uppercase tracking-wider">
                      Course Curriculum & Key Concepts ({completedTopicsCount}/{totalTopicsCount})
                    </h3>
                    <span className="text-xs font-semibold text-brand-blue-600">
                      {progressPercent}% completed
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-brand-ink-100 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-brand-blue-500 to-brand-purple-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2">
                    {course.topics.map((topic, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleSubTopic(idx)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs transition-all ${
                          completedSubTopics[idx]
                            ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900 font-medium'
                            : 'border-brand-ink-100 bg-white hover:border-brand-blue-200 text-brand-ink-700'
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                            completedSubTopics[idx]
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-brand-ink-300 bg-white'
                          }`}
                        >
                          {completedSubTopics[idx] && <Check size={11} />}
                        </div>
                        <span className={completedSubTopics[idx] ? 'line-through opacity-80' : ''}>
                          {topic}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Interactive Actions & Study Notepad */}
            <div className="space-y-5">
              {/* Completion Card */}
              <div className="bg-white rounded-2xl p-5 border border-brand-ink-100 shadow-soft flex flex-col gap-3.5">
                <h4 className="font-display font-bold text-sm text-brand-ink-900">
                  Learning Progress
                </h4>

                <button
                  onClick={() => onToggleCompleted(course.id)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-soft'
                      : 'bg-white border-2 border-brand-blue-600 text-brand-blue-600 hover:bg-brand-blue-50'
                  }`}
                >
                  <CheckCircle2 size={18} />
                  <span>{isCompleted ? 'Completed! 🎉' : 'Mark Course as Completed'}</span>
                </button>

                <p className="text-center text-[11px] text-brand-ink-400">
                  {isCompleted
                    ? 'Great job! This course is marked as finished on your dashboard.'
                    : 'Track your milestones and build your portfolio profile.'}
                </p>
              </div>

              {/* Personal Notes Box */}
              <div className="bg-white rounded-2xl p-5 border border-brand-ink-100 shadow-soft flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="font-display font-bold text-sm text-brand-ink-900 flex items-center gap-1.5">
                    <FileText size={16} className="text-brand-purple-600" />
                    Study Notes
                  </h4>
                  {savedNoteSuccess && (
                    <span className="text-[11px] font-semibold text-emerald-600 animate-fade-in flex items-center gap-1">
                      <Check size={12} /> Saved!
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-brand-ink-400 mb-2">
                  Take personal timestamped notes, code snippets, or key concepts while watching.
                </p>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. at 12:45 - Key architectural pattern explanation...&#10;Useful library mentioned: https://..."
                  rows={6}
                  className="w-full rounded-xl border border-brand-ink-200 bg-brand-ink-50/50 p-3 text-xs text-brand-ink-800 placeholder:text-brand-ink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple-400 focus:border-transparent transition-all resize-none"
                />

                <div className="mt-3 flex justify-end">
                  <Button variant="primary" size="sm" onClick={handleSaveNotes}>
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
