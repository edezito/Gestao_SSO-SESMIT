import React, { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';

const styles = {
  container: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px',
    border: '1px solid #e9ecef'
  },
  title: {
    marginBottom: '20px',
    color: '#333',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '600',
    color: '#495057'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e9ecef',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'border-color 0.3s'
  },
  inputError: {
    borderColor: '#dc3545'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e9ecef',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'border-color 0.3s',
    resize: 'vertical',
    minHeight: '80px'
  },
  errorMessage: {
    color: '#dc3545',
    fontSize: '12px',
    marginTop: '5px',
    display: 'block'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '25px',
    paddingTop: '15px',
    borderTop: '1px solid #e9ecef'
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s'
  },
  buttonPrimary: {
    background: '#007bff',
    color: 'white'
  },
  buttonSecondary: {
    background: '#6c757d',
    color: 'white'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  }
};

const RiscoForm = ({ risco, onSubmit, onCancel, loading }) => {
  const { formData, handleChange, setFieldValue } = useForm({
    nome: '',
    descricao: '',
    ativo: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (risco) {
      setFieldValue('nome', risco.nome || '');
      setFieldValue('descricao', risco.descricao || '');
      setFieldValue('ativo', risco.ativo !== undefined ? risco.ativo : true);
    }
  }, [risco, setFieldValue]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do risco é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro no formulário:', error);
    }
  };

  const getInputStyle = (fieldName) => {
    return {
      ...styles.input,
      ...(errors[fieldName] ? styles.inputError : {}),
      ...(loading ? styles.buttonDisabled : {})
    };
  };

  const getButtonStyle = (type = 'primary') => {
    return {
      ...styles.button,
      ...(type === 'primary' ? styles.buttonPrimary : styles.buttonSecondary),
      ...(loading ? styles.buttonDisabled : {})
    };
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{risco ? 'Editar Risco' : 'Novo Risco'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="nome" style={styles.label}>Nome do Risco *</label>
          <input
            id="nome"
            name="nome"
            type="text"
            value={formData.nome}
            onChange={handleChange}
            style={getInputStyle('nome')}
            disabled={loading}
            placeholder="Ex: Ruído, Químico, Ergonomia"
          />
          {errors.nome && <span style={styles.errorMessage}>{errors.nome}</span>}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="descricao" style={styles.label}>Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            style={{...styles.textarea, ...(loading ? styles.buttonDisabled : {})}}
            disabled={loading}
            placeholder="Descreva os detalhes do risco..."
            rows="3"
          />
        </div>

        {risco && (
          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="ativo"
                checked={formData.ativo}
                onChange={(e) => setFieldValue('ativo', e.target.checked)}
                disabled={loading}
              />
              <span>Risco ativo</span>
            </label>
          </div>
        )}

        <div style={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            style={getButtonStyle('secondary')}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={getButtonStyle('primary')}
            disabled={loading}
          >
            {loading ? 'Salvando...' : (risco ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RiscoForm;