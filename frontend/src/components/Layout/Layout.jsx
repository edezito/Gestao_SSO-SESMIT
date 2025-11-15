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
        display: 'flex',
        flexDirection: 'column',
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
        flex: 1,
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
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'rgba(37,99,235,0.04)',
            color: theme.colors.primary,
        }
    }),
    topbar: {
        gridColumn: '1 / -1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        borderBottom: `1px solid ${theme.colors.border}`,
        background: 'rgba(255,255,255,0.8)',
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
        gap: 16,
        alignItems: 'center',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: theme.colors.primary,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 14,
    },
    userDetails: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    userName: {
        fontWeight: 600,
        fontSize: 14,
        color: theme.colors.text,
    },
    userRole: {
        fontSize: 12,
        color: theme.colors.muted,
        marginTop: 2,
    },
    logoutButton: {
        background: 'transparent',
        color: '#6b7280',
        border: `1px solid #e5e7eb`,
        padding: '8px 16px',
        borderRadius: theme.radii.sm,
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: 13,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        '&:hover': {
            background: '#fef2f2',
            color: '#dc2626',
            borderColor: '#fecaca',
        }
    },
    sidebarFooter: {
        marginTop: 'auto',
        paddingTop: 24,
        fontSize: 13,
        color: theme.colors.muted,
    },
    menuButton: {
        border: 'none',
        background: 'transparent',
        padding: 8,
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 18,
        color: theme.colors.text,
        '&:hover': {
            background: 'rgba(0,0,0,0.05)',
        }
    }
};

export default function Layout({ 
    children, 
    user, 
    navItems = [], 
    onNavigate = () => {},
    onLogout = () => {}
}) {
    const handleLogout = () => {
        console.log('🔄 Layout: Iniciando processo de logout...');
        console.log('🔍 Layout: Tipo de onLogout:', typeof onLogout);
        
        if (window.confirm('Tem certeza que deseja sair do sistema?')) {
            console.log('✅ Layout: Usuário confirmou logout, executando onLogout...');
            
            if (typeof onLogout === 'function') {
                onLogout();
            } else {
                console.error('❌ Layout: onLogout não é uma função! Valor:', onLogout);
                // Fallback direto
                window.location.replace('/auth');
            }
        } else {
            console.log('❌ Layout: Usuário cancelou o logout');
        }
    };

    return (
        <div style={styles.root}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.brand}>
                    <div style={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 10, 
                        background: theme.colors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 16
                    }}>
                        S
                    </div>
                    <div>
                        <div style={styles.brandTitle}>SSO Gestão</div>
                        <div style={{ fontSize: 12, color: theme.colors.muted }}>Admin Panel</div>
                    </div>
                </div>

                <nav style={styles.nav}>
                    {navItems.map((item) => (
                        <a
                            key={item.key}
                            style={styles.navItem(item.active)}
                            href={item.to}
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigate(item.to);
                            }}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </a>
                    ))}
                </nav>

                <div style={styles.sidebarFooter}>
                    <div>Versão 1.0</div>
                    <div style={{ marginTop: 8 }}>Contato: suporte@empresa.com</div>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Topbar */}
                <header style={styles.topbar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button
                            style={styles.menuButton}
                            aria-label="Abrir menu"
                        >
                            ☰
                        </button>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>Painel de Controle</div>
                    </div>

                    <div style={styles.topbarRight}>
                        <div style={styles.userInfo}>
                            <div style={styles.userDetails}>
                                <div style={styles.userName}>
                                    {user?.nome || 'Usuário'}
                                </div>
                                <div style={styles.userRole}>
                                    {user?.perfil || 'Perfil'}
                                </div>
                            </div>
                            <div style={styles.avatar}>
                                {(user?.nome || 'U')[0].toUpperCase()}
                            </div>
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            style={styles.logoutButton}
                            title="Sair do sistema"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" strokeLinecap="round"/>
                                <polyline points="16,17 21,12 16,7" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Sair
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main style={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}
