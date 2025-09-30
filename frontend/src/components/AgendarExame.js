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
      setMensagem(`Exame agendado com sucesso! ID: ${response.id}`);
      // Limpar formulário após o sucesso
      setColaboradorId('');
      setNomeExame('');
      setDataAgendamento('');
      // Limpa a mensagem de sucesso após 5 segundos
      setTimeout(() => setMensagem(''), 5000);
    } catch (error) {
      setErro(`Erro ao agendar: ${error.message}`);
      setMensagem('');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Agendar Novo Exame</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Colaborador</label>
          {loadingColaboradores ? <p>Carregando colaboradores...</p> : (
            <select value={colaboradorId} onChange={e => setColaboradorId(e.target.value)} required style={styles.input}>
              <option value="">Selecione um colaborador</option>
              {colaboradores.map(col => (
                <option key={col.id} value={col.id}>{col.nome}</option>
              ))}
            </select>
          )}
        </div>
        <div style={styles.formGroup}>
          <label>Nome do Exame</label>
          <input type="text" value={nomeExame} onChange={e => setNomeExame(e.target.value)} required style={styles.input} placeholder="Ex: Acuidade Visual"/>
        </div>
        <div style={styles.formGroup}>
          <label>Tipo do Exame</label>
          <select value={tipoExame} onChange={e => setTipoExame(e.target.value)} required style={styles.input}>
            <option value="ADMISSIONAL">Admissional</option>
            <option value="PERIODICO">Periódico</option>
            <option value="RETORNO">Retorno ao Trabalho</option>
            <option value="DEMISSIONAL">Demissional</option>
          </select>
        </div>
         <div style={styles.formGroup}>
          <label>Data de Agendamento</label>
          <input type="datetime-local" value={dataAgendamento} onChange={e => setDataAgendamento(e.target.value)} required style={styles.input}/>
        </div>
        <button type="submit" style={styles.submitButton}>Agendar</button>
      </form>
      {mensagem && <p style={styles.messageSuccess}>{mensagem}</p>}
      {erro && <p style={styles.messageError}>{erro}</p>}
    </div>
  );
}

const styles = {
    container: { padding: '20px', backgroundColor: 'white', borderRadius: '8px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    formGroup: { display: 'flex', flexDirection: 'column' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
    submitButton: { padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: 'white', fontSize: '16px', cursor: 'pointer' },
    messageSuccess: { marginTop: '15px', color: '#007bff', fontWeight: 'bold'},
    messageError: { marginTop: '15px', color: '#dc3545', fontWeight: 'bold'},
};

export default AgendarExame;

