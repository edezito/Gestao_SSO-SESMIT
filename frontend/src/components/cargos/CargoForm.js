// src/components/cargos/CargoForm.js
import React, { useState } from 'react';

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e9ecef',
  },
  modalTitle: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.25rem',
    fontWeight: '600',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6c757d',
    padding: '0.25rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  form: {
    padding: '1.5rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#495057',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem',
  },
  cancelButton: {
    background: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    fontSize: '0.9rem',
  },
  submitButton: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    fontSize: '0.9rem',
  },
  buttonHover: {
    cancelButton: {
      backgroundColor: '#5a6268',
    },
    submitButton: {
      backgroundColor: '#2980b9',
    },
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  placeholder: {
    color: '#6c757d',
    fontStyle: 'italic',
  },
};

const Button = ({ children, style, hoverStyle, disabled, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        ...style,
        ...(isHovered && !disabled ? hoverStyle : {}),
        ...(disabled ? styles.buttonDisabled : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default function CargoForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      alert('Por favor, preencha o nome do cargo');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#3498db';
    e.target.style.boxShadow = '0 0 0 2px rgba(52, 152, 219, 0.2)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#ced4da';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Cadastrar Novo Cargo</h3>
          <button 
            onClick={onCancel} 
            style={styles.closeButton}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="nome" style={styles.label}>
              Nome do Cargo *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={styles.input}
              placeholder="Ex: Analista de TI, Engenheiro de Segurança..."
              required
              disabled={submitting}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="descricao" style={styles.label}>
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={styles.textarea}
              placeholder="Descreva as responsabilidades e características deste cargo..."
              rows="4"
              disabled={submitting}
            />
          </div>

          <div style={styles.formActions}>
            <Button
              type="button"
              onClick={onCancel}
              style={styles.cancelButton}
              hoverStyle={styles.buttonHover.cancelButton}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              style={styles.submitButton}
              hoverStyle={styles.buttonHover.submitButton}
              disabled={submitting}
            >
              {submitting ? 'Cadastrando...' : 'Cadastrar Cargo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}