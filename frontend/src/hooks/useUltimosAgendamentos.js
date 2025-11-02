// useUltimosAgendamentos.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { exameService } from '../services/api'; // Importar do serviço centralizado

export function useUltimosAgendamentos({ limit = 5 } = {}) {
  const { token } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAgendamentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Buscando últimos agendamentos...');
      
      // Usar o serviço centralizado em vez de fetch direto
      const data = await exameService.listarAgendamentos();
      
      console.log('📦 Dados recebidos:', data);
      
      // Verificar a estrutura da resposta
      if (Array.isArray(data)) {
        // Se for array direto (estrutura atual)
        const limitados = data.slice(0, limit);
        setAgendamentos(limitados);
      } else if (data && Array.isArray(data.dados)) {
        // Se for estrutura {dados: [], mensagem: ""}
        const limitados = data.dados.slice(0, limit);
        setAgendamentos(limitados);
      } else if (data && Array.isArray(data.agendamentos)) {
        // Se for estrutura {agendamentos: []}
        const limitados = data.agendamentos.slice(0, limit);
        setAgendamentos(limitados);
      } else {
        console.warn('Estrutura de dados inesperada:', data);
        setAgendamentos([]);
      }
      
    } catch (err) {
      console.error('❌ Erro ao buscar agendamentos:', err);
      setError(err.message);
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  }, [limit, token]);

  useEffect(() => {
    fetchAgendamentos();
  }, [fetchAgendamentos]);

  return { 
    agendamentos, 
    loading, 
    error, 
    refresh: fetchAgendamentos 
  };
}