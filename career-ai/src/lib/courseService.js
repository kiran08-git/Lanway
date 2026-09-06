import { INITIAL_COURSES } from '../data/coursesData';
import { CATEGORY_INFO } from '../data/careerDatabase';

const STORAGE_KEYS = {
  UPLOADED_COURSES: 'careerai_uploaded_courses',
  BOOKMARKS: 'careerai_bookmarked_courses',
  COMPLETED: 'careerai_completed_courses',
  NOTES: 'careerai_course_notes',
  RECENT_WATCHED: 'careerai_recent_watched_courses',
};

/**
 * Extracts YouTube Video ID from any standard YouTube URL or raw ID
 */
export function extractYouTubeId(urlOrId) {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle standard youtube.com/watch?v=...
  const watchMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // Handle youtube.com/shorts/...
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^"&?\/\s]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }

  // Handle youtu.be/...
  const shortUrlMatch = trimmed.match(/youtu\.be\/([^"&?\/\s]{11})/i);
  if (shortUrlMatch && shortUrlMatch[1]) {
    return shortUrlMatch[1];
  }

  return '';
}

/**
 * Generates YouTube thumbnail URLs with quality hierarchy
 */
export function getYouTubeThumbnail(videoId, quality = 'maxres') {
  if (!videoId) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
  if (quality === 'hq') {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Generates clean embed URL
 */
export function getYouTubeEmbedUrl(videoId, autoPlay = false) {
  if (!videoId) return '';
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`;
}

/**
 * Get all courses (combining initial catalog + user-uploaded courses from localStorage)
 */
export function getAllCourses() {
  let uploaded = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UPLOADED_COURSES);
    if (raw) {
      uploaded = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error loading uploaded courses from storage:', err);
  }

  // Return uploaded courses first, then default courses
  return [...uploaded, ...INITIAL_COURSES];
}

/**
 * Add a new user-uploaded course
 */
export function addUploadedCourse(courseData) {
  const videoId = extractYouTubeId(courseData.youtubeId || courseData.url);
  if (!videoId) {
    throw new Error('Please provide a valid YouTube video URL or 11-character Video ID.');
  }

  const newCourse = {
    id: `user-yt-${Date.now()}`,
    title: courseData.title.trim(),
    channel: courseData.channel?.trim() || 'YouTube Creator',
    youtubeId: videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    category: courseData.category || 'SW',
    level: courseData.level || 'Beginner',
    duration: courseData.duration?.trim() || 'Full Course',
    rating: 5.0,
    reviewsCount: 1,
    language: courseData.language?.trim() || 'English',
    thumbnail: courseData.thumbnail || getYouTubeThumbnail(videoId),
    description: courseData.description?.trim() || 'Free comprehensive tutorial course available on YouTube.',
    topics: Array.isArray(courseData.topics)
      ? courseData.topics
      : typeof courseData.topics === 'string'
      ? courseData.topics.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    careerMatch: courseData.careerMatch?.trim() || '',
    featured: false,
    isUploaded: true,
    createdAt: new Date().toISOString().split('T')[0],
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UPLOADED_COURSES);
    const uploaded = raw ? JSON.parse(raw) : [];
    uploaded.unshift(newCourse);
    localStorage.setItem(STORAGE_KEYS.UPLOADED_COURSES, JSON.stringify(uploaded));
  } catch (err) {
    console.error('Error saving new uploaded course:', err);
  }

  return newCourse;
}

/**
 * Update an existing user-uploaded course
 */
export function updateUploadedCourse(courseId, updatedData) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UPLOADED_COURSES);
    if (!raw) return null;
    let uploaded = JSON.parse(raw);
    const index = uploaded.findIndex((c) => c.id === courseId);
    if (index === -1) return null;

    const videoId = extractYouTubeId(updatedData.youtubeId || updatedData.url) || uploaded[index].youtubeId;

    uploaded[index] = {
      ...uploaded[index],
      ...updatedData,
      youtubeId: videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: updatedData.thumbnail || getYouTubeThumbnail(videoId),
      topics: Array.isArray(updatedData.topics)
        ? updatedData.topics
        : typeof updatedData.topics === 'string'
        ? updatedData.topics.split(',').map((t) => t.trim()).filter(Boolean)
        : uploaded[index].topics,
    };

    localStorage.setItem(STORAGE_KEYS.UPLOADED_COURSES, JSON.stringify(uploaded));
    return uploaded[index];
  } catch (err) {
    console.error('Error updating uploaded course:', err);
    return null;
  }
}

/**
 * Delete a user-uploaded course
 */
export function deleteUploadedCourse(courseId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UPLOADED_COURSES);
    if (!raw) return false;
    let uploaded = JSON.parse(raw);
    uploaded = uploaded.filter((c) => c.id !== courseId);
    localStorage.setItem(STORAGE_KEYS.UPLOADED_COURSES, JSON.stringify(uploaded));
    return true;
  } catch (err) {
    console.error('Error deleting course:', err);
    return false;
  }
}

/**
 * Bookmarks management
 */
export function getBookmarkedCourseIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : ['yt-sw-1', 'yt-ai-1', 'yt-ux-1'];
  } catch {
    return ['yt-sw-1', 'yt-ai-1', 'yt-ux-1'];
  }
}

export function toggleCourseBookmark(courseId) {
  const current = getBookmarkedCourseIds();
  let updated;
  if (current.includes(courseId)) {
    updated = current.filter((id) => id !== courseId);
  } else {
    updated = [...current, courseId];
  }
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  } catch (err) {
    console.warn('Error persisting bookmarks:', err);
  }
  return updated;
}

/**
 * Completed courses management
 */
export function getCompletedCourseIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleCourseCompleted(courseId) {
  const current = getCompletedCourseIds();
  let updated;
  if (current.includes(courseId)) {
    updated = current.filter((id) => id !== courseId);
  } else {
    updated = [...current, courseId];
  }
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(updated));
  } catch (err) {
    console.warn('Error persisting completed status:', err);
  }
  return updated;
}

/**
 * Notes management
 */
export function getCourseNotes(courseId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    const allNotes = raw ? JSON.parse(raw) : {};
    return allNotes[courseId] || '';
  } catch {
    return '';
  }
}

export function saveCourseNote(courseId, noteText) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    const allNotes = raw ? JSON.parse(raw) : {};
    allNotes[courseId] = noteText;
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(allNotes));
    return true;
  } catch (err) {
    console.warn('Error saving note:', err);
    return false;
  }
}

/**
 * Get category list with color mapping & active course counts
 */
export function getCategoriesWithCounts(courses) {
  const counts = {};
  courses.forEach((c) => {
    counts[c.category] = (counts[c.category] || 0) + 1;
  });

  const categories = Object.entries(CATEGORY_INFO).map(([code, info]) => ({
    code,
    name: info.name,
    color: info.color,
    count: counts[code] || 0,
  }));

  return categories;
}
