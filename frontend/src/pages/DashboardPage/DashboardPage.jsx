import React from 'react';
import Layout from '../../components/Layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDashboardSummary } from '../../hooks/useDashboardSummary';
import { useUltimosAgendamentos } from '../../hooks/useUltimosAgendamentos';

export default function DashboardPage() {
    const { user, isSesmit, isGestor, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Menu dinâmico baseado no perfil
    const getNavItems = () => {
        const activePath = location.pathname;
        
        const items = [
            { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: '🏠', active: activePath === '/dashboard' },
            { key: 'exames', label: 'Exames', to: '/exames', icon: '📋', active: activePath === '/exames' },
            { key: 'cats', label: 'CATs', to: '/cats', icon: '🚨', active: activePath === '/cats' },
        ];

        if (isGestor) {
            items.push({ 
                key: 'colaboradores', 
                label: 'Colaboradores', 
                to: '/colaboradores', 
                icon: '👥', 
                active: activePath === '/colaboradores' 
            });
        }

        if (isGestor || isSesmit) {
            items.push(
                { key: 'riscos', label: 'Riscos', to: '/riscos', icon: '⚠️', active: activePath === '/riscos' },
                { key: 'vinculos', label: 'Cargos (Vínculos)', to: '/vinculos', icon: '🔗', active: activePath === '/vinculos' }
            );
        }
        
        return items;
    };

    const navItems = getNavItems();

    // Hooks de dados
    const { data, loading, error, refresh } = useDashboardSummary({ pollInterval: 60000 });
    const {
        agendamentos,
        loading: loadingAgendamentos,
        error: errorAgendamentos,
        refresh: refreshAgendamentos
    } = useUltimosAgendamentos({ limit: 5 });

    const showNumber = (value) => {
        if (loading) return '...';
        if (error) return '—';
        return value ?? (loading ? '...' : '—');
    };

    return (
        <Layout 
            user={user} 
            navItems={navItems} 
            onNavigate={(to) => navigate(to)}
            onLogout={logout} 
        >
            <div style={{ display: 'grid', gap: 20 }}>
                {/* Cabeçalho */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div>
                        <h2 style={{ margin: 0 }}>Visão Geral</h2>
                        <div style={{ color: '#6b7280', marginTop: 6 }}>
                            Atualizado automaticamente a cada 60s.
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Button onClick={() => { refresh(); refreshAgendamentos(); }}>
                            Atualizar
                        </Button>
                        {(loading || loadingAgendamentos) && (
                            <span style={{ color: '#6b7280' }}>Carregando...</span>
                        )}
                        {(error || errorAgendamentos) && (
                            <span style={{ color: '#e74c3c' }}>
                                Erro: {error?.message || errorAgendamentos?.message || 'Erro ao carregar'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Cards de Métricas */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                    gap: 16 
                }}>
                    {/* Card para todos os usuários */}
                    <Card title="Exames Pendentes">
                        <div style={{ fontSize: 28, fontWeight: 800 }}>
                            {showNumber(data?.exames_pendentes)}
                        </div>
                        <div style={{ color: '#6b7280', marginTop: 8 }}>
                            {isGestor || isSesmit ? 'Agendamentos pendentes (Global)' : 'Meus agendamentos pendentes'}
                        </div>
                    </Card>

                    {/* Cards apenas para Admin */}
                    {(isGestor || isSesmit) && (
                        <>
                            <Card title="Total de Colaboradores">
                                <div style={{ fontSize: 28, fontWeight: 800 }}>
                                    {showNumber(data?.colaboradores)}
                                </div>
                                <div style={{ color: '#6b7280', marginTop: 8 }}>
                                    Usuários cadastrados no sistema
                                </div>
                            </Card>

                            <Card title="Riscos Ativos">
                                <div style={{ fontSize: 28, fontWeight: 800 }}>
                                    {showNumber(data?.riscos_ativos)}
                                </div>
                                <div style={{ color: '#6b7280', marginTop: 8 }}>
                                    Riscos marcados como ativos
                                </div>
                            </Card>

                            <Card title="Cargos com Vínculos">
                                <div style={{ fontSize: 28, fontWeight: 800 }}>
                                    {showNumber(data?.vinculos)}
                                </div>
                                <div style={{ color: '#6b7280', marginTop: 8 }}>
                                    Cargos que possuem riscos vinculados
                                </div>
                            </Card>
                        </>
                    )}
                </div>

                {/* Área Principal */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
                    {/* Últimos Agendamentos */}
                    <Card title="Últimos Agendamentos">
                        {loadingAgendamentos ? (
                            <div style={{ color: '#6b7280' }}>Carregando agendamentos...</div>
                        ) : errorAgendamentos ? (
                            <div style={{ color: '#e74c3c' }}>Erro ao carregar agendamentos</div>
                        ) : agendamentos.length === 0 ? (
                            <div style={{ color: '#6b7280' }}>Nenhum agendamento recente</div>
                        ) : (
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                {agendamentos.map(agendamento => (
                                    <li key={agendamento.id} style={{ padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                                        <div style={{ fontWeight: 600 }}>{agendamento.colaborador_nome}</div>
                                        <div style={{ color: '#6b7280', fontSize: 14 }}>
                                            {agendamento.exame_nome} - {new Date(agendamento.data_agendamento).toLocaleString()}
                                        </div>
                                        <div style={{ 
                                            fontSize: 12, 
                                            color: agendamento.status === 'concluido' ? '#10b981' : '#f59e0b',
                                            marginTop: 4
                                        }}>
                                            {agendamento.status}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    {/* Sidebar de Ações */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Card title="Ações Rápidas">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <Button onClick={() => navigate('/exames')}>
                                    Gerenciar Exames
                                </Button>
                                <Button variant="primary" onClick={() => navigate('/cats')}>
                                    Registrar CAT
                                </Button>
                                {isGestor && (
                                    <Button variant="primary" onClick={() => navigate('/colaboradores')}>
                                        Gerenciar Colaboradores
                                    </Button>
                                )}
                            </div>
                        </Card>

                        <Card title="Informações do Sistema">
                           <div style={{ color: '#6b7280', fontSize: 14 }}>
                               <div>Última sincronização: <strong>{data ? 'agora' : '—'}</strong></div>
                               <div style={{ marginTop: 8 }}>Suporte: suporte@empresa.com</div>
                               <div style={{ marginTop: 4 }}>Telefone: (11) 99999-9999</div>
                           </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}