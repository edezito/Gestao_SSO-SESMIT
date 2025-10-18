import React, { useState, useEffect } from 'react';
// CORREÇÃO: Usa 'listarUsuarios' para consistência com o resto da API
import { agendarExame, listarUsuarios } from '../../services/api'; 
import { responsiveStyles } from '../../styles/responsive';

function AgendarExame() {
  const [colaboradores, setColaboradores] = useState([]);
  const [loadingColaboradores, setLoadingColaboradores] = useState(true);
  const [colaboradorId, setColaboradorId] = useState('');
  const [nomeExame, setNomeExame] = useState('');
  const [tipoExame, setTipoExame] = useState('ADMISSIONAL');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const carregarColaboradores = async () => {
      try {
        setLoadingColaboradores(true);
        // CORREÇÃO: Chama a função com o nome correto
        const data = await listarUsuarios(); 
        setColaboradores(data);
      } catch (error) {
        setErro("Falha ao carregar colaboradores. Você tem permissão?");
      } finally {
        setLoadingColaboradores(false);
      }
    };
    carregarColaboradores();
  }, []);

  // ... (O restante do seu componente permanece o mesmo)
  // handleSubmit, handleReset, return, styles, etc.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMensagem('Agendando...');
    setErro('');

    const dadosExame = {
      colaborador_id: parseInt(colaboradorId),
      nome: nomeExame,
      tipo_exame: tipoExame,
      data_agendamento: dataAgendamento,
    };

    try {
      const response = await agendarExame(dadosExame);
      setMensagem(`✅ Exame agendado com sucesso! ID: ${response.id}`);
      // Limpa o formulário
      setColaboradorId('');
      setNomeExame('');
      setDataAgendamento('');
      setTipoExame('ADMISSIONAL');
      setTimeout(() => setMensagem(''), 5000);
    } catch (error) {
      const errorMsg = error.response?.data?.msg || error.response?.data?.erro || "Erro desconhecido.";
      setErro(`❌ Erro ao agendar: ${errorMsg}`);
      setMensagem('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setColaboradorId('');
    setNomeExame('');
    setTipoExame('ADMISSIONAL');
    setDataAgendamento('');
    setMensagem('');
    setErro('');
  };

  return (
    <div style={responsiveStyles.formContainer}>
      <h2 style={styles.title}>Agendar Exame</h2>

      {mensagem && (
        <div style={responsiveStyles.messageSuccess}>
          {mensagem}
        </div>
      )}

      {erro && (
        <div style={responsiveStyles.messageError}>
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} style={responsiveStyles.form}>
        {/* Seletor de Colaborador */}
        <div style={responsiveStyles.formGroup}>
          <label style={responsiveStyles.label}>
            Colaborador *
          </label>
          {loadingColaboradores ? (
            <div style={styles.loadingContainer}>
              <span style={styles.loadingText}>Carregando colaboradores...</span>
            </div>
          ) : (
            <select
              style={responsiveStyles.select}
              value={colaboradorId}
              onChange={(e) => setColaboradorId(e.target.value)}
              required
              disabled={submitting}
            >
              <option value="">Selecione um colaborador</option>
              {colaboradores.map((colaborador) => (
                <option key={colaborador.id} value={colaborador.id}>
                  {colaborador.nome}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Nome do Exame */}
        <div style={responsiveStyles.formGroup}>
          <label style={responsiveStyles.label}>
            Nome do Exame *
          </label>
          <input
            style={responsiveStyles.input}
            type="text"
            value={nomeExame}
            onChange={(e) => setNomeExame(e.target.value)}
            placeholder="Ex: Exame Clínico, Audiometria, etc."
            required
            disabled={submitting}
          />
        </div>

        {/* Tipo de Exame */}
        <div style={responsiveStyles.formGroup}>
          <label style={responsiveStyles.label}>
            Tipo de Exame *
          </label>
          <select
            style={responsiveStyles.select}
            value={tipoExame}
            onChange={(e) => setTipoExame(e.target.value)}
            required
            disabled={submitting}
          >
            <option value="ADMISSIONAL">Admissional</option>
            <option value="PERIODICO">Periódico</option>
            <option value="DEMISSIONAL">Demissional</option>
            <option value="RETORNO_TRABALHO">Retorno ao Trabalho</option>
            <option value="MUDANCA_FUNCAO">Mudança de Função</option>
          </select>
        </div>

        {/* Data do Agendamento */}
        <div style={responsiveStyles.formGroup}>
          <label style={responsiveStyles.label}>
            Data do Agendamento *
          </label>
          <input
            style={responsiveStyles.input}
            type="datetime-local"
            value={dataAgendamento}
            onChange={(e) => setDataAgendamento(e.target.value)}
            required
            disabled={submitting}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        {/* Botões de Ação */}
        <div style={styles.buttonContainer}>
          <button
            type="button"
            onClick={handleReset}
            style={styles.resetButton}
            disabled={submitting}
          >
            Limpar
          </button>
          <button
            type="submit"
            style={{
              ...responsiveStyles.button,
              ...styles.submitButton,
              ...(submitting ? styles.buttonDisabled : {})
            }}
            disabled={submitting}
          >
            {submitting ? 'Agendando...' : 'Agendar Exame'}
          </button>
        </div>
      </form>

      {/* Informações de Ajuda */}
      <div style={styles.helpText}>
        <p><strong>Dica:</strong> Todos os campos marcados com * são obrigatórios.</p>
      </div>
    </div>
  );
}
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
    padding: '15px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    border: '1px dashed #dee2e6',
  },

  loadingText: {
    fontStyle: 'italic',
    color: '#6c757d',
    fontSize: '14px',
  },

  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
    [`@media (max-width: 480px)`]: {
      flexDirection: 'column',
    },
  },

  submitButton: {
    backgroundColor: '#28a745',
    flex: 2,
    '&:hover:not(:disabled)': {
      backgroundColor: '#218838',
    },
  },

  resetButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontWeight: 'bold',
    '&:hover:not(:disabled)': {
      backgroundColor: '#5a6268',
    },
    [`@media (max-width: 480px)`]: {
      padding: '12px',
    },
  },

  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
    opacity: 0.6,
  },

  helpText: {
    marginTop: '25px',
    padding: '15px',
    backgroundColor: '#e7f3ff',
    borderRadius: '5px',
    borderLeft: '4px solid #007bff',
    fontSize: '14px',
    color: '#495057',
    [`@media (max-width: 768px)`]: {
      marginTop: '20px',
      padding: '12px',
    },
  },
};

export default AgendarExame;