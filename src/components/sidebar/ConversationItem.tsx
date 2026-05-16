import type { Conversation } from '../../types';
import { IconButton } from '../common/IconButton';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  onDelete,
}: ConversationItemProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '8px 10px',
        borderRadius: 8,
        cursor: 'pointer',
        background: isActive ? '#2d2d4a' : 'transparent',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = '#252540';
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent';
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#a1a1aa"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ flexShrink: 0 }}
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span
        style={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: 13,
          color: isActive ? '#e4e4e7' : '#a1a1aa',
        }}
      >
        {conversation.title}
      </span>
      <IconButton
        label="Delete conversation"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        style={{ width: 26, height: 26, flexShrink: 0 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </IconButton>
    </div>
  );
}
