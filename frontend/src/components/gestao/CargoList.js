import React, { useEffect, useState } from 'react';
import { listarCargos } from '../../services/api';
import { responsiveStyles } from '../../styles/responsive';

const CargoList = () => {
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarCargos = async () => {
      try {
        setLoading(true);
        const response = await listarCargos();
        setCargos(response);
      } catch (err) {
        console.error('Erro ao buscar cargos', err);
        setError('Falha ao carregar cargos. Verifique suas permissões.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarCargos();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>Carregando cargos...</p>
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
      <h2 style={styles.title}>Lista de Cargos</h2>
      
      {cargos.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Nenhum cargo cadastrado.</p>
        </div>
      ) : (
        <div style={responsiveStyles.tableContainer}>
          <table style={responsiveStyles.table}>
            <thead>
              <tr>
                <th style={responsiveStyles.th}>ID</th>
                <th style={responsiveStyles.th}>Nome</th>
                <th style={responsiveStyles.th}>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {cargos.map(cargo => (
                <tr key={cargo.id} style={styles.tableRow}>
                  <td style={responsiveStyles.td}>{cargo.id}</td>
                  <td style={responsiveStyles.td}>
                    <strong>{cargo.nome}</strong>
                  </td>
                  <td style={responsiveStyles.td}>
                    {cargo.descricao || 'Sem descrição'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div style={styles.stats}>
        <p>Total de cargos: <strong>{cargos.length}</strong></p>
      </div>
    </div>
  );
};

const styles = {
  title: {
    textAlign: 'center',
    color: '#007bff',
    fontSize: '24px',
    marginBottom: '25px',
    fontWeight: '600',
    [`@media (max-width: 768px)`]: {
      fontSize: '20px',
      marginBottom: '20px',
    },
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
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
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

export default CargoList;