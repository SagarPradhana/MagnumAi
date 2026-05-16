import { useState } from 'react';
import type { Message } from '../../types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
}

export function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [copied, setCopied] = useState(false);
  const [docExpanded, setDocExpanded] = useState(false);

  const handleCopy = async (text?: string) => {
    try {
      await navigator.clipboard.writeText(text || message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: message.content });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const handleDownload = () => {
    const blob = new Blob([message.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `magnumai-doc-${message.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isPrompt = !isUser && message.mode === 'prompt';
  const isDoc = !isUser && message.mode === 'doc';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        padding: '4px 0',
      }}
    >
      <div style={{ maxWidth: isMobile ? '90%' : '80%', width: isDoc ? '100%' : undefined }}>
        <div
          style={{
            padding: isDoc ? 0 : isMobile ? '10px 12px' : '12px 16px',
            borderRadius: 12,
            background: isUser ? '#3a3a6a' : isPrompt ? '#1a2a1a' : isDoc ? '#1a1a2e' : '#1e1e3f',
            border: isUser ? 'none' : isPrompt ? '1px solid #2a4a2a' : isDoc ? '1px solid #2d2d4a' : '1px solid #2d2d4a',
            color: '#e4e4e7',
            fontSize: 14,
            lineHeight: 1.6,
            overflow: 'hidden',
          }}
        >
          {!isUser && message.mode && message.mode !== 'default' && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: isPrompt ? '#2a4a2a' : '#2d2d4a',
                color: isPrompt ? '#4ade80' : '#7c5cfc',
                marginBottom: 8,
              }}
            >
              {isPrompt ? '⌨ Prompt' : '📄 Doc'}
            </div>
          )}

          {isUser && message.images?.length ? (
            <div style={{ marginBottom: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {message.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  style={{
                    maxWidth: isMobile ? 120 : 200,
                    maxHeight: isMobile ? 120 : 200,
                    borderRadius: 8,
                    objectFit: 'cover',
                  }}
                />
              ))}
            </div>
          ) : null}

          {isUser ? (
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: isMobile ? 13 : 14 }}>{message.content || '(image)'}</p>
          ) : isDoc ? (
            <div>
              <div
                style={{
                  maxHeight: docExpanded ? 'none' : 300,
                  overflow: 'hidden',
                  position: 'relative',
                  padding: isMobile ? '10px 12px' : '12px 16px',
                }}
              >
                <MarkdownRenderer content={message.content} />
                {!docExpanded && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 60,
                      background: 'linear-gradient(transparent, #1a1a2e)',
                    }}
                  />
                )}
              </div>
              <button
                onClick={() => setDocExpanded(!docExpanded)}
                style={{
                  width: '100%',
                  padding: '6px',
                  border: 'none',
                  borderTop: '1px solid #2d2d4a',
                  background: 'transparent',
                  color: '#7c5cfc',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {docExpanded ? 'Show less' : 'Show more'}
              </button>
            </div>
          ) : (
            <>
              <MarkdownRenderer content={message.content} />
              {message.duration !== undefined && (
                <div style={{ marginTop: 8, fontSize: 11, color: '#6b6b80' }}>
                  {message.duration.toFixed(1)}s
                </div>
              )}
            </>
          )}
        </div>

        {!isUser && (
          <div
            style={{
              display: 'flex',
              gap: 2,
              padding: '4px 4px 0',
              opacity: isMobile ? 0.6 : 0.4,
            }}
            onMouseEnter={(e) => !isMobile && (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => !isMobile && (e.currentTarget.style.opacity = '0.4')}
          >
            {isPrompt ? (
              <>
                <ActionButton label="Copy prompt" onClick={() => handleCopy()}>
                  {copied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </ActionButton>
                <ActionButton label="Share" onClick={handleShare}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </ActionButton>
              </>
            ) : isDoc ? (
              <>
                <ActionButton label="View" onClick={() => setDocExpanded(!docExpanded)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </ActionButton>
                <ActionButton label="Copy" onClick={() => handleCopy()}>
                  {copied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </ActionButton>
                <ActionButton label="Download" onClick={handleDownload}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </ActionButton>
                <ActionButton label="Share" onClick={handleShare}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </ActionButton>
              </>
            ) : (
              <>
                <ActionButton label="Copy" onClick={() => handleCopy()}>
                  {copied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </ActionButton>
                <ActionButton label="Share" onClick={handleShare}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </ActionButton>
                {onRetry ? (
                  <ActionButton label="Retry" onClick={onRetry}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                  </ActionButton>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        border: 'none',
        borderRadius: 6,
        background: 'transparent',
        color: '#a1a1aa',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#2d2d4a')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  );
}
