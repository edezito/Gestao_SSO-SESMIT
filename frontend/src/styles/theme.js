// Tema completo
export const theme = {
  colors: {
    primary: '#2563EB',     
    primaryDark: '#1E40AF',
    accent: '#7C3AED',      
    success: '#16A34A',
    danger: '#DC2626',
    muted: '#6B7280',
    bg: '#F7FAFC',
    card: '#FFFFFF',
    border: '#E6E9EE',
    text: '#0F172A',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    warning: '#F59E0B', 
    white: '#FFFFFF',
    black: '#000000',
    cardBackground: '#FFFFFF'
  },
  
  radii: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    circle: '50%'
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  
  font: {
    base: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    mono: "'SF Mono', Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', monospace"
  },
  
  typography: {
    small: {
      fontSize: '12px',
      lineHeight: 1.5,
      fontWeight: 400 // Adicionado
    },
    body: {
      fontSize: '14px',
      lineHeight: 1.5,
      fontWeight: 400 // Adicionado
    },
    large: {
      fontSize: '16px',
      lineHeight: 1.5,
      fontWeight: 400 // Adicionado
    },
    heading: {
      h1: {
        fontSize: '32px',
        fontWeight: 700,
        lineHeight: 1.2
      },
      h2: {
        fontSize: '24px',
        fontWeight: 600,
        lineHeight: 1.3
      },
      h3: {
        fontSize: '20px',
        fontWeight: 600,
        lineHeight: 1.4
      }
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  }
};

// Exportações nomeadas para compatibilidade
export const COLORS = theme.colors;
export const SPACING = theme.spacing;
export const BORDER_RADIUS = theme.radii;
export const SHADOWS = theme.shadows;
export const TYPOGRAPHY = theme.typography;

export default theme;