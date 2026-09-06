import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Play,
  GraduationCap,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  BookOpen,
  Filter,
  X,
} from 'lucide-react';
import YoutubeIcon from '../components/ui/YoutubeIcon';
import DashboardLayout from '../components/layout/DashboardLayout';
import CourseCard from '../components/courses/CourseCard';
import CoursePlayerModal from '../components/courses/CoursePlayerModal';
import UploadCourseModal from '../components/courses/UploadCourseModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { CATEGORY_INFO } from '../data/careerDatabase';
import { useAuth } from '../contexts/AuthContext';
import { getLatestCareerRecommendations } from '../lib/careerService';
import {
  getAllCourses,
  addUploadedCourse,
  updateUploadedCourse,
  deleteUploadedCourse,
  getBookmarkedCourseIds,
  toggleCourseBookmark,
  getCompletedCourseIds,
  toggleCourseCompleted,
  getCategoriesWithCounts,
} from '../lib/courseService';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS = [
  { label: 'Featured First', value: 'featured' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Reviews', value: 'popular' },
  { label: 'Newest Added', value: 'newest' },
];

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [courses, setCourses] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [aiData, setAiData] = useState(null);

  // Filters & Tabs
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'ALL');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all'); // 'all' | 'ai' | 'saved' | 'completed' | 'uploaded'
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Modals
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // 1. Initial Load
  useEffect(() => {
    refreshCourses();
    setBookmarkedIds(getBookmarkedCourseIds());
    setCompletedIds(getCompletedCourseIds());

    // Check if URL specifies upload modal
    if (searchParams.get('upload') === 'true') {
      setIsUploadOpen(true);
    }
  }, []);

  // 2. Fetch AI Recommendations for personalized matches
  useEffect(() => {
    async function loadAI() {
      try {
        const res = await getLatestCareerRecommendations(user?.id);
        if (res) setAiData(res);
      } catch (err) {
        console.warn('Could not fetch AI recommendations for courses:', err);
      }
    }
    loadAI();
  }, [user]);

  // Sync category & search from URL params if they change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
    const search = searchParams.get('search');
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const refreshCourses = () => {
    setCourses(getAllCourses());
  };

  // Top AI matched category
  const topAICategory = useMemo(() => {
    if (aiData?.categoryRankings && aiData.categoryRankings.length > 0) {
      return aiData.categoryRankings[0].category;
    }
    if (aiData?.careers && aiData.careers.length > 0) {
      return aiData.careers[0].primaryCategory || 'SW';
    }
    return 'SW';
  }, [aiData]);

  // Category counts
  const categoryList = useMemo(() => {
    return getCategoriesWithCounts(courses);
  }, [courses]);

  // Handle Handlers
  const handlePlayCourse = (course) => {
    setSelectedCourse(course);
    setIsPlayerOpen(true);
  };

  const handleToggleBookmark = (id) => {
    const updated = toggleCourseBookmark(id);
    setBookmarkedIds(updated);
  };

  const handleToggleCompleted = (id) => {
    const updated = toggleCourseCompleted(id);
    setCompletedIds(updated);
  };

  const handleOpenUpload = () => {
    setEditingCourse(null);
    setIsUploadOpen(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setIsUploadOpen(true);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this custom course?')) {
      deleteUploadedCourse(id);
      refreshCourses();
    }
  };

  const handleSaveCourse = (data) => {
    if (editingCourse) {
      updateUploadedCourse(editingCourse.id, data);
    } else {
      addUploadedCourse(data);
    }
    refreshCourses();
  };

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Tab filter
        if (activeTab === 'saved' && !bookmarkedIds.includes(course.id)) return false;
        if (activeTab === 'completed' && !completedIds.includes(course.id)) return false;
        if (activeTab === 'uploaded' && !course.isUploaded) return false;
        if (activeTab === 'ai' && course.category !== topAICategory) return false;

        // Category filter
        if (activeCategory !== 'ALL' && course.category !== activeCategory) return false;

        // Level filter
        if (selectedLevel !== 'All' && course.level !== selectedLevel) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = course.title?.toLowerCase().includes(q);
          const matchChannel = course.channel?.toLowerCase().includes(q);
          const matchDesc = course.description?.toLowerCase().includes(q);
          const matchTopics = course.topics?.some((t) => t.toLowerCase().includes(q));
          const matchCareer = course.careerMatch?.toLowerCase().includes(q);
          if (!matchTitle && !matchChannel && !matchDesc && !matchTopics && !matchCareer) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'popular') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        // Default: featured first, then rating
        if (a.featured === b.featured) return b.rating - a.rating;
        return a.featured ? -1 : 1;
      });
  }, [
    courses,
    activeTab,
    activeCategory,
    selectedLevel,
    searchQuery,
    sortBy,
    bookmarkedIds,
    completedIds,
    topAICategory,
  ]);

  const userUploadedCount = courses.filter((c) => c.isUploaded).length;

  return (
    <DashboardLayout
      title="Free YouTube Courses"
      subtitle="Curated high-quality video courses organized by career domain"
    >
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-blue-600 text-white p-6 sm:p-8 mb-8 shadow-xs">
        {/* Background glow ornaments */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 h-56 w-56 rounded-full bg-brand-purple-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
              <YoutubeIcon size={14} className="text-red-400" />
              100% Free Video Courses & Tutorials
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-2 leading-tight">
              Master High-Demand Skills with Free YouTube Courses
            </h1>

            <p className="text-brand-blue-100 text-sm sm:text-base leading-relaxed">
              Explore university-grade lectures, crash courses, and full masterclasses. Stream directly inside CareerAI, take study notes, and track your completion.
            </p>
          </div>

          {/* Action & Quick Stats */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={handleOpenUpload}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-brand-ink-900 font-display font-bold text-sm shadow-xl hover:bg-brand-blue-50 transition-all hover:scale-102 hover:shadow-2xl"
            >
              <Plus size={18} className="text-brand-purple-600" />
              <span>Upload / Add Course</span>
            </button>

            <div className="flex items-center justify-around gap-4 px-4 py-2 rounded-xl bg-black/20 backdrop-blur-md text-xs">
              <div className="text-center">
                <span className="block font-bold text-base text-white">{courses.length}</span>
                <span className="text-brand-blue-200 text-[10px]">Total Courses</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="text-center">
                <span className="block font-bold text-base text-white">14</span>
                <span className="text-brand-blue-200 text-[10px]">Categories</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="text-center">
                <span className="block font-bold text-base text-white">{completedIds.length}</span>
                <span className="text-brand-blue-200 text-[10px]">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Highlight Box */}
      {aiData && (
        <div className="mb-7 p-4 sm:p-5 rounded-2xl bg-brand-blue-50 border border-brand-blue-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-blue-600 text-white flex items-center justify-center shadow-soft shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm text-brand-ink-900">
                  AI Recommendation for Your Career Match
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-purple-100 text-brand-purple-700">
                  Assessment Match
                </span>
              </div>
              <p className="text-xs text-brand-ink-600 mt-0.5">
                Top match in <strong className="text-brand-purple-900">{CATEGORY_INFO[topAICategory]?.name}</strong> ({aiData.careers?.[0]?.title || 'Career Focus'}).
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveCategory(topAICategory);
              setActiveTab('ai');
            }}
            className="text-xs font-bold text-brand-purple-700 hover:text-brand-purple-900 bg-white px-3.5 py-2 rounded-xl border border-brand-purple-200 hover:border-brand-purple-400 transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <span>View {CATEGORY_INFO[topAICategory]?.name} Courses</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 border-b border-brand-ink-100">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'all'
              ? 'border-brand-blue-600 text-brand-blue-700 bg-brand-blue-50/50'
              : 'border-transparent text-brand-ink-600 hover:text-brand-ink-900'
          }`}
        >
          <BookOpen size={16} />
          <span>All Courses</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-ink-100 text-brand-ink-700">
            {courses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ai'
              ? 'border-brand-purple-600 text-brand-purple-700 bg-brand-purple-50/50'
              : 'border-transparent text-brand-ink-600 hover:text-brand-ink-900'
          }`}
        >
          <Sparkles size={16} className="text-brand-purple-500" />
          <span>AI Matched</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-purple-100 text-brand-purple-700">
            {courses.filter((c) => c.category === topAICategory).length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'saved'
              ? 'border-brand-purple-600 text-brand-purple-700 bg-brand-purple-50/50'
              : 'border-transparent text-brand-ink-600 hover:text-brand-ink-900'
          }`}
        >
          <Bookmark size={16} />
          <span>Saved</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-ink-100 text-brand-ink-700">
            {bookmarkedIds.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'completed'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-brand-ink-600 hover:text-brand-ink-900'
          }`}
        >
          <CheckCircle2 size={16} />
          <span>Completed</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {completedIds.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('uploaded')}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'uploaded'
              ? 'border-brand-blue-600 text-brand-blue-700 bg-brand-blue-50/50'
              : 'border-transparent text-brand-ink-600 hover:text-brand-ink-900'
          }`}
        >
          <YoutubeIcon size={16} className="text-red-500" />
          <span>My Uploads</span>
          {userUploadedCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-blue-100 text-brand-blue-700">
              {userUploadedCount}
            </span>
          )}
        </button>
      </div>

      {/* Category Pills Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-ink-500">
            Filter by Category ({categoryList.length})
          </span>
          {activeCategory !== 'ALL' && (
            <button
              onClick={() => setActiveCategory('ALL')}
              className="text-xs font-semibold text-brand-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Reset Category</span>
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeCategory === 'ALL'
                ? 'bg-brand-ink-900 text-white shadow-soft'
                : 'bg-white border border-brand-ink-200 text-brand-ink-700 hover:border-brand-ink-400'
            }`}
          >
            <span>All Domains</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {courses.length}
            </span>
          </button>

          {categoryList.map((cat) => {
            const isSelected = activeCategory === cat.code;
            return (
              <button
                key={cat.code}
                onClick={() => setActiveCategory(cat.code)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-brand-blue-600 text-white border-brand-blue-600 shadow-soft'
                    : 'bg-white border-brand-ink-200 text-brand-ink-700 hover:border-brand-blue-300'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-brand-ink-100 text-brand-ink-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar & Secondary Filters */}
      <div className="bg-white p-4 rounded-2xl border border-brand-ink-100 shadow-card mb-7 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search size={17} className="absolute left-3.5 top-3 text-brand-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, channel, title (e.g. React, Python, Figma, CS50)..."
            className="input-field pl-10 pr-9 py-2 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-brand-ink-400 hover:text-brand-ink-700"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Level & Sort Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-ink-500 font-medium whitespace-nowrap">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-xl border border-brand-ink-200 bg-white px-3 py-1.5 text-xs text-brand-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-ink-500 font-medium whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-brand-ink-200 bg-white px-3 py-1.5 text-xs text-brand-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isBookmarked={bookmarkedIds.includes(course.id)}
              isCompleted={completedIds.includes(course.id)}
              onPlay={handlePlayCourse}
              onToggleBookmark={handleToggleBookmark}
              onToggleCompleted={handleToggleCompleted}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-3xl border border-brand-ink-100 shadow-soft max-w-lg mx-auto my-6">
          <div className="h-16 w-16 rounded-2xl bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center mx-auto mb-4">
            <YoutubeIcon size={32} />
          </div>
          <h3 className="font-display font-bold text-lg text-brand-ink-900 mb-1">
            No courses found
          </h3>
          <p className="text-xs text-brand-ink-500 mb-5 leading-relaxed">
            {activeTab === 'uploaded'
              ? 'You have not uploaded any YouTube courses yet. Click below to add free courses for your category!'
              : activeTab === 'saved'
              ? 'You have not saved any courses yet. Bookmark courses to build your personal watchlist!'
              : activeTab === 'completed'
              ? 'No completed courses yet. Mark courses finished as you watch and study!'
              : 'Try clearing your search query or selecting another category.'}
          </p>

          <div className="flex items-center justify-center gap-3">
            {(searchQuery || activeCategory !== 'ALL' || selectedLevel !== 'All') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('ALL');
                  setSelectedLevel('All');
                }}
              >
                Clear Filters
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={handleOpenUpload}>
              <Plus size={15} />
              Upload a Course
            </Button>
          </div>
        </div>
      )}

      {/* Course Player Modal */}
      <CoursePlayerModal
        course={selectedCourse}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        isBookmarked={selectedCourse ? bookmarkedIds.includes(selectedCourse.id) : false}
        isCompleted={selectedCourse ? completedIds.includes(selectedCourse.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onToggleCompleted={handleToggleCompleted}
      />

      {/* Upload Course Modal */}
      <UploadCourseModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSave={handleSaveCourse}
        initialData={editingCourse}
      />
    </DashboardLayout>
  );
}
