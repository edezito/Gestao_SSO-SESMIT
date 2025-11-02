// src/hooks/useDashboardSummary.js
import { useEffect, useState, useRef, useCallback } from 'react';
import { getDashboardSummary } from '../services/api';

export function useDashboardSummary({ pollInterval = 0 } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboardSummary();
      setData(response);
    } catch (err) {
      setError(err.message || 'Erro ao buscar summary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();

    if (pollInterval > 0) {
      timerRef.current = setInterval(fetchSummary, pollInterval);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchSummary, pollInterval]);

  return { data, loading, error, refresh: fetchSummary };
}
