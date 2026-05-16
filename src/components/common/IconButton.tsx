import type { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function IconButton({ label, style, children, ...rest }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        border: 'none',
        borderRadius: 8,
        background: 'transparent',
        color: '#a1a1aa',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#2d2d4a')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      {...rest}
    >
      {children}
    </button>
  );
}
