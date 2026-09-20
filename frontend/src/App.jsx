import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { createSession, uploadFile, getSessions, deleteSession } from './utils/api';
import { supabase } from './lib/supabase';

import HeroView from './components/views/HeroView';
import AuthView from './components/views/AuthView';
import UploadView from './components/views/UploadView';
import ProcessingView from './components/views/ProcessingView';
import DashboardView from './components/views/DashboardView';
import Sidebar from './components/layout/Sidebar';

// Local development escape hatch. Set VITE_DEV_BYPASS_AUTH=true in .env.local to
// skip the Supabase gate when running without a Supabase project. Off by default,
// so production behavior is unchanged.
const DEV_BYPASS_AUTH = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';
const DEV_SESSION = { user: { id: 'dev-local', email: 'dev@localhost' } };

const lightCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M3 3l7.5 18 2.5-7.5L20.5 11z'/%3E%3C/svg%3E"), auto`;
const darkCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M3 3l7.5 18 2.5-7.5L20.5 11z'/%3E%3C/svg%3E"), auto`;

// Inner component for authenticated workspace
const AuthenticatedWorkspace = () => {
  const [savedCases, setSavedCases] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Global theme management
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('nexus_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const handleThemeChange = () => {
      const saved = localStorage.getItem('nexus_theme');
      const dark = saved === 'dark';
      setIsDark(dark);
      document.documentElement.classList.toggle('dark', dark);
    };

    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('nexus_theme_change', handleThemeChange);
    document.documentElement.classList.toggle('dark', isDark);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('nexus_theme_change', handleThemeChange);
    };
  }, [isDark]);

  const navigate = useNavigate();
  const location = useLocation();

  // Load existing sessions from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const sessions = await getSessions();
        if (sessions && sessions.length > 0) {
          const cases = sessions.map(s => ({
            id: s.id,
            sessionId: s.id,
            title: s.title || 'Untitled Case',
            date: s.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            status: 'Open',
            files: s.files || []
          }));
          setSavedCases(cases);
        }
      } catch (err) {
        console.error('Could not load sessions:', err);
      }
    })();
  }, []);

  const handleUpload = async (files, caseName) => {
    if (!files || files.length === 0 || !caseName) return;

    setIsProcessing(true);
    setLoadingProgress(0);
    
    const newCase = { 
      id: `CASE-${Math.floor(Math.random() * 1000)}-UPLOAD`, 
      title: caseName,
      date: new Date().toISOString().split('T')[0], 
      status: 'Processing',
      filesUploaded: []
    };

    try {
      const session = await createSession(newCase.title);
      newCase.sessionId = session.id;

      const totalFiles = files.length;
      let uploadedCount = 0;

      for (const file of files) {
        try {
          const result = await uploadFile(session.id, file, newCase.id);
          newCase.filesUploaded.push({
            name: file.name,
            success: true,
            skipped: result.skipped || false,
            chunks: result.chunks_created || 0
          });
        } catch (err) {
          console.error(`Error uploading ${file.name}:`, err);
          newCase.filesUploaded.push({ name: file.name, success: false, error: err.message });
        }
        uploadedCount++;
        setLoadingProgress(Math.round((uploadedCount / totalFiles) * 100));
      }

      newCase.status = 'Open';
      setSavedCases(prev => [newCase, ...prev]);

      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/c/${session.id}`);
      }, 500);

    } catch (err) {
      console.error('Failed to create session:', err);
      newCase.status = 'Error';
      setSavedCases(prev => [newCase, ...prev]);
      setLoadingProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/c/${newCase.id}`);
      }, 500);
    }
  };

  const handleDeleteCase = async (e, caseId) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSavedCases(prev => prev.filter(c => c.id !== caseId && c.sessionId !== caseId));
    
    if (location.pathname === `/c/${caseId}`) {
      navigate('/c');
    }

    try {
      await deleteSession(caseId);
    } catch (err) {
      console.error('Failed to delete session from backend:', err);
    }
  };

  const handleLogout = async () => {
    if (DEV_BYPASS_AUTH) return;
    await supabase.auth.signOut();
  };

  if (isProcessing) {
    return <ProcessingView loadingProgress={loadingProgress} />;
  }

  return (
    <div 
      className="flex h-[100dvh] overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: isDark ? '#0f1013' : '#f7f7f5',
        color: isDark ? '#ffffff' : '#111827',
        cursor: isDark ? darkCursor : lightCursor
      }}
    >
      <Sidebar 
        savedCases={savedCases}
        onDeleteCase={handleDeleteCase}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        onLogout={handleLogout}
        isDark={isDark}
      />
      <div 
        className={`flex-1 min-w-0 transition-all duration-300 flex flex-col pt-4 pr-4 pb-4 ${
          sidebarCollapsed ? 'ml-[100px]' : 'ml-[288px]'
        }`}
      >
        <div 
          className="flex-1 w-full min-w-0 rounded-[24px] overflow-hidden transition-all duration-200"
          style={{
            backgroundColor: isDark ? '#15171c' : '#ffffff',
            border: `1px solid ${isDark ? '#292c35' : '#e4e4df'}`,
            boxShadow: isDark 
              ? '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.05)' 
              : '0 8px 30px rgb(0,0,0,0.06)'
          }}
        >
          <Routes>
            <Route path="/" element={<UploadView onUpload={handleUpload} isDark={isDark} />} />
            <Route path="/:caseId" element={<DashboardView savedCases={savedCases} isDark={isDark} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Main App Component with Supabase Auth Routing
export default function App() {
  const [session, setSession] = useState(DEV_BYPASS_AUTH ? DEV_SESSION : undefined);

  useEffect(() => {
    if (DEV_BYPASS_AUTH) return;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a loading state until session is checked (undefined means checking, null means no session)
  if (session === undefined) {
    return (
      <div className="h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-[#1f1f1f] border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={session ? <Navigate to="/c" replace /> : <HeroView />} 
        />
        <Route 
          path="/login" 
          element={session ? <Navigate to="/c" replace /> : <AuthView mode="login" />} 
        />
        <Route 
          path="/signup" 
          element={session ? <Navigate to="/c" replace /> : <AuthView mode="signup" />} 
        />

        {/* Protected Workspace Routes (everything under /c) */}
        <Route 
          path="/c/*" 
          element={session ? <AuthenticatedWorkspace /> : <Navigate to="/login" replace />} 
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}