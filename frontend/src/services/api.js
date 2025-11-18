// src/services/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // ===========================================================
      // TRATAMENTO ESPECIAL PARA ARQUIVOS (PDF/BLOB)
      // ===========================================================
      if (options.responseType === 'blob') {
        const blob = await response.blob();

        // VERIFICAÇÃO DE SEGURANÇA 1: Erro HTTP vindo como Blob
        if (!response.ok) {
          const text = await blob.text();
          try {
            const json = JSON.parse(text);
            throw new Error(json.erro || json.msg || `Erro ${response.status}`);
          } catch {
            throw new Error(`Erro ao baixar arquivo: Status ${response.status}`);
          }
        }

        // VERIFICAÇÃO DE SEGURANÇA 2: O Backend retornou JSON em vez de PDF?
        if (blob.type.includes('application/json')) {
          const text = await blob.text();
          try {
            const json = JSON.parse(text);
            throw new Error(json.erro || json.message || "Erro desconhecido ao gerar PDF");
          } catch (e) {
            console.warn("Recebido application/json mas não consegui ler o erro:", e);
          }
        }

        console.log(`📦 [API] Arquivo recebido. Tamanho: ${blob.size} bytes. Tipo: ${blob.type}`);
        return blob;
      }
      // ===========================================================

      if (!response.ok) {
        await this.handleError(response, endpoint);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        return text ? JSON.parse(text) : {};
      }
      
      return {};

    } catch (error) {
      console.error(`❌ API Error em ${endpoint}:`, error.message);
      if (error.message.includes('Erro')) {
        throw error;
      }
      this.handleNetworkError(error);
      throw error;
    }
  }

  async handleError(response, endpoint) {
    let errorMessage = `Erro ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.erro || errorData.msg || errorData.message || errorMessage;
    } catch { }

    if (endpoint === '/usuarios/login' && response.status === 401) {
      errorMessage = errorMessage.includes('Credenciais') ? errorMessage : 'Credenciais inválidas.';
    } else {
      switch (response.status) {
        case 401: errorMessage = 'Sessão expirada. Faça login novamente.'; break;
        case 403: errorMessage = 'Acesso negado.'; break;
        case 404: errorMessage = 'Recurso não encontrado.'; break;
        case 500: errorMessage = 'Erro interno do servidor.'; break;
        default: break;
      }
    }
    throw new Error(errorMessage);
  }

  handleNetworkError(error) {
    if (error.message.includes('Failed to fetch') || 
        error.message.includes('NetworkError')) {
      throw new Error('Erro de conexão. Verifique sua internet.');
    } else {
      throw error;
    }
  }

  get(endpoint) { return this.request(endpoint); }
  post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }); }
  put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }

  // DOWNLOAD OTIMIZADO
  async download(endpoint, filename) {
    try {
      console.log(`⬇️ [API] Iniciando download de: ${filename}`);
      const blob = await this.request(endpoint, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        console.log('✅ [API] Download finalizado');
      }, 100);
      
      return { success: true, message: 'Download iniciado' };
    } catch (error) {
      console.error('❌ Erro no download:', error);
      throw error;
    }
  }
}

const api = new ApiClient();

// =========================
// SERVIÇOS
// =========================

export const usuarioService = {
  cadastrar: (dados) => api.post('/usuarios/cadastro', dados),
  login: (creds) => api.post('/usuarios/login', creds),
  listarColaboradores: () => api.get('/usuarios/colaboradores'),
  buscarColaborador: (id) => api.get(`/usuarios/colaboradores/${id}`),
  criarColaborador: (dados) => api.post('/usuarios/colaboradores', dados),
  atualizarColaborador: (id, dados) => api.put(`/usuarios/colaboradores/${id}`, dados),
  deletarColaborador: (id) => api.delete(`/usuarios/colaboradores/${id}`),
};

export const exameService = {
  listarAgendamentos: () => api.get('/exames/agendamentos'),
  listarTiposExame: () => api.get('/exames/tipos-exame'),
  agendarExame: (dados) => api.post('/exames/agendamentos', dados),
  buscarAgendamento: (id) => api.get(`/exames/agendamentos/${id}`),
  atualizarAgendamento: (id, dados) => api.put(`/exames/agendamentos/${id}`, dados),
  
  // ESTA É A FUNÇÃO QUE O BUILD ESTAVA RECLAMANDO
  deletarAgendamento: (id) => api.delete(`/exames/agendamentos/${id}`),
  
  criarTipoExame: (dados) => api.post('/exames/tipos-exame', dados),
  gerarPDFAgendamento: (id) => api.download(`/exames/agendamentos/${id}/gerar-pdf`, `Agendamento_Exame_${id}.pdf`)
};

export const cargoService = {
  listar: () => api.get('/cargos'),
  criar: (dados) => api.post('/cargos', dados),
  atualizar: (id, dados) => api.put(`/cargos/${id}`, dados),
  deletar: (id) => api.delete(`/cargos/${id}`),
  vincularRiscos: (id, riscos) => api.post(`/cargos/${id}/riscos`, { risco_ids: riscos }),
  vincularExames: (id, exames) => api.post(`/cargos/${id}/exames`, { exame_ids: exames }),
};

export const dashboardService = {
  summary: () => api.get('/dashboard/summary'),
};

export const riscoService = {
  listar: () => api.get('/riscos'),
  criar: (dados) => api.post('/riscos', dados),
  atualizar: (id, dados) => api.put(`/riscos/${id}`, dados),
  deletar: (id) => api.delete(`/riscos/${id}`),
  vincularExames: (id, exames) => api.post(`/riscos/${id}/exames`, { exame_ids: exames }),
};

export const catService = {
  listar: () => api.get('/cats'),
  buscar: (id) => api.get(`/cats/${id}`),
  criar: (dados) => api.post('/cats', dados),
  atualizar: (id, dados) => api.put(`/cats/${id}`, dados),
  deletar: (id) => api.delete(`/cats/${id}`),
  gerarPDF: (id) => api.download(`/cats/${id}/gerar-pdf`, `CAT_${id}.pdf`)
};

// =========================
// EXPORTAÇÕES INDIVIDUAIS (FIXED)
// =========================

// Usuários
export const cadastroUsuario = usuarioService.cadastrar;
export const loginUsuario = usuarioService.login;
export const listarColaboradores = usuarioService.listarColaboradores;
export const buscarColaborador = usuarioService.buscarColaborador;
export const criarColaborador = usuarioService.criarColaborador;
export const atualizarColaborador = usuarioService.atualizarColaborador;
export const deletarColaborador = usuarioService.deletarColaborador;

// Exames
export const listarTodosExames = exameService.listarAgendamentos;
export const listarTiposExame = exameService.listarTiposExame;
export const agendarExame = exameService.agendarExame;
export const gerarPDFAgendamento = exameService.gerarPDFAgendamento;
// 👇 AQUI ESTAVA FALTANDO A EXPORTAÇÃO
export const deletarAgendamento = exameService.deletarAgendamento; 

// Cargos
export const listarCargos = cargoService.listar;
export const criarCargo = cargoService.criar;
export const atualizarCargo = cargoService.atualizar;
export const deletarCargo = cargoService.deletar;
export const vincularRiscosCargo = cargoService.vincularRiscos;
export const vincularExamesCargo = cargoService.vincularExames;

// Riscos
export const listarRiscos = riscoService.listar;
export const criarRisco = riscoService.criar;
export const atualizarRisco = riscoService.atualizar;
export const deletarRisco = riscoService.deletar;
export const vincularExamesRisco = riscoService.vincularExames;

export const getDashboardSummary = dashboardService.summary;

// CATs
export const listarCATs = catService.listar;
export const buscarCAT = catService.buscar;
export const criarCAT = catService.criar;
export const atualizarCAT = catService.atualizar;
export const deletarCAT = catService.deletar;
export const gerarPDFCAT = catService.gerarPDF;

export { api };
export default api;