// src/components/cats/FormCAT.js
import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { Button } from '../ui/Button';
import { Loading } from '../ui/Loading';
import { ErrorMessage } from '../ui/ErrorMessage';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
    color: '#374151'
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14
  },
  textarea: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    minHeight: 100,
    resize: 'vertical'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    background: 'white'
  },
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingTop: 20,
    borderTop: '1px solid #e5e7eb'
  }
};

export default function FormCAT({ cat, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    colaborador_id: '',
    cargo_id: '',
    data_acidente: '',
    local_acidente: '',
    tipo_acidente: '',
    descricao: '',
    testemunhas: '',
    comunicante: '',
    status: 'EM ABERTO'
  });

  // Buscar colaboradores e cargos
  const { data: colaboradores, loading: loadingColabs } = useApi('/usuarios/colaboradores');
  const { data: cargos, loading: loadingCargos } = useApi('/cargos');

  useEffect(() => {
    if (cat) {
      setFormData({
        colaborador_id: cat.colaborador_id || '',
        cargo_id: cat.cargo_id || '',
        data_acidente: cat.data_acidente ? 
          new Date(cat.data_acidente).toISOString().slice(0, 16) : '',
        local_acidente: cat.local_acidente || '',
        tipo_acidente: cat.tipo_acidente || '',
        descricao: cat.descricao || '',
        testemunhas: cat.testemunhas || '',
        comunicante: cat.comunicante || '',
        status: cat.status || 'EM ABERTO'
      });
    }
  }, [cat]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.colaborador_id || !formData.cargo_id || !formData.data_acidente || 
        !formData.local_acidente || !formData.descricao) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    onSubmit(formData);
  };

  const loading = loadingColabs || loadingCargos;

  if (loading) return <Loading message="Carregando dados..." />;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Colaborador *</label>
          <select
            name="colaborador_id"
            value={formData.colaborador_id}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Selecione um colaborador</option>
            {colaboradores?.map(colab => (
              <option key={colab.id} value={colab.id}>
                {colab.nome} - {colab.email}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Cargo *</label>
          <select
            name="cargo_id"
            value={formData.cargo_id}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Selecione um cargo</option>
            {cargos?.map(cargo => (
              <option key={cargo.id} value={cargo.id}>
                {cargo.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Data e Hora do Acidente *</label>
          <input
            type="datetime-local"
            name="data_acidente"
            value={formData.data_acidente}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Tipo de Acidente</label>
          <select
            name="tipo_acidente"
            value={formData.tipo_acidente}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Selecione o tipo</option>
            <option value="COM AFASTAMENTO">Com Afastamento</option>
            <option value="SEM AFASTAMENTO">Sem Afastamento</option>
            <option value="TRAJETO">Trajeto</option>
            <option value="DOENCA">Doença Ocupacional</option>
          </select>
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Local do Acidente *</label>
        <input
          type="text"
          name="local_acidente"
          value={formData.local_acidente}
          onChange={handleChange}
          style={styles.input}
          placeholder="Ex: Setor de Produção, Almoxarifado..."
          required
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Descrição do Acidente *</label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          style={styles.textarea}
          placeholder="Descreva detalhadamente como ocorreu o acidente..."
          required
        />
      </div>

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Testemunhas</label>
          <textarea
            name="testemunhas"
            value={formData.testemunhas}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Nome das testemunhas (separadas por vírgula)"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Comunicante</label>
          <input
            type="text"
            name="comunicante"
            value={formData.comunicante}
            onChange={handleChange}
            style={styles.input}
            placeholder="Nome de quem está comunicando"
          />

          <label style={{ ...styles.label, marginTop: 12 }}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="EM ABERTO">Em Aberto</option>
            <option value="FINALIZADA">Finalizada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>
      </div>

      <div style={styles.actions}>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {cat ? 'Atualizar CAT' : 'Criar CAT'}
        </Button>
      </div>
    </form>
  );
}