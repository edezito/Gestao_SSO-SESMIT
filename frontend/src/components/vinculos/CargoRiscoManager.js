import React, { useState, useEffect } from 'react';
import { listarCargos, listarRiscos, vincularRiscosCargo, vincularExamesCargo } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center'
  },
  title: {
    color: '#2c3e50',
    marginBottom: '10px',
    fontSize: '2rem'
  },
  subtitle: {
    color: '#6c757d',
    fontSize: '1.1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '30px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid #e1e5e9'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px'
  },
  list: {
    maxHeight: '400px',
    overflowY: 'auto'
  },
  listItem: {
    padding: '12px 15px',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listItemSelected: {
    background: '#e3f2fd',
    borderColor: '#2196f3'
  },
  listItemHover: {
    background: '#f8f9fa'
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '5px'
  },
  itemDescription: {
    color: '#6c757d',
    fontSize: '0.9rem'
  },
  itemMeta: {
    fontSize: '0.8rem',
    color: '#868e96',
    display: 'flex',
    gap: '10px'
  },
  badge: {
    background: '#e9ecef',
    color: '#495057',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem'
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef'
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  buttonPrimary: {
    background: '#3498db',
    color: 'white'
  },
  buttonSecondary: {
    background: '#6c757d',
    color: 'white'
  },
  buttonSuccess: {
    background: '#27ae60',
    color: 'white'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d'
  },
  error: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
    marginBottom: '20px'
  },
  success: {
    background: '#d1edff',
    color: '#0c5460',
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid #bee5eb',
    marginBottom: '20px'
  },
  accessDenied: {
    textAlign: 'center',
    padding: '40px',
    background: '#f8f9fa',
    borderRadius: '8px',
    border: '2px dashed #dee2e6'
  }
};

