import React, { useRef, useEffect, useState } from 'react';
import { Bot, Send, Globe, FileText, Trash2, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Markdown message component for AI responses
const MarkdownMessage = ({ content, isDark }) => {
  return (
    <div className={`prose prose-sm max-w-none transition-colors ${
      isDark ? 'prose-invert' : ''
    }
      ${isDark ? 'text-[#c4c6ce]' : 'text-[#3a3a3a]'}
      prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2
      ${isDark ? 'prose-headings:text-[#ffffff]' : 'prose-headings:text-[#1f1f1f]'}
      prose-h2:text-base prose-h2:border-b ${isDark ? 'prose-h2:border-[#292c35]' : 'prose-h2:border-[#e8e8e4]'} prose-h2:pb-2
      prose-h3:text-sm ${isDark ? 'prose-h3:text-[#ffffff]' : 'prose-h3:text-[#3a3a3a]'}
      prose-p:leading-relaxed prose-p:my-3
      ${isDark ? 'prose-strong:text-[#ffffff]' : 'prose-strong:text-[#1f1f1f]'}
      prose-ul:my-2 prose-li:my-1 prose-li:ml-4
      prose-table:text-xs prose-table:my-4
      ${isDark ? 'prose-th:bg-[#242732] prose-th:text-[#ffffff]' : 'prose-th:bg-[#f4f4f4] prose-th:text-[#1f1f1f]'} prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold
      ${isDark ? 'prose-td:bg-[#1b1d24] prose-td:text-[#c4c6ce] prose-td:border-[#292c35]' : 'prose-td:bg-white prose-td:text-[#3a3a3a] prose-td:border-[#e8e8e4]'} prose-td:px-3 prose-td:py-2 prose-td:border-t
      ${isDark ? 'prose-hr:border-[#292c35]' : 'prose-hr:border-[#e8e8e4]'} prose-hr:my-4
      ${isDark ? 'prose-code:text-[#ffffff] prose-code:bg-[#242732]' : 'prose-code:text-[#1f1f1f] prose-code:bg-[#f4f4f4]'} prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
    `}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

const ChatTab = ({ messages, newMessage, setNewMessage, isAiTyping, onSendMessage, deepResearch, setDeepResearch, onClearChat }) => {
  const messagesEndRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  // Self-managed or inherited theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('nexus_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const handleTheme = () => {
      const saved = localStorage.getItem('nexus_theme');
      setIsDark(saved === 'dark');
    };
    window.addEventListener('storage', handleTheme);
    window.addEventListener('nexus_theme_change', handleTheme);
    return () => {
      window.removeEventListener('storage', handleTheme);
      window.removeEventListener('nexus_theme_change', handleTheme);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiTyping]);

  return (
    <div className="h-full flex flex-col w-full">
      {/* Message Container */}
      <div className="flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-400/30 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto w-full px-4 space-y-6 pt-4 pb-8">

        {/* Empty State */}
        {messages.length === 0 && !isAiTyping && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div 
              className="p-5 rounded-2xl mb-4"
              style={{
                backgroundColor: isDark ? '#242732' : '#1f1f1f',
                border: isDark ? '1px solid #3d4255' : 'none'
              }}
            >
              <Bot size={32} className="text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-lg" style={{ color: isDark ? '#ffffff' : '#1f1f1f' }}>
              Begin Your Investigation
            </h3>
            <p className="text-sm max-w-sm leading-relaxed" style={{ color: isDark ? '#8b8e99' : '#a1a19b' }}>
              Upload evidence files and ask questions about forensic findings. The AI will analyze documents and provide insights.
            </p>
          </div>
        )}
        
        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
            {/* Message header */}
            <div className="flex items-center gap-2 mb-2">
              {msg.sender === 'AI Assistant' && (
                <Bot size={13} style={{ color: isDark ? '#8b8e99' : '#71717a' }} />
              )}
              <span className="text-xs font-semibold" style={{ color: isDark ? '#8b8e99' : '#71717a' }}>
                {msg.sender}
              </span>
              <span className="text-[10px] font-mono" style={{ color: isDark ? '#6b7280' : '#a1a19b' }}>
                {msg.time}
              </span>
            </div>
            
            {/* Message bubble */}
            <div 
              className="px-5 py-4 text-sm rounded-[24px] max-w-[85%] transition-colors"
              style={{
                backgroundColor: msg.sender === 'You'
                  ? (isDark ? '#242732' : '#1f1f1f')
                  : (isDark ? '#1b1d24' : '#ffffff'),
                color: msg.sender === 'You'
                  ? '#ffffff'
                  : (isDark ? '#ffffff' : '#1f1f1f'),
                border: msg.sender === 'You'
                  ? (isDark ? '1px solid #3d4255' : 'none')
                  : (isDark ? '1px solid #292c35' : '1px solid #e8e8e4'),
                borderBottomRightRadius: msg.sender === 'You' ? '4px' : '24px',
                borderBottomLeftRadius: msg.sender === 'AI Assistant' ? '4px' : '24px',
                boxShadow: isDark 
                  ? '0 2px 10px rgba(0,0,0,0.3)' 
                  : (msg.sender === 'You' ? '0 2px 8px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.04)')
              }}
            >
              {msg.sender === 'AI Assistant' ? (
                <MarkdownMessage content={msg.text} isDark={isDark} />
              ) : (
                <p className="leading-relaxed">{msg.text}</p>
              )}
            </div>

            {/* Sources (if available) */}
            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-4 w-full">
                <span 
                  className="block mb-2 text-[11px] font-mono font-semibold uppercase tracking-wider"
                  style={{ color: isDark ? '#8b8e99' : '#a1a19b' }}
                >
                  Reference Sources
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {msg.sources.map((src, idx) => {
                    const isWeb = src.startsWith('Web: ');
                    const sourceText = isWeb ? src.replace('Web: ', '') : src;
                    const url = isWeb ? sourceText : null;
                    
                    return url ? (
                      <a 
                        key={idx} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col p-4 rounded-xl cursor-pointer group no-underline transition-all"
                        style={{
                          backgroundColor: isDark ? '#1b1d24' : '#ffffff',
                          border: `1px solid ${isDark ? '#292c35' : '#e8e8e4'}`,
                          color: isDark ? '#ffffff' : '#111111'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Globe size={16} className={isDark ? "text-neutral-400 group-hover:text-white" : "text-[#a1a19b] group-hover:text-[#1f1f1f]"} />
                          <span className="text-xs font-semibold" style={{ color: isDark ? '#ffffff' : '#1f1f1f' }}>
                            Web Search
                          </span>
                        </div>
                        <span className="text-xs break-all line-clamp-2" style={{ color: isDark ? '#8b8e99' : '#71717a' }}>
                          {sourceText}
                        </span>
                      </a>
                    ) : (
                      <div 
                        key={idx} 
                        className="flex flex-col p-4 rounded-xl transition-colors"
                        style={{
                          backgroundColor: isDark ? '#1b1d24' : '#ffffff',
                          border: `1px solid ${isDark ? '#292c35' : '#e8e8e4'}`
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FileText size={16} style={{ color: isDark ? '#8b8e99' : '#a1a19b' }} />
                          <span className="text-xs font-semibold" style={{ color: isDark ? '#ffffff' : '#1f1f1f' }}>
                            Evidence File
                          </span>
                        </div>
                        <span className="text-xs truncate" title={sourceText} style={{ color: isDark ? '#8b8e99' : '#71717a' }}>
                          {sourceText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isAiTyping && (
          <div className="flex items-center gap-2">
            <Bot size={13} style={{ color: isDark ? '#8b8e99' : '#71717a' }} />
            <div 
              className="px-5 py-4 rounded-2xl rounded-tl-sm transition-colors"
              style={{
                backgroundColor: isDark ? '#1b1d24' : '#f4f4f4',
                border: `1px solid ${isDark ? '#292c35' : '#e8e8e4'}`
              }}
            >
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full animate-bounce opacity-60" style={{ backgroundColor: isDark ? '#ffffff' : '#1f1f1f', animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full animate-bounce opacity-60" style={{ backgroundColor: isDark ? '#ffffff' : '#1f1f1f', animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full animate-bounce opacity-60" style={{ backgroundColor: isDark ? '#ffffff' : '#1f1f1f', animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="w-full flex justify-center pb-4 px-4 relative z-50">
        <form onSubmit={onSendMessage} className="w-full max-w-4xl flex gap-2 relative">
          
          <div 
            className="flex-1 rounded-[24px] flex items-center px-2 py-1.5 transition-all shadow-sm"
            style={{
              backgroundColor: isDark ? '#1b1d24' : '#ffffff',
              border: `1px solid ${isDark ? '#292c35' : '#e8e8e4'}`
            }}
          >
            {/* Plus Button & Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-full transition-colors ml-1 cursor-pointer hover:opacity-80"
                style={{
                  color: isDark ? '#8b8e99' : '#a1a19b',
                  backgroundColor: showMenu ? (isDark ? '#242732' : '#f4f4f4') : 'transparent'
                }}
                title="More options"
              >
                <Plus size={19} className={`transition-transform duration-200 ${showMenu ? 'rotate-45' : ''}`} />
              </button>
              
              {showMenu && (
                <>
                  {/* Backdrop to close menu */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)}
                  ></div>
                  
                  {/* Dropdown Menu */}
                  <div 
                    className="absolute bottom-[calc(100%+16px)] left-0 w-64 rounded-2xl shadow-2xl z-20 py-2 flex flex-col transition-all"
                    style={{
                      backgroundColor: isDark ? '#1b1d24' : '#ffffff',
                      border: `1px solid ${isDark ? '#292c35' : '#e8e8e4'}`,
                      color: isDark ? '#ffffff' : '#111111'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setDeepResearch(!deepResearch);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left cursor-pointer hover:opacity-80"
                    >
                      <Globe size={16} className={deepResearch ? 'text-blue-500' : (isDark ? 'text-neutral-400' : 'text-[#71717a]')} />
                      <div className="flex flex-col">
                        <span className="font-semibold" style={{ color: isDark ? '#ffffff' : '#111111' }}>
                          Deep Research {deepResearch && '(On)'}
                        </span>
                        <span className="text-xs" style={{ color: isDark ? '#8b8e99' : '#a1a19b' }}>
                          Search web for extra context
                        </span>
                      </div>
                    </button>
                    
                    <div className="h-px w-full my-1" style={{ backgroundColor: isDark ? '#292c35' : '#f4f4f4' }} />
                    
                    <button
                      type="button"
                      onClick={() => {
                        onClearChat();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:text-red-500 transition-colors text-left cursor-pointer"
                      style={{ color: isDark ? '#f87171' : '#dc2626' }}
                    >
                      <Trash2 size={16} />
                      <span className="font-semibold">Clear Chat History</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Actual Input */}
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask about evidence, patterns, or connections..."
              className="flex-1 bg-transparent border-none px-4 py-2.5 text-sm focus:outline-none focus:ring-0"
              style={{
                color: isDark ? '#ffffff' : '#1f1f1f'
              }}
              disabled={isAiTyping}
            />

            {/* Send Button */}
            <button 
              type="submit" 
              disabled={isAiTyping || !newMessage.trim()}
              className="p-2.5 rounded-full transition-all flex-shrink-0 border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: newMessage.trim() && !isAiTyping
                  ? (isDark ? '#ffffff' : '#1f1f1f')
                  : (isDark ? '#242732' : '#f4f4f4'),
                color: newMessage.trim() && !isAiTyping
                  ? (isDark ? '#09090b' : '#ffffff')
                  : (isDark ? '#8b8e99' : '#a1a19b')
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;
