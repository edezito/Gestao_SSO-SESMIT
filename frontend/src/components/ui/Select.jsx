import React, { useState } from 'react';
import { theme } from '../../styles/theme';

export function Select({ 
  label, 
  options = [], 
  error, 
  style, 
  placeholder = "Selecione...",
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);

  const selectStyle = {
    width: '100%',
    padding: '12px 16px',
    paddingRight: '40px',
    border: `1px solid ${error ? theme.colors.danger : isFocused ? theme.colors.primary : theme.colors.border}`,
    borderRadius: theme.radii.sm,
    fontSize: '14px',
    fontFamily: theme.font.base,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
    boxSizing: 'border-box',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: isFocused ? `0 0 0 3px ${theme.colors.primary}20` : 'none',
    ...style
  };

  return (
    <div style={{ marginBottom: '16px', ...style }}>
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
      <div style={{ position: 'relative' }}>
        <select
          style={selectStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled={props.value !== ''}>
              {placeholder}
            </option>
          )}
          
          {options.map((option, index) => (
            <option 
              key={option.value || option.id || index} 
              value={option.value || option.id}
            >
              {option.label || option.name}
            </option>
          ))}
        </select>
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: theme.colors.muted
        }}>
          ▼
        </div>
      </div>
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

export default Select;