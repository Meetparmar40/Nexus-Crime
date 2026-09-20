import React, { useState, useEffect, useCallback } from 'react';
import { X, Tag, Paperclip, Trash2, Plus, Clock, FileText, User, Activity, AlertCircle } from 'lucide-react';
import { getSessionNotes, createNote, deleteNote } from '../../utils/api';

const NotesSidebar = ({ sessionId, onClose, onNavigate, isDark: propIsDark }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [draftContent, setDraftContent] = useState('');
  const [draftTags, setDraftTags] = useState([]);
  const [draftAttachments, setDraftAttachments] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Self-managed or inherited theme state
  const [isDark, setIsDark] = useState(() => {
    if (typeof propIsDark === 'boolean') return propIsDark;
    const saved = localStorage.getItem('nexus_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (typeof propIsDark === 'boolean') {
      setIsDark(propIsDark);
    }
  }, [propIsDark]);

  useEffect(() => {
    const handleThemeChange = () => {
      const saved = localStorage.getItem('nexus_theme');
      setIsDark(saved === 'dark');
    };

    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('nexus_theme_change', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('nexus_theme_change', handleThemeChange);
    };
  }, []);

  const theme = isDark ? {
    panelBg: '#15171c',
    headerBg: '#15171c',
    border: '#292c35',
    cardBg: '#1b1d24',
    textareaBg: '#1b1d24',
    textPrimary: '#ffffff',
    textSecondary: '#c4c6ce',
    textMuted: '#8b8e99',
    btnPrimaryBg: '#242732',
    btnPrimaryBorder: '#3d4255',
    btnPrimaryText: '#ffffff',
    tagBg: '#242732',
    tagBorder: '#3d4255',
    tagText: '#ffffff'
  } : {
    panelBg: '#ffffff',
    headerBg: '#fafafa',
    border: '#e4e4df',
    cardBg: '#ffffff',
    textareaBg: '#f7f7f5',
    textPrimary: '#111111',
    textSecondary: '#444446',
    textMuted: '#717175',
    btnPrimaryBg: '#111111',
    btnPrimaryBorder: '#111111',
    btnPrimaryText: '#ffffff',
    tagBg: '#f2f2ef',
    tagBorder: '#e4e4df',
    tagText: '#111111'
  };

  const fetchNotes = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const data = await getSessionNotes(sessionId);
      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      
      // Prevent duplicates
      const isDuplicate = draftAttachments.some(a => JSON.stringify(a) === JSON.stringify(data));
      if (!isDuplicate) {
        setDraftAttachments(prev => [...prev, data]);
      }
    } catch (err) {
      console.error('Failed to parse dropped data:', err);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!draftTags.includes(tagInput.trim())) {
        setDraftTags(prev => [...prev, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setDraftTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const removeAttachment = (idxToRemove) => {
    setDraftAttachments(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSaveNote = async () => {
    if (!draftContent.trim() && draftAttachments.length === 0) return;
    
    const newNote = {
      content: draftContent,
      tags: draftTags,
      attachments: draftAttachments
    };

    try {
      await createNote(sessionId, newNote);
      setDraftContent('');
      setDraftTags([]);
      setDraftAttachments([]);
      fetchNotes(); // refresh
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to save note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(sessionId, noteId);
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
    }
  };

  const handleAttachmentClick = (attachment) => {
    if (!onNavigate) return;
    if (attachment.type === 'entity') {
      onNavigate('people', attachment);
    } else if (attachment.type === 'timeline_event') {
      onNavigate('timeline', attachment);
    } else if (attachment.type === 'evidence') {
      onNavigate('evidence', attachment);
    }
  };

  const renderAttachment = (attachment, idx, isDraft = false) => {
    let icon = <Paperclip size={12} />;
    let label = 'Attachment';
    let colorClass = isDark 
      ? 'text-neutral-300 bg-neutral-800 border-neutral-700' 
      : 'text-gray-600 bg-gray-100 border-gray-200';

    if (attachment.type === 'entity') {
      icon = <User size={12} />;
      label = attachment.name || 'Entity';
      colorClass = isDark
        ? 'text-blue-300 bg-blue-950/50 border-blue-800/60 hover:bg-blue-900/50'
        : 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100';
    } else if (attachment.type === 'timeline_event') {
      icon = <Activity size={12} />;
      label = attachment.title || 'Event';
      colorClass = isDark
        ? 'text-purple-300 bg-purple-950/50 border-purple-800/60 hover:bg-purple-900/50'
        : 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100';
    } else if (attachment.type === 'evidence') {
      icon = <FileText size={12} />;
      label = attachment.filename || 'File';
      colorClass = isDark
        ? 'text-emerald-300 bg-emerald-950/50 border-emerald-800/60 hover:bg-emerald-900/50'
        : 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100';
    }

    return (
      <div 
        key={idx} 
        className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-medium ${colorClass} max-w-full ${!isDraft ? 'cursor-pointer shadow-sm hover:shadow transition-all' : ''}`}
        onClick={() => !isDraft && handleAttachmentClick(attachment)}
        title={!isDraft ? `Go to ${attachment.type} tab` : ""}
      >
        {icon}
        <span className="truncate">{label}</span>
        {isDraft && (
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); removeAttachment(idx); }} 
            className="ml-1 hover:text-black opacity-60 hover:opacity-100 focus:outline-none cursor-pointer"
          >
            <X size={10} />
          </button>
        )}
      </div>
    );
  };

  return (
    <aside 
      className="w-80 md:w-96 shrink-0 h-full flex flex-col shadow-[-4px_0_20px_rgba(0,0,0,0.02)] transition-all duration-300 z-20 select-none"
      style={{
        backgroundColor: theme.panelBg,
        borderLeft: `1px solid ${theme.border}`,
        color: theme.textSecondary
      }}
    >
      {/* Header */}
      <div 
        className="px-5 py-4 flex items-center justify-between shrink-0 transition-colors"
        style={{
          backgroundColor: theme.headerBg,
          borderBottom: `1px solid ${theme.border}`
        }}
      >
        <div 
          className="text-[14px] font-bold flex items-center gap-2 whitespace-nowrap tracking-tight"
          style={{ color: theme.textPrimary }}
        >
          <FileText size={16} style={{ color: theme.textMuted }} />
          Investigation Notes
        </div>
        {onClose && (
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 rounded-lg transition-colors cursor-pointer hover:opacity-75"
            style={{
              color: theme.textMuted,
              backgroundColor: isDark ? '#1b1d24' : '#f4f4f4',
              border: `1px solid ${theme.border}`
            }}
            title="Close Notes"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Draft Area */}
      <div 
        className="p-4 shrink-0 transition-colors relative"
        style={{
          backgroundColor: theme.panelBg,
          borderBottom: `1px solid ${theme.border}`
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDraggingOver && (
          <div 
            className="absolute inset-0 z-10 flex flex-col items-center justify-center border-2 border-dashed rounded-xl m-3 pointer-events-none"
            style={{
              backgroundColor: isDark ? 'rgba(36, 39, 50, 0.85)' : 'rgba(239, 246, 255, 0.85)',
              borderColor: isDark ? '#3d4255' : '#60a5fa'
            }}
          >
            <Paperclip size={24} className={isDark ? 'text-neutral-200 mb-2' : 'text-blue-500 mb-2'} />
            <p className="text-xs font-semibold" style={{ color: theme.textPrimary }}>Drop to attach to note</p>
          </div>
        )}
        
        <div className="relative">
          <textarea
            className="w-full text-xs sm:text-sm rounded-xl p-3 focus:outline-none min-h-[96px] resize-none transition-colors"
            style={{
              backgroundColor: theme.textareaBg,
              border: `1px solid ${theme.border}`,
              color: theme.textPrimary
            }}
            placeholder="Write a note... Drag and drop entities, events, or files here to attach them."
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
          />

          {/* Attachments rendering */}
          {draftAttachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {draftAttachments.map((att, i) => renderAttachment(att, i, true))}
            </div>
          )}

          {/* Tags rendering & input */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {draftTags.map(tag => (
              <span 
                key={tag} 
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: theme.tagBg,
                  color: theme.tagText,
                  border: `1px solid ${theme.tagBorder}`
                }}
              >
                <Tag size={9} /> {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-100 opacity-60 ml-0.5 cursor-pointer"><X size={9} /></button>
              </span>
            ))}
            <input 
              type="text"
              placeholder="Add tag + Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="text-[11px] bg-transparent border-none focus:outline-none min-w-[110px]"
              style={{
                color: theme.textPrimary
              }}
            />
          </div>

          <div className="mt-3 flex justify-end">
            <button 
              type="button"
              onClick={handleSaveNote}
              disabled={!draftContent.trim() && draftAttachments.length === 0}
              className="text-xs px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-sm hover:opacity-90"
              style={{
                backgroundColor: theme.btnPrimaryBg,
                color: theme.btnPrimaryText,
                border: `1px solid ${theme.btnPrimaryBorder}`
              }}
            >
              <Plus size={14} /> Save Note
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div 
          className="mx-4 mt-3 p-2.5 rounded-xl flex items-center gap-2 text-xs font-medium border"
          style={{
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
            borderColor: isDark ? 'rgba(239, 68, 68, 0.25)' : '#fee2e2',
            color: '#f87171'
          }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-neutral-400/40 scrollbar-track-transparent">
        {loading && notes.length === 0 ? (
          <div className="flex justify-center py-8">
            <div 
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: theme.textPrimary, borderTopColor: 'transparent' }}
            />
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12" style={{ color: theme.textMuted }}>
            <FileText size={28} className="mb-2.5 opacity-40" />
            <p className="text-xs font-semibold">No notes recorded yet</p>
            <p className="text-[11px] mt-0.5 opacity-80">Type above or drag items into this panel</p>
          </div>
        ) : (
          notes.map(note => (
            <div 
              key={note.id} 
              className="rounded-2xl p-3.5 transition-all group"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.border}`,
                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.25)' : '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div 
                  className="flex items-center gap-1.5 text-[10px] font-mono"
                  style={{ color: theme.textMuted }}
                >
                  <Clock size={10} />
                  {new Date(note.created_at).toLocaleString(undefined, {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
                <button 
                  type="button"
                  onClick={() => handleDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all border-none bg-transparent p-0.5 cursor-pointer hover:text-red-500"
                  style={{ color: theme.textMuted }}
                  title="Delete note"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              
              {note.content && (
                <p 
                  className="text-xs sm:text-[13px] whitespace-pre-wrap leading-relaxed mb-2.5"
                  style={{ color: theme.textSecondary }}
                >
                  {note.content}
                </p>
              )}

              {note.attachments && note.attachments.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {note.attachments.map((att, i) => renderAttachment(att, i, false))}
                </div>
              )}

              {note.tags && note.tags.length > 0 && (
                <div 
                  className="flex flex-wrap gap-1 mt-2 pt-2"
                  style={{ borderTop: `1px solid ${theme.border}` }}
                >
                  {note.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: theme.tagBg,
                        color: theme.textMuted,
                        border: `1px solid ${theme.tagBorder}`
                      }}
                    >
                      <Tag size={8} /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default NotesSidebar;
