// src/styles/theme.js
export const theme = {
  colors: {
    primary: '#2563EB',     // azul principal
    primaryDark: '#1E40AF',
    accent: '#7C3AED',      // roxo para vínculos
    success: '#16A34A',
    danger: '#DC2626',
    muted: '#6B7280',
    bg: '#F7FAFC',
    card: '#FFFFFF',
    border: '#E6E9EE',
    text: '#0F172A'
  },
  radii: {
    sm: 6,
    md: 12,
    lg: 16
  },
  spacing: (n) => `${n * 8}px`,
  font: {
    base: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  }
};
