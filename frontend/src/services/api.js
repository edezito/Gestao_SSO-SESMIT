// src/services/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ------------------------
// Cliente HTTP centralizado
// ------------------------
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`🔄 API Request: ${url}`); // ✅ DEBUG
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Adiciona token se disponível
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔑 Token incluído: ${token.substring(0, 20)}...`); // ✅ DEBUG
    } else {
      console.log('❌ Token não encontrado'); // ✅ DEBUG
    }

    try {
      const response = await fetch(url, config);
      console.log(`✅ API Response: ${response.status} ${response.statusText}`); // ✅ DEBUG
      
      // Verifica se a resposta é bem-sucedida
      if (!response.ok) {
        await this.handleError(response, endpoint);
      }

      // Verifica se há conteúdo para parsear
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`📦 API Data:`, data); // ✅ DEBUG
        return data;
      }
      
      return {};
    } catch (error) {
      console.error(`❌ API Error:`, error.message); // ✅ DEBUG
      this.handleNetworkError(error);
      throw error;
    }
  }

  async handleError(response, endpoint) {
    let errorMessage = `Erro ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.erro || errorData.msg || errorData.message || errorMessage;
      console.log(`📋 Error details:`, errorData); // ✅ DEBUG
    } catch {
      // Se não conseguir parsear JSON, usa a mensagem padrão
      console.log('📋 No error details available'); // ✅ DEBUG
    }

    // ✅ CORREÇÃO: Tratamento específico para login
    if (endpoint === '/usuarios/login' && response.status === 401) {
      // Usa a mensagem do servidor ou uma mensagem padrão para login
      errorMessage = errorMessage.includes('Credenciais') ? errorMessage : 'Credenciais inválidas. Verifique seu email e senha.';
    }
    // ✅ CORREÇÃO: Tratamento diferenciado para outras rotas
    else {
      switch (response.status) {
        case 401:
          errorMessage = 'Sessão expirada. Faça login novamente.';
          break;
        case 403:
          errorMessage = 'Acesso negado. Você não tem permissão para esta ação.';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente.';
          break;
        default:
          // Mantém a mensagem do servidor para outros erros
          break;
      }
    }

    throw new Error(errorMessage);
  }

  handleNetworkError(error) {
    console.error('Erro de rede:', error);
    
    // ✅ CORREÇÃO: Verifica se é realmente um erro de rede
    if (error.message.includes('Failed to fetch') || 
        error.message.includes('NetworkError') ||
        error.message.includes('Network request failed')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    } else {
      // Se não for erro de rede, propaga a mensagem original
      throw error;
    }
  }

  // Métodos HTTP simplificados
  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Instância única do cliente
const api = new ApiClient();

// =========================
// Usuários
// =========================
export const usuarioService = {
  cadastrar(dadosUsuario) {
    return api.post('/usuarios/cadastro', dadosUsuario);
  },

  login(credenciais) {
    return api.post('/usuarios/login', credenciais);
  },

  listarColaboradores() {
    return api.get('/usuarios/colaboradores');
  },

  buscarColaborador(id) {
    return api.get(`/usuarios/colaboradores/${id}`);
  },

  criarColaborador(dados) {
    return api.post('/usuarios/colaboradores', dados);
  },

  atualizarColaborador(id, dados) {
    return api.put(`/usuarios/colaboradores/${id}`, dados);
  },

  deletarColaborador(id) {
    return api.delete(`/usuarios/colaboradores/${id}`);
  },
};

// =========================
// Exames
// =========================
export const exameService = {
  listarAgendamentos() {
    return api.get('/exames/agendamentos');
  },

  listarTiposExame() {
    return api.get('/exames/tipos-exame');
  },

  agendarExame(dadosExame) {
    return api.post('/exames/agendamentos', dadosExame);
  },

  buscarAgendamento(id) {
    return api.get(`/exames/agendamentos/${id}`);
  },

  atualizarAgendamento(id, dados) {
    return api.put(`/exames/agendamentos/${id}`, dados);
  },

  deletarAgendamento(id) {
    return api.delete(`/exames/agendamentos/${id}`);
  },

  criarTipoExame(dados) {
    return api.post('/exames/tipos-exame', dados);
  },
};

