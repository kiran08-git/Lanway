import { supabase } from './supabase';
import { calculateCategoryScores, matchCareersFromScores } from './scoringEngine.js';

/**
 * Calculates deterministic assessment scores across all 14 categories.
 */
export function calculateAssessmentScores(answers) {
  return calculateCategoryScores(answers);
}

/**
 * Sends profile & deterministic scores to the server-side AI endpoint
 * and saves full results to Supabase and localStorage.
 */
export async function analyzeAndSaveCareerPath({ user, profile, answers }) {
  // 1. Calculate deterministic scores across the 14 assessment categories
  const deterministicScores = calculateCategoryScores(answers);
  const matchedCareersData = matchCareersFromScores(
    deterministicScores.normalizedScores,
    deterministicScores.categoryTotals,
    profile
  );

  const payload = {
    profile: {
      id: user?.id,
      name: profile?.name || user?.user_metadata?.full_name || 'Student',
      degree: profile?.degree || '',
      branch: profile?.branch || '',
      year: profile?.year || '',
      college: profile?.college || '',
      skills: profile?.skills || [],
      interests: profile?.interests || [],
      careerGoal: profile?.career_goal || '',
    },
    assessment: {
      answers,
      categoryTotals: deterministicScores.categoryTotals,
      normalizedScores: deterministicScores.normalizedScores,
      strongestCategories: deterministicScores.strongestCategories,
      matchedCareers: matchedCareersData.topMatches,
      topStrengths: matchedCareersData.topStrengths,
      areasForDevelopment: matchedCareersData.areasForDevelopment,
      overallScore: deterministicScores.overallScore,
    },
  };

  let aiData = null;

  // 2. Call the server-side AI analysis endpoint
  try {
    const response = await fetch('/api/analyze-career', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        aiData = result.data;
      }
    } else {
      console.warn('[CareerService] AI endpoint returned non-200, using deterministic synthesis');
    }
  } catch (apiErr) {
    console.warn('[CareerService] AI endpoint fetch failed, fallback to deterministic data:', apiErr);
  }

  // 3. Fallback to deterministic synthesis if AI call was unavailable
  if (!aiData) {
    aiData = {
      overallScore: deterministicScores.overallScore,
      topStrengths: matchedCareersData.topStrengths,
      areasForDevelopment: matchedCareersData.areasForDevelopment,
      careers: matchedCareersData.topMatches,
    };
  }

  // 4. Persist to Supabase if authenticated
  let assessmentId = null;
  if (user?.id) {
    try {
      // Save full 30-answer assessment record
      const { data: assessmentRecord, error: aErr } = await supabase
        .from('assessment_results')
        .insert({
          user_id: user.id,
          answers,
          category_totals: deterministicScores.categoryTotals,
          normalized_scores: deterministicScores.normalizedScores,
          strongest_categories: deterministicScores.strongestCategories,
          overall_score: deterministicScores.overallScore,
          // Backwards compatibility columns:
          skill_score: deterministicScores.normalizedScores?.SW || 80,
          aptitude_score: deterministicScores.normalizedScores?.AI || 80,
          interest_score: deterministicScores.overallScore || 85,
        })
        .select()
        .single();

      if (aErr) {
        console.warn('[Supabase] Note on saving assessment_results:', aErr.message);
      } else if (assessmentRecord) {
        assessmentId = assessmentRecord.id;
      }

      // Save Career Recommendations Record
      const { error: rErr } = await supabase
        .from('career_recommendations')
        .insert({
          user_id: user.id,
          assessment_id: assessmentId,
          overall_score: aiData.overallScore || deterministicScores.overallScore,
          strengths: aiData.topStrengths || matchedCareersData.topStrengths,
          areas_for_development: aiData.areasForDevelopment || matchedCareersData.areasForDevelopment,
          careers: aiData.careers || matchedCareersData.topMatches,
          category_breakdown: deterministicScores.normalizedScores,
        });

      if (rErr) {
        console.warn('[Supabase] Note on saving career_recommendations:', rErr.message);
      }
    } catch (dbErr) {
      console.warn('[Supabase] Database save error (check if tables exist):', dbErr);
    }
  }

  // 5. Store in localStorage cache for instant responsiveness & session persistence
  try {
    const cacheKey = user?.id ? `career_ai_latest_${user.id}` : 'career_ai_latest_guest';
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        aiData,
        scores: deterministicScores,
        answers,
        matchedCareers: matchedCareersData,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (e) {
    console.warn('LocalStorage cache error:', e);
  }

  return {
    scores: deterministicScores,
    aiData,
    matchedCareers: matchedCareersData,
  };
}

