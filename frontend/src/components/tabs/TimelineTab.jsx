import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw, Clock, AlertCircle, Zap, Users, X, GripVertical } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const TimelineTab = ({ sessionId, isNotesOpen, highlightTarget }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, filesProcessed: 0 });
  const [infoBanner, setInfoBanner] = useState(null);
  const [filterEntity, setFilterEntity] = useState(null);
  const [knownActors, setKnownActors] = useState([]);

  const isDark = localStorage.getItem('nexus_theme') === 'dark';

  const theme = isDark ? {
    bgCard: '#15171c',          // Replaces matte white card
    bgCardHover: '#1a1d24',
    bgBadge: '#1f222a',
    border: '#292c35',          // Mild dark border
    borderSubtle: '#22252e',
    timelineLine: '#2a2e3a',    // Vertical timeline wire
    textHeading: '#ffffff',
    textBody: '#c4c6ce',
    textMuted: '#8b8e99',
    pillBg: '#1f222a',
    pillBorder: '#2f3340',
    pillText: '#f4f4f5',
  } : {
    bgCard: '#ffffff',
    bgCardHover: '#fbfbfa',
    bgBadge: '#f2f2ef',
    border: '#e8e8e4',
    borderSubtle: '#f0f0ed',
    timelineLine: '#e8e8e4',
    textHeading: '#111111',
    textBody: '#444446',
    textMuted: '#717175',
    pillBg: '#f2f2ef',
    pillBorder: '#e4e4df',
    pillText: '#111111',
  };

  const deriveActors = (events) => {
    const set = new Set();
    events.forEach(e => (e.actors || []).forEach(a => set.add(a)));
    setKnownActors([...set].sort());
  };

  const fetchTimeline = async () => {
    if (!sessionId) {
      setError('No session available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = filterEntity
        ? `${API_BASE}/sessions/${sessionId}/timeline?entity=${encodeURIComponent(filterEntity)}`
        : `${API_BASE}/sessions/${sessionId}/timeline`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Timeline endpoint not available');
      }
      const data = await response.json();

      if (data.timeline && data.timeline.length > 0) {
        const formattedTimeline = data.timeline.map((event, idx) => ({
          id: idx + 1,
          timestamp: event.timestamp || 'Unknown',
          event: event.event,
          type: event.type || 'info',
          sourceFile: event.source_file || 'Unknown',
          actors: event.actors || [],
          artifacts: event.artifacts || [],
          confidence: event.confidence || 'medium'
        }));
        setTimeline(formattedTimeline);
        setStats({
          total: data.total_events || formattedTimeline.length,
          filesProcessed: data.files_processed || 0
        });
        if (!filterEntity) deriveActors(formattedTimeline);
      } else {
        setTimeline([]);
        setStats({ total: 0, filesProcessed: 0 });
      }
    } catch (err) {
      console.error('Timeline fetch error:', err);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  const extractTimeline = async () => {
    if (!sessionId) return;

    setExtracting(true);
    setError(null);
    setInfoBanner(null);
    setFilterEntity(null);

    try {
      const response = await fetch(`${API_BASE}/sessions/${sessionId}/extract-timeline`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to extract timeline');
      }

      const data = await response.json();

      if (data.entities_auto_extracted) {
        setInfoBanner('Entity graph was automatically generated to provide context for timeline extraction.');
      }

      if (data.success && data.timeline && data.timeline.length > 0) {
        const formattedTimeline = data.timeline.map((event, idx) => ({
          id: idx + 1,
          timestamp: event.timestamp || 'Unknown',
          event: event.event,
          type: event.type || 'info',
          sourceFile: event.source_file || 'Unknown',
          actors: event.actors || [],
          artifacts: event.artifacts || [],
          confidence: event.confidence || 'medium'
        }));
        setTimeline(formattedTimeline);
        setStats({
          total: data.total_events || formattedTimeline.length,
          filesProcessed: data.files_processed || 0
        });
        deriveActors(formattedTimeline);
      } else if (data.message) {
        setError(data.message);
        setTimeline([]);
      }
    } catch (err) {
      console.error('Timeline extraction error:', err);
      setError('Failed to extract timeline from documents');
    } finally {
      setExtracting(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchTimeline();
    }
  }, [sessionId, filterEntity]);

  useEffect(() => {
    if (highlightTarget && highlightTarget.type === 'timeline_event' && timeline.length > 0) {
      const elementId = `timeline-${highlightTarget.timestamp}-${highlightTarget.title}`.replace(/[^a-zA-Z0-9_-]/g, '');
      const el = document.getElementById(elementId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-amber-400/50');
          setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400/50'), 3000);
        }, 100);
      }
    }
  }, [highlightTarget, timeline]);

  if (timeline.length === 0 && !loading && !extracting) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black tracking-tight uppercase" style={{ color: theme.textHeading }}>
            Incident Log (Local Time)
          </h3>
          <button
            onClick={extractTimeline}
            disabled={extracting || !sessionId}
            className="text-xs font-semibold px-4 py-2 rounded-full border flex items-center gap-2 transition-all cursor-pointer hover:opacity-85 disabled:opacity-50 shadow-sm"
            style={{
              backgroundColor: theme.pillBg,
              color: theme.pillText,
              border: `1px solid ${theme.pillBorder}`
            }}
          >
            {extracting ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
            <span>{extracting ? 'Extracting...' : 'Extract Timeline from Evidence'}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-400 text-xs">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <div
          className="rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]"
          style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}
        >
          <div className="p-4 rounded-2xl mb-4" style={{ backgroundColor: isDark ? '#1f222a' : '#f4f4f4' }}>
            <Clock size={44} className="text-[#8b8e99]" />
          </div>
          <h3 className="font-semibold text-base mb-1" style={{ color: theme.textHeading }}>No Timeline Events</h3>
          <p className="text-xs max-w-md" style={{ color: theme.textMuted }}>
            Upload evidence files and click "Extract Timeline from Evidence" to automatically reconstruct the sequence of events.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pl-4 md:pl-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-lg font-black tracking-tight uppercase" style={{ color: theme.textHeading }}>
            {filterEntity ? `Timeline — ${filterEntity}` : 'Incident Log (Local Time)'}
          </h2>
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              backgroundColor: theme.pillBg,
              color: theme.pillText,
              border: `1px solid ${theme.pillBorder}`
            }}
          >
            {stats.total} events
          </span>
          {filterEntity && (
            <button
              onClick={() => setFilterEntity(null)}
              className="text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 transition-all cursor-pointer"
              style={{
                backgroundColor: isDark ? '#2a1b38' : '#f5f3ff',
                borderColor: isDark ? '#4c2869' : '#ddd6fe',
                color: isDark ? '#d8b4fe' : '#7c3aed'
              }}
            >
              <X size={11} /> Clear filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={extractTimeline}
            disabled={extracting || !sessionId}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 transition-all cursor-pointer hover:opacity-85 disabled:opacity-50"
            style={{
              backgroundColor: theme.pillBg,
              color: theme.pillText,
              border: `1px solid ${theme.pillBorder}`
            }}
          >
            {extracting ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
            <span>{extracting ? 'Extracting...' : 'Re-Extract Timeline'}</span>
          </button>

          {knownActors.length > 0 && (
            <select
              value={filterEntity || ''}
              onChange={e => setFilterEntity(e.target.value || null)}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full border cursor-pointer appearance-none transition-all"
              style={{
                backgroundColor: theme.pillBg,
                color: theme.pillText,
                border: `1px solid ${theme.pillBorder}`
              }}
            >
              <option value="">All Entities</option>
              {knownActors.map(actor => (
                <option key={actor} value={actor}>{actor}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {infoBanner && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between text-blue-400 text-xs">
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>{infoBanner}</span>
          </div>
          <button onClick={() => setInfoBanner(null)} className="hover:opacity-75 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-400 text-xs">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {(loading || extracting) && (
        <div
          className="rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[300px]"
          style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}
        >
          <RefreshCw size={36} className="animate-spin mb-3" style={{ color: theme.textHeading }} />
          <h3 className="font-semibold text-base mb-1" style={{ color: theme.textHeading }}>
            {extracting ? 'Extracting Timeline Events...' : 'Loading Timeline...'}
          </h3>
          <p className="text-xs" style={{ color: theme.textMuted }}>
            {extracting ? 'Analyzing documents for temporal markers' : 'Fetching events'}
          </p>
        </div>
      )}

      {!loading && !extracting && (
        <div className="relative pt-2">
          {/* Vertical Connector Line */}
          <div
            className="absolute top-3 bottom-8 w-px left-4 md:left-38"
            style={{ backgroundColor: theme.timelineLine }}
          />

          <div className="space-y-6">
            {timeline.map((item, idx) => (
              <div
                key={item.id}
                className="relative pl-12 md:pl-0 md:flex group rounded-2xl transition-all duration-300"
                id={`timeline-${item.timestamp}-${item.event}`.replace(/[^a-zA-Z0-9_-]/g, '')}
              >
                {/* Date/Time Column */}
                <div className="mb-2 md:mb-0 md:w-34 md:text-right shrink-0 flex flex-col justify-start md:pt-2 md:pr-6">
                  <span className="font-mono text-[11px] uppercase tracking-widest block mb-0.5" style={{ color: theme.textMuted }}>
                    {item.timestamp.split(' ')[0]}
                  </span>
                  <span className="font-mono text-sm font-bold" style={{ color: theme.textHeading }}>
                    {item.timestamp.split(' ')[1] || item.timestamp.split('T')[1]?.slice(0, 8) || ''}
                  </span>
                </div>

                {/* Dot Column */}
                <div className="absolute left-4 top-3 -translate-x-1/2 md:relative md:left-auto md:top-auto md:translate-x-0 md:w-10 md:flex md:justify-center md:pt-3 z-10">
                  <div className="relative">
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 group-hover:scale-125 z-20 relative"
                      style={{
                        backgroundColor: theme.bgCard,
                        borderColor: item.type === 'critical' ? '#ef4444' :
                          item.type === 'warning' ? '#f59e0b' :
                            item.type === 'success' ? '#10b981' : '#3b82f6'
                      }}
                    />
                  </div>
                </div>

                {/* Content Card (Mild Dark Palette) */}
                <div className="flex-1">
                  <div
                    className={`relative p-5 rounded-2xl transition-all duration-200 shadow-sm overflow-hidden ${isNotesOpen ? 'cursor-grab active:cursor-grabbing' : ''
                      }`}
                    style={{
                      backgroundColor: theme.bgCard,
                      border: `1px solid ${theme.border}`
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.bgCardHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = theme.bgCard; }}
                    draggable={isNotesOpen}
                    onDragStart={(e) => {
                      if (!isNotesOpen) return;
                      e.dataTransfer.setData('application/json', JSON.stringify({
                        type: 'timeline_event',
                        title: item.event,
                        timestamp: item.timestamp,
                        source: item.sourceFile
                      }));
                    }}
                  >
                    {isNotesOpen && (
                      <div className="absolute top-4 right-4 text-[#8b8e99] opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={16} />
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider
                        ${item.type === 'critical' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                          item.type === 'warning' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                            item.type === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                              'bg-blue-500/15 text-blue-400 border border-blue-500/30'}
                      `}>
                        {item.type}
                      </span>

                      <span
                        className="text-[10px] px-2 py-0.5 rounded-md font-mono border"
                        style={{
                          backgroundColor: theme.bgBadge,
                          borderColor: theme.borderSubtle,
                          color: theme.textMuted
                        }}
                      >
                        {item.confidence} confidence
                      </span>
                    </div>

                    <p
                      className="font-medium text-base leading-relaxed mb-4 relative z-10"
                      style={{ color: theme.textHeading }}
                    >
                      {item.event}
                    </p>

                    <div className="space-y-3 relative z-10">
                      {item.actors && item.actors.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <Users size={12} className="text-purple-400 mr-1" />
                          {item.actors.map((actor, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-0.5 rounded-md border font-medium"
                              style={{
                                backgroundColor: isDark ? 'rgba(168, 85, 247, 0.12)' : '#faf5ff',
                                borderColor: isDark ? 'rgba(168, 85, 247, 0.25)' : '#f3e8ff',
                                color: isDark ? '#c084fc' : '#7e22ce'
                              }}
                            >
                              {actor}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.artifacts && item.artifacts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <Zap size={12} className="text-[#8b8e99] mr-1" />
                          {item.artifacts.map((artifact, i) => (
                            <span
                              key={i}
                              className="text-xs font-mono px-2 py-0.5 rounded-md border"
                              style={{
                                backgroundColor: theme.bgBadge,
                                borderColor: theme.borderSubtle,
                                color: theme.textBody
                              }}
                            >
                              {artifact}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      className="mt-4 flex items-center gap-1.5 text-[11px] p-2.5 rounded-lg border relative z-10 font-mono"
                      style={{
                        backgroundColor: isDark ? '#101114' : '#fafafa',
                        borderColor: theme.borderSubtle,
                        color: theme.textMuted
                      }}
                    >
                      <FileText size={12} className="text-[#8b8e99] shrink-0" />
                      <span className="truncate">
                        Source: <span style={{ color: theme.textHeading }}>{item.sourceFile}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineTab;