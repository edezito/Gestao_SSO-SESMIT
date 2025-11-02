import React from 'react';
import { theme } from '../../styles/theme';

export function Input({ placeholder, value, onChange, type = 'text', style, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: theme.radii.sm,
        border: `1px solid ${theme.colors.border}`,
        background: '#fff',
        fontFamily: theme.font.base,
        fontSize: 14,
        boxSizing: 'border-box',
        ...style
      }}
    />
  );
}
