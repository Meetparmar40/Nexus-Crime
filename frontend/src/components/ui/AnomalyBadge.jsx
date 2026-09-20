import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const CATEGORY_META = {
  temporal: { label: 'Temporal', color: 'text-blue-400', bar: 'bg-blue-500' },
  behavioral: { label: 'Behavioral', color: 'text-orange-400', bar: 'bg-orange-500' },
  content: { label: 'Content', color: 'text-amber-400', bar: 'bg-amber-500' },
  structural: { label: 'Structural', color: 'text-[#8b8e99]', bar: 'bg-[#8b8e99]' },
  relational: { label: 'Relational', color: 'text-purple-400', bar: 'bg-purple-500' },
};

export const AnomalyBadge = ({ score, severity, onClick }) => {
  const isDark = localStorage.getItem('nexus_theme') === 'dark';

  if (score === null || score === undefined || !severity) {
    return <span className="text-xs text-[#8b8e99] font-mono px-1 select-none">—</span>;
  }

  const isLow = severity === 'low';
  const isHigh = severity === 'high';

  // Base colors for badges in dark vs light mode
  const badgeStyle = isDark ? {
    bg: '#1f222a',
    border: isHigh ? '#7f1d1d' : isLow ? '#064e3b' : '#78350f',
    text: isHigh ? '#f87171' : isLow ? '#34d399' : '#fbbf24'
  } : {
    bg: isHigh ? '#fef2f2' : isLow ? '#ecfdf5' : '#fffbeb',
    border: isHigh ? '#fecaca' : isLow ? '#a7f3d0' : '#fde68a',
    text: isHigh ? '#dc2626' : isLow ? '#059669' : '#d97706'
  };

  const content = (
    <>
      {isHigh ? <ShieldAlert size={12} /> : !isLow ? <AlertTriangle size={12} /> : null}
      <span>{score}/100</span>
    </>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-mono font-medium transition-all ${onClick ? 'cursor-pointer hover:opacity-80 active:scale-95 shadow-sm' : 'cursor-default'
        }`}
      style={{
        backgroundColor: badgeStyle.bg,
        borderColor: badgeStyle.border,
        color: badgeStyle.text
      }}
      title={onClick ? "Click to toggle anomaly details" : `Score: ${score}/100`}
    >
      {content}
    </button>
  );
};

export const AnomalyDetailPanel = ({ anomaly }) => {
  if (!anomaly) return null;

  const isDark = localStorage.getItem('nexus_theme') === 'dark';
  const { flags = [], summary = '', category_scores = {}, severity } = anomaly;

  // Outer container styling (Mild charcoal, clean borders, NO muddy olive tint)
  const containerStyle = isDark ? {
    bgOuter: '#15171c',
    borderOuter: '#2b2e38',
    textSummary: '#ffffff',
    bgFlagCard: '#101114',
    borderFlagCard: '#242732',
    textFlag: '#ffffff',
    textMuted: '#8b8e99',
    barTrack: '#1e212b'
  } : {
    bgOuter: '#f9f9f8',
    borderOuter: '#e4e4df',
    textSummary: '#111111',
    bgFlagCard: '#ffffff',
    borderFlagCard: '#e4e4df',
    textFlag: '#111111',
    textMuted: '#717175',
    barTrack: '#e8e8e4'
  };

  return (
    <div
      className="rounded-2xl p-5 space-y-5 transition-colors duration-200"
      style={{
        backgroundColor: containerStyle.bgOuter,
        border: `1px solid ${containerStyle.borderOuter}`
      }}
    >
      {/* Summary statement in clean pure white (dark mode) */}
      <p
        className="text-sm font-medium leading-relaxed"
        style={{ color: containerStyle.textSummary }}
      >
        {summary}
      </p>

      {/* 5-Category Score Breakdown */}
      <div>
        <div
          className="text-xs font-mono uppercase tracking-wider font-semibold mb-2.5"
          style={{ color: containerStyle.textMuted }}
        >
          Score Breakdown
        </div>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(category_scores).map(([cat, pts]) => {
            const meta = CATEGORY_META[cat] || { label: cat, color: 'text-[#8b8e99]', bar: 'bg-[#8b8e99]' };
            const pct = Math.round((pts / 20) * 100);
            return (
              <div key={cat} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: containerStyle.barTrack }}
                >
                  <div
                    className={`h-full rounded-full ${meta.bar} transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold capitalize ${meta.color}`}>{meta.label}</span>
                <span className="text-xs font-mono" style={{ color: containerStyle.textMuted }}>{pts}/20</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flags List (Inner cards styled in dark elevated shade with white text) */}
      {flags.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <div
            className="text-xs font-mono uppercase tracking-wider font-semibold"
            style={{ color: containerStyle.textMuted }}
          >
            Anomaly Flags ({flags.length})
          </div>
          <div className="space-y-2.5">
            {flags.map((flag, i) => {
              const meta = CATEGORY_META[flag.category] || CATEGORY_META.content;
              return (
                <div
                  key={i}
                  className="rounded-xl p-4 space-y-2 transition-colors duration-200"
                  style={{
                    backgroundColor: containerStyle.bgFlagCard,
                    border: `1px solid ${containerStyle.borderFlagCard}`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span
                      className="text-xs font-mono font-medium"
                      style={{ color: containerStyle.textMuted }}
                    >
                      +{flag.weight} pts
                    </span>
                  </div>

                  <p
                    className="text-sm font-medium leading-relaxed"
                    style={{ color: containerStyle.textFlag }}
                  >
                    {flag.flag}
                  </p>

                  {flag.evidence_quote && (
                    <blockquote
                      className="text-xs font-mono pl-3 italic border-l-2 leading-relaxed"
                      style={{
                        borderColor: containerStyle.borderFlagCard,
                        color: containerStyle.textMuted
                      }}
                    >
                      &ldquo;{flag.evidence_quote.length > 200
                        ? flag.evidence_quote.slice(0, 200) + '…'
                        : flag.evidence_quote}&rdquo;
                    </blockquote>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};