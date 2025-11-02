import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Importação correta

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');

      console.log('🔐 Inicializando autenticação...', { 
        hasToken: !!token, 
        hasUserData: !!userData 
      });

      if (token) {
        try {
          const decoded = jwtDecode(token); // ✅ Remove o .default
          const userInfo = userData ? JSON.parse(userData) : {};

          // Verifica se o token não expirou
          if (decoded.exp * 1000 > Date.now()) {
            const userProfile = {
              ...userInfo,
              perfil: decoded.perfil || userInfo.perfil,
              id: decoded.sub || userInfo.id
            };
            console.log('✅ Usuário autenticado:', userProfile);
            setUser(userProfile);
          } else {
            console.log('❌ Token expirado');
            logout();
          }
        } catch (error) {
          console.error('❌ Erro ao decodificar token:', error);
          logout();
        }
      } else {
        console.log('ℹ️  Nenhum token encontrado');
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token, userData) => {
    console.log('🔑 Fazendo login:', { token, userData });
    localStorage.setItem('token', token);
    if (userData) localStorage.setItem('userData', JSON.stringify(userData));

    try {
      const decoded = jwtDecode(token); // ✅ Remove o .default
      const userProfile = {
        ...userData,
        perfil: decoded.perfil || userData?.perfil,
        id: decoded.sub || userData?.id
      };
      console.log('✅ Login realizado - Perfil do usuário:', userProfile);
      setUser(userProfile);
    } catch (error) {
      console.error('❌ Erro ao processar login:', error);
      logout();
      throw error;
    }

    return true;
  };

  const logout = () => {
    console.log('🚪 Fazendo logout');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const userPerfil = user?.perfil?.toUpperCase() || '';
  const isColaborador = userPerfil === 'COLABORADOR';
  const isGestor = userPerfil === 'GESTOR';
  const isSesmit = userPerfil === 'SESMIT';

  console.log('🎭 Perfil atual:', { perfil: userPerfil, isColaborador, isGestor, isSesmit });

  return {
    user,
    loading,
    isColaborador,
    isGestor,
    isSesmit,
    isAuthenticated: !!user,
    login,
    logout
  };
};