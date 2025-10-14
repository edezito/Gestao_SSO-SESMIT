import React, { useEffect, useState } from 'react';
import api from '../services/api';

const CargoList = () => {
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    api.get('/cargos')
      .then(response => setCargos(response.data))
      .catch(error => console.error('Erro ao buscar cargos', error));
  }, []);

  return (
    <div>
      <h2>Lista de Cargos</h2>
      <ul>
        {cargos.map(cargo => (
          <li key={cargo.id}>{cargo.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default CargoList;