/**
 * Retrieves the latest AI recommendations from Supabase or localStorage,
 * intelligently comparing timestamps and guaranteeing full category breakdown.
 */
export async function getLatestCareerRecommendations(userId) {
  let localResult = null;
  let supabaseResult = null;

  // 1. Read localStorage cache first
  try {
    const cacheKey = userId ? `career_ai_latest_${userId}` : 'career_ai_latest_guest';
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.aiData?.careers?.length > 0 || parsed?.matchedCareers?.topMatches?.length > 0) {
        const careers = parsed.aiData?.careers?.length > 0
          ? parsed.aiData.careers
          : (parsed.matchedCareers?.topMatches || []);

        localResult = {
          source: 'cache',
          overallScore: parsed.aiData?.overallScore || parsed.scores?.overallScore || 85,
          topStrengths: parsed.aiData?.topStrengths || parsed.matchedCareers?.topStrengths || [],
          areasForDevelopment: parsed.aiData?.areasForDevelopment || parsed.matchedCareers?.areasForDevelopment || [],
          careers,
          categoryScores: parsed.scores?.normalizedScores || null,
          strongestCategories: parsed.scores?.strongestCategories || null,
          createdAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    }
  } catch (e) {
    console.warn('LocalStorage retrieval error:', e);
  }

  // 2. Fetch from Supabase if userId is provided
  if (userId) {
    try {
      const { data, error } = await supabase
        .from('career_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data && data.careers && data.careers.length > 0) {
        let categoryScores = data.category_breakdown || null;
        let strongestCategories = null;

        const { data: assessmentData } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (assessmentData) {
          categoryScores = assessmentData.normalized_scores || categoryScores;
          strongestCategories = assessmentData.strongest_categories || null;

          // If category scores are still null but answers exist, calculate on the fly
          if (!categoryScores && assessmentData.answers && Object.keys(assessmentData.answers).length > 0) {
            const recomputed = calculateCategoryScores(assessmentData.answers);
            categoryScores = recomputed.normalizedScores;
            strongestCategories = recomputed.strongestCategories;
          }
        }

        supabaseResult = {
          source: 'supabase',
          overallScore: data.overall_score || 85,
          topStrengths: Array.isArray(data.strengths) && data.strengths.length > 0 ? data.strengths : [],
          areasForDevelopment: Array.isArray(data.areas_for_development) && data.areas_for_development.length > 0 ? data.areas_for_development : [],
          careers: data.careers || [],
          categoryScores,
          strongestCategories,
          createdAt: data.created_at,
        };
      }
    } catch (err) {
      console.warn('[Supabase] Error loading recommendations:', err);
    }
  }

  // 3. Resolve best result between Supabase and Local Cache
  if (supabaseResult && localResult) {
    // If Supabase has valid category scores and is not older than local cache by more than a minute, prefer Supabase
    const supaTime = new Date(supabaseResult.createdAt).getTime();
    const localTime = new Date(localResult.createdAt).getTime();

    const hasSupaScores = supabaseResult.categoryScores && Object.values(supabaseResult.categoryScores).some((v) => v > 0);
    const hasLocalScores = localResult.categoryScores && Object.values(localResult.categoryScores).some((v) => v > 0);

    // If local cache is clearly newer (e.g. freshly retaken assessment), or Supabase has empty scores while local has valid scores:
    if (localTime > supaTime || (!hasSupaScores && hasLocalScores)) {
      // Merge in any missing areasForDevelopment if needed
      if (!localResult.areasForDevelopment || localResult.areasForDevelopment.length === 0) {
        localResult.areasForDevelopment = supabaseResult.areasForDevelopment || [];
      }
      return localResult;
    }

    // Otherwise use Supabase with fallback to local category scores if Supabase scores are missing
    if (!hasSupaScores && hasLocalScores) {
      supabaseResult.categoryScores = localResult.categoryScores;
      supabaseResult.strongestCategories = localResult.strongestCategories;
    }
    if ((!supabaseResult.areasForDevelopment || supabaseResult.areasForDevelopment.length === 0) && localResult.areasForDevelopment?.length > 0) {
      supabaseResult.areasForDevelopment = localResult.areasForDevelopment;
    }

    return supabaseResult;
  }

  return supabaseResult || localResult || null;
}
