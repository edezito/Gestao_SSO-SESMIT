import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import CargoManager from '../../components/cargos/CargoManager';
import Layout from '../../components/Layout/Layout';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ColaboradoresPage() {
  const { user, isSesmit } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isSesmit) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
        color: '#6c757d'
      }}>
        <div>
          <h1 style={{ color: '#e74c3c' }}>Acesso Restrito</h1>
          <p>Apenas usuários SESMIT têm acesso à gestão de colaboradores.</p>
          <p>Seu perfil atual: <strong>{user?.perfil}</strong></p>
        </div>
      </div>
    );
  }

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: '🏠', active: location.pathname === '/dashboard' },
    { key: 'colaboradores', label: 'Colaboradores', to: '/colaboradores', icon: '👥', active: location.pathname === '/colaboradores' },
    { key: 'riscos', label: 'Riscos', to: '/riscos', icon: '⚠️', active: location.pathname === '/riscos' },
  ];

  return (
    <Layout user={user} navItems={navItems} onNavigate={(to) => navigate(to)}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '1.8rem' }}>Gestão de Colaboradores</h1>
          <div style={{ textAlign: 'right', color: '#6c757d' }}>
            <div>Logado como: <strong>{user?.nome}</strong></div>
            <div style={{ marginTop: 6, display: 'inline-block', background: '#e9ecef', padding: '4px 10px', borderRadius: 12 }}>{user?.perfil}</div>
          </div>
        </header>

        <main>
          <CargoManager />
        </main>
      </div>
    </Layout>
  );
}
