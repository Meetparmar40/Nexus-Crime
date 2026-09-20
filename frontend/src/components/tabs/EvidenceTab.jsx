import React, { useState, useEffect, useCallback } from 'react';
import { Camera, FileText, MessageSquare, FolderOpen, AlertCircle, Zap, RefreshCw, GripVertical } from 'lucide-react';
import { getSessionFiles, detectAnomalies, getAnomalies } from '../../utils/api';
import RelevanceBar from '../ui/RelevanceBar';
import { AnomalyBadge, AnomalyDetailPanel } from '../ui/AnomalyBadge';

const getFileTypeInfo = (filename) => {
  const ext = filename?.split('.').pop()?.toLowerCase() || '';
  const typeMap = {
    pdf: { type: 'Document', icon: FileText, color: 'text-blue-400' },
    docx: { type: 'Document', icon: FileText, color: 'text-blue-400' },
    doc: { type: 'Document', icon: FileText, color: 'text-blue-400' },
    pptx: { type: 'Presentation', icon: FileText, color: 'text-orange-400' },
    ppt: { type: 'Presentation', icon: FileText, color: 'text-orange-400' },
    txt: { type: 'Text', icon: FileText, color: 'text-[#8b8e99]' },
    log: { type: 'Log', icon: FileText, color: 'text-emerald-400' },
    csv: { type: 'Data', icon: FileText, color: 'text-amber-400' },
    json: { type: 'Data', icon: FileText, color: 'text-amber-400' },
    mp4: { type: 'Video', icon: Camera, color: 'text-purple-400' },
    avi: { type: 'Video', icon: Camera, color: 'text-purple-400' },
    wav: { type: 'Audio', icon: MessageSquare, color: 'text-amber-400' },
    mp3: { type: 'Audio', icon: MessageSquare, color: 'text-amber-400' },
    png: { type: 'Image', icon: Camera, color: 'text-pink-400' },
    jpg: { type: 'Image', icon: Camera, color: 'text-pink-400' },
    jpeg: { type: 'Image', icon: Camera, color: 'text-pink-400' },
  };
  return typeMap[ext] || { type: 'File', icon: FileText, color: 'text-[#8b8e99]' };
};

