import { useEffect, useRef } from 'react';
import type { Message as MessageType, OutputMode } from '../../types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { Spinner } from '../common/Spinner';

interface ChatContainerProps {
  messages: MessageType[];
  streamingContent: string;
  isLoading: boolean;
  onSend: (content: string, images?: string[], mode?: OutputMode) => void;
  onStop: () => void;
  onNewChat: () => void;
  onRetry: () => void;
  hasApiKey: boolean;
  currentModel?: string;
  onModelChange?: (model: string) => void;
}

export function ChatContainer({
  messages,
  streamingContent,
  isLoading,
  onSend,
  onStop,
  onNewChat,
  onRetry,
  hasApiKey,
  currentModel,
  onModelChange,
}: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  if (messages.length === 0 && !streamingContent) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <EmptyState onNewChat={onNewChat} hasApiKey={hasApiKey} />
        <ChatInput onSend={onSend} isLoading={isLoading} onStop={onStop} disabled={!hasApiKey} currentModel={currentModel} onModelChange={onModelChange} />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '8px 10px' : '16px 24px',
        }}
      >
        <div style={{ maxWidth: isMobile ? '100%' : 800, margin: '0 auto' }}>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onRetry={msg.role === 'assistant' && msg === messages[messages.length - 1] && !msg.content.startsWith('Error') ? onRetry : undefined}
            />
          ))}
          {streamingContent && (
            <ChatMessage
              message={{
                id: 'streaming',
                role: 'assistant',
                content: streamingContent,
                timestamp: Date.now(),
              }}
            />
          )}
          {isLoading && !streamingContent && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '4px 0' }}>
              <div style={{ padding: '12px 16px', borderRadius: 12, background: '#1e1e3f', border: '1px solid #2d2d4a' }}>
                <Spinner size={18} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <ChatInput onSend={onSend} isLoading={isLoading} onStop={onStop} disabled={!hasApiKey} currentModel={currentModel} onModelChange={onModelChange} />
    </div>
  );
}
