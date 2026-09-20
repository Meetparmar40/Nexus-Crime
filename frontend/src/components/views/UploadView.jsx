import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Plus, X, BrainCircuit } from 'lucide-react';

const UploadView = ({ onUpload, isDark: propIsDark }) => {
  const [showModal, setShowModal] = useState(false);
  const [caseName, setCaseName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const fileInputRef = useRef(null);

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
    pageBg: '#15171c',
    cardBg: '#1b1d24',
    border: '#292c35',
    textPrimary: '#ffffff',
    textSecondary: '#c4c6ce',
    textMuted: '#8b8e99',
    btnPrimaryBg: '#242732',
    btnPrimaryBorder: '#3d4255',
    btnPrimaryText: '#ffffff',
    inputBg: '#1b1d24',
    inputBorder: '#292c35'
  } : {
    pageBg: '#ffffff',
    cardBg: '#f7f7f5',
    border: '#e4e4df',
    textPrimary: '#111111',
    textSecondary: '#444446',
    textMuted: '#717175',
    btnPrimaryBg: '#111111',
    btnPrimaryBorder: '#111111',
    btnPrimaryText: '#ffffff',
    inputBg: '#f4f4f4',
    inputBorder: '#e8e8e4'
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!caseName.trim() || selectedFiles.length === 0) return;
    
    onUpload(selectedFiles, caseName.trim());
    
    // Reset modal state
    setShowModal(false);
    setCaseName('');
    setSelectedFiles([]);
  };

  return (
    <div 
      className="h-full flex flex-col font-sans relative transition-colors duration-200 select-none"
      style={{
        backgroundColor: theme.pageBg,
        color: theme.textPrimary
      }}
    >
      {/* Top Header */}
      <div className="pt-10 px-8 pb-4">
        <h1 
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: theme.textPrimary }}
        >
          Case Workspace
        </h1>
        <p className="mt-1 text-sm" style={{ color: theme.textMuted }}>
          Manage your forensic investigations or start a new one.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full text-center flex flex-col items-center">
          <div 
            className="w-18 h-18 rounded-3xl flex items-center justify-center mb-6 shadow-sm transition-colors"
            style={{
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`
            }}
          >
            <FileText size={30} style={{ color: theme.textMuted }} />
          </div>
          <h2 
            className="text-xl font-bold mb-2 tracking-tight"
            style={{ color: theme.textPrimary }}
          >
            No Active Case Selected
          </h2>
          <p 
            className="text-sm mb-8 leading-relaxed max-w-sm"
            style={{ color: theme.textMuted }}
          >
            Select an existing case from the sidebar history, or create a new investigation to start analyzing evidence.
          </p>
          
          <button 
            type="button"
            onClick={() => setShowModal(true)}
            className="font-bold px-7 py-3.5 rounded-full text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer hover:opacity-90"
            style={{
              backgroundColor: theme.btnPrimaryBg,
              color: theme.btnPrimaryText,
              border: `1px solid ${theme.btnPrimaryBorder}`
            }}
          >
            <Plus size={18} />
            <span>Create New Case</span>
          </button>
        </div>
      </div>

      {/* Create Case Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col transition-all"
            style={{
              backgroundColor: theme.pageBg,
              border: `1px solid ${theme.border}`,
              color: theme.textPrimary
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div 
              className="flex justify-between items-center p-6 border-b transition-colors"
              style={{ borderColor: theme.border }}
            >
              <div>
                <h3 className="text-lg font-bold tracking-tight" style={{ color: theme.textPrimary }}>
                  New Investigation
                </h3>
                <p className="text-xs" style={{ color: theme.textMuted }}>
                  Define case identifier and attach evidence files
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full transition-colors cursor-pointer hover:opacity-75"
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.border}`,
                  color: theme.textMuted
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateCase} className="p-6 space-y-5">
              {/* Case Name Input */}
              <div className="space-y-1.5 text-left">
                <label 
                  className="text-[11px] font-mono font-semibold uppercase tracking-wider block"
                  style={{ color: theme.textMuted }}
                >
                  Case Identifier / Name
                </label>
                <input 
                  type="text"
                  required
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  placeholder="e.g., Operation Blackout Analysis"
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none"
                  style={{
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.inputBorder}`,
                    color: theme.textPrimary
                  }}
                />
              </div>

              {/* File Upload Zone */}
              <div className="space-y-1.5 text-left">
                <label 
                  className="text-[11px] font-mono font-semibold uppercase tracking-wider block"
                  style={{ color: theme.textMuted }}
                >
                  Digital Evidence Archive
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center cursor-pointer transition-all group"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.cardBg
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    required
                    accept=".pdf,.docx,.pptx,.doc,.ppt,.rtf,.txt,.csv,.json,.log,.zip"
                    className="hidden"
                  />
                  <div 
                    className="p-3.5 rounded-2xl transition-colors duration-200 mb-3"
                    style={{
                      backgroundColor: theme.pageBg,
                      border: `1px solid ${theme.border}`
                    }}
                  >
                    <Upload size={22} style={{ color: theme.textMuted }} />
                  </div>
                  
                  {selectedFiles.length > 0 ? (
                    <div className="text-center">
                      <p className="font-bold text-xs sm:text-sm" style={{ color: theme.textPrimary }}>
                        {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} staged for analysis
                      </p>
                      <p className="text-[11px] mt-1 line-clamp-1" style={{ color: theme.textMuted }}>
                        {selectedFiles.map(f => f.name).join(', ')}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="font-semibold text-xs sm:text-sm" style={{ color: theme.textPrimary }}>
                        Click to browse digital evidence files
                      </p>
                      <p className="text-[11px] mt-1" style={{ color: theme.textMuted }}>
                        PDF, DOCX, TXT, CSV, LOG, ZIP
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div 
                className="pt-4 flex justify-end gap-3 border-t"
                style={{ borderColor: theme.border }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.border}`,
                    color: theme.textMuted
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!caseName.trim() || selectedFiles.length === 0}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center gap-2 cursor-pointer hover:opacity-90"
                  style={{
                    backgroundColor: theme.btnPrimaryBg,
                    color: theme.btnPrimaryText,
                    border: `1px solid ${theme.btnPrimaryBorder}`
                  }}
                >
                  <BrainCircuit size={15} />
                  <span>Process Case</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadView;
