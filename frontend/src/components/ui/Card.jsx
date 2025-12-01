import React from 'react';
import { theme } from '../../styles/theme';

export function Card({ title, children, style }) {
  return (
    <div style={{
      background: theme.colors.card,
      borderRadius: theme.radii.md,
      padding: 20,
      boxShadow: theme.shadows.md || '0 6px 18px rgba(15,23,42,0.06)',
      border: `1px solid ${theme.colors.border}`,
      ...style
    }}>
      {title && <h3 style={{ 
        margin: 0, 
        marginBottom: 12, 
        color: theme.colors.text,
        fontSize: '16px',
        fontWeight: 600 
      }}>{title}</h3>}
      <div>{children}</div>
    </div>
  );
}

export default Card;