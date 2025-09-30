import React, { useState, useEffect } from 'react';
// Agora importamos a função real que busca os dados da API
import { listarTodosExames } from '../services/api';

function ListaColaboradoresExames({ token }) {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExames = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await listarTodosExames(token);
        setExames(data);

      } catch (err) {
        setError(err.message || 'Falha ao carregar os exames.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
        fetchExames();
    }
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status) {
        case 'PENDENTE': return { color: '#ffc107', fontWeight: 'bold' };
        case 'VENCIDO': return { color: '#dc3545', fontWeight: 'bold' };
        case 'REALIZADO': return { color: '#28a745', fontWeight: 'bold' };
        default: return {};
    }
  };

  if (loading) return <p>Carregando exames...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div style={styles.container}>
      <h2>Lista de Exames Agendados</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Exame</th>
            <th style={styles.th}>Colaborador</th>
            <th style={styles.th}>Tipo</th>
            <th style={styles.th}>Data Agendada</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {exames.length > 0 ? (
            exames.map(exame => (
              <tr key={exame.id}>
                <td style={styles.td}>{exame.nome}</td>
                {/* CORREÇÃO: Sua API retorna um campo 'colaborador' com o nome, não um objeto */}
                <td style={styles.td}>{exame.colaborador}</td>
                <td style={styles.td}>{exame.tipo_exame}</td>
                <td style={styles.td}>{new Date(exame.data_agendamento).toLocaleString('pt-BR')}</td>
                <td style={{...styles.td, ...getStatusStyle(exame.status)}}>{exame.status}</td>
              </tr>
            ))
          ) : (
            <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Nenhum exame encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
    container: { padding: '20px', backgroundColor: 'white', borderRadius: '8px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { backgroundColor: '#f2f2f2', padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' },
    td: { padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' },
};

export default ListaColaboradoresExames;

