import type { Conversation } from '../../types';
import { NewChatButton } from './NewChatButton';
import { ConversationItem } from './ConversationItem';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
  onClearAll: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNewChat,
  onClearAll,
  onOpenSettings,
}: SidebarProps) {
  return (
    <div
      style={{
        width: 260,
        height: '100vh',
        background: '#16162a',
        borderRight: '1px solid #2d2d4a',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '12px' }}>
        <NewChatButton onClick={onNewChat} />
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 8px',
        }}
      >
        {conversations.length === 0 && (
          <p
            style={{
              textAlign: 'center',
              color: '#6b6b80',
              fontSize: 13,
              padding: '20px 12px',
              margin: 0,
            }}
          >
            No conversations yet
          </p>
        )}
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === activeId}
            onClick={() => onSelect(conv.id)}
            onDelete={() => onDelete(conv.id)}
          />
        ))}
      </div>

      <div
        style={{
          padding: '8px 12px',
          borderTop: '1px solid #2d2d4a',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <button
          onClick={onOpenSettings}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 10px',
            background: 'transparent',
            color: '#a1a1aa',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
            width: '100%',
            textAlign: 'left',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#252540')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          Settings
        </button>
        {conversations.length > 0 && (
          <button
            onClick={onClearAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              background: 'transparent',
              color: '#a1a1aa',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              width: '100%',
              textAlign: 'left',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#252540')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
