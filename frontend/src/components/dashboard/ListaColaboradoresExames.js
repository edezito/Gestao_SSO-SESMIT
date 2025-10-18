import React, { useState, useEffect } from 'react';
// CORREÇÃO: Importa a função correta ('listarTodosExames') e remove as que não são usadas.
import { listarTodosExames } from '../../services/api';
import { responsiveStyles } from '../../styles/responsive';

function ListaColaboradoresExames() {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  useEffect(() => {
    const fetchExames = async () => {
      try {
        setLoading(true);
        // Agora esta função foi importada corretamente e pode ser chamada
        const data = await listarTodosExames();
        setExames(data);
      } catch (err) {
        const errorMsg = err.response?.data?.msg || 'Falha ao carregar os exames. Verifique suas permissões.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchExames();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDENTE': 
        return { 
          color: '#856404', 
          backgroundColor: '#fff3cd', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold'
        };
      case 'VENCIDO': 
        return { 
          color: '#721c24', 
          backgroundColor: '#f8d7da', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold'
        };
      case 'REALIZADO': 
        return { 
          color: '#155724', 
          backgroundColor: '#d4edda', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold'
        };
      default: 
        return {
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        };
    }
  };

  const examesFiltrados = filtroStatus === 'TODOS' 
    ? exames 
    : exames.filter(exame => exame.status === filtroStatus);

  const formatarData = (dataString) => {
    if (!dataString) return '';
    // Adiciona correção de fuso horário para garantir que a data local seja exibida
    const data = new Date(dataString);
    const dataCorrigida = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
    return dataCorrigida.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>Carregando exames...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={responsiveStyles.messageError}>
        {error}
      </div>
    );
  }

  return (
    <div style={responsiveStyles.formContainer}>
      <div style={styles.header}>
        <h2 style={styles.title}>Lista de Colaboradores e Exames</h2>
        
        <div style={styles.filters}>
          <label style={styles.filterLabel}>Filtrar por status:</label>
          <select
            style={styles.filterSelect}
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="REALIZADO">Realizados</option>
            <option value="VENCIDO">Vencidos</option>
          </select>
        </div>
      </div>

      {examesFiltrados.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Nenhum exame encontrado.</p>
        </div>
      ) : (
        <div style={responsiveStyles.tableContainer}>
          <table style={responsiveStyles.table}>
            <thead>
              <tr>
                <th style={responsiveStyles.th}>Colaborador</th>
                <th style={responsiveStyles.th}>Exame</th>
                <th style={responsiveStyles.th}>Tipo</th>
                <th style={responsiveStyles.th}>Data Agendamento</th>
                <th style={responsiveStyles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {examesFiltrados.map((exame) => (
                <tr key={exame.id} style={styles.tableRow}>
                  <td style={responsiveStyles.td}>
                    <div style={styles.colaboradorInfo}>
                      <strong>{exame.colaborador_nome}</strong>
                      <br />
                      <small style={styles.email}>{exame.colaborador_email}</small>
                    </div>
                  </td>
                  <td style={responsiveStyles.td}>{exame.nome}</td>
                  <td style={responsiveStyles.td}>
                    <span style={styles.tipoBadge}>{exame.tipo_exame}</span>
                  </td>
                  <td style={responsiveStyles.td}>
                    {formatarData(exame.data_agendamento)}
                  </td>
                  <td style={responsiveStyles.td}>
                    <span style={getStatusStyle(exame.status)}>
                      {exame.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={styles.stats}>
        <p>
          Exibindo <strong>{examesFiltrados.length}</strong> de <strong>{exames.length}</strong> exames
          {filtroStatus !== 'TODOS' && ` (filtrado por: ${filtroStatus})`}
        </p>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px',
    [`@media (max-width: 768px)`]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },

  title: {
    color: '#007bff',
    fontSize: '24px',
    fontWeight: '600',
    margin: 0,
    [`@media (max-width: 768px)`]: {
      fontSize: '20px',
      textAlign: 'center',
    },
  },

  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    [`@media (max-width: 480px)`]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },

  filterLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
  },

  filterSelect: {
    padding: '8px 12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundColor: '#fefefe',
  },

  loadingContainer: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },

  loadingText: {
    fontStyle: 'italic',
    color: '#6c757d',
    fontSize: '16px',
  },

  emptyState: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    color: '#6c757d',
  },

  tableRow: {
    transition: 'background-color 0.2s',
  },

  colaboradorInfo: {
    lineHeight: '1.4',
  },

  email: {
    color: '#6c757d',
    fontSize: '12px',
  },

  tipoBadge: {
    backgroundColor: '#e9ecef',
    color: '#495057',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
  },

  stats: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e7f3ff',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#495057',
  },
};

export default ListaColaboradoresExames;