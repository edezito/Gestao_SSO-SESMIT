import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api'; 
import ExameForm from './ExameForm';
import { Loading } from '../ui/Loading';
import { ErrorMessage } from '../ui/ErrorMessage';

const AgendarExame = () => {
    const { user, isColaborador, isGestor, isSesmit, loading: authLoading } = useAuth();
    
    // ✅ CORREÇÃO: Apenas Gestor/SESMIT podem agendar exames
    const podeAgendarExames = isGestor || isSesmit;
    
    // ✅ Busca de colaboradores (apenas se tiver permissão)
    const { 
        data: colaboradores, 
        loading: colabLoading, 
        error: colabError 
    } = useApi('/usuarios/colaboradores', { 
        lazy: !podeAgendarExames,
    });

    // ✅ Busca tipos de exame
    const { 
        data: tiposExame, 
        loading: examesLoading, 
        error: examesError 
    } = useApi('/exames/tipos-exame');

    const [submitStatus, setSubmitStatus] = useState({ 
        loading: false, 
        error: '', 
        success: '' 
    });

    // ✅ CORREÇÃO: Se for colaborador, mostra mensagem de acesso negado
    if (isColaborador) {
        return (
            <div style={styles.container}>
                <div style={styles.accessDenied}>
                    <h2>❌ Acesso Negado</h2>
                    <p>Colaboradores não podem agendar exames diretamente.</p>
                    <p>Entre em contato com o SESMIT ou Gestor para agendar seu exame.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (formData) => {
        setSubmitStatus({ loading: true, error: '', success: '' });

        try {
            // ✅ Apenas Gestor/SESMIT chegam aqui
            await api.post('/exames/agendamentos', formData);
            
            setSubmitStatus({ 
                loading: false, 
                error: '', 
                success: 'Exame agendado com sucesso!' 
            });

            return true;
        } catch (error) {
            setSubmitStatus({ 
                loading: false, 
                error: error.message || 'Erro ao agendar exame', 
                success: '' 
            });
            return false;
        }
    };

    const loading = authLoading || colabLoading || examesLoading;
    const error = colabError || examesError;

    if (loading) {
        return <Loading message="Carregando dados..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Agendar Exame para Colaborador</h1>
                <div style={styles.userBadge}>
                    Permissão: <strong>{isGestor ? 'GESTOR' : 'SESMIT'}</strong>
                </div>
            </header>

            <ExameForm
                colaboradores={colaboradores || []}
                tiposExame={tiposExame || []}
                currentUser={user}
                isColaborador={false} // ✅ Sempre false aqui
                onSubmit={handleSubmit}
                submitStatus={submitStatus}
            />
        </div>
    );
};

// Estilos inline
const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    header: {
        marginBottom: '30px',
        borderBottom: '1px solid #eee',
        paddingBottom: '20px',
    },
    title: {
        margin: '0 0 10px 0',
        color: '#333',
    },
    userBadge: {
        padding: '8px 12px',
        backgroundColor: '#28a745',
        color: 'white',
        borderRadius: '4px',
        display: 'inline-block',
    },
    accessDenied: {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        color: '#721c24',
    }
};

export default AgendarExame;