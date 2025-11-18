import React from 'react';
import { useCATs } from '../../hooks/useCATs';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../ui/Loading';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Button } from '../ui/Button';
import tableStyles from '../../styles/Table.module.css';

export default function ListaCATs({ onEditar, onVerDetalhes }) {
  const { cats, loading, error, deletar, gerarPDF, refetch } = useCATs();
  const { isSesmit, isGestor } = useAuth();

  const podeEditar = isSesmit || isGestor;
  const podeDeletar = isSesmit;

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta CAT?')) {
      try {
        await deletar(id);
      } catch (err) {
        alert('Erro ao excluir CAT: ' + err.message);
      }
    }
  };

  // CORREÇÃO 1: Receber o evento 'e' e prevenir comportamento padrão
  const handleGerarPDF = async (id, e) => {
    if (e) {
      e.preventDefault();  // Impede recarregar a página
      e.stopPropagation(); // Impede clicar na linha da tabela (se houver evento na tr)
    }

    try {
      await gerarPDF(id);
    } catch (err) {
      alert('Erro ao gerar PDF: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'EM ABERTO': { className: tableStyles.statusPendente, label: 'Em Aberto' },
      'FINALIZADA': { className: tableStyles.statusRealizado, label: 'Finalizada' },
      'CANCELADA': { className: tableStyles.statusVencido, label: 'Cancelada' }
    };

    const config = statusConfig[status] || { className: tableStyles.statusPendente, label: status };
    
    return (
      <span className={`${tableStyles.statusCell} ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (loading) return <Loading message="Carregando CATs..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className={tableStyles.container}>
      <div className={tableStyles.header}>
        <h2 className={tableStyles.title}>Comunicações de Acidente de Trabalho (CATs)</h2>
      </div>

      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th className={tableStyles.th}>ID</th>
            <th className={tableStyles.th}>Colaborador</th>
            <th className={tableStyles.th}>Data do Acidente</th>
            <th className={tableStyles.th}>Local</th>
            <th className={tableStyles.th}>Status</th>
            <th className={tableStyles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cats.length > 0 ? (
            cats.map(cat => (
              <tr key={cat.id}>
                <td className={tableStyles.td}>#{cat.id}</td>
                <td className={tableStyles.td}>
                  {cat.colaborador?.nome || 'N/A'}
                </td>
                <td className={tableStyles.td}>
                  {cat.data_acidente ? 
                    new Date(cat.data_acidente).toLocaleDateString('pt-BR') : '---'
                  }
                </td>
                <td className={tableStyles.td}>{cat.local_acidente}</td>
                <td className={tableStyles.td}>
                  {getStatusBadge(cat.status)}
                </td>
                <td className={tableStyles.td}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button 
                      size="small" 
                      variant="outline"
                      // Adicione type="button" se o seu componente Button aceitar props nativas
                      type="button" 
                      onClick={() => onVerDetalhes(cat)}
                    >
                      👁️ Ver
                    </Button>
                    
                    {/* CORREÇÃO 2: type="button" e passar o evento 'e' */}
                    <Button 
                      size="small" 
                      variant="outline"
                      type="button"
                      onClick={(e) => handleGerarPDF(cat.id, e)}
                    >
                      📄 PDF
                    </Button>

                    {podeEditar && (
                      <Button 
                        size="small" 
                        variant="primary"
                        type="button"
                        onClick={() => onEditar(cat)}
                      >
                        ✏️ Editar
                      </Button>
                    )}

                    {podeDeletar && (
                      <Button 
                        size="small" 
                        variant="danger"
                        type="button"
                        onClick={() => handleDeletar(cat.id)}
                      >
                        🗑️ Excluir
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className={tableStyles.emptyRow}>
              <td colSpan="6">
                Nenhuma CAT encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}