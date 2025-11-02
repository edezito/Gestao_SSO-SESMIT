import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AgendarExame from '../../components/exames/AgendarExame';
import ListaExames from '../../components/exames/ListaExames';
import CriarTipoExame from '../../components/exames/CriarTipoExame';
import Layout from '../../components/Layout/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../../components/ui/Card';

const styles = {
  pageWrapper: { minHeight: '100vh', background: '#f8f9fa' },
  header: { background: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, color: '#333', fontSize: '1.25rem' },
  userInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  container: { maxWidth: 1200, margin: '0 auto', padding: '2rem' },
  nav: { display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #dee2e6', paddingBottom: 12 },
  navButton: (active) => ({
    padding: '0.6rem 1rem',
    borderRadius: 8,
    border: active ? '1px solid #007bff' : '1px solid #dee2e6',
    background: active ? '#007bff' : '#fff',
    color: active ? '#fff' : '#495057',
    cursor: 'pointer',
    fontWeight: 700
  }),
  mainContent: { background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
  accessMessage: { padding: 20, background: '#fff3f3', borderRadius: 8, color: '#c53030' }
};

export default function ExamesPage() {
  const { user, isGestor, isSesmit, isColaborador } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState('lista');
  const navigate = useNavigate();
  const location = useLocation();

  const temAcessoCompleto = isGestor || isSesmit;

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: '🏠', active: location.pathname === '/dashboard' },
    { key: 'exames', label: 'Exames', to: '/exames', icon: '📋', active: location.pathname === '/exames' }
  ];

  return (
    <Layout user={user} navItems={navItems} onNavigate={(to) => navigate(to)}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <header style={styles.header}>
          <h1 style={styles.title}>Gestão de Exames</h1>
          <div style={styles.userInfo}>
            <span>Olá, <strong>{user?.nome}</strong></span>
            <span style={{ background: '#e9ecef', padding: '4px 8px', borderRadius: 8 }}>{user?.perfil}</span>
          </div>
        </header>

        <div style={styles.container}>
          <nav style={styles.nav}>
            <button className="nav-btn" style={styles.navButton(abaAtiva === 'lista')} onClick={() => setAbaAtiva('lista')}>
              {temAcessoCompleto ? 'Todos os Exames' : 'Meus Exames'}
            </button>

            {temAcessoCompleto && (
              <button style={styles.navButton(abaAtiva === 'agendar')} onClick={() => setAbaAtiva('agendar')}>
                Agendar Exame
              </button>
            )}

            {temAcessoCompleto && (
              <button style={styles.navButton(abaAtiva === 'criar-tipo')} onClick={() => setAbaAtiva('criar-tipo')}>
                Criar Tipo de Exame
              </button>
            )}
          </nav>

          <main style={styles.mainContent}>
            {abaAtiva === 'lista' && <ListaExames />}
            {abaAtiva === 'agendar' && temAcessoCompleto && <AgendarExame />}
            {abaAtiva === 'criar-tipo' && temAcessoCompleto && <CriarTipoExame />}

            {isColaborador && abaAtiva !== 'lista' && (
              <div style={styles.accessMessage}>
                <h3>❌ Acesso Restrito</h3>
                <p>Esta funcionalidade está disponível apenas para SESMIT e Gestores.</p>
                <p>Entre em contato com a equipe responsável para agendar exames.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