const CargoRiscoManager = () => {
  const [cargos, setCargos] = useState([]);
  const [riscos, setRiscos] = useState([]);
  const [cargoSelecionado, setCargoSelecionado] = useState(null);
  const [riscosSelecionados, setRiscosSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isSesmit } = useAuth();

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      console.log('🔄 Carregando cargos e riscos...');
      const [dadosCargos, dadosRiscos] = await Promise.all([
        listarCargos(token),
        listarRiscos(token)
      ]);
      
      setCargos(dadosCargos);
      setRiscos(dadosRiscos.filter(risco => risco.ativo));
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSesmit) {
      carregarDados();
    }
  }, [isSesmit]);

  const handleSelecionarCargo = (cargo) => {
    setCargoSelecionado(cargo);
    // Pre-seleciona os riscos já vinculados a este cargo
    setRiscosSelecionados(cargo.riscos_associados?.map(r => r.id) || []);
    setError('');
    setSuccess('');
  };

  const handleToggleRisco = (riscoId) => {
    setRiscosSelecionados(prev => {
      if (prev.includes(riscoId)) {
        return prev.filter(id => id !== riscoId);
      } else {
        return [...prev, riscoId];
      }
    });
  };

  const handleVincularRiscos = async () => {
    if (!cargoSelecionado) {
      setError('Selecione um cargo primeiro.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      console.log(`🔄 Vinculando ${riscosSelecionados.length} riscos ao cargo ${cargoSelecionado.nome}...`);
      
      await vincularRiscosCargo(cargoSelecionado.id, riscosSelecionados, token);
      
      setSuccess(`Riscos vinculados com sucesso ao cargo ${cargoSelecionado.nome}! Exames serão gerados automaticamente para os colaboradores.`);
      
      // Recarrega os dados para atualizar as informações
      await carregarDados();
      
    } catch (error) {
      console.error('❌ Erro ao vincular riscos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLimparSelecoes = () => {
    setCargoSelecionado(null);
    setRiscosSelecionados([]);
    setError('');
    setSuccess('');
  };

  const getButtonStyle = (type = 'primary') => {
    const baseStyle = {
      ...styles.button,
      ...(loading ? styles.buttonDisabled : {})
    };

    switch (type) {
      case 'secondary':
        return { ...baseStyle, ...styles.buttonSecondary };
      case 'success':
        return { ...baseStyle, ...styles.buttonSuccess };
      default:
        return { ...baseStyle, ...styles.buttonPrimary };
    }
  };

  const getListItemStyle = (item, isSelected = false) => {
    return {
      ...styles.listItem,
      ...(isSelected ? styles.listItemSelected : {}),
      ...(!loading ? { ':hover': styles.listItemHover } : {})
    };
  };

  if (!isSesmit) {
    return (
      <div style={styles.container}>
        <div style={styles.accessDenied}>
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para gerenciar vínculos entre cargos e riscos.</p>
          <p>Apenas usuários SESMIT podem acessar esta funcionalidade.</p>
        </div>
      </div>
    );
  }

  if (loading && cargos.length === 0) {
    return <div style={styles.loading}>Carregando cargos e riscos...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Vínculos Cargos × Riscos</h1>
        <p style={styles.subtitle}>
          Vincule riscos ocupacionais aos cargos para gerar exames automaticamente
        </p>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {success && (
        <div style={styles.success}>
          {success}
        </div>
      )}

      <div style={styles.grid}>
        {/* Coluna 1: Lista de Cargos */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Cargos da Empresa</h3>
          <div style={styles.list}>
            {cargos.map((cargo) => (
              <div
                key={cargo.id}
                style={getListItemStyle(cargo, cargoSelecionado?.id === cargo.id)}
                onClick={() => !loading && handleSelecionarCargo(cargo)}
              >
                <div style={styles.itemInfo}>
                  <div style={styles.itemName}>{cargo.nome}</div>
                  {cargo.descricao && (
                    <div style={styles.itemDescription}>{cargo.descricao}</div>
                  )}
                  <div style={styles.itemMeta}>
                    <span>👥 {cargo.total_colaboradores || 0} colaboradores</span>
                    <span>⚠️ {cargo.riscos_associados?.length || 0} riscos</span>
                    <span>📋 {cargo.exames_exigidos?.length || 0} exames</span>
                  </div>
                </div>
                {cargoSelecionado?.id === cargo.id && (
                  <div style={styles.badge}>Selecionado</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Coluna 2: Lista de Riscos */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Riscos Ocupacionais</h3>
          <div style={styles.list}>
            {riscos.map((risco) => (
              <div
                key={risco.id}
                style={getListItemStyle(risco, riscosSelecionados.includes(risco.id))}
                onClick={() => !loading && handleToggleRisco(risco.id)}
              >
                <div style={styles.itemInfo}>
                  <div style={styles.itemName}>{risco.nome}</div>
                  {risco.descricao && (
                    <div style={styles.itemDescription}>{risco.descricao}</div>
                  )}
                  <div style={styles.itemMeta}>
                    <span>📋 {risco.exames_obrigatorios?.length || 0} exames obrigatórios</span>
                  </div>
                </div>
                {riscosSelecionados.includes(risco.id) && (
                  <div style={styles.badge}>Selecionado</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel de Resumo e Ações */}
      {cargoSelecionado && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Resumo do Vínculo</h3>
          <div style={{ marginBottom: '20px' }}>
            <p>
              <strong>Cargo selecionado:</strong> {cargoSelecionado.nome}
            </p>
            <p>
              <strong>Riscos selecionados:</strong> {riscosSelecionados.length} 
              {riscosSelecionados.length > 0 && (
                <span> ({riscosSelecionados.map(id => {
                  const risco = riscos.find(r => r.id === id);
                  return risco?.nome;
                }).filter(Boolean).join(', ')})</span>
              )}
            </p>
            <p>
              <strong>Colaboradores afetados:</strong> {cargoSelecionado.total_colaboradores || 0}
            </p>
            <p style={{ color: '#27ae60', fontWeight: '600' }}>
              ⚡ Exames serão gerados automaticamente para todos os colaboradores deste cargo!
            </p>
          </div>

          <div style={styles.actions}>
            <button
              style={getButtonStyle('secondary')}
              onClick={handleLimparSelecoes}
              disabled={loading}
            >
              Limpar Seleções
            </button>
            <button
              style={getButtonStyle('success')}
              onClick={handleVincularRiscos}
              disabled={loading || riscosSelecionados.length === 0}
            >
              {loading ? 'Processando...' : `Vincular ${riscosSelecionados.length} Riscos`}
            </button>
          </div>
        </div>
      )}

      {/* Informações do Sistema */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Como funciona o vínculo automático</h3>
        <div style={{ lineHeight: '1.6' }}>
          <p>✅ <strong>Vincule riscos aos cargos</strong> - O sistema automaticamente identifica os exames obrigatórios de cada risco</p>
          <p>✅ <strong>Geração automática</strong> - Os exames são automaticamente agendados para todos os colaboradores do cargo</p>
          <p>✅ <strong>Sem duplicação</strong> - O sistema evita criar exames duplicados para o mesmo colaborador</p>
          <p>✅ <strong>Atualização em tempo real</strong> - Qualquer mudança nos riscos reflete automaticamente nos exames</p>
        </div>
      </div>
    </div>
  );
};

export default CargoRiscoManager;