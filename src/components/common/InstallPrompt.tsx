import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('pwa-dismissed') === '1');
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa-dismissed', '1');
  };

  if (!deferredPrompt || dismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isMobile ? 0 : 24,
        left: isMobile ? 0 : '50%',
        transform: isMobile ? 'none' : 'translateX(-50%)',
        right: isMobile ? 0 : 'auto',
        zIndex: 200,
        background: '#212134',
        border: isMobile ? 'none' : '1px solid #2d2d4a',
        borderTopLeftRadius: isMobile ? 16 : 12,
        borderTopRightRadius: isMobile ? 16 : 12,
        borderRadius: isMobile ? '16px 16px 0 0' : 12,
        padding: isMobile ? '16px 20px' : '16px 24px',
        maxWidth: isMobile ? '100%' : 400,
        width: isMobile ? '100%' : 'auto',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 48 46" fill="none">
          <path d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" fill="#7c5cfc"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#e4e4e7' }}>Install MagnumAI</div>
        <div style={{ fontSize: 12, color: '#a1a1aa' }}>Add to home screen for a better experience</div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          onClick={handleDismiss}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #2d2d4a',
            background: 'transparent',
            color: '#a1a1aa',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          Not now
        </button>
        <button
          onClick={handleInstall}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            background: '#7c5cfc',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          Install
        </button>
      </div>
    </div>
  );
}
