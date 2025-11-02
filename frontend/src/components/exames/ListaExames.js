import React from 'react';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../ui/Loading';
import { ErrorMessage } from '../ui/ErrorMessage';
import tableStyles from '../../styles/Table.module.css';

function ListaExames() {
  const { user, isGestor, isSesmit } = useAuth();
  
  // ✅ Gestor/SESMIT veem todos, Colaborador só os seus
  const { 
    data: exames, 
    loading, 
    error, 
    refetch 
  } = useApi('/exames/agendamentos');

  const getStatusClassName = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDENTE': return tableStyles.statusPendente;
      case 'VENCIDO': return tableStyles.statusVencido;
      case 'REALIZADO': return tableStyles.statusRealizado;
      default: return tableStyles.statusPendente;
    }
  };

  if (loading) return <Loading message="Carregando exames..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className={tableStyles.container}>
      <h2 className={tableStyles.title}>
        {isGestor || isSesmit ? 'Todos os Exames Agendados' : 'Meus Exames Agendados'}
      </h2>
      
      <table className={tableStyles.table}>
        <thead>
          <tr>
            {(isGestor || isSesmit) && <th className={tableStyles.th}>Colaborador</th>}
            <th className={tableStyles.th}>Exame</th>
            <th className={tableStyles.th}>Tipo</th>
            <th className={tableStyles.th}>Data Agendada</th>
            <th className={tableStyles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {exames && exames.length > 0 ? (
            exames.map(exame => (
              <tr key={exame.id}>
                {/* ✅ Apenas Gestor/SESMIT veem nome do colaborador */}
                {(isGestor || isSesmit) && (
                  <td className={tableStyles.td}>{exame.colaborador_nome || exame.colaborador?.nome || '---'}</td>
                )}
                <td className={tableStyles.td}>{exame.exame_nome || exame.exame?.nome || '---'}</td>
                <td className={tableStyles.td}>{exame.tipo_exame}</td>
                <td className={tableStyles.td}>
                  {exame.data_agendamento ? 
                    new Date(exame.data_agendamento).toLocaleString('pt-BR') : '---'
                  }
                </td>
                <td className={`${tableStyles.statusCell} ${getStatusClassName(exame.status)}`}>
                  {exame.status || 'PENDENTE'}
                </td>
              </tr>
            ))
          ) : (
            <tr className={tableStyles.emptyRow}>
              <td colSpan={isGestor || isSesmit ? 5 : 4}>
                Nenhum exame encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListaExames;