import React from 'react';
import { theme } from '../../styles/theme';

export function Input({ 
  placeholder, 
  value, 
  onChange, 
  type = 'text', 
  style, 
  label,
  error,
  ...props 
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '6px',
          fontSize: '14px',
          fontWeight: 500,
          color: theme.colors.text
        }}>
          {label}
        </label>
      )}
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
          border: `1px solid ${error ? theme.colors.danger : theme.colors.border}`,
          background: '#fff',
          fontFamily: theme.font.base,
          fontSize: 14,
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
          '&:focus': {
            outline: 'none',
            borderColor: theme.colors.primary
          },
          ...style
        }}
      />
      {error && (
        <div style={{
          color: theme.colors.danger,
          fontSize: '12px',
          marginTop: '4px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default Input;