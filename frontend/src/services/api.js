// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR DE RESPOSTAS ATUALIZADO ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Mantém a lógica para deslogar em caso de token inválido (401)
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/'; // Redireciona para o login
      return Promise.reject(error); // Interrompe o fluxo aqui
    }

    // ✅ NOVA LÓGICA: Trata o erro de permissão (422) na rota de exames
    if (
      error.response?.status === 422 &&
      error.config?.url === '/exames'
    ) {
      // Garante que o objeto de dados exista para evitar erros
      if (!error.response.data) {
        error.response.data = {};
      }
      // Sobrescreve a mensagem de erro por uma mais clara e amigável
      error.response.data.msg = "Acesso negado. Seu perfil não tem permissão para visualizar esta lista de exames.";
    }

    // Retorna o erro (agora modificado, se necessário) para o .catch() do componente
    return Promise.reject(error);
  }
);


// --- Funções de Autenticação ---
export const loginUsuario = (credenciais) => 
  api.post('/login', credenciais).then(res => res.data);

export const cadastroUsuario = (usuario) => 
  api.post('/cadastro', usuario).then(res => res.data);


// --- Funções de Usuários/Colaboradores ---
export const listarUsuarios = () => 
  api.get('/colaboradores').then(res => res.data);

export const atualizarUsuario = (id, usuario) => 
  api.put(`/usuario/${id}`, usuario).then(res => res.data);

export const excluirUsuario = (id) => 
  api.delete(`/usuario/${id}`).then(res => res.data);


// --- Funções de Exames ---
export const agendarExame = (dadosExame) => 
  api.post('/exames/agendar', dadosExame).then(res => res.data);

export const listarTodosExames = () => 
  api.get('/exames').then(res => res.data);


// --- Funções de Cargos ---
export const criarCargo = (cargo) => 
  api.post('/cargos', cargo).then(res => res.data);

export const listarCargos = () => 
  api.get('/cargos').then(res => res.data);

export const atualizarCargo = (id, cargo) => 
  api.put(`/cargos/${id}`, cargo).then(res => res.data);

export const excluirCargo = (id) => 
  api.delete(`/cargos/${id}`).then(res => res.data);


export default api;