import React from 'react';

function Spinner({ size = 40, color = '#2563EB', label }) {
  const spinnerStyle = {
    display: 'inline-block',
    width: `${size}px`,
    height: `${size}px`,
    border: `4px solid ${color}20`,
    borderTop: `4px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={spinnerStyle} />
      {label && (
        <span style={{ 
          marginTop: '12px', 
          color: '#666',
          fontSize: '14px'
        }}>
          {label}
        </span>
      )}
    </div>
  );
}

export default Spinner;