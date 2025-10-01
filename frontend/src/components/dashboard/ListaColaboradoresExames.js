import React, { useState, useEffect } from 'react';
import { listarTodosExames } from '../../services/api';
import tableStyles from '../../styles/Table.module.css';

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

  const getStatusClassName = (status) => {
    switch (status) {
      case 'PENDENTE': return tableStyles.statusPendente;
      case 'VENCIDO': return tableStyles.statusVencido;
      case 'REALIZADO': return tableStyles.statusRealizado;
      default: return '';
    }
  };

  if (loading) return <p>Carregando exames...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div className={tableStyles.container}>
      <h2 className={tableStyles.title}>Lista de Exames Agendados</h2>
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th className={tableStyles.th}>Exame</th>
            <th className={tableStyles.th}>Colaborador</th>
            <th className={tableStyles.th}>Tipo</th>
            <th className={tableStyles.th}>Data Agendada</th>
            <th className={tableStyles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {exames.length > 0 ? (
            exames.map(exame => (
              <tr key={exame.id}>
                {/* acessando os nomes corretos */}
                <td className={tableStyles.td}>{exame.exame?.nome || '---'}</td>
                <td className={tableStyles.td}>{exame.colaborador?.nome || '---'}</td>
                <td className={tableStyles.td}>{exame.tipo_exame}</td>
                <td className={tableStyles.td}>
                  {new Date(exame.data_agendamento).toLocaleString('pt-BR')}
                </td>
                <td className={`${tableStyles.statusCell} ${getStatusClassName(exame.status)}`}>
                  {exame.status}
                </td>
              </tr>
            ))
          ) : (
            <tr className={tableStyles.emptyRow}>
              <td colSpan="5">Nenhum exame encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListaColaboradoresExames;