// =========================
// Cargos
// =========================
export const cargoService = {
  listar() {
    return api.get('/cargos');
  },

  criar(dadosCargo) {
    return api.post('/cargos', dadosCargo);
  },

  atualizar(id, dadosCargo) {
    return api.put(`/cargos/${id}`, dadosCargo);
  },

  deletar(id) {
    return api.delete(`/cargos/${id}`);
  },

  // ✅ NOVAS FUNÇÕES PARA VÍNCULOS
  vincularRiscos(cargoId, riscoIds) {
    return api.post(`/cargos/${cargoId}/riscos`, { risco_ids: riscoIds });
  },

  vincularExames(cargoId, exameIds) {
    return api.post(`/cargos/${cargoId}/exames`, { exame_ids: exameIds });
  },
};

// =========================
// Dashboard
// =========================
export const dashboardService = {
  summary() {
    return api.get('/dashboard/summary');
  }
};


// =========================
// Riscos
// =========================
export const riscoService = {
  listar() {
    return api.get('/riscos');
  },

  criar(dadosRisco) {
    return api.post('/riscos', dadosRisco);
  },

  atualizar(id, dadosRisco) {
    return api.put(`/riscos/${id}`, dadosRisco);
  },

  deletar(id) {
    return api.delete(`/riscos/${id}`);
  },

  vincularExames(riscoId, exameIds) {
    return api.post(`/riscos/${riscoId}/exames`, { exame_ids: exameIds });
  },
};

// =========================
// EXPORTAÇÕES INDIVIDUAIS (para compatibilidade)
// =========================

// Usuários
export const cadastroUsuario = (dados) => usuarioService.cadastrar(dados);
export const loginUsuario = (credenciais) => usuarioService.login(credenciais);
export const listarColaboradores = (token) => usuarioService.listarColaboradores();
export const buscarColaborador = (id, token) => usuarioService.buscarColaborador(id);
export const criarColaborador = (dados, token) => usuarioService.criarColaborador(dados);
export const atualizarColaborador = (id, dados, token) => usuarioService.atualizarColaborador(id, dados);
export const deletarColaborador = (id, token) => usuarioService.deletarColaborador(id);

// Exames
export const listarTodosExames = (token) => exameService.listarAgendamentos();
export const listarTiposExame = (token) => exameService.listarTiposExame();
export const agendarExame = (dadosExame, token) => exameService.agendarExame(dadosExame);

// Cargos
export const listarCargos = (token) => cargoService.listar();
export const criarCargo = (dadosCargo, token) => cargoService.criar(dadosCargo);
export const atualizarCargo = (id, dadosCargo, token) => cargoService.atualizar(id, dadosCargo);
export const deletarCargo = (id, token) => cargoService.deletar(id);
export const vincularRiscosCargo = (cargoId, riscoIds, token) => cargoService.vincularRiscos(cargoId, riscoIds);
export const vincularExamesCargo = (cargoId, exameIds, token) => cargoService.vincularExames(cargoId, exameIds);

// Riscos
export const listarRiscos = (token) => riscoService.listar();
export const criarRisco = (dadosRisco, token) => riscoService.criar(dadosRisco);
export const atualizarRisco = (id, dadosRisco, token) => riscoService.atualizar(id, dadosRisco);
export const deletarRisco = (id, token) => riscoService.deletar(id);
export const vincularExamesRisco = (riscoId, exameIds, token) => riscoService.vincularExames(riscoId, exameIds);

export const getDashboardSummary = () => dashboardService.summary();


// Exportação padrão para compatibilidade
export { api };
export default api;