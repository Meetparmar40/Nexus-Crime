import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Settings, 
  LogOut, 
  Dna,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Plus,
  Trash2,
  X,
  Sun,
  Moon,
  Check,
  Palette
} from 'lucide-react';

const Sidebar = ({ 
  savedCases, 
  onDeleteCase, 
  collapsed, 
  onToggleCollapse, 
  onLogout,
  isDark: propIsDark 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Self-managed or inherited theme state
  const [isDark, setIsDark] = useState(() => {
    if (typeof propIsDark === 'boolean') return propIsDark;
    const saved = localStorage.getItem('nexus_theme');
    return saved === 'dark';
  });

  const [showSettings, setShowSettings] = useState(false);

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

  const handleSetTheme = (mode) => {
    localStorage.setItem('nexus_theme', mode);
    setIsDark(mode === 'dark');
    document.documentElement.classList.toggle('dark', mode === 'dark');
    window.dispatchEvent(new CustomEvent('nexus_theme_change', { detail: mode }));
  };

  const theme = isDark ? {
    sidebarBg: '#15171c',
    border: '#292c35',
    borderSubtle: '#22252e',
    textPrimary: '#ffffff',
    textSecondary: '#c4c6ce',
    textMuted: '#8b8e99',
    newCaseBg: '#242732',
    newCaseText: '#ffffff',
    newCaseBorder: '#3d4255',
    newCaseActiveBg: '#2e3342',
    historyActiveBg: '#1b1d24',
    historyActiveBorder: '#292c35',
    historyActiveText: '#ffffff',
    hoverBg: '#1b1d24',
    cardBg: '#15171c',
    nestedCardBg: '#1b1d24',
    highlightBorder: '#3d4255'
  } : {
    sidebarBg: '#ffffff',
    border: '#e4e4df',
    borderSubtle: '#ededeb',
    textPrimary: '#111111',
    textSecondary: '#444446',
    textMuted: '#717175',
    newCaseBg: '#ffffff',
    newCaseText: '#111111',
    newCaseBorder: '#e4e4df',
    newCaseActiveBg: '#111111',
    historyActiveBg: '#f2f2ef',
    historyActiveBorder: '#e4e4df',
    historyActiveText: '#111111',
    hoverBg: '#f2f2ef',
    cardBg: '#ffffff',
    nestedCardBg: '#f7f7f5',
    highlightBorder: '#111111'
  };

  return (
    <>
      <aside 
        className={`${collapsed ? 'w-[68px]' : 'w-64'} shrink-0 rounded-[24px] flex flex-col fixed left-4 top-4 bottom-4 z-40 transition-all duration-300 ease-in-out select-none`}
        style={{
          backgroundColor: theme.sidebarBg,
          border: `1px solid ${theme.border}`,
          boxShadow: isDark 
            ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)' 
            : '0 8px 30px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Logo + Collapse Toggle */}
        <div 
          className={`py-4 w-full flex items-center transition-colors ${
            collapsed ? 'justify-center px-0' : 'justify-between px-3.5'
          }`}
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          {!collapsed && (
            <div 
              className="flex items-center gap-2.5 min-w-0 cursor-pointer"
              onClick={() => navigate('/c')}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                style={{
                  backgroundColor: isDark ? '#ffffff' : '#111111',
                  color: isDark ? '#111111' : '#ffffff'
                }}
              >
                <Dna size={18} />
              </div>
              <span 
                className="font-bold text-[15px] tracking-tight whitespace-nowrap overflow-hidden"
                style={{ color: theme.textPrimary }}
              >
                CrimeNexus
              </span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg transition-colors cursor-pointer flex-shrink-0 hover:opacity-80"
            style={{ 
              color: theme.textMuted,
              background: 'transparent',
              border: 'none'
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* New Case Button */}
        <div className="p-3">
          <button
            onClick={() => navigate('/c')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm ${
              collapsed ? 'justify-center' : ''
            }`}
            style={{
              backgroundColor: location.pathname === '/c' && isDark
                ? theme.newCaseActiveBg
                : location.pathname === '/c' && !isDark
                ? '#111111'
                : theme.newCaseBg,
              color: location.pathname === '/c' && !isDark
                ? '#ffffff'
                : theme.newCaseText,
              border: location.pathname === '/c' && !isDark
                ? '1px solid #111111'
                : `1px solid ${theme.newCaseBorder}`
            }}
            title="New Case"
          >
            <Plus size={18} className="flex-shrink-0" />
            {!collapsed && (
              <span className="text-[13px] font-semibold whitespace-nowrap">
                New Case
              </span>
            )}
          </button>
        </div>

        {/* Case History */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-3 space-y-1">
          {!collapsed && savedCases.length > 0 && (
            <div 
              className="px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider"
              style={{ color: theme.textMuted }}
            >
              History
            </div>
          )}
          {savedCases.map((c) => {
            const casePath = `/c/${c.sessionId || c.id}`;
            const isActive = location.pathname === casePath;
            
            return (
              <div key={c.id} className="relative group flex items-center">
                <button
                  onClick={() => navigate(casePath)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    collapsed ? 'justify-center' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? theme.historyActiveBg : 'transparent',
                    color: isActive ? theme.historyActiveText : theme.textSecondary,
                    border: isActive ? `1px solid ${theme.historyActiveBorder}` : '1px solid transparent'
                  }}
                  title={c.title}
                >
                  <MessageSquare 
                    size={16} 
                    className="flex-shrink-0"
                    style={{ color: isActive ? theme.textPrimary : theme.textMuted }} 
                  />
                  {!collapsed && (
                    <span className="text-[13px] font-medium whitespace-nowrap overflow-hidden text-ellipsis text-left flex-1">
                      {c.title}
                    </span>
                  )}
                </button>
                
                {/* Delete button (visible on hover) */}
                {!collapsed && (
                  <button
                    onClick={(e) => onDeleteCase(e, c.sessionId || c.id)}
                    className="absolute right-2 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    style={{
                      color: theme.textMuted,
                      backgroundColor: isDark ? '#242732' : '#ffffff',
                      border: `1px solid ${theme.border}`
                    }}
                    title="Delete case"
                  >
                    <Trash2 size={13} className="hover:text-red-500 transition-colors" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation (Settings + Logout) */}
        <div 
          className="py-3 px-3 w-full space-y-1"
          style={{ borderTop: `1px solid ${theme.border}` }}
        >
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer hover:opacity-85 ${
              collapsed ? 'justify-center' : ''
            }`}
            style={{
              color: theme.textSecondary,
              backgroundColor: 'transparent',
              border: 'none'
            }}
            title="Settings"
          >
            <Settings size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-[13px] font-medium whitespace-nowrap">Settings</span>}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer hover:opacity-85 ${
              collapsed ? 'justify-center' : ''
            }`}
            style={{
              color: theme.textSecondary,
              backgroundColor: 'transparent',
              border: 'none'
            }}
            title="Logout"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-[13px] font-medium whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* Settings Modal Dialog                                         */}
      {/* ------------------------------------------------------------- */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowSettings(false)}
        >
          <div 
            className="w-full max-w-md rounded-3xl p-6 sm:p-7 transition-all shadow-2xl relative"
            style={{
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              color: theme.textPrimary
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b" style={{ borderColor: theme.border }}>
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: isDark ? '#242732' : '#f2f2ef',
                    border: `1px solid ${theme.border}`,
                    color: theme.textPrimary
                  }}
                >
                  <Palette size={17} />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight" style={{ color: theme.textPrimary }}>
                    Workspace Settings
                  </h3>
                  <p className="text-xs" style={{ color: theme.textMuted }}>
                    Customize interface and appearance
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="p-1.5 rounded-full transition-colors cursor-pointer hover:opacity-75"
                style={{
                  color: theme.textMuted,
                  backgroundColor: isDark ? '#1b1d24' : '#f2f2ef',
                  border: `1px solid ${theme.border}`
                }}
                title="Close settings"
              >
                <X size={16} />
              </button>
            </div>

            {/* Appearance / Theme Selector Card */}
            <div 
              className="p-4 rounded-2xl mb-6"
              style={{
                backgroundColor: theme.nestedCardBg,
                border: `1px solid ${theme.border}`
              }}
            >
              <div className="mb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider block mb-1" style={{ color: theme.textMuted }}>
                  Appearance / Theme
                </span>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Switch between black-and-white high contrast modes:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                {/* Light Mode Option */}
                <button
                  type="button"
                  onClick={() => handleSetTheme('light')}
                  className="p-3.5 rounded-xl flex flex-col items-start gap-2.5 transition-all text-left cursor-pointer relative"
                  style={{
                    backgroundColor: !isDark ? (isDark ? '#242732' : '#ffffff') : 'transparent',
                    border: !isDark 
                      ? `2px solid ${isDark ? '#ffffff' : '#111111'}` 
                      : `1px solid ${theme.border}`,
                    color: theme.textPrimary
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: !isDark ? '#111111' : (isDark ? '#242732' : '#f2f2ef'),
                        color: !isDark ? '#ffffff' : theme.textMuted
                      }}
                    >
                      <Sun size={15} />
                    </div>
                    {!isDark && (
                      <div className="w-4 h-4 rounded-full bg-[#111111] text-white flex items-center justify-center">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold block" style={{ color: theme.textPrimary }}>
                      Light Mode
                    </span>
                    <span className="text-[10px]" style={{ color: theme.textMuted }}>
                      Crisp white canvas
                    </span>
                  </div>
                </button>

                {/* Dark Mode Option */}
                <button
                  type="button"
                  onClick={() => handleSetTheme('dark')}
                  className="p-3.5 rounded-xl flex flex-col items-start gap-2.5 transition-all text-left cursor-pointer relative"
                  style={{
                    backgroundColor: isDark ? '#242732' : 'transparent',
                    border: isDark 
                      ? '2px solid #3d4255' 
                      : `1px solid ${theme.border}`,
                    color: theme.textPrimary
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: isDark ? '#ffffff' : '#f2f2ef',
                        color: isDark ? '#111111' : theme.textMuted
                      }}
                    >
                      <Moon size={15} />
                    </div>
                    {isDark && (
                      <div className="w-4 h-4 rounded-full bg-white text-neutral-900 flex items-center justify-center">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold block" style={{ color: theme.textPrimary }}>
                      Dark Mode
                    </span>
                    <span className="text-[10px]" style={{ color: theme.textMuted }}>
                      Mild charcoal palette
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer hover:opacity-90"
                style={{
                  backgroundColor: isDark ? '#242732' : '#111111',
                  color: '#ffffff',
                  border: `1px solid ${isDark ? '#3d4255' : '#111111'}`
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
