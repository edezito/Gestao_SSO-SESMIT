import React from 'react';
import Layout from '../../components/Layout/Layout';
import { Card } from '../../components/ui/Card';
import CargoRiscoManager from '../../components/vinculos/CargoRiscoManager';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CargoRiscoPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: '🏠', active: location.pathname === '/dashboard' },
    { key: 'vinculos', label: 'Vínculos', to: '/vinculos', icon: '🔗', active: location.pathname === '/vinculos' }
  ];

  return (
    <Layout user={user} navItems={navItems} onNavigate={(to) => navigate(to)}>
      <Card title="Gestão de Vínculos" style={{ marginBottom: 20 }}>
        <p style={{ color: '#6c757d', marginTop: 0 }}>
          Configure os vínculos entre cargos, riscos e exames para automatizar o agendamento.
        </p>
      </Card>

      <Card>
        <CargoRiscoManager />
      </Card>
    </Layout>
  );
}
