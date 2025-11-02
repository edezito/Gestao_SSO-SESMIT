import React, { useState, useEffect } from 'react';
import { listarRiscos, criarRisco, atualizarRisco, deletarRisco } from '../../services/api';
import RiscoForm from './RiscoForm';
import RiscoList from './RiscoList'; // ✅ CORREÇÃO: importar do arquivo correto
import { useAuth } from '../../hooks/useAuth';

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e9ecef'
  },
  accessDenied: {
    textAlign: 'center',
    padding: '40px',
    background: '#f8f9fa',
    borderRadius: '8px',
    border: '2px dashed #dee2e6'
  },
  accessDeniedTitle: {
    color: '#dc3545',
    marginBottom: '15px'
  },
  accessDeniedText: {
    color: '#6c757d',
    marginBottom: '10px'
  },
  errorMessage: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
    marginBottom: '20px'
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s'
  },
  buttonPrimary: {
    background: '#007bff',
    color: 'white'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  }
};

const RiscoManager = () => {
  const [riscos, setRiscos] = useState([]);
  const [riscoEditando, setRiscoEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const { isSesmit } = useAuth();

  const carregarRiscos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      console.log('🔄 Carregando riscos...');
      const dadosRiscos = await listarRiscos(token);
      setRiscos(dadosRiscos);
      
    } catch (error) {
      console.error('❌ Erro ao carregar riscos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSesmit) {
      carregarRiscos();
    }
  }, [isSesmit]);

  const handleCriarRisco = async (dadosRisco) => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      await criarRisco(dadosRisco, token);
      await carregarRiscos();
      setMostrarForm(false);
      setRiscoEditando(null);
      
    } catch (error) {
      console.error('❌ Erro ao criar risco:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarRisco = async (dadosRisco) => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      await atualizarRisco(riscoEditando.id, dadosRisco, token);
      await carregarRiscos();
      setMostrarForm(false);
      setRiscoEditando(null);
      
    } catch (error) {
      console.error('❌ Erro ao editar risco:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarRisco = async (id) => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      if (window.confirm('Tem certeza que deseja inativar este risco?')) {
        await deletarRisco(id, token);
        await carregarRiscos();
      }
      
    } catch (error) {
      console.error('❌ Erro ao deletar risco:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoRisco = () => {
    setRiscoEditando(null);
    setMostrarForm(true);
  };

  const handleCancelar = () => {
    setMostrarForm(false);
    setRiscoEditando(null);
  };

  const handleEditar = (risco) => {
    setRiscoEditando(risco);
    setMostrarForm(true);
  };

  const getButtonStyle = () => {
    return {
      ...styles.button,
      ...styles.buttonPrimary,
      ...((loading || mostrarForm) ? styles.buttonDisabled : {})
    };
  };

  if (!isSesmit) {
    return (
      <div style={styles.container}>
        <div style={styles.accessDenied}>
          <h2 style={styles.accessDeniedTitle}>Acesso Negado</h2>
          <p style={styles.accessDeniedText}>Você não tem permissão para gerenciar riscos.</p>
          <p style={styles.accessDeniedText}>Apenas usuários SESMIT podem acessar esta funcionalidade.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Gerenciar Riscos Ocupacionais</h2>
        <button
          onClick={handleNovoRisco}
          style={getButtonStyle()}
          disabled={loading || mostrarForm}
        >
          + Novo Risco
        </button>
      </div>
      
      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}

      {mostrarForm && (
        <RiscoForm
          risco={riscoEditando}
          onSubmit={riscoEditando ? handleEditarRisco : handleCriarRisco}
          onCancel={handleCancelar}
          loading={loading}
        />
      )}

      <RiscoList
        riscos={riscos}
        onEdit={handleEditar}
        onDelete={handleDeletarRisco}
        loading={loading}
      />
    </div>
  );
};

export default RiscoManager;