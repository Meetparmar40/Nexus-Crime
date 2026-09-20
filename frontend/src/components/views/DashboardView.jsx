import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, FileText, Users, Clock, FolderOpen, PenTool } from 'lucide-react';
import { getSessionMessages, sendChatMessage, clearSessionMessages } from '../../utils/api';

import ChatTab from '../tabs/ChatTab';
import EvidenceTab from '../tabs/EvidenceTab';
import PeopleTab from '../tabs/PeopleTab';
import TimelineTab from '../tabs/TimelineTab';
import RawEvidenceTab from '../tabs/RawEvidenceTab';
import NotesSidebar from '../ui/NotesSidebar';

const lightCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M3 3l7.5 18 2.5-7.5L20.5 11z'/%3E%3C/svg%3E"), auto`;
const darkCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M3 3l7.5 18 2.5-7.5L20.5 11z'/%3E%3C/svg%3E"), auto`;

const DashboardView = ({ savedCases, isDark: propIsDark }) => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  
  // Theme state inherited from props or localStorage
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
    border: '#292c35',
    pillContainerBg: '#1b1d24',
    tabActiveBg: '#242732',
    tabActiveBorder: '#3d4255',
    tabActiveText: '#ffffff',
    tabInactiveText: '#8b8e99',
    tabHoverBg: '#222633',
    notesActiveBg: '#242732',
    notesActiveBorder: '#3d4255',
    notesActiveText: '#ffffff',
    notesInactiveBg: '#1b1d24',
    notesInactiveBorder: '#292c35',
    notesInactiveText: '#c4c6ce',
    textPrimary: '#ffffff',
    textSecondary: '#c4c6ce',
    textMuted: '#8b8e99'
  } : {
    pageBg: '#ffffff',
    border: '#e4e4df',
    pillContainerBg: '#f2f2ef',
    tabActiveBg: '#ffffff',
    tabActiveBorder: '#e4e4df',
    tabActiveText: '#111111',
    tabInactiveText: '#717175',
    tabHoverBg: '#e6e6e2',
    notesActiveBg: '#111111',
    notesActiveBorder: '#111111',
    notesActiveText: '#ffffff',
    notesInactiveBg: '#ffffff',
    notesInactiveBorder: '#e4e4df',
    notesInactiveText: '#111111',
    textPrimary: '#111111',
    textSecondary: '#444446',
    textMuted: '#717175'
  };

  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [highlightTarget, setHighlightTarget] = useState(null);
  const [deepResearch, setDeepResearch] = useState(false);

  // Find current case
  const currentCase = savedCases.find(c => c.sessionId === caseId || c.id === caseId);

  useEffect(() => {
    if (savedCases.length > 0 && !currentCase) {
      navigate('/c', { replace: true });
    }
  }, [caseId, savedCases, currentCase, navigate]);

  // Load chat messages when caseId changes
  useEffect(() => {
    if (!currentCase) return;
    
    let isMounted = true;
    const sessionId = currentCase.sessionId || currentCase.id;
    
    (async () => {
      try {
        const savedMsgs = await getSessionMessages(sessionId);
        if (!isMounted) return;
        
        if (savedMsgs && savedMsgs.length > 0) {
          const formatted = savedMsgs.map((msg, idx) => ({
            id: idx + 1,
            sender: msg.role === 'user' ? 'You' : 'AI Assistant',
            text: msg.content,
            sources: msg.sources || [],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(formatted);
        } else {
          setMessages([{
            id: 1,
            sender: 'AI Assistant',
            text: `Case **${currentCase.title}** loaded. Upload evidence files to begin analysis, then ask me questions about the case.`,
            sources: [],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Could not load messages:', err);
        setMessages([{
          id: 1,
          sender: 'AI Assistant',
          text: `Case **${currentCase.title}** loaded. Upload evidence files to begin analysis, then ask me questions about the case.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    })();
    return () => { isMounted = false; };
  }, [currentCase]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const userMsg = {
      id: Date.now(),
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setNewMessage("");
    setIsAiTyping(true);

    (async () => {
      try {
        const sessionId = currentCase?.sessionId || currentCase?.id;
        if (!sessionId) throw new Error('No session available for chat');

        const resp = await sendChatMessage(sessionId, userMsg.text, deepResearch);

        const aiMsg = {
          id: Date.now() + 1,
          sender: 'AI Assistant',
          text: resp.response || 'No response',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: resp.sources || []
        };

        setMessages(prev => [...prev, aiMsg]);
      } catch (err) {
        console.error('Chat error:', err);
        const errMsg = {
          id: Date.now() + 2,
          sender: 'AI Assistant',
          text: 'Error contacting backend: ' + (err.message || err),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errMsg]);
      } finally {
        setIsAiTyping(false);
      }
    })();
  };

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear the chat history?")) return;
    try {
      const sessionId = currentCase?.sessionId || currentCase?.id;
      if (!sessionId) return;
      await clearSessionMessages(sessionId);
      setMessages([{
        id: Date.now(),
        sender: 'AI Assistant',
        text: 'Chat cleared. Ask me questions about the case.',
        sources: [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  };

  if (!currentCase) {
    return (
      <div 
        className="h-full w-full flex items-center justify-center transition-colors"
        style={{
          backgroundColor: theme.pageBg,
          cursor: isDark ? darkCursor : lightCursor
        }}
      >
        <div className="animate-pulse flex flex-col items-center">
          <div 
            className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mb-4"
            style={{
              borderColor: isDark ? '#3d4255' : '#111111',
              borderTopColor: 'transparent'
            }}
          />
          <p className="font-mono text-xs" style={{ color: theme.textMuted }}>
            Loading Investigation Workspace...
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'evidence', label: 'Analysis', icon: FileText },
    { id: 'people', label: 'People', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'raw_evidence', label: 'Raw Files', icon: FolderOpen }
  ];

  const sessionId = currentCase.sessionId || currentCase.id;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <ChatTab 
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            isAiTyping={isAiTyping}
            onSendMessage={handleSendMessage}
            deepResearch={deepResearch}
            setDeepResearch={setDeepResearch}
            onClearChat={handleClearChat}
          />
        );
      case 'evidence':
        return <EvidenceTab sessionId={sessionId} isNotesOpen={isNotesOpen} highlightTarget={highlightTarget} />;
      case 'people':
        return <PeopleTab sessionId={sessionId} isNotesOpen={isNotesOpen} highlightTarget={highlightTarget} />;
      case 'timeline':
        return <TimelineTab sessionId={sessionId} isNotesOpen={isNotesOpen} highlightTarget={highlightTarget} />;
      case 'raw_evidence':
        return <RawEvidenceTab sessionId={sessionId} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="h-full w-full overflow-hidden flex flex-row transition-colors duration-200 select-none"
      style={{
        backgroundColor: theme.pageBg,
        color: theme.textPrimary,
        cursor: isDark ? darkCursor : lightCursor
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* Center Workspace (min-w-0 allows proper flex contraction)     */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 min-w-0 overflow-y-auto px-6 py-6 flex flex-col h-full relative z-10 transition-all duration-200">
        
        {/* Top Tab Bar & Notes Toggle Button */}
        <div className="flex mb-6 overflow-x-auto scrollbar-hide pb-1 justify-between items-center gap-3">
          {/* Elevated Tab Navigation Pills */}
          <div 
            className="p-1 rounded-full inline-flex items-center transition-colors"
            style={{
              backgroundColor: theme.pillContainerBg,
              border: `1px solid ${theme.border}`
            }}
          >
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: isActive ? theme.tabActiveBg : 'transparent',
                    color: isActive ? theme.tabActiveText : theme.tabInactiveText,
                    border: isActive ? `1px solid ${theme.tabActiveBorder}` : '1px solid transparent',
                    boxShadow: isActive ? (isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.06)') : 'none'
                  }}
                >
                  <Icon size={14} style={{ color: isActive ? theme.tabActiveText : theme.tabInactiveText }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Notes Toggle Button */}
          <button
            type="button"
            onClick={() => setIsNotesOpen(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer shadow-sm hover:opacity-90"
            style={{
              backgroundColor: isNotesOpen ? theme.notesActiveBg : theme.notesInactiveBg,
              color: isNotesOpen ? theme.notesActiveText : theme.notesInactiveText,
              border: `1px solid ${isNotesOpen ? theme.notesActiveBorder : theme.notesInactiveBorder}`
            }}
            title={isNotesOpen ? "Hide Notes Panel" : "Show Notes Panel"}
          >
            <PenTool size={14} />
            <span>Notes</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className={`flex-1 min-h-0 min-w-0 ${activeTab !== 'chat' ? 'overflow-y-auto pr-1' : ''}`}>
          {renderTabContent()}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Right Notes Panel (Fixed width with smooth entrance)          */}
      {/* ------------------------------------------------------------- */}
      {isNotesOpen && (
        <NotesSidebar 
          sessionId={sessionId} 
          isDark={isDark}
          onClose={() => setIsNotesOpen(false)} 
          onNavigate={(tabId, attachment) => {
            setActiveTab(tabId);
            setHighlightTarget(attachment);
            setTimeout(() => setHighlightTarget(null), 1000);
          }}
        />
      )}
    </div>
  );
};

export default DashboardView;
