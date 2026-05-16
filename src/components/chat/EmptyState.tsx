export function EmptyState({
  onNewChat,
  hasApiKey,
}: {
  onNewChat: () => void;
  hasApiKey: boolean;
}) {
  const iconStyle: React.CSSProperties = {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #7c5cfc, #5a3fd4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        textAlign: 'center',
      }}
    >
      <div style={iconStyle}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h1 style={{ margin: '0 0 8px', fontSize: 24, color: '#e4e4e7' }}>MagnumAI</h1>
      <p style={{ margin: '0 0 24px', color: '#a1a1aa', fontSize: 14, maxWidth: 400, lineHeight: 1.5 }}>
        {hasApiKey
          ? 'Start a conversation by typing a message below.'
          : 'Enter your OpenRouter API key in settings to start chatting.'}
      </p>
      <button
        onClick={onNewChat}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 20px',
          background: '#7c5cfc',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        New Conversation
      </button>
    </div>
  );
}
