import React from 'react';
import RiscoManager from '../../components/riscos/RiscoManager';
import Layout from '../../components/Layout/Layout';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function RiscosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: '🏠', active: location.pathname === '/dashboard' },
    { key: 'riscos', label: 'Riscos', to: '/riscos', icon: '⚠️', active: location.pathname === '/riscos' }
  ];

  return (
    <Layout user={user} navItems={navItems} onNavigate={(to) => navigate(to)}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 0' }}>
        <Card title="Gestão de Riscos Ocupacionais" style={{ marginBottom: 20 }}>
          <p style={{ margin: 0, color: '#6c757d' }}>Cadastre e gerencie os riscos ocupacionais da empresa</p>
        </Card>

        <Card>
          <RiscoManager />
        </Card>
      </div>
    </Layout>
  );
}
