import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        console.log('🚪 Executando logout...');
        
        // Limpa todos os dados de autenticação
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        // Limpa o estado
        setUser(null);
        setLoading(false);
        
        // ✅ FORÇA O REDIRECIONAMENTO - use replace para evitar voltar com back button
        console.log('🔄 Redirecionando para /auth');
        window.location.replace('/auth');
        
        // Ou se preferir usar href:
        // window.location.href = '/auth';
    };

    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('userData');

            console.log('🔄 Inicializando auth...', { token: !!token, userData: !!userData });

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const userInfo = userData ? JSON.parse(userData) : {};

                    // Verifica se o token expirou
                    const isTokenExpired = decoded.exp * 1000 < Date.now();
                    
                    if (!isTokenExpired) {
                        const userProfile = {
                            ...userInfo,
                            perfil: decoded.perfil || userInfo.perfil,
                            id: decoded.sub || userInfo.id,
                            nome: userInfo.nome || decoded.nome || 'Usuário'
                        };
                        console.log('✅ Usuário autenticado:', userProfile);
                        setUser(userProfile);
                    } else {
                        console.log('❌ Token expirado - fazendo logout automático');
                        handleLogout();
                    }
                } catch (error) {
                    console.error('❌ Erro ao decodificar token:', error);
                    handleLogout();
                }
            } else {
                console.log('ℹ️ Nenhum token encontrado');
                setLoading(false);
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = (token, userData) => {
        console.log('🔑 Fazendo login...', { token: token.substring(0, 20) + '...', userData });
        
        try {
            const decoded = jwtDecode(token);
            
            // Salva no localStorage
            localStorage.setItem('token', token);
            if (userData) {
                localStorage.setItem('userData', JSON.stringify(userData));
            }

            const userProfile = {
                ...userData,
                perfil: decoded.perfil || userData?.perfil,
                id: decoded.sub || userData?.id,
                nome: userData?.nome || decoded.nome || 'Usuário'
            };
            
            setUser(userProfile);
            console.log('✅ Login realizado com sucesso:', userProfile);
            
        } catch (error) {
            console.error('❌ Erro ao processar login:', error);
            // Limpa dados inválidos
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            throw error;
        }
        return true;
    };

    const userPerfil = user?.perfil?.toUpperCase() || '';
    const isColaborador = userPerfil === 'COLABORADOR';
    const isGestor = userPerfil === 'GESTOR';
    const isSesmit = userPerfil === 'SESMIT';

    return {
        user,
        loading,
        isColaborador,
        isGestor,
        isSesmit,
        isAuthenticated: !!user,
        login,
        logout: handleLogout
    };
};