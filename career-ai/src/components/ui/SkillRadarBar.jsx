import { useState } from 'react';
import { BarChart2, Award, ChevronDown, ChevronUp, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { CATEGORY_INFO, CATEGORY_NAMES, MAX_SCORES } from '../../lib/scoringEngine.js';
import ProgressBar from './ProgressBar';

export default function SkillRadarBar({
  categoryScores = {},
  strongestCategories = [],
  careers = [],
}) {
  const [expanded, setExpanded] = useState(false);

  // Build sorted array of all 14 categories with their percentages
  let allCategoryList = Object.keys(MAX_SCORES).map((code) => {
    const info = CATEGORY_INFO[code] || {};
    const percentage =
      categoryScores[code] ??
      (strongestCategories.find((c) => c.code === code)?.percentage || 0);

    return {
      code,
      name: CATEGORY_NAMES[code] || code,
      field: info.field || 'General',
      color: info.color || 'blue',
      percentage: Math.min(100, Math.max(0, percentage)),
    };
  }).sort((a, b) => b.percentage - a.percentage);

  // If category percentages are all 0 (legacy rows or mock), infer from careers
  const allZero = allCategoryList.every((c) => c.percentage === 0);
  if (allZero && careers.length > 0) {
    const inferred = { ...categoryScores };
    careers.forEach((c) => {
      if (c.primaryCategory && typeof c.matchScore === 'number') {
        inferred[c.primaryCategory] = Math.max(
          inferred[c.primaryCategory] || 0,
          c.matchScore
        );
      }
    });

    allCategoryList = Object.keys(MAX_SCORES).map((code) => {
      const info = CATEGORY_INFO[code] || {};
      const percentage = inferred[code] || 0;
      return {
        code,
        name: CATEGORY_NAMES[code] || code,
        field: info.field || 'General',
        color: info.color || 'blue',
        percentage: Math.min(100, Math.max(0, percentage)),
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }

  const displayedCategories = expanded
    ? allCategoryList
    : allCategoryList.slice(0, 4);

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-brand-ink-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center">
              <BarChart2 size={18} />
            </div>
            <div>
              <h4 className="font-display font-bold text-brand-ink-900 text-sm sm:text-base">
                Aptitude & Dimension Fit
              </h4>
              <p className="text-[11px] text-brand-ink-500">
                14 Holland RIASEC & Career Anchor benchmarks
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-700 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-brand-blue-50 transition-colors"
          >
            <span>{expanded ? 'Show Top 4' : 'View All 14'}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Categories List */}
        <div className="space-y-3.5">
          {displayedCategories.map((cat, idx) => {
            const isTop = idx === 0;
            return (
              <div key={cat.code} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`h-4 w-4 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800'
                          : idx === 1
                          ? 'bg-brand-blue-100 text-brand-blue-800'
                          : 'bg-brand-ink-100 text-brand-ink-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-brand-ink-800 truncate">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-brand-ink-400 font-mono">
                      ({cat.code})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-extrabold text-brand-ink-900">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                <ProgressBar
                  value={cat.percentage}
                  color={
                    cat.percentage >= 80
                      ? 'blue'
                      : cat.percentage >= 65
                      ? 'purple'
                      : 'mixed'
                  }
                  height="h-1.5"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer View Full Analysis Button */}
      <div className="mt-4 pt-4 border-t border-brand-ink-100">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-bold text-brand-blue-600 hover:text-brand-blue-700 hover:bg-brand-blue-50 rounded-lg transition-colors"
        >
          View Full Analysis <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
