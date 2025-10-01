import React, { useState, useEffect } from 'react';
import { agendarExame, listarColaboradores, listarTiposExame } from '../../services/api';
import formStyles from '../../styles/Form.module.css';

function AgendarExame({ token }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [tiposExame, setTiposExame] = useState([]);
  const [loadingColaboradores, setLoadingColaboradores] = useState(true);
  const [loadingExames, setLoadingExames] = useState(true);
  const [colaboradorId, setColaboradorId] = useState('');
  const [exameId, setExameId] = useState('');
  const [tipoExame, setTipoExame] = useState('ADMISSIONAL');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  // Carregar colaboradores
  useEffect(() => {
    const carregarColaboradores = async () => {
      try {
        setLoadingColaboradores(true);
        const data = await listarColaboradores(token);
        setColaboradores(data);
      } catch (error) {
        setErro("Falha ao carregar colaboradores.");
      } finally {
        setLoadingColaboradores(false);
      }
    };
    if (token) carregarColaboradores();
  }, [token]);

  // Carregar exames já criados
  useEffect(() => {
    const carregarTiposExame = async () => {
      try {
        setLoadingExames(true);
        const data = await listarTiposExame(token);
        setTiposExame(data);
      } catch (error) {
        setErro("Falha ao carregar tipos de exames.");
      } finally {
        setLoadingExames(false);
      }
    };
    if (token) carregarTiposExame();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('Agendando...');
    setErro('');
    try {
      const dadosAgendamento = {
        colaborador_id: parseInt(colaboradorId),
        exame_id: parseInt(exameId),
        tipo_exame: tipoExame,
        data_agendamento: dataAgendamento,
      };
      const response = await agendarExame(dadosAgendamento, token);
      setMensagem(`✅ Agendamento realizado com sucesso! ID: ${response.id}`);
      setColaboradorId('');
      setExameId('');
      setDataAgendamento('');
      setTimeout(() => setMensagem(''), 5000);
    } catch (error) {
      setErro(`❌ Erro ao agendar: ${error.message}`);
      setMensagem('');
    }
  };

  return (
    <div className={formStyles.container} style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className={formStyles.title}>Agendar Novo Exame</h2>
      <form onSubmit={handleSubmit} className={formStyles.form} style={{ gap: '20px' }}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.label}>Colaborador</label>
          {loadingColaboradores ? (
            <p className={formStyles.loadingText}>Carregando...</p>
          ) : (
            <select
              value={colaboradorId}
              onChange={e => setColaboradorId(e.target.value)}
              required
              className={formStyles.select}
            >
              <option value="">Selecione um colaborador</option>
              {colaboradores.map(col => (
                <option key={col.id} value={col.id}>{col.nome}</option>
              ))}
            </select>
          )}
        </div>

        <div className={formStyles.formGroup}>
          <label className={formStyles.label}>Exame</label>
          {loadingExames ? (
            <p className={formStyles.loadingText}>Carregando exames...</p>
          ) : (
            <select
              value={exameId}
              onChange={e => setExameId(e.target.value)}
              required
              className={formStyles.select}
            >
              <option value="">Selecione um exame</option>
              {tiposExame.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.nome}</option>
              ))}
            </select>
          )}
        </div>

        <div className={formStyles.formGroup}>
          <label className={formStyles.label}>Tipo do Exame</label>
          <select
            value={tipoExame}
            onChange={e => setTipoExame(e.target.value)}
            required
            className={formStyles.select}
          >
            <option value="ADMISSIONAL">Admissional</option>
            <option value="PERIODICO">Periódico</option>
            <option value="RETORNO">Retorno ao Trabalho</option>
            <option value="DEMISSIONAL">Demissional</option>
          </select>
        </div>

        <div className={formStyles.formGroup}>
          <label className={formStyles.label}>Data de Agendamento</label>
          <input
            type="datetime-local"
            value={dataAgendamento}
            onChange={e => setDataAgendamento(e.target.value)}
            required
            className={formStyles.input}
          />
        </div>

        <button type="submit" className={formStyles.buttonBase} style={{ '--button-bg-color': '#28a745' }}>
          Agendar
        </button>
      </form>

      {mensagem && <p className={`${formStyles.message} ${formStyles.messageSuccess}`}>{mensagem}</p>}
      {erro && <p className={`${formStyles.message} ${formStyles.messageError}`}>{erro}</p>}
    </div>
  );
}

export default AgendarExame;
