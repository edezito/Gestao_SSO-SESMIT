import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './useAuth';

export const useApi = (endpoint, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!options.lazy);
    const [error, setError] = useState(null);

    const { user, isColaborador, isGestor, isSesmit, isAuthenticated, loading: authLoading } = useAuth();

    const { 
        lazy = false, 
        requiresAuth = true,
        skipPermissionCheck = false,
        ...fetchOptions
    } = options;

    const fetchData = async (overrides = {}) => {
        // ⏳ Aguarda autenticação
        if (authLoading) return;

        // 🚫 Abort se não autenticado
        if (requiresAuth && !isAuthenticated) {
            setError('Usuário não autenticado');
            setLoading(false);
            return;
        }

        // 🔐 Verificação centralizada de permissões
        if (!skipPermissionCheck && endpoint.includes('/usuarios/colaboradores')) {
            // Bloqueia COLABORADOR, mas permite GESTOR e SESMIT
            if (isColaborador) {
                setError('Sem permissão para acessar este recurso');
                setData([]);
                setLoading(false);
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            console.log(`🔄 Buscando: ${endpoint}`);
            const response = await api.get(endpoint, fetchOptions);
            setData(response);
        } catch (err) {
            console.error(`❌ Erro em ${endpoint}:`, err.message);

            // Tratamento de erro sem loops
            if (err.message.includes('401')) {
                setError('Sessão expirada. Faça login novamente.');
            } else if (err.message.includes('network') || err.message.includes('fetch')) {
                setError('Servidor indisponível. Tente novamente.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!lazy && !authLoading) {
            fetchData();
        }

        if (!lazy && !isAuthenticated && !authLoading) {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint, isAuthenticated, authLoading, lazy]);

    return { 
        data, 
        loading: loading || authLoading, 
        error, 
        refetch: fetchData 
    };
};
