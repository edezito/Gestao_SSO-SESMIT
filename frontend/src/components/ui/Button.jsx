import React from 'react';
import { theme } from '../../styles/theme';

export function Button({ children, variant = 'primary', style, ...props }) {
  const base = {
    padding: '10px 14px',
    borderRadius: theme.radii.sm,
    border: 'none',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: theme.font.base,
    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
  };

  const variants = {
    primary: { background: theme.colors.primary, color: '#fff' },
    ghost: { background: 'transparent', color: theme.colors.primary },
    danger: { background: theme.colors.danger, color: '#fff' },
    success: { background: theme.colors.success, color: '#fff' },
  };

  return (
    <button
      {...props}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.995)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = '')}
    >
      {children}
    </button>
  );
}
