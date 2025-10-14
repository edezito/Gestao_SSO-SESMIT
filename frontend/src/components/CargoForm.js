import React, { useState } from 'react';
import api from '../services/api';

const CargoForm = () => {
  const [nome, setNome] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/cargos', { nome })
      .then(() => {
        alert('Cargo cadastrado com sucesso');
        setNome('');
      })
      .catch(error => {
        console.error('Erro ao cadastrar cargo', error);
        alert('Erro ao cadastrar cargo');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Cargo</h2>
      <input
        type="text"
        value={nome}
        onChange={e => setNome(e.target.value)}
        placeholder="Nome do cargo"
        required
      />
      <button type="submit">Salvar</button>
    </form>
  );
};

export default CargoForm;
