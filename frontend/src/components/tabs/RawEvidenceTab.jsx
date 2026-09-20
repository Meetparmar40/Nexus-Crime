import React, { useState, useEffect } from 'react';
import { FolderOpen, FileText, Image as ImageIcon, File, ExternalLink, Download } from 'lucide-react';
import { getSessionFiles } from '../../utils/api';

const API_BASE_URL = 'http://127.0.0.1:8000';

const getFileTypeInfo = (filename) => {
  const ext = filename?.split('.').pop()?.toLowerCase() || '';
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
    return { type: 'image', icon: ImageIcon, color: 'text-pink-400' };
  } else if (ext === 'pdf') {
    return { type: 'pdf', icon: FileText, color: 'text-red-400' };
  } else if (['txt', 'csv', 'json', 'log'].includes(ext)) {
    return { type: 'text', icon: FileText, color: 'text-blue-400' };
  } else {
    return { type: 'other', icon: File, color: 'text-gray-400' };
  }
};

const RawEvidenceTab = ({ sessionId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const isDark = localStorage.getItem('nexus_theme') === 'dark';

  const theme = isDark ? {
    bgCard: '#15171c',          // Mild charcoal card
    bgCardAlt: '#101114',
    bgItemActive: '#222530',
    border: '#292c35',          // Mild dark outline
    borderSubtle: '#22252e',
    textHeading: '#ffffff',
    textBody: '#c4c6ce',
    textMuted: '#8b8e99',
    pillBg: '#1f222a',
    pillBorder: '#2f3340',
    pillText: '#f4f4f5',
  } : {
    bgCard: '#ffffff',
    bgCardAlt: '#fafaf8',
    bgItemActive: '#f4f4f2',
    border: '#e8e8e4',
    borderSubtle: '#f0f0ed',
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
      try {
        const data = await getSessionFiles(sessionId);
        if (data.files && data.files.length > 0) {
          setFiles(data.files);
          const firstViewable = data.files.find(f => {
            const type = getFileTypeInfo(f).type;
            return type === 'image' || type === 'pdf' || type === 'text';
          });
          if (firstViewable) setSelectedFile(firstViewable);
          else setSelectedFile(data.files[0]);
        }
      } catch (err) {
        console.error('Error fetching files:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [sessionId]);

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

  if (files.length === 0) {
    return (
      <div
        className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}
      >
        <FolderOpen size={44} className="mb-4 text-[#8b8e99]" />
        <h3 className="font-semibold text-base mb-1" style={{ color: theme.textHeading }}>No Raw Evidence</h3>
        <p className="text-xs" style={{ color: theme.textMuted }}>Upload files to inspect original un-parsed artifacts.</p>
      </div>
    );
  }

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    const fileUrl = `${API_BASE_URL}/sessions/${sessionId}/files/download/${encodeURIComponent(selectedFile)}`;
    const { type } = getFileTypeInfo(selectedFile);

    if (type === 'image') {
      return (
        <div
          className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden p-4"
          style={{ backgroundColor: theme.bgCardAlt, border: `1px solid ${theme.border}` }}
        >
          <img src={fileUrl} alt={selectedFile} className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      );
    } else if (type === 'pdf' || type === 'text') {
      return (
        <div
          className="w-full h-full rounded-xl overflow-hidden"
          style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.bgCard }}
        >
          <iframe
            src={fileUrl}
            title={selectedFile}
            className="w-full h-full border-none"
          />
        </div>
      );
    } else {
      return (
        <div
          className="w-full h-full flex flex-col items-center justify-center rounded-xl p-6"
          style={{ backgroundColor: theme.bgCardAlt, border: `1px solid ${theme.border}` }}
        >
          <File size={56} className="text-[#8b8e99] mb-3" />
          <p className="text-xs mb-4" style={{ color: theme.textMuted }}>No inline preview available for this file type.</p>
          <a
            href={fileUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer hover:opacity-85 shadow-sm"
            style={{
              backgroundColor: theme.pillBg,
              color: theme.pillText,
              border: `1px solid ${theme.pillBorder}`
            }}
          >
            <Download size={14} />
            <span>Download Artifact</span>
          </a>
        </div>
      );
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-4">
      {/* Sidebar File List */}
      <div
        className="w-64 shrink-0 rounded-2xl flex flex-col overflow-hidden shadow-sm transition-colors duration-200"
        style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}
      >
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: isDark ? '#191b22' : '#fafaf8',
            borderColor: theme.border
          }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider font-mono" style={{ color: theme.textHeading }}>
            Files
          </h3>
          <span
            className="text-[11px] font-mono px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: theme.pillBg,
              color: theme.pillText,
              border: `1px solid ${theme.pillBorder}`
            }}
          >
            {files.length} items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {files.map(file => {
              const { icon: Icon, color } = getFileTypeInfo(file);
              const isSelected = selectedFile === file;
              return (
                <li key={file}>
                  <button
                    onClick={() => setSelectedFile(file)}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? theme.bgItemActive : 'transparent',
                      color: isSelected ? theme.textHeading : theme.textMuted,
                      fontWeight: isSelected ? '600' : '400'
                    }}
                  >
                    <Icon size={15} className={isSelected ? 'text-blue-400' : color} />
                    <span className="truncate">{file}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Main Preview Area */}
      <div
        className="flex-1 rounded-2xl p-4 flex flex-col shadow-sm transition-colors duration-200"
        style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}
      >
        {selectedFile && (
          <div
            className="flex flex-wrap items-center justify-between mb-3 pb-3 border-b gap-3"
            style={{ borderColor: theme.border }}
          >
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-semibold truncate max-w-sm" style={{ color: theme.textHeading }}>
                {selectedFile}
              </h2>
              <span
                className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: theme.pillBg,
                  color: theme.pillText,
                  border: `1px solid ${theme.pillBorder}`
                }}
              >
                {getFileTypeInfo(selectedFile).type}
              </span>
            </div>

            <a
              href={`${API_BASE_URL}/sessions/${sessionId}/files/download/${encodeURIComponent(selectedFile)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all hover:opacity-80"
              style={{
                backgroundColor: theme.pillBg,
                color: theme.pillText,
                border: `1px solid ${theme.pillBorder}`
              }}
            >
              <ExternalLink size={12} />
              <span>Open in New Tab</span>
            </a>
          </div>
        )}

        <div className="flex-1 min-h-0">
          {renderFilePreview()}
        </div>
      </div>
    </div>
  );
};

export default RawEvidenceTab;