import { useEffect, type ReactNode } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { IconButton } from './IconButton';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          background: '#212134',
          border: isMobile ? 'none' : '1px solid #2d2d4a',
          borderTopLeftRadius: isMobile ? 16 : 12,
          borderTopRightRadius: isMobile ? 16 : 12,
          borderRadius: isMobile ? '16px 16px 0 0' : 12,
          padding: isMobile ? 20 : 24,
          minWidth: isMobile ? '100%' : 400,
          maxWidth: isMobile ? '100%' : 500,
          width: isMobile ? '100%' : '90%',
          maxHeight: isMobile ? '80vh' : '80vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, color: '#e4e4e7' }}>{title}</h2>
          <IconButton label="Close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  );
}
