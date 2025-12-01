import React from 'react';
import { theme } from '../../styles/theme';

// Exportação nomeada (sem export default)
export function Button({ children, variant = 'primary', style, ...props }) {
  
  const base = {
    padding: '10px 14px',
    borderRadius: theme.radii.sm,
    border: 'none',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: theme.font.base,
    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
    fontSize: '14px', // Adicionado para melhor visualização
  };

  const variants = {
    primary: { 
      background: theme.colors.primary, 
      color: '#fff',
      '&:hover': {
        background: theme.colors.primaryDark,
      }
    },
    secondary: { 
      background: theme.colors.muted, 
      color: '#fff',
      '&:hover': {
        background: theme.colors.text,
      }
    },
    ghost: { 
      background: 'transparent', 
      color: theme.colors.primary,
      border: `1px solid ${theme.colors.primary}`,
    },
    danger: { 
      background: theme.colors.danger, 
      color: '#fff',
      '&:hover': {
        background: '#b91c1c',
      }
    },
    success: { 
      background: theme.colors.success, 
      color: '#fff',
      '&:hover': {
        background: '#15803d',
      }
    },
  };

  const variantStyles = variants[variant] || variants.primary;

  return (
    <button
      {...props}
      style={{ 
        ...base, 
        ...variantStyles, 
        ...style 
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.995)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = '')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
    >
      {children}
    </button>
  );
}

// Exportação padrão para compatibilidade
export default Button;