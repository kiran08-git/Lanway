import { useState } from 'react';
import { PieChart, Sparkles, Filter, RotateCcw } from 'lucide-react';

// Domain color palette for vibrant, modern aesthetics
const DOMAIN_COLORS = {
  Technology: '#3B82F6', // Blue
  'AI & Analytics': '#8B5CF6', // Purple
  Design: '#EC4899', // Pink
  Engineering: '#F59E0B', // Amber
  Business: '#10B981', // Emerald
  Finance: '#06B6D4', // Cyan
  Marketing: '#F97316', // Orange
  Healthcare: '#F43F5E', // Rose
  Education: '#6366F1', // Indigo
  'Research & Science': '#14B8A6', // Teal
  Legal: '#64748B', // Slate
  'Media & Creative': '#A855F7', // Violet
  'Government & Public Service': '#059669', // Green
  General: '#3B82F6',
};

const FALLBACK_COLORS = [
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#10B981',
  '#F59E0B',
  '#06B6D4',
  '#F97316',
  '#6366F1',
  '#14B8A6',
];

/**
 * Calculates SVG arc path for a pie/donut slice
 */
function getSlicePath(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
  // Guard against full 360 circle issues in SVG arcs
  const diff = endAngle - startAngle;
  const angle = diff >= 359.99 ? 359.99 : diff;
  const actualEndAngle = startAngle + angle;

  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((actualEndAngle - 90) * Math.PI) / 180;

  const x1 = cx + outerRadius * Math.cos(startRad);
  const y1 = cy + outerRadius * Math.sin(startRad);
  const x2 = cx + outerRadius * Math.cos(endRad);
  const y2 = cy + outerRadius * Math.sin(endRad);

  const x3 = cx + innerRadius * Math.cos(endRad);
  const y3 = cy + innerRadius * Math.sin(endRad);
  const x4 = cx + innerRadius * Math.cos(startRad);
  const y4 = cy + innerRadius * Math.sin(startRad);

  const largeArcFlag = angle > 180 ? 1 : 0;

  return [
    `M ${x1} ${y1}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}

export default function CareerMatchPieChart({
  careers = [],
  selectedCategory = 'ALL',
  onSelectCategory,
}) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  if (!careers || careers.length === 0) {
    return (
      <div className="p-8 text-center text-brand-ink-400 text-sm">
        No career data available to render chart.
      </div>
    );
  }

  // Aggregate Data by Domain
  const totalCareers = careers.length;
  const domainCounts = {};
  const domainScores = {};

  careers.forEach((career) => {
    const domain = career.field || 'General';
    domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    const score = career.matchScore || 80;
    domainScores[domain] = (domainScores[domain] || 0) + score;
  });

  const entries = Object.entries(domainCounts).sort((a, b) => b[1] - a[1]);
  let currentAngle = 0;

  const slices = entries.map(([domain, count], index) => {
    const percentage = (count / totalCareers) * 100;
    const angle = (count / totalCareers) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const avgScore = Math.round(domainScores[domain] / count);
    const color =
      DOMAIN_COLORS[domain] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];

    return {
      id: domain,
      label: domain,
      count,
      percentage: Math.round(percentage),
      avgScore,
      color,
      startAngle,
      endAngle,
    };
  });

  // Active highlighted slice
  const activeSlice = hoveredSlice || slices[0];
  const overallAvgScore = Math.round(
    careers.reduce((acc, c) => acc + (c.matchScore || 80), 0) / totalCareers
  );

  const cx = 100;
  const cy = 100;
  const outerRadius = 80;
  const innerRadius = 50;

  const isFiltered = selectedCategory && selectedCategory !== 'ALL';

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-brand-ink-100">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center">
            <PieChart size={16} />
          </div>
          <div>
            <h4 className="font-display font-bold text-brand-ink-900 text-xs sm:text-sm">
              Career Matches Distribution
            </h4>
            <p className="text-[10px] text-brand-ink-500">
              Visual breakdown of {totalCareers} matched pathways
            </p>
          </div>
        </div>
      </div>

      {/* Main Chart + Legend Section */}
      <div className="grid sm:grid-cols-12 gap-3 items-center my-auto">
        {/* SVG Donut Chart (5 cols) */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-[180px] h-[180px] flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full transform -rotate-90 transition-transform duration-300 overflow-visible"
            >
              <defs>
                <filter id="pie-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15" />
                </filter>
              </defs>

              {slices.map((slice) => {
                const isHovered = hoveredSlice?.id === slice.id;
                const isSelected = selectedCategory === slice.id;
                const isExpanded = isHovered || isSelected;

                const currentOuterRadius = isExpanded ? outerRadius + 6 : outerRadius;
                const currentInnerRadius = isExpanded ? innerRadius - 2 : innerRadius;
                const pathData = getSlicePath(
                  cx,
                  cy,
                  currentInnerRadius,
                  currentOuterRadius,
                  slice.startAngle,
                  slice.endAngle
                );

                return (
                  <path
                    key={slice.id}
                    d={pathData}
                    fill={slice.color}
                    opacity={isExpanded ? 1 : hoveredSlice ? 0.6 : 0.92}
                    filter={isExpanded ? 'url(#pie-glow)' : 'none'}
                    className="cursor-pointer transition-all duration-200 stroke-white stroke-2 hover:opacity-100"
                    onMouseEnter={() => setHoveredSlice(slice)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() => {
                      if (onSelectCategory) {
                        onSelectCategory(
                          selectedCategory === slice.id ? 'ALL' : slice.id
                        );
                      }
                    }}
                  />
                );
              })}
            </svg>

            {/* Central Donut Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink-400">
                {hoveredSlice ? 'Selected Slice' : 'Average Fit'}
              </span>
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-brand-ink-900 leading-tight">
                {activeSlice ? `${activeSlice.avgScore}%` : `${overallAvgScore}%`}
              </span>
              <span className="text-[11px] font-medium text-brand-blue-600 truncate max-w-[120px] px-1">
                {activeSlice ? activeSlice.label : `${totalCareers} Roles`}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-brand-ink-400 mt-1 flex items-center gap-1">
            <Filter size={11} /> Click slice or legend item to filter career list
          </p>
        </div>

        {/* Legend & Breakdown List (7 cols) */}
        <div className="sm:col-span-7 space-y-1">
          <div className="flex items-center justify-between pb-1 border-b border-brand-ink-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink-500">
              Domains
            </span>
            {isFiltered && (
              <button
                type="button"
                onClick={() => onSelectCategory && onSelectCategory('ALL')}
                className="text-[10px] font-semibold text-brand-blue-600 hover:text-brand-blue-700 flex items-center gap-1 bg-brand-blue-50 px-1.5 py-0.5 rounded-md transition-colors"
              >
                <RotateCcw size={10} /> Reset Filter
              </button>
            )}
          </div>

          <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin">
            {slices.map((slice) => {
              const isHovered = hoveredSlice?.id === slice.id;
              const isSelected = selectedCategory === slice.id;

              return (
                <button
                  key={slice.id}
                  type="button"
                  onMouseEnter={() => setHoveredSlice(slice)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  onClick={() => {
                    if (onSelectCategory) {
                      onSelectCategory(
                        selectedCategory === slice.id ? 'ALL' : slice.id
                      );
                    }
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between gap-3 border ${
                    isSelected
                      ? 'border-brand-blue-500 bg-brand-blue-50/90 text-brand-blue-950 ring-1 ring-brand-blue-500 shadow-xs'
                      : isHovered
                      ? 'border-brand-blue-200 bg-brand-blue-50/40 text-brand-ink-900'
                      : 'border-brand-ink-100/80 bg-brand-ink-50/30 text-brand-ink-700 hover:border-brand-ink-200 hover:bg-brand-ink-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="h-3 w-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: slice.color }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate leading-tight">
                        {slice.label}
                      </p>
                      <p className="text-[10px] text-brand-ink-400">
                        {slice.count} {slice.count === 1 ? 'career match' : 'career matches'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-brand-ink-900">
                      {slice.percentage}%
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-brand-ink-600 border border-brand-ink-200">
                      {slice.avgScore}% fit
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="mt-4 pt-3 border-t border-brand-ink-100 flex flex-wrap items-center justify-between gap-2 text-xs text-brand-ink-600">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-500" />
          <span>
            Top Domain: <strong className="text-brand-ink-900">{slices[0]?.label}</strong> ({slices[0]?.percentage}% of your match pool)
          </span>
        </div>
        <span className="text-[11px] text-brand-ink-400">
          Calculated across 14 Holland RIASEC categories
        </span>
      </div>
    </div>
  );
}