const EvidenceTab = ({ sessionId, isNotesOpen, highlightTarget }) => {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anomalyData, setAnomalyData] = useState({});
  const [detecting, setDetecting] = useState(false);
  const [detectionRan, setDetectionRan] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const isDark = localStorage.getItem('nexus_theme') === 'dark';

  const theme = isDark ? {
    bgCard: '#15171c',          // Base card container
    bgNested: '#0f1013',        // Mild dark canvas for expanded row
    bgRowHover: '#1a1d24',
    border: '#292c35',
    borderRow: 'rgba(255, 255, 255, 0.08)', // Mild white line separating reports
    textHeading: '#ffffff',
    textBody: '#c4c6ce',
    textMuted: '#8b8e99',
    pillBg: '#1f222a',
    pillBorder: '#2f3340',
    pillText: '#f4f4f5',
  } : {
    bgCard: '#ffffff',
    bgNested: '#fafaf8',
    bgRowHover: '#f9f9f8',
    border: '#e8e8e4',
    borderRow: '#f0f0ed',
    textHeading: '#111111',
    textBody: '#444446',
    textMuted: '#717175',
    pillBg: '#f2f2ef',
    pillBorder: '#e4e4df',
    pillText: '#111111',
  };

  useEffect(() => {
    if (!sessionId) return;
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSessionFiles(sessionId);
        if (data.files && data.files.length > 0) {
          const formatted = data.files.map((f, idx) => ({
            id: idx + 1,
            name: f,
            location: 'Uploaded Evidence',
            ...getFileTypeInfo(f),
            relevance: Math.floor(Math.random() * 30) + 70,
            size: 'N/A',
          }));
          setEvidence(formatted);
        } else {
          setEvidence([]);
        }
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('Failed to load evidence files');
        setEvidence([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [sessionId]);

  useEffect(() => {
    if (highlightTarget && highlightTarget.type === 'evidence' && evidence.length > 0) {
      const elementId = `evidence-${highlightTarget.filename}`.replace(/[^a-zA-Z0-9_-]/g, '');
      const el = document.getElementById(elementId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add(isDark ? 'bg-amber-950/40' : 'bg-yellow-100');
          setTimeout(() => el.classList.remove(isDark ? 'bg-amber-950/40' : 'bg-yellow-100'), 3000);
        }, 100);
      }
    }
  }, [highlightTarget, evidence, isDark]);

  useEffect(() => {
    if (!sessionId) return;
    setAnomalyData({});
    setExpandedRows(new Set());
    setDetectionRan(false);

    const fetchCachedAnomalies = async () => {
      try {
        const data = await getAnomalies(sessionId);
        if (data.cached && data.document_anomalies?.length > 0) {
          const map = {};
          data.document_anomalies.forEach(a => { map[a.filename] = a; });
          setAnomalyData(map);
          setDetectionRan(true);
        }
      } catch {
        // Silently continue
      }
    };
    fetchCachedAnomalies();
  }, [sessionId]);

  const handleDetectAnomalies = useCallback(async () => {
    if (!sessionId || detecting) return;
    setDetecting(true);
    setError(null);
    try {
      const result = await detectAnomalies(sessionId);
      if (result.success === false) {
        setError(`Anomaly detection failed: ${result.message || 'Unknown error'}`);
        return;
      }
      const anomalies = result.document_anomalies || [];
      if (anomalies.length > 0) {
        const map = {};
        anomalies.forEach(a => { map[a.filename] = a; });
        setAnomalyData(map);
        setExpandedRows(new Set());
      }
      setDetectionRan(true);
    } catch (err) {
      setError(`Anomaly detection failed: ${err.message}`);
    } finally {
      setDetecting(false);
    }
  }, [sessionId, detecting]);

  const toggleRow = useCallback((filename) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(filename)) next.delete(filename);
      else next.add(filename);
      return next;
    });
  }, []);

  const highCount = Object.values(anomalyData).filter(a => a.severity === 'high').length;
  const moderateCount = Object.values(anomalyData).filter(a => a.severity === 'moderate').length;
  const hasAnomalies = Object.keys(anomalyData).length > 0;

  if (!sessionId) {
    return (
      <div
        className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}
      >
        <FolderOpen size={44} className="mb-4 text-[#8b8e99]" />
        <h3 className="font-semibold text-base mb-1" style={{ color: theme.textHeading }}>No Session Active</h3>
        <p className="text-xs" style={{ color: theme.textMuted }}>Open a case to view evidence files.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="rounded-2xl p-12 flex items-center justify-center"
        style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}
      >
        <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full" style={{ borderColor: theme.textHeading, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}
      >
        <AlertCircle size={44} className="text-red-400 mb-3" />
        <h3 className="text-red-400 font-medium mb-1">Error</h3>
        <p className="text-xs text-[#8b8e99]">{error}</p>
      </div>
    );
  }

  if (evidence.length === 0) {
    return (
      <div
        className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}
      >
        <FolderOpen size={44} className="mb-4 text-[#8b8e99]" />
        <h3 className="font-semibold text-base mb-1" style={{ color: theme.textHeading }}>No Evidence Files</h3>
        <p className="text-xs" style={{ color: theme.textMuted }}>Upload evidence files to begin your investigation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-lg font-black tracking-tight uppercase" style={{ color: theme.textHeading }}>
            Evidence Files
          </h2>
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              backgroundColor: theme.pillBg,
              color: theme.pillText,
              border: `1px solid ${theme.pillBorder}`
            }}
          >
            {evidence.length} files
          </span>

          {hasAnomalies && (
            <div className="flex items-center gap-2">
              {highCount > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full border bg-red-500/15 border-red-500/30 text-red-400 font-medium font-mono">
                  {highCount} high
                </span>
              )}
              {moderateCount > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full border bg-amber-500/15 border-amber-500/30 text-amber-400 font-medium font-mono">
                  {moderateCount} moderate
                </span>
              )}
              {highCount === 0 && moderateCount === 0 && detectionRan && (
                <span className="text-xs px-2.5 py-0.5 rounded-full border bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-medium font-mono">
                  All clear
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleDetectAnomalies}
          disabled={detecting}
          className="text-xs font-semibold px-4 py-2 rounded-full border flex items-center gap-2 transition-all cursor-pointer hover:opacity-85 disabled:opacity-50 shadow-sm"
          style={{
            backgroundColor: theme.pillBg,
            color: theme.pillText,
            border: `1px solid ${theme.pillBorder}`
          }}
        >
          {detecting ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
          <span>{detecting ? 'Detecting…' : hasAnomalies || detectionRan ? 'Re-detect Anomalies' : 'Detect Anomalies'}</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div
        className="rounded-2xl overflow-hidden shadow-sm transition-colors duration-200"
        style={{
          backgroundColor: theme.bgCard,
          border: `1px solid ${theme.border}`
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead
              className="text-xs uppercase font-mono tracking-wider font-semibold"
              style={{
                backgroundColor: isDark ? '#1a1c22' : '#f7f7f5',
                color: theme.textMuted,
                borderBottom: `1px solid ${theme.border}`
              }}
            >
              <tr>
                <th className="px-5 py-3.5">Evidence Name</th>
                <th className="px-5 py-3.5">Location / Source</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 w-44">Case Relevance</th>
                <th className="px-5 py-3.5 w-36">Anomaly Score</th>
                <th className="px-5 py-3.5 text-right">Size</th>
              </tr>
            </thead>

            <tbody>
              {evidence.map((file) => {
                const IconComponent = file.icon;
                const anomaly = anomalyData[file.name] || null;
                const isExpanded = expandedRows.has(file.name);
                const isExpandable = anomaly && (anomaly.severity === 'moderate' || anomaly.severity === 'high' || Object.values(anomaly.category_scores || {}).some(v => v > 0));

                return (
                  <React.Fragment key={file.id}>
                    <tr
                      id={`evidence-${file.name}`.replace(/[^a-zA-Z0-9_-]/g, '')}
                      className="transition-colors group"
                      style={{
                        borderBottom: `1px solid ${theme.borderRow}`
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.bgRowHover; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      draggable={isNotesOpen}
                      onDragStart={(e) => {
                        if (!isNotesOpen) return;
                        e.dataTransfer.setData('application/json', JSON.stringify({
                          type: 'evidence',
                          filename: file.name,
                          file_type: file.type
                        }));
                      }}
                    >
                      <td
                        className="px-5 py-3.5 font-medium flex items-center gap-3 relative"
                        style={{ color: theme.textHeading }}
                      >
                        {isNotesOpen && (
                          <div className="text-[#8b8e99] opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical size={14} />
                          </div>
                        )}
                        <IconComponent size={16} className={file.color} />
                        <span className="truncate max-w-[200px]" title={file.name}>{file.name}</span>
                      </td>

                      <td
                        className="px-5 py-3.5 font-mono text-xs truncate max-w-[150px]"
                        style={{ color: theme.textMuted }}
                        title={file.location}
                      >
                        {file.location}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className="px-2.5 py-1 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: isDark ? '#1f222a' : '#f2f2ef',
                            color: theme.pillText,
                            border: `1px solid ${theme.pillBorder}`
                          }}
                        >
                          {file.type}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <RelevanceBar score={file.relevance} />
                      </td>

                      <td className="px-5 py-3.5">
                        {detecting ? (
                          <span className="text-xs text-[#8b8e99] animate-pulse font-mono">analysing…</span>
                        ) : (
                          <AnomalyBadge
                            score={anomaly?.anomaly_score ?? null}
                            severity={anomaly?.severity ?? null}
                            onClick={isExpandable ? () => toggleRow(file.name) : undefined}
                          />
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right font-mono text-xs" style={{ color: theme.textMuted }}>
                        {file.size}
                      </td>
                    </tr>

                    {/* Expanded Detail Panel: Clean Mild Charcoal Backdrop (No Olive/Grey Artifacts) */}
                    {isExpandable && isExpanded && (
                      <tr style={{ borderBottom: `1px solid ${theme.borderRow}` }}>
                        <td
                          colSpan={6}
                          className="px-5 py-4"
                          style={{ backgroundColor: theme.bgNested }}
                        >
                          <AnomalyDetailPanel anomaly={anomaly} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {hasAnomalies && (highCount > 0 || moderateCount > 0) && (
        <p className="text-xs text-right" style={{ color: theme.textMuted }}>
          Click a <span className="text-amber-400 font-semibold">moderate</span> or <span className="text-red-400 font-semibold">high</span> anomaly badge to toggle detailed flags.
        </p>
      )}
    </div>
  );
};

export default EvidenceTab;