import React, { useState } from 'react';
import { criarCargo } from '../../services/api';
import { responsiveStyles } from '../../styles/responsive';

const CargoForm = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    try {
      await criarCargo({ nome, descricao });
      setMsg('✅ Cargo cadastrado com sucesso!');
      setIsSuccess(true);
      setNome('');
      setDescricao('');
      setTimeout(() => setMsg(''), 5000);
    } catch (error) {
      setMsg(`❌ ${error.response?.data?.erro || 'Erro ao cadastrar cargo.'}`);
      setIsSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setNome('');
    setDescricao('');
    setMsg('');
  };

  return (
    <div style={responsiveStyles.formContainer}>
      <h2 style={styles.title}>Cadastrar Cargo</h2>
      
      {msg && (
        <div style={isSuccess ? responsiveStyles.messageSuccess : responsiveStyles.messageError}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={responsiveStyles.form}>
        <div style={responsiveStyles.formGroup}>
          <label style={responsiveStyles.label}>
            Nome do Cargo *
          </label>
          <input
            style={responsiveStyles.input}
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Ex: Analista de RH, Desenvolvedor, etc."
            required
            disabled={submitting}
            maxLength={100}
          />
        </div>

        <div style={responsiveStyles.formGroup}>
          <label style={responsiveStyles.label}>
            Descrição do Cargo
          </label>
          <textarea
            style={styles.textarea}
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            placeholder="Descreva as responsabilidades e atribuições do cargo..."
            rows="4"
            disabled={submitting}
            maxLength={500}
          />
          <div style={styles.charCount}>
            {descricao.length}/500 caracteres
          </div>
        </div>

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
            {submitting ? 'Cadastrando...' : 'Cadastrar Cargo'}
          </button>
        </div>
      </form>

      <div style={styles.helpText}>
        <p><strong>Dica:</strong> Campos marcados com * são obrigatórios.</p>
      </div>
    </div>
  );
};

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

  textarea: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: '#fefefe',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: "'Segoe UI', sans-serif",
    [`@media (max-width: 768px)`]: {
      padding: '10px',
      fontSize: '14px',
    },
  },

  charCount: {
    textAlign: 'right',
    fontSize: '12px',
    color: '#6c757d',
    marginTop: '5px',
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

export default CargoForm;