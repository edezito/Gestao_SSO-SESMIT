import React, { useState, useEffect } from 'react';
import { listarTodosExames, gerarPDFAgendamento, deletarAgendamento } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Loading } from '../ui/Loading';
import { ErrorMessage } from '../ui/ErrorMessage';
import tableStyles from '../../styles/Table.module.css'; // Usando o mesmo CSS da CAT

export default function ListaExames() {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isSesmit, isGestor } = useAuth();

  const temPermissaoEdicao = isSesmit || isGestor;

  // Função para buscar dados
  const fetchExames = async () => {
    try {
      setLoading(true);
      const data = await listarTodosExames();
      setExames(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar exames: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExames();
  }, []);

  // --- LÓGICA DE EMISSÃO DE PDF (Igual à da CAT) ---
  const handleEmitirGuia = async (id, e) => {
    // 1. Previne comportamento padrão e propagação
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      console.log(`Iniciando emissão para exame ${id}...`);
      await gerarPDFAgendamento(id);
    } catch (err) {
      alert('Erro ao emitir guia: ' + err.message);
    }
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      try {
        await deletarAgendamento(id); // Supondo que exista na api.js
        fetchExames(); // Recarrega a lista
      } catch (err) {
        alert('Erro ao cancelar: ' + err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      'AGENDADO': { label: 'Agendado', class: tableStyles.statusPendente },
      'REALIZADO': { label: 'Realizado', class: tableStyles.statusRealizado },
      'CANCELADO': { label: 'Cancelado', class: tableStyles.statusVencido },
      'PENDENTE': { label: 'Pendente', class: tableStyles.statusPendente }
    };
    
    const config = map[status?.toUpperCase()] || map['PENDENTE'];

    return (
      <span className={`${tableStyles.statusCell} ${config.class}`}>
        {config.label}
      </span>
    );
  };

  if (loading) return <Loading message="Carregando agendamentos..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchExames} />;

  return (
    <div className={tableStyles.container}>
      <div className={tableStyles.header}>
        <h2 className={tableStyles.title}>Agendamentos de Exames</h2>
        <Button variant="outline" onClick={fetchExames} size="small">
          🔄 Atualizar
        </Button>
      </div>

      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th className={tableStyles.th}>ID</th>
            <th className={tableStyles.th}>Colaborador</th>
            <th className={tableStyles.th}>Exame</th>
            <th className={tableStyles.th}>Data</th>
            <th className={tableStyles.th}>Status</th>
            <th className={tableStyles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {exames.length > 0 ? (
            exames.map((exame) => (
              <tr key={exame.id}>
                <td className={tableStyles.td}>#{exame.id}</td>
                <td className={tableStyles.td}>
                  {exame.colaborador?.nome || '---'}
                </td>
                <td className={tableStyles.td}>
                  {exame.exame?.nome || exame.tipo_exame || '---'}
                </td>
                <td className={tableStyles.td}>
                  {exame.data_agendamento ? 
                    new Date(exame.data_agendamento).toLocaleDateString('pt-BR') : 'A definir'}
                </td>
                <td className={tableStyles.td}>
                  {getStatusBadge(exame.status)}
                </td>
                <td className={tableStyles.td}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    
                    {/* BOTÃO DE EMITIR PDF */}
                    <Button 
                      size="small" 
                      variant="outline"
                      type="button" // Importante para evitar refresh
                      onClick={(e) => handleEmitirGuia(exame.id, e)}
                      title="Baixar Comprovante de Agendamento"
                    >
                      🖨️ Emitir Guia
                    </Button>

                    {temPermissaoEdicao && (
                      <Button 
                        size="small" 
                        variant="danger"
                        type="button"
                        onClick={() => handleDeletar(exame.id)}
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className={tableStyles.emptyRow}>
              <td colSpan="6">Nenhum exame agendado encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}