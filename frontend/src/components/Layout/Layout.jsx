// src/components/Layout/Layout.jsx
import React from 'react';
import { theme } from '../../styles/theme';

const styles = {
  root: {
    fontFamily: theme.font.base,
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    minHeight: '100vh',
    background: theme.colors.bg,
    color: theme.colors.text,
  },
  sidebar: {
    background: theme.colors.card,
    borderRight: `1px solid ${theme.colors.border}`,
    padding: '20px',
    boxSizing: 'border-box',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  brandTitle: {
    fontWeight: 700,
    fontSize: 18,
    color: theme.colors.primary,
  },
  nav: {
    marginTop: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  navItem: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: theme.radii.sm,
    cursor: 'pointer',
    color: active ? theme.colors.primaryDark : theme.colors.muted,
    background: active ? 'rgba(37,99,235,0.06)' : 'transparent',
    fontWeight: active ? 600 : 500,
    textDecoration: 'none',
  }),
  topbar: {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    borderBottom: `1px solid ${theme.colors.border}`,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.65), rgba(255,255,255,0.65))',
    backdropFilter: 'blur(6px)',
  },
  content: {
    padding: 24,
    maxWidth: 1200,
    width: '100%',
    margin: '24px auto',
  },
  topbarRight: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    background: theme.colors.primary,
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
  },

  // mobile
  '@mediaSmall': {
    root: { gridTemplateColumns: '1fr' },
    sidebar: { display: 'none' },
    topbar: { gridColumn: '1 / -1' },
  }
};

export default function Layout({ children, user, navItems = [], onNavigate = () => {} }) {
  return (
    <div style={styles.root}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: theme.colors.primary }} />
          <div>
            <div style={styles.brandTitle}>SSO Gestão</div>
            <div style={{ fontSize: 12, color: theme.colors.muted }}>Admin Panel</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {navItems.map((it) => (
            <a
              key={it.key}
              style={styles.navItem(it.active)}
              href={it.to}
              onClick={(e) => { e.preventDefault(); onNavigate(it.to); }}
            >
              <span>{it.icon}</span>
              <span>{it.label}</span>
            </a>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', marginTop: 24, fontSize: 13, color: theme.colors.muted }}>
          <div>Versão 1.0</div>
          <div style={{ marginTop: 8 }}>Contato: suporte@empresa.com</div>
        </div>
      </aside>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={styles.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              style={{
                border: 'none',
                background: 'transparent',
                padding: 8,
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 18
              }}
              aria-label="Abrir menu"
            >☰</button>

            <div style={{ fontWeight: 700, fontSize: 16 }}>Painel de Controle</div>
            <div style={{ marginLeft: 8, color: theme.colors.muted, fontSize: 13 }}>
              Bem-vindo{user?.nome ? `, ${user.nome}` : ''}
            </div>
          </div>

          <div style={styles.topbarRight}>
            <div style={{ fontSize: 13, color: theme.colors.muted }}>{user?.perfil}</div>
            <div style={styles.avatar}>{(user?.nome || 'U')[0].toUpperCase()}</div>
          </div>
        </header>

        <main style={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
