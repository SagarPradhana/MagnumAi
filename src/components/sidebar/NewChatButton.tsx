interface NewChatButtonProps {
  onClick: () => void;
}

export function NewChatButton({ onClick }: NewChatButtonProps) {
  return (
    <button
      onClick={onClick}
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
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#3a3a5a')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '#2d2d4a')}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
      New Chat
    </button>
  );
}
