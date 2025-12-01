// src/components/colaboradores/ColaboradorFormModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button'; // Agora vai funcionar com export default
import Input from '../ui/Input';
import Select from '../ui/Select';
import { COLORS, SPACING } from '../../styles/theme';

const PERFIS = [
  { value: 'COLABORADOR', label: 'Colaborador' },
  { value: 'SESMIT', label: 'SESMIT' },
  { value: 'GESTOR', label: 'Gestor' },
];

const initialForm = {
  nome: '',
  email: '',
  senha: '',
  perfil: 'COLABORADOR',
  cargo_id: ''
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: SPACING.lg || '24px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    marginBottom: SPACING.md || '16px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: COLORS.text || '#333',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md || '16px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: SPACING.sm || '8px',
    marginTop: SPACING.lg || '24px',
    borderTop: '1px solid #eee',
    paddingTop: '16px',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
    marginBottom: '10px',
    fontSize: '0.9rem'
  }
};

export default function ColaboradorFormModal({ 
  isOpen, 
  colaborador, 
  cargos = [], 
  onSubmit, 
  onClose, 
  loading 
}) {
  const isEditing = !!colaborador;
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (colaborador) {
        setForm({
          nome: colaborador.nome || '',
          email: colaborador.email || '',
          senha: '', 
          perfil: colaborador.perfil || 'COLABORADOR',
          cargo_id: colaborador.cargo_id || ''
        });
      } else {
        setForm(initialForm);
      }
      setError(null);
    }
  }, [colaborador, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.nome.trim() || !form.email.trim() || !form.perfil) {
      return "Todos os campos obrigatórios devem ser preenchidos.";
    }
    if (!isEditing && !form.senha.trim()) {
      return "A senha é obrigatória para novos colaboradores.";
    }
    if (form.email.trim().length > 0 && !form.email.includes('@')) {
      return "Formato de e-mail inválido.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const dataToSubmit = { 
      nome: form.nome, 
      email: form.email, 
      perfil: form.perfil,
      cargo_id: form.cargo_id || null 
    };

    if (form.senha) {
      dataToSubmit.senha = form.senha;
    }
    
    setError(null);
    await onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  const cargoOptions = cargos.map(c => ({ value: c.id, label: `${c.nome} (${c.cbo})` }));

  return (
    <div style={styles.overlay}>
      <div style={styles.modalContainer}>
        
        <div style={styles.header}>
          <h2 style={styles.title}>
            {isEditing ? 'Editar Colaborador' : 'Novo Colaborador'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          <Input 
            label="Nome Completo"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            disabled={loading}
            required
          />
          
          <Input 
            label="E-mail"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
          
          <Input 
            label={isEditing ? "Nova Senha (opcional)" : "Senha"}
            name="senha"
            type="password"
            value={form.senha}
            onChange={handleChange}
            disabled={loading}
            required={!isEditing}
          />

          <Select
            label="Perfil de Acesso"
            name="perfil"
            options={PERFIS}
            value={form.perfil}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <Select
            label="Cargo (CBO)"
            name="cargo_id"
            options={[{ value: '', label: 'Nenhum Cargo' }, ...cargoOptions]}
            value={form.cargo_id || ''}
            onChange={handleChange}
            disabled={loading}
          />
          
          <div style={styles.footer}>
            <Button 
              variant="secondary" 
              onClick={onClose} 
              disabled={loading}
              type="button"
            >
              Cancelar
            </Button>
            <Button 
              variant={isEditing ? 'primary' : 'success'} 
              onClick={handleSubmit} 
              disabled={loading}
              type="submit"
            >
              {loading 
                ? 'Salvando...' 
                : (isEditing ? 'Salvar Alterações' : 'Criar Colaborador')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}