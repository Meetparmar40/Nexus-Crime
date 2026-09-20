import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Users,
  RefreshCw,
  Network,
  List,
  AlertCircle,
  Scan,
  AlertTriangle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Flag,
  X,
  Clock,
  FileText,
  GripVertical
} from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import { extractEntities, getSessionGraph, getAnomalies, getEntityTimeline } from '../../utils/api';

/* ── Severity style helpers ── */
const getSeverityConfig = (isDark) => ({
  critical: {
    bg: isDark ? 'bg-red-950/30' : 'bg-red-50',
    border: isDark ? 'border-red-800/40' : 'border-red-200',
    text: isDark ? 'text-red-400' : 'text-red-600',
    barColor: 'bg-red-500',
    icon: ShieldAlert
  },
  high: {
    bg: isDark ? 'bg-orange-950/30' : 'bg-orange-50',
    border: isDark ? 'border-orange-800/40' : 'border-orange-200',
    text: isDark ? 'text-orange-400' : 'text-orange-600',
    barColor: 'bg-orange-500',
    icon: ShieldAlert
  },
  moderate: {
    bg: isDark ? 'bg-amber-950/30' : 'bg-amber-50',
    border: isDark ? 'border-amber-800/40' : 'border-amber-200',
    text: isDark ? 'text-amber-400' : 'text-amber-600',
    barColor: 'bg-amber-500',
    icon: AlertTriangle
  },
  low: {
    bg: isDark ? 'bg-emerald-950/30' : 'bg-emerald-50',
    border: isDark ? 'border-emerald-800/40' : 'border-emerald-200',
    text: isDark ? 'text-emerald-400' : 'text-emerald-600',
    barColor: 'bg-emerald-500',
    icon: Flag
  },
  normal: {
    bg: isDark ? 'bg-[#1e2028]' : 'bg-[#f4f4f4]',
    border: isDark ? 'border-[#2d313d]' : 'border-[#e8e8e4]',
    text: isDark ? 'text-[#a1a1aa]' : 'text-[#71717a]',
    barColor: 'bg-[#a1a19b]',
    icon: Flag
  },
});

/* ── EntityCard (list-view) ── */
const EntityCard = ({ entity, relationships, getNodeColor, onViewTimeline, timelineData, isNotesOpen, isDark }) => {
  const [expanded, setExpanded] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const anomaly = entity.anomaly || { score: 0, severity: 'normal', triggered_flags: [], summary: '' };
  const severityConfig = getSeverityConfig(isDark);
  const style = severityConfig[anomaly.severity] || severityConfig.normal;
  const IconComp = style.icon;

  const handleTimelineClick = () => {
    if (!showTimeline && onViewTimeline) {
      onViewTimeline(entity.name);
    }
    setShowTimeline(prev => !prev);
  };

  const tl = timelineData || { loading: false, error: null, events: [] };

  return (
    <div
      id={`entity-${entity.name}`.replace(/[^a-zA-Z0-9_-]/g, '')}
      className={`rounded-2xl transition-all overflow-hidden shadow-sm relative group ${isNotesOpen ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      style={{
        backgroundColor: isDark ? '#171920' : '#ffffff',
        border: `1px solid ${isDark ? '#292c36' : '#e8e8e4'}`
      }}
      draggable={isNotesOpen}
      onDragStart={(e) => {
        if (!isNotesOpen) return;
        e.dataTransfer.setData('application/json', JSON.stringify({
          type: 'entity',
          name: entity.name,
          entityType: entity.type,
          anomalyScore: anomaly.score
        }));
      }}
    >
      {isNotesOpen && (
        <div className="absolute top-4 right-4 text-[#8b8e99] opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical size={16} />
        </div>
      )}

      {/* ── Top section ── */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
              style={{ backgroundColor: getNodeColor(entity) + '30', color: getNodeColor(entity) }}
            >
              {entity.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: isDark ? '#ffffff' : '#1f1f1f' }}>
                {entity.name}
              </h3>
              <span
                className="text-[11px] px-2 py-0.5 rounded capitalize font-mono"
                style={{ backgroundColor: getNodeColor(entity) + '20', color: getNodeColor(entity) }}
              >
                {entity.type || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Anomaly score badge ── */}
        <button
          onClick={() => setExpanded(prev => !prev)}
          className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono cursor-pointer transition-colors ${style.bg} ${style.border} ${style.text}`}
        >
          <div className="flex items-center gap-1.5">
            <IconComp size={12} />
            <span>Anomaly: {anomaly.score}/100</span>
            <span className="capitalize opacity-75">({anomaly.severity})</span>
          </div>
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {/* ── Expandable anomaly details ── */}
        {expanded && (
          <div className={`mt-2 rounded-xl border p-3 text-xs space-y-2 ${style.bg} ${style.border}`}>
            <div>
              <div className="flex justify-between text-[#8b8e99] mb-1 font-mono">
                <span>Score</span>
                <span className={style.text}>{anomaly.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${style.barColor}`}
                  style={{ width: `${anomaly.score}%` }}
                />
              </div>
            </div>

            {anomaly.triggered_flags?.length > 0 && (
              <div>
                <div className="text-[#8b8e99] mb-1 font-mono">Triggered Flags</div>
                <ul className="space-y-1">
                  {anomaly.triggered_flags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-1.5" style={{ color: isDark ? '#c4c6ce' : '#3a3a3a' }}>
                      <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${style.barColor}`} />
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {anomaly.summary && (
              <div>
                <div className="text-[#8b8e99] mb-1 font-mono">Summary</div>
                <p className="leading-relaxed" style={{ color: isDark ? '#c4c6ce' : '#3a3a3a' }}>{anomaly.summary}</p>
              </div>
            )}
          </div>
        )}

        {entity.description && (
          <p className="text-xs mt-3 leading-relaxed" style={{ color: isDark ? '#8b8e99' : '#71717a' }}>{entity.description}</p>
        )}
      </div>

      {/* ── Relationships ── */}
      {relationships.length > 0 && (
        <div
          className="px-5 py-3"
          style={{ borderTop: `1px solid ${isDark ? '#242732' : '#e8e8e4'}` }}
        >
          <div className="text-[11px] font-mono mb-2" style={{ color: isDark ? '#8b8e99' : '#a1a19b' }}>Relationships</div>
          <div className="flex flex-wrap gap-1.5">
            {relationships.map((rel, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-md border"
                style={{
                  backgroundColor: isDark ? '#1e212b' : '#f4f4f4',
                  borderColor: isDark ? '#2e3342' : '#e8e8e4',
                  color: isDark ? '#c4c6ce' : '#3a3a3a'
                }}
              >
                {rel.relationship} → {typeof rel.target === 'string' ? rel.target : rel.target?.id}
                {rel.weight ? (
                  <span className="ml-1 font-mono text-[#8b8e99]">
                    w{rel.weight}
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── View Timeline button ── */}
      <div
        className="px-5 py-3"
        style={{ borderTop: `1px solid ${isDark ? '#242732' : '#e8e8e4'}` }}
      >
        <button
          onClick={handleTimelineClick}
          className="w-full text-xs font-medium flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border transition-colors cursor-pointer"
          style={{
            backgroundColor: isDark ? '#1e212b' : '#ffffff',
            borderColor: isDark ? '#2e3342' : '#e8e8e4',
            color: isDark ? '#f4f4f5' : '#1f1f1f'
          }}
        >
          <Clock size={13} />
          <span>{showTimeline ? 'Hide Timeline' : 'View Timeline'}</span>
        </button>
      </div>

      {/* ── Inline timeline panel ── */}
      {showTimeline && (
        <div
          className="px-4 py-3 max-h-72 overflow-y-auto space-y-2"
          style={{
            borderTop: `1px solid ${isDark ? '#242732' : '#e8e8e4'}`,
            backgroundColor: isDark ? '#121318' : '#f6f7ed'
          }}
        >
          {tl.loading && (
            <div className="flex items-center justify-center py-4 gap-2 text-[#8b8e99] text-xs">
              <RefreshCw size={13} className="animate-spin" /> Loading timeline...
            </div>
          )}
          {tl.error && (
            <div className="text-xs text-amber-500 text-center py-3">{tl.error}</div>
          )}
          {!tl.loading && !tl.error && tl.events.length === 0 && (
            <div className="text-xs text-[#8b8e99] text-center py-3">No timeline events for this entity.</div>
          )}
          {!tl.loading && tl.events.length > 0 && (
            <>
              <div className="text-[10px] text-[#8b8e99] font-mono">{tl.events.length} event{tl.events.length !== 1 ? 's' : ''}</div>
              {tl.events.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-2.5 text-xs border"
                  style={{
                    backgroundColor: isDark ? '#171920' : '#ffffff',
                    borderColor: isDark ? '#292c36' : '#e8e8e4'
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase
                      ${item.type === 'critical' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                        item.type === 'warning' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' :
                          item.type === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                            'bg-blue-500/15 text-blue-400 border border-blue-500/30'}
                    `}>{item.type}</span>
                    <span className="text-[10px] font-mono text-[#8b8e99]">{item.timestamp}</span>
                  </div>
                  <p className="leading-relaxed mb-1" style={{ color: isDark ? '#e4e4e7' : '#1f1f1f' }}>{item.event}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};


/* ── Main PeopleTab Component ── */
const PeopleTab = ({ sessionId, isNotesOpen, highlightTarget }) => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('graph');
  const [personAnomalyMap, setPersonAnomalyMap] = useState({});
  const graphRef = useRef();
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const resizeObserverRef = useRef(null);

  const [selectedNode, setSelectedNode] = useState(null);
  const [entityTimeline, setEntityTimeline] = useState([]);
  const [entityTimelineLoading, setEntityTimelineLoading] = useState(false);
  const [entityTimelineError, setEntityTimelineError] = useState(null);
  const [listTimelines, setListTimelines] = useState({});

  const isDark = localStorage.getItem('nexus_theme') === 'dark';

  const theme = isDark ? {
    bgCard: '#171920',
    bgGraph: '#121316',          // Clean mild charcoal (never stark white)
    border: '#292c36',
    pillBg: '#1f222a',
    pillText: '#f4f4f5',
    pillBorder: '#2f3340',
    textHeading: '#ffffff',
    textMuted: '#8b8e99',
    linkColorActive: 'rgba(255, 255, 255, 0.40)',
    linkColorMuted: 'rgba(255, 255, 255, 0.12)'
  } : {
    bgCard: '#ffffff',
    bgGraph: '#fafaf8',
    border: '#e8e8e4',
    pillBg: '#f2f2ef',
    pillText: '#111111',
    pillBorder: '#e4e4df',
    textHeading: '#111111',
    textMuted: '#717175',
    linkColorActive: 'rgba(31, 31, 31, 0.42)',
    linkColorMuted: 'rgba(0, 0, 0, 0.10)'
  };

  useEffect(() => {
    if (highlightTarget && highlightTarget.type === 'entity' && graphData.nodes.length > 0) {
      if (viewMode !== 'list') {
        setViewMode('list');
      }
      setTimeout(() => {
        const elementId = `entity-${highlightTarget.name}`.replace(/[^a-zA-Z0-9_-]/g, '');
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-amber-400/50');
          setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400/50'), 3000);
        }
      }, 100);
    }
  }, [highlightTarget, graphData, viewMode]);

  const handleNodeClick = useCallback(async (node) => {
    if (!sessionId || !node) return;
    setSelectedNode(node);
    setEntityTimeline([]);
    setEntityTimelineLoading(true);
    setEntityTimelineError(null);

    try {
      const data = await getEntityTimeline(sessionId, node.name);
      if (data.timeline && data.timeline.length > 0) {
        setEntityTimeline(data.timeline.map((evt, i) => ({
          id: i + 1,
          timestamp: evt.timestamp || 'Unknown',
          event: evt.event,
          type: evt.type || 'info',
          sourceFile: evt.source_file || 'Unknown',
          actors: evt.actors || [],
          artifacts: evt.artifacts || [],
          confidence: evt.confidence || 'medium',
        })));
      } else {
        setEntityTimeline([]);
      }
    } catch (err) {
      setEntityTimelineError('Timeline not yet extracted. Generate a timeline first from the Timeline tab.');
    } finally {
      setEntityTimelineLoading(false);
    }
  }, [sessionId]);

  const handleListViewTimeline = useCallback(async (entityName) => {
    if (!sessionId || !entityName) return;
    setListTimelines(prev => ({
      ...prev,
      [entityName]: { loading: true, error: null, events: [] }
    }));
    try {
      const data = await getEntityTimeline(sessionId, entityName);
      const events = (data.timeline || []).map((evt, i) => ({
        id: i + 1,
        timestamp: evt.timestamp || 'Unknown',
        event: evt.event,
        type: evt.type || 'info',
        actors: evt.actors || [],
      }));
      setListTimelines(prev => ({
        ...prev,
        [entityName]: { loading: false, error: null, events }
      }));
    } catch (err) {
      setListTimelines(prev => ({
        ...prev,
        [entityName]: { loading: false, error: 'Timeline not yet extracted. Generate a timeline first.', events: [] }
      }));
    }
  }, [sessionId]);

  const containerRef = useCallback(node => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }
    if (!node) return;
    const { width, height } = node.getBoundingClientRect();
    setContainerSize({ width, height });
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(node);
    resizeObserverRef.current = observer;
  }, []);

  const fetchGraphData = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);

    try {
      const graphRes = await getSessionGraph(sessionId);

      if (graphRes.nodes && graphRes.edges) {
        const nodes = graphRes.nodes.map(n => ({
          id: n.id,
          name: n.name,
          type: n.type,
          description: n.description,
          anomaly: n.anomaly || null,
          val: n.type === 'person' ? 10 : 6
        }));

        const links = graphRes.edges.map(e => ({
          source: e.source,
          target: e.target,
          relationship: e.relationship,
          weight: e.weight || 1,
          confidence: e.confidence || 0.5,
          sourceFiles: e.source_files || [],
          evidenceCount: e.evidence_count || 1,
          properties: e.properties || {},
        }));

        setGraphData({ nodes, links });
      }
    } catch (err) {
      setError('Failed to load graph data');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  useEffect(() => {
    if (!sessionId) return;
    setPersonAnomalyMap({});

    const fetchPersonAnomalies = async () => {
      try {
        const data = await getAnomalies(sessionId);
        if (data.cached && data.person_anomalies?.length > 0) {
          const map = {};
          data.person_anomalies.forEach(p => {
            map[p.person_name.toLowerCase()] = { score: p.anomaly_score, severity: p.severity };
          });
          setPersonAnomalyMap(map);
        }
      } catch {
        // silently continue
      }
    };

    fetchPersonAnomalies();
  }, [sessionId]);

  const handleExtractEntities = async () => {
    if (!sessionId) return;
    setExtracting(true);
    setError(null);

    try {
      const result = await extractEntities(sessionId);
      if (result.success) {
        await fetchGraphData();
      } else {
        setError(result.message || 'Extraction failed');
      }
    } catch (err) {
      setError('Failed to extract entities from evidence');
    } finally {
      setExtracting(false);
    }
  };

  const getNodeColor = (node) => {
    const anomalyInfo = node.anomaly || personAnomalyMap[node.name?.toLowerCase()];
    if (anomalyInfo?.severity === 'critical' || anomalyInfo?.severity === 'high') return '#ef4444';
    if (anomalyInfo?.severity === 'moderate') return '#f59e0b';

    const typeColors = {
      person: '#3b82f6',
      organization: '#8b5cf6',
      location: '#10b981',
      event: '#f59e0b',
      vehicle: '#06b6d4',
      weapon: '#ef4444',
      document: '#6b7280',
      evidence: '#6b7280',
      phone: '#ec4899',
      email: '#84cc16',
      account: '#f97316',
      device: '#14b8a6',
      date: '#a855f7',
      money: '#eab308',
      unknown: '#71717a'
    };

    return typeColors[node.type?.toLowerCase()] || typeColors.unknown;
  };

  if (!sessionId) {
    return (
      <div
        className="rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[500px]"
        style={{
          backgroundColor: theme.bgCard,
          border: `1px solid ${theme.border}`
        }}
      >
        <div className="p-4 rounded-2xl mb-4" style={{ backgroundColor: isDark ? '#1f222a' : '#f4f4f4' }}>
          <Users size={44} className="text-[#8b8e99]" />
        </div>
        <h3 className="font-semibold text-base mb-1" style={{ color: theme.textHeading }}>No Session Active</h3>
        <p className="text-xs max-w-md" style={{ color: theme.textMuted }}>
          Open a case to view and extract entities from evidence.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-lg font-black tracking-tight uppercase" style={{ color: theme.textHeading }}>
            Knowledge Graph
          </h2>
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              backgroundColor: theme.pillBg,
              color: theme.pillText,
              border: `1px solid ${theme.pillBorder}`
            }}
          >
            {graphData.nodes.length} entities, {graphData.links.length} relationships
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Extract Entities Button */}
          <button
            onClick={handleExtractEntities}
            disabled={extracting}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 transition-all cursor-pointer hover:opacity-85 disabled:opacity-50"
            style={{
              backgroundColor: theme.pillBg,
              color: theme.pillText,
              border: `1px solid ${theme.pillBorder}`
            }}
          >
            {extracting ? <RefreshCw size={13} className="animate-spin" /> : <Scan size={13} />}
            <span>{extracting ? 'Extracting...' : 'Extract from Evidence'}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchGraphData}
            disabled={loading}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 transition-all cursor-pointer hover:opacity-85 disabled:opacity-50"
            style={{
              backgroundColor: theme.pillBg,
              color: theme.pillText,
              border: `1px solid ${theme.pillBorder}`
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          {/* View Toggle */}
          <div
            className="p-0.5 rounded-full flex items-center border"
            style={{
              backgroundColor: theme.pillBg,
              borderColor: theme.pillBorder
            }}
          >
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 rounded-full transition-all cursor-pointer ${viewMode === 'graph' ? 'shadow-sm' : 'opacity-65 hover:opacity-100'
                }`}
              style={{
                backgroundColor: viewMode === 'graph' ? (isDark ? '#2e3240' : '#ffffff') : 'transparent',
                color: theme.textHeading
              }}
            >
              <Network size={12} /> Graph
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 rounded-full transition-all cursor-pointer ${viewMode === 'list' ? 'shadow-sm' : 'opacity-65 hover:opacity-100'
                }`}
              style={{
                backgroundColor: viewMode === 'list' ? (isDark ? '#2e3240' : '#ffffff') : 'transparent',
                color: theme.textHeading
              }}
            >
              <List size={12} /> List
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div
          className="rounded-2xl p-12 flex items-center justify-center min-h-[500px]"
          style={{ backgroundColor: theme.bgGraph, border: `1px solid ${theme.border}` }}
        >
          <div className="flex flex-col items-center gap-3 text-xs text-[#8b8e99]">
            <RefreshCw size={24} className="animate-spin text-white" />
            <span>Loading graph data...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && graphData.nodes.length === 0 && (
        <div
          className="rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[500px]"
          style={{ backgroundColor: theme.bgGraph, border: `1px solid ${theme.border}` }}
        >
          <div className="p-4 rounded-2xl mb-4" style={{ backgroundColor: isDark ? '#1f222a' : '#f4f4f4' }}>
            <Network size={44} className="text-[#8b8e99]" />
          </div>
          <h3 className="font-semibold text-base mb-1" style={{ color: theme.textHeading }}>No Entities Extracted</h3>
          <p className="text-xs max-w-md mb-6" style={{ color: theme.textMuted }}>
            Click "Extract from Evidence" to automatically identify people, organizations, and relationships.
          </p>
          <button
            onClick={handleExtractEntities}
            disabled={extracting}
            className="text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:opacity-85"
            style={{ backgroundColor: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff' }}
          >
            {extracting ? <RefreshCw size={13} className="animate-spin" /> : <Scan size={13} />}
            <span>Extract Entities</span>
          </button>
        </div>
      )}

      {/* Graph View */}
      {!loading && graphData.nodes.length > 0 && viewMode === 'graph' && (
        <div className="flex gap-3 relative">
          <div
            ref={containerRef}
            className="rounded-2xl overflow-hidden relative transition-all duration-300 shadow-sm"
            style={{
              height: '600px',
              width: selectedNode ? '55%' : '100%',
              backgroundColor: theme.bgGraph,
              border: `1px solid ${theme.border}`
            }}
          >
            <ForceGraph2D
              ref={graphRef}
              width={containerSize.width}
              height={containerSize.height}
              graphData={graphData}
              nodeLabel={() => ''}
              nodeRelSize={6}
              onNodeClick={handleNodeClick}
              linkColor={link => {
                const weight = link.weight || 1;
                return weight >= 4 ? theme.linkColorActive : theme.linkColorMuted;
              }}
              linkWidth={link => Math.max(1, Math.min(5, 0.75 + (link.weight || 1) * 0.4))}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.004}
              backgroundColor={theme.bgGraph}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const fontSize = Math.max(11 / globalScale, 2);
                const nodeRadius = node.val || 5;
                const isSelected = selectedNode && node.id === selectedNode.id;
                const color = getNodeColor(node);

                ctx.beginPath();
                ctx.arc(node.x, node.y, nodeRadius + (isSelected ? 8 : 4), 0, 2 * Math.PI, false);
                ctx.fillStyle = isSelected ? (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)') : `${color}25`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
                ctx.fillStyle = color;
                ctx.fill();

                if (globalScale > 1.1 || isSelected) {
                  ctx.font = `600 ${fontSize}px sans-serif`;
                  const textWidth = ctx.measureText(label).width;
                  const padX = fontSize * 0.6;
                  const padY = fontSize * 0.4;
                  const bckgW = textWidth + padX * 2;
                  const bckgH = fontSize + padY * 2;
                  const labelYOffset = nodeRadius + 5;

                  ctx.fillStyle = isDark ? 'rgba(21, 23, 28, 0.92)' : 'rgba(255, 255, 255, 0.92)';
                  ctx.beginPath();
                  if (ctx.roundRect) {
                    ctx.roundRect(node.x - bckgW / 2, node.y + labelYOffset, bckgW, bckgH, bckgH / 2);
                  } else {
                    ctx.rect(node.x - bckgW / 2, node.y + labelYOffset, bckgW, bckgH);
                  }
                  ctx.fill();

                  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
                  ctx.lineWidth = 1 / globalScale;
                  ctx.stroke();

                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = isDark ? '#ffffff' : '#111111';
                  ctx.fillText(label, node.x, node.y + labelYOffset + bckgH / 2);
                }
              }}
              onEngineStop={() => {
                if (graphRef.current) {
                  graphRef.current.zoomToFit(400, 40);
                }
              }}
            />

            {/* Legend */}
            <div
              className="absolute bottom-4 left-4 rounded-xl p-3.5 backdrop-blur-md shadow-sm border"
              style={{
                backgroundColor: isDark ? 'rgba(21, 23, 28, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                borderColor: theme.border
              }}
            >
              <div className="text-[10px] uppercase tracking-wider text-[#8b8e99] mb-2 font-bold">Entity Types</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span style={{ color: theme.textHeading }}>Person</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span style={{ color: theme.textHeading }}>Organization</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span style={{ color: theme.textHeading }}>Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span style={{ color: theme.textHeading }}>Event</span>
                </div>
              </div>
            </div>
          </div>

          {/* Entity Timeline Side Panel */}
          {selectedNode && (
            <div
              className="w-[45%] rounded-2xl overflow-hidden flex flex-col shadow-sm border"
              style={{
                height: '600px',
                backgroundColor: theme.bgCard,
                borderColor: theme.border
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b shrink-0"
                style={{
                  backgroundColor: isDark ? '#14161c' : '#fafafa',
                  borderColor: theme.border
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: getNodeColor(selectedNode) + '30', color: getNodeColor(selectedNode) }}
                  >
                    {selectedNode.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold leading-tight" style={{ color: theme.textHeading }}>
                      {selectedNode.name}
                    </h4>
                    <span className="text-[10px] text-[#8b8e99] capitalize font-mono">
                      {selectedNode.type} timeline
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg hover:opacity-75 text-[#8b8e99] border-0 bg-transparent cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
                {entityTimelineLoading && (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-[#8b8e99] text-xs">
                    <RefreshCw size={20} className="animate-spin text-white" />
                    <span>Loading timeline...</span>
                  </div>
                )}
                {entityTimelineError && (
                  <div className="text-xs text-amber-500 text-center py-4">{entityTimelineError}</div>
                )}
                {!entityTimelineLoading && !entityTimelineError && entityTimeline.length === 0 && (
                  <div className="text-xs text-[#8b8e99] text-center py-4">No events found for {selectedNode.name}.</div>
                )}
                {!entityTimelineLoading && entityTimeline.length > 0 && (
                  <>
                    <div className="text-[10px] text-[#8b8e99] font-mono mb-1">
                      {entityTimeline.length} event{entityTimeline.length !== 1 ? 's' : ''}
                    </div>
                    {entityTimeline.map(item => (
                      <div
                        key={item.id}
                        className="rounded-xl p-3 border"
                        style={{
                          backgroundColor: isDark ? '#121318' : '#f6f7ed',
                          borderColor: theme.border
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase
                            ${item.type === 'critical' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                              item.type === 'warning' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' :
                                item.type === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                                  'bg-blue-500/15 text-blue-400 border border-blue-500/30'}
                          `}>{item.type}</span>
                          <span className="text-[10px] font-mono text-[#8b8e99]">{item.timestamp}</span>
                        </div>
                        <p className="text-xs leading-relaxed mb-1.5" style={{ color: isDark ? '#ffffff' : '#1f1f1f' }}>
                          {item.event}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-[#8b8e99]">
                          <FileText size={10} />
                          <span className="font-mono">{item.sourceFile}</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {!loading && graphData.nodes.length > 0 && viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {graphData.nodes.map((entity, idx) => (
            <EntityCard
              key={idx}
              entity={entity}
              relationships={graphData.links.filter(
                l => l.source === entity.id || l.source?.id === entity.id
              )}
              getNodeColor={getNodeColor}
              onViewTimeline={handleListViewTimeline}
              timelineData={listTimelines[entity.name]}
              isNotesOpen={isNotesOpen}
              isDark={isDark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PeopleTab;