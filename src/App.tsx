import { useState, useCallback } from 'react';
import { useChat } from './hooks/useChat';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useMediaQuery } from './hooks/useMediaQuery';
import { ChatContainer } from './components/chat/ChatContainer';
import { SettingsModal } from './components/settings/SettingsModal';
import { ModelSelector } from './components/settings/ModelSelector';
import { IconButton } from './components/common/IconButton';
import { InstallPrompt } from './components/common/InstallPrompt';
import type { OutputMode } from './types';

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';

export default function App() {
  const [model, setModel] = useLocalStorage('magnumai-model', 'deepseek/deepseek-chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const showSidebar = isMobile ? mobileSidebarOpen : sidebarOpen;

  const {
    conversations,
    activeConversation,
    isLoading,
    streamingContent,
    createConversation,
    deleteConversation,
    clearConversations,
    sendUserMessage,
    retryLast,
    stopStreaming,
    selectConversation,
  } = useChat();

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen((p) => !p);
    } else {
      setSidebarOpen((p) => !p);
    }
  };

  const handleSelectConv = (id: string) => {
    selectConversation(id);
    if (isMobile) setMobileSidebarOpen(false);
  };

  const handleSend = useCallback(
    (content: string, images?: string[], mode?: OutputMode) => {
      if (!activeConversation) {
        const newId = createConversation(model);
        sendUserMessage(content, apiKey, newId, images, mode);
      } else {
        sendUserMessage(content, apiKey, undefined, images, mode);
      }
    },
    [activeConversation, model, createConversation, sendUserMessage]
  );

  const handleRetry = useCallback(() => {
    retryLast(apiKey);
  }, [retryLast]);

  const handleNewChat = useCallback(() => {
    createConversation(model);
    if (isMobile) setMobileSidebarOpen(false);
  }, [model, createConversation, isMobile]);

  return (
    <div style={{ display: 'flex', height: '100dvh', background: '#1a1a2e', color: '#e4e4e7' }}>
      {showSidebar && (
        <>
          {isMobile && (
            <div
              onClick={() => setMobileSidebarOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 90,
              }}
            />
          )}
          <div
            style={{
              width: isMobile ? '80vw' : 260,
              maxWidth: 320,
              height: '100dvh',
              background: '#16162a',
              borderRight: '1px solid #2d2d4a',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              position: isMobile ? 'fixed' : 'relative',
              left: 0,
              top: 0,
              zIndex: isMobile ? 100 : 'auto',
              transition: 'transform 0.2s ease',
            }}
          >
            <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <button
                  onClick={() => {
                    handleNewChat();
                    if (isMobile) setMobileSidebarOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '10px 14px',
                    background: '#2d2d4a',
                    color: '#e4e4e7',
                    border: '1px solid #3a3a5a',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  New Chat
                </button>
              </div>
              {isMobile && (
                <IconButton label="Close sidebar" onClick={() => setMobileSidebarOpen(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </IconButton>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
              {conversations.length === 0 && (
                <p style={{ textAlign: 'center', color: '#6b6b80', fontSize: 13, padding: '20px 12px', margin: 0 }}>
                  No conversations yet
                </p>
              )}
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConv(conv.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '8px 10px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: conv.id === activeConversation?.id ? '#2d2d4a' : 'transparent',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: conv.id === activeConversation?.id ? '#e4e4e7' : '#a1a1aa' }}>
                    {conv.title}
                  </span>
                  <IconButton
                    label="Delete"
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    style={{ width: 26, height: 26, flexShrink: 0 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </IconButton>
                </div>
              ))}
            </div>

            <div style={{ padding: '8px 12px', borderTop: '1px solid #2d2d4a', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button
                onClick={() => { setSettingsOpen(true); if (isMobile) setMobileSidebarOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                  background: 'transparent', color: '#a1a1aa', border: 'none', borderRadius: 8,
                  cursor: 'pointer', fontSize: 13, width: '100%', textAlign: 'left',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                Settings
              </button>
              {conversations.length > 0 && (
                <button
                  onClick={clearConversations}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                    background: 'transparent', color: '#a1a1aa', border: 'none', borderRadius: 8,
                    cursor: 'pointer', fontSize: 13, width: '100%', textAlign: 'left',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Clear All
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 4 : 8,
            padding: isMobile ? '6px 10px' : '8px 16px',
            borderBottom: '1px solid #2d2d4a',
            background: '#1a1a2e',
            minHeight: isMobile ? 44 : 48,
          }}
        >
          <IconButton
            label="Toggle sidebar"
            onClick={toggleSidebar}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </IconButton>

          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 48 46" fill="none">
                <path d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" fill="#7c5cfc" />
              </svg>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#e4e4e7' }}>MagnumAI</span>
            </div>
          )}

          <div style={{ flex: 1 }} />

          {!isMobile && (
            <div style={{ minWidth: 200 }}>
              <ModelSelector
                value={activeConversation?.model || model}
                onChange={(m) => setModel(m)}
              />
            </div>
          )}

          <IconButton label="Settings" onClick={() => setSettingsOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </IconButton>
        </div>

        <ChatContainer
          messages={activeConversation?.messages || []}
          streamingContent={streamingContent}
          isLoading={isLoading}
          onSend={handleSend}
          onStop={stopStreaming}
          onNewChat={handleNewChat}
          onRetry={handleRetry}
          hasApiKey={!!apiKey}
          currentModel={activeConversation?.model || model}
          onModelChange={setModel}
        />
      </div>

      {isMobile && (
        <div style={{ position: 'fixed', bottom: 80, right: 16, zIndex: 50 }}>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            style={{
              width: 48, height: 48, borderRadius: '50%', border: 'none',
              background: '#7c5cfc', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124,92,252,0.4)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      )}

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        model={model}
        onModelChange={setModel}
      />

      <InstallPrompt />
    </div>
  );
}
