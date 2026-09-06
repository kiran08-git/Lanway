import { useState } from 'react';
import {
  Play,
  Bookmark,
  CheckCircle2,
  Clock,
  Star,
  ExternalLink,
  Trash2,
  Edit2,
  Sparkles,
  Tv,
  Globe,
} from 'lucide-react';
import YoutubeIcon from '../ui/YoutubeIcon';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { CATEGORY_INFO } from '../../data/careerDatabase';

const LEVEL_COLORS = {
  Beginner: 'green',
  Intermediate: 'blue',
  Advanced: 'purple',
  'All Levels': 'cyan',
};

export default function CourseCard({
  course,
  isBookmarked,
  isCompleted,
  onPlay,
  onToggleBookmark,
  onToggleCompleted,
  onEdit,
  onDelete,
}) {
  const [imgSrc, setImgSrc] = useState(
    course.thumbnail || `https://img.youtube.com/vi/${course.youtubeId}/hqdefault.jpg`
  );

  const categoryMeta = CATEGORY_INFO[course.category] || {
    name: course.category,
    color: 'blue',
  };

  const handleImageError = () => {
    // Fallback hierarchy if maxresdefault is unavailable
    if (course.youtubeId && !imgSrc.includes('hqdefault')) {
      setImgSrc(`https://img.youtube.com/vi/${course.youtubeId}/hqdefault.jpg`);
    } else {
      setImgSrc('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80');
    }
  };

  return (
    <Card
      hover
      className={`flex flex-col h-full overflow-hidden transition-all duration-300 border ${
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/10'
          : 'border-brand-ink-100 hover:border-brand-blue-300 hover:shadow-glow'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden group cursor-pointer" onClick={() => onPlay(course)}>
        <img
          src={imgSrc}
          alt={course.title}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Dark overlay with Play button on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity flex items-center justify-center">
          <div className="h-13 w-13 sm:h-14 sm:w-14 rounded-full bg-brand-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-blue-500 transition-all duration-300 backdrop-blur-xs">
            <Play size={24} className="ml-1 fill-white" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="flex items-center gap-1 text-[11px] font-semibold bg-red-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full shadow-sm">
            <YoutubeIcon size={13} className="text-white" /> Free
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {course.isUploaded && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-600/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full">
                Custom Upload
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(course.id);
              }}
              aria-label="Bookmark course"
              className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                isBookmarked
                  ? 'bg-brand-purple-600 text-white shadow-md'
                  : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white'
              }`}
            >
              <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Bottom Duration Badge */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[11px] font-medium bg-black/75 backdrop-blur-md text-white px-2 py-0.5 rounded-md">
          <Clock size={12} /> {course.duration}
        </div>

        {/* Completed Badge Indicator */}
        {isCompleted && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[11px] font-semibold bg-emerald-600/90 text-white px-2 py-0.5 rounded-md">
            <CheckCircle2 size={13} /> Completed
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category & Level Pills */}
        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
          <Badge color={categoryMeta.color || 'blue'}>
            {categoryMeta.name}
          </Badge>
          <span className="text-[11px] font-semibold text-brand-ink-500 bg-brand-ink-100 px-2.5 py-0.5 rounded-full">
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onPlay(course)}
          className="font-display font-bold text-base text-brand-ink-900 line-clamp-2 hover:text-brand-blue-600 transition-colors cursor-pointer mb-2 leading-snug"
          title={course.title}
        >
          {course.title}
        </h3>

        {/* Channel & Language */}
        <div className="flex items-center justify-between text-xs text-brand-ink-500 mb-3 pb-3 border-b border-brand-ink-100">
          <div className="flex items-center gap-1.5 font-medium text-brand-ink-700 truncate max-w-[65%]">
            <Tv size={14} className="text-brand-ink-400 shrink-0" />
            <span className="truncate">{course.channel}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500 font-semibold shrink-0">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-brand-ink-400 font-normal">({course.reviewsCount.toLocaleString()})</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-brand-ink-500 line-clamp-2 mb-3.5 leading-relaxed">
          {course.description}
        </p>

        {/* Career Match Pill */}
        {course.careerMatch && (
          <div className="mb-3.5 flex items-center gap-1.5 text-[11px] font-medium text-brand-purple-700 bg-brand-purple-50/80 px-2.5 py-1 rounded-lg border border-brand-purple-100/70">
            <Sparkles size={13} className="shrink-0 text-brand-purple-500" />
            <span className="truncate">For: {course.careerMatch}</span>
          </div>
        )}

        {/* Topics Tags */}
        {course.topics && course.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4 mt-auto">
            {course.topics.slice(0, 3).map((topic, i) => (
              <span
                key={i}
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-brand-ink-50 text-brand-ink-600 border border-brand-ink-100"
              >
                {topic}
              </span>
            ))}
            {course.topics.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-ink-50 text-brand-ink-400">
                +{course.topics.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-ink-100 mt-auto">
          {/* Complete Toggle */}
          <button
            onClick={() => onToggleCompleted(course.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              isCompleted
                ? 'text-emerald-600 hover:text-emerald-700'
                : 'text-brand-ink-400 hover:text-emerald-600'
            }`}
          >
            <CheckCircle2 size={16} className={isCompleted ? 'fill-emerald-100' : ''} />
            <span>{isCompleted ? 'Finished' : 'Mark done'}</span>
          </button>

          {/* Right action group */}
          <div className="flex items-center gap-2">
            {course.isUploaded && (
              <>
                <button
                  onClick={() => onEdit(course)}
                  aria-label="Edit course"
                  className="p-1.5 text-brand-ink-400 hover:text-brand-blue-600 hover:bg-brand-blue-50 rounded-lg transition-colors"
                  title="Edit uploaded course"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  aria-label="Delete course"
                  className="p-1.5 text-brand-ink-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete uploaded course"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}

            <button
              onClick={() => onPlay(course)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-blue-600 text-white text-xs font-semibold hover:bg-brand-blue-700 shadow-sm transition-all hover:gap-1.5"
            >
              <span>Watch</span>
              <Play size={12} className="fill-white" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
