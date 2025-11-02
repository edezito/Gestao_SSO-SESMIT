import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { exameService } from '../../services/api';
import { Loading } from '../ui/Loading';
import { ErrorMessage } from '../ui/ErrorMessage';
import formStyles from '../../styles/Form.module.css';

function CriarTipoExame() {
  const { isGestor, isSesmit } = useAuth();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ Apenas Gestor/SESMIT podem acessar
  if (!isGestor && !isSesmit) {
    return <ErrorMessage message="Acesso negado. Apenas gestores podem criar tipos de exame." />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await exameService.criarTipoExame({ nome, descricao });
      setSuccess('Tipo de exame criado com sucesso!');
      setNome('');
      setDescricao('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={formStyles.container}>
      <h2 className={formStyles.title}>Criar Novo Tipo de Exame</h2>
      
      {error && <ErrorMessage message={error} />}
      {success && (
        <div className={`${formStyles.message} ${formStyles.messageSuccess}`}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className={formStyles.form}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.label}>Nome do Exame *</label>
          <input
            className={formStyles.input}
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            disabled={loading}
            placeholder="Ex: Exame Admissional, Exame Periódico..."
          />
        </div>

        <div className={formStyles.formGroup}>
          <label className={formStyles.label}>Descrição</label>
          <textarea
            className={formStyles.textarea}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={loading}
            rows="3"
            placeholder="Descrição opcional do tipo de exame..."
          />
        </div>

        <button
          type="submit"
          className={formStyles.buttonBase}
          style={{ '--button-bg-color': '#28a745' }}
          disabled={loading}
        >
          {loading ? 'Criando...' : 'Criar Tipo de Exame'}
        </button>
      </form>
    </div>
  );
}

export default CriarTipoExame;