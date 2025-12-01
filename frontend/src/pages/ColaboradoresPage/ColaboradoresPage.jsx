// src/pages/ColaboradoresPage/ColaboradoresPage.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import CargoManager from '../../components/cargos/CargoManager';
import ColaboradorManager from '../../components/colaboradores/ColaboradorManager';
import Layout from '../../components/Layout/Layout';
import { useNavigate, useLocation } from 'react-router-dom';

const styles = {
  container: {
    maxWidth: 1300,
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '2rem',
    fontWeight: 700,
  },
  userInfo: {
    textAlign: 'right',
    color: '#6c757d',
  },
  badge: {
    marginTop: 6,
    display: 'inline-block',
    background: '#e9ecef',
    padding: '4px 10px',
    borderRadius: 12,
    fontWeight: 600,
  },
  section: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: 12,
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    marginBottom: 20,
    color: '#34495e',
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  main: {
    display: 'grid',
    gap: '2rem',
  },
  accessDenied: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    textAlign: 'center',
    color: '#6c757d',
  },
  accessDeniedTitle: {
    color: '#e74c3c',
    marginBottom: '1rem',
  },
};

export default function ColaboradoresPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isSesmit = user?.perfil === "SESMIT";
  const isGestor = user?.perfil === "GESTOR";

  // PERMITIR APENAS SESMIT OU GESTOR
  if (!isSesmit && !isGestor) {
    return (
      <div style={styles.accessDenied}>
        <div>
          <h1 style={styles.accessDeniedTitle}>Acesso Restrito</h1>
          <p>Apenas usuários SESMIT ou GESTOR têm acesso a esta área.</p>
          <p>Seu perfil atual: <strong>{user?.perfil}</strong></p>
        </div>
      </div>
    );
  }

  const navItems = [
    { 
      key: 'dashboard', 
      label: 'Dashboard', 
      to: '/dashboard', 
      icon: '🏠', 
      active: location.pathname === '/dashboard' 
    },
    { 
      key: 'colaboradores', 
      label: 'Colaboradores', 
      to: '/colaboradores', 
      icon: '👥', 
      active: location.pathname === '/colaboradores' 
    },
    { 
      key: 'riscos', 
      label: 'Riscos', 
      to: '/riscos', 
      icon: '⚠️', 
      active: location.pathname === '/riscos' 
    },
  ];

  const canEdit = isGestor; // SOMENTE GESTOR PODE CRUD COMPLETO

  return (
    <Layout user={user} navItems={navItems} onNavigate={(to) => navigate(to)}>
      <div style={styles.container}>
        
        {/* Header da Página */}
        <header style={styles.header}>
          <h1 style={styles.title}>
            Gestão de Colaboradores
          </h1>
          <div style={styles.userInfo}>
            <div>Logado como: <strong>{user?.nome}</strong></div>
            <div style={styles.badge}>
              {user?.perfil}
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main style={styles.main}>
          
          {/* === GERENCIAMENTO DE COLABORADORES === */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              👥 Colaboradores
            </h2>
            <ColaboradorManager canEdit={canEdit} />
          </section>

          {/* === GERENCIAMENTO DE CARGOS === */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              💼 Cargos
            </h2>
            <CargoManager canEdit={canEdit} />
          </section>

        </main>
      </div>
    </Layout>
  );
}