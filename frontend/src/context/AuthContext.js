import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Cria o contexto
const AuthContext = createContext(null);

// 2. Cria o Provedor que irá "abraçar" sua aplicação
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [perfil, setPerfil] = useState(null);

  // Este useEffect roda uma vez quando a app carrega
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setPerfil(decodedToken.perfil);
        setToken(storedToken);
      } catch (error) {
        console.error("Token inválido no localStorage, limpando...", error);
        localStorage.removeItem('authToken'); // Limpa token corrompido
      }
    }
  }, []);

  // Função que será chamada pelo componente de Login
  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    const decodedToken = jwtDecode(newToken);
    setPerfil(decodedToken.perfil);
    setToken(newToken);
  };

  // Função que será chamada pelo Dashboard/Header
  const logout = () => {
    localStorage.removeItem('authToken');
    setPerfil(null);
    setToken(null);
  };

  // Valores que serão compartilhados com toda a aplicação
  const authData = { token, perfil, login, logout };

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook customizado para facilitar o uso do contexto nos componentes
export const useAuth = () => {
  return useContext(AuthContext);
};