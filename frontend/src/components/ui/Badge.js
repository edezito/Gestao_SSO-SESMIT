// src/components/ui/Badge.js
const badgeStyles = {
  base: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
    display: 'inline-block',
  },
  success: {
    background: '#d4edda',
    color: '#155724',
  },
  info: {
    background: '#d1ecf1',
    color: '#0c5460',
  },
  secondary: {
    background: '#e2e3e5',
    color: '#383d41',
  },
  warning: {
    background: '#fff3cd',
    color: '#856404',
  },
  danger: {
    background: '#f8d7da',
    color: '#721c24',
  },
};

export default function Badge({ children, type = 'secondary' }) {
  return (
    <span style={{ ...badgeStyles.base, ...badgeStyles[type] }}>
      {children}
    </span>
  );
}