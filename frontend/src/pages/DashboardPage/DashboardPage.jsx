// src/pages/DashboardPage/DashboardPage.jsx
import React from 'react';
import Layout from '../../components/Layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDashboardSummary } from '../../hooks/useDashboardSummary';
import { useUltimosAgendamentos } from '../../hooks/useUltimosAgendamentos'; // novo hook

export default function DashboardPage() {
  const { user, isSesmit, isGestor, isColaborador } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: '🏠', active: location.pathname === '/dashboard' },
    { key: 'exames', label: 'Exames', to: '/exames', icon: '📋', active: location.pathname === '/exames' },
    { key: 'colaboradores', label: 'Colaboradores', to: '/colaboradores', icon: '👥', active: location.pathname === '/colaboradores' },
    { key: 'riscos', label: 'Riscos', to: '/riscos', icon: '⚠️', active: location.pathname === '/riscos' },
    { key: 'vinculos', label: 'Vínculos', to: '/vinculos', icon: '🔗', active: location.pathname === '/vinculos' },
  ];

  const temAcessoCompleto = isGestor || isSesmit;

  // Hook que busca o resumo do backend; polling a cada 60s
  const { data, loading, error, refresh } = useDashboardSummary({ pollInterval: 60000 });

  // Hook que busca os últimos agendamentos (limit = 5)
  const {
    agendamentos,
    loading: loadingAgendamentos,
    error: errorAgendamentos,
    refresh: refreshAgendamentos
  } = useUltimosAgendamentos({ limit: 5 });

  const showNumber = (value) => {
    if (loading) return '...';
    if (error) return '—';
    return value ?? '0';
  };

  return (
    <Layout user={user} navItems={navItems} onNavigate={(to) => navigate(to)}>
      <div style={{ display: 'grid', gap: 20 }}>
        {/* Top controls: refresh + status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Visão Geral</h2>
            <div style={{ color: '#6b7280', marginTop: 6 }}>
              Atualizado automaticamente a cada 60s.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button onClick={() => { refresh(); refreshAgendamentos(); }}>Atualizar</Button>
            {(loading || loadingAgendamentos) && <span style={{ color: '#6b7280' }}>Carregando...</span>}
            {(error || errorAgendamentos) && <span style={{ color: '#e74c3c' }}>Erro: {error || errorAgendamentos}</span>}
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <Card title="Exames Pendentes">
            <div style={{ fontSize: 28, fontWeight: 800 }}>{showNumber(data?.exames_pendentes)}</div>
            <div style={{ color: '#6b7280', marginTop: 8 }}>Agendamentos pendentes / sem realização</div>
          </Card>

          <Card title="Total de Colaboradores">
            <div style={{ fontSize: 28, fontWeight: 800 }}>{showNumber(data?.colaboradores)}</div>
            <div style={{ color: '#6b7280', marginTop: 8 }}>Usuários cadastrados no sistema</div>
          </Card>

          {isSesmit && (
            <Card title="Riscos Ativos">
              <div style={{ fontSize: 28, fontWeight: 800 }}>{showNumber(data?.riscos_ativos)}</div>
              <div style={{ color: '#6b7280', marginTop: 8 }}>Riscos marcados como ativos</div>
            </Card>
          )}

          <Card title="Cargos com Vínculos">
            <div style={{ fontSize: 28, fontWeight: 800 }}>{showNumber(data?.vinculos)}</div>
            <div style={{ color: '#6b7280', marginTop: 8 }}>Cargos que possuem riscos vinculados</div>
          </Card>
        </div>

        {/* Main area: agendamentos + actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
          <Card title="Últimos Agendamentos">
            {loadingAgendamentos ? (
              <div style={{ color: '#6b7280' }}>Carregando agendamentos...</div>
            ) : errorAgendamentos ? (
              <div style={{ color: '#e74c3c' }}>Erro ao carregar agendamentos</div>
            ) : agendamentos.length === 0 ? (
              <div style={{ color: '#6b7280' }}>Nenhum agendamento recente</div>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {agendamentos.map(a => (
                  <li key={a.id} style={{ padding: '4px 0' }}>
                    <strong>{a.colaborador_nome}</strong> - {a.exame_nome} - {new Date(a.data_agendamento).toLocaleString()} ({a.status})
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Card title="Ações Rápidas">
              <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={() => navigate('/exames')}>Exames</Button>
                {isSesmit && <Button variant="primary" onClick={() => navigate('/colaboradores')}>Colaboradores</Button>}
              </div>
            </Card>

            <Card title="Informações">
              <div style={{ color: '#6b7280' }}>
                Última sincronização: <strong>{data ? 'agora' : '—'}</strong>
                <div style={{ marginTop: 6 }}>Suporte: suporte@empresa.com</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
