// src/hooks/useCATs.js
import { useState, useEffect } from 'react';
import { catService } from '../services/api';
import { useAuth } from './useAuth';

export const useCATs = (options = {}) => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchCATs = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await catService.listar();
      setCats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCATs();
  }, [isAuthenticated]);

  const criar = async (dadosCAT) => {
    try {
      const novaCAT = await catService.criar(dadosCAT);
      setCats(prev => [novaCAT, ...prev]);
      return novaCAT;
    } catch (err) {
      throw err;
    }
  };

  const atualizar = async (id, dadosCAT) => {
    try {
      const catAtualizada = await catService.atualizar(id, dadosCAT);
      setCats(prev => prev.map(cat => 
        cat.id === id ? catAtualizada : cat
      ));
      return catAtualizada;
    } catch (err) {
      throw err;
    }
  };

  const deletar = async (id) => {
    try {
      await catService.deletar(id);
      setCats(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const gerarPDF = async (id) => {
    try {
      const response = await catService.gerarPDF(id);
      // Cria um blob e faz download
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CAT_${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      throw err;
    }
  };

  return {
    cats,
    loading,
    error,
    refetch: fetchCATs,
    criar,
    atualizar,
    deletar,
    gerarPDF
  };
};