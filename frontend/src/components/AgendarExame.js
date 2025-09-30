import React, { useState, useEffect } from 'react';
import { agendarExame, listarColaboradores } from '../services/api';

function AgendarExame({ token }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [loadingColaboradores, setLoadingColaboradores] = useState(true);

  const [colaboradorId, setColaboradorId] = useState('');
  const [nomeExame, setNomeExame] = useState('');
  const [tipoExame, setTipoExame] = useState('ADMISSIONAL');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarColaboradores = async () => {
      try {
        setLoadingColaboradores(true);
        const data = await listarColaboradores(token);
        setColaboradores(data);
      } catch (error) {
        setErro("Falha ao carregar a lista de colaboradores.");
      } finally {
        setLoadingColaboradores(false);
      }
    };
    if (token) {
      carregarColaboradores();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('Agendando...');
    setErro('');

    const dadosExame = {
      colaborador_id: parseInt(colaboradorId),
      nome: nomeExame,
      tipo_exame: tipoExame,
      data_agendamento: dataAgendamento,
    };

    try {
      const response = await agendarExame(dadosExame, token);
      setMensagem(`✅ Exame agendado com sucesso! ID: ${response.id}`);
      setColaboradorId('');
      setNomeExame('');
      setDataAgendamento('');
      setTimeout(() => setMensagem(''), 5000);
    } catch (error) {
      setErro(`❌ Erro ao agendar: ${error.message}`);
      setMensagem('');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Agendar Novo Exame</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Colaborador</label>
          {loadingColaboradores ? (
            <p style={styles.loadingText}>Carregando colaboradores...</p>
          ) : (
            <select
              value={colaboradorId}
              onChange={e => setColaboradorId(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">Selecione um colaborador</option>
              {colaboradores.map(col => (
                <option key={col.id} value={col.id}>{col.nome}</option>
              ))}
            </select>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Nome do Exame</label>
          <input
            type="text"
            value={nomeExame}
            onChange={e => setNomeExame(e.target.value)}
            required
            style={styles.input}
            placeholder="Ex: Acuidade Visual"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tipo do Exame</label>
          <select
            value={tipoExame}
            onChange={e => setTipoExame(e.target.value)}
            required
            style={styles.input}
          >
            <option value="ADMISSIONAL">Admissional</option>
            <option value="PERIODICO">Periódico</option>
            <option value="RETORNO">Retorno ao Trabalho</option>
            <option value="DEMISSIONAL">Demissional</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Data de Agendamento</label>
          <input
            type="datetime-local"
            value={dataAgendamento}
            onChange={e => setDataAgendamento(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.submitButton}>
          Agendar
        </button>
      </form>

      {mensagem && <p style={styles.messageSuccess}>{mensagem}</p>}
      {erro && <p style={styles.messageError}>{erro}</p>}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    color: '#007bff',
    fontSize: '24px',
    marginBottom: '25px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '6px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: '#fefefe',
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  messageSuccess: {
    marginTop: '20px',
    color: '#28a745',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageError: {
    marginTop: '20px',
    color: '#dc3545',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    fontStyle: 'italic',
    color: '#555',
  },
};

export default AgendarExame;
