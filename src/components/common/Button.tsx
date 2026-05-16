import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const styles: Record<string, React.CSSProperties> = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
  primary: { background: '#7c5cfc', color: '#fff' },
  secondary: { background: '#2d2d4a', color: '#e4e4e7' },
  ghost: { background: 'transparent', color: '#a1a1aa' },
  danger: { background: '#dc2626', color: '#fff' },
  sm: { padding: '6px 12px', fontSize: 13 },
  md: { padding: '8px 16px', fontSize: 14 },
  lg: { padding: '12px 20px', fontSize: 15 },
};

export function Button({
  variant = 'secondary',
  size = 'md',
  style,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      style={{
        ...styles.base,
        ...styles[variant],
        ...styles[size],
        ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
        ...style,
      }}
      disabled={disabled}
      {...rest}
    />
  );
}
