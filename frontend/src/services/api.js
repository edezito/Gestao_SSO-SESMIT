const API_URL = "/api";

// Função auxiliar para requisições autenticadas
async function fetchAutenticado(endpoint, token, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.erro || errorData.msg || `Erro na requisição para ${endpoint}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return res.json();
  }
  return {};
}

// ========================================================
// Funções do sistema
// ========================================================

// Cadastra um novo usuário
export function cadastroUsuario(dadosUsuario, token) {
  return fetchAutenticado("/cadastro", token, {
    method: "POST",
    body: JSON.stringify(dadosUsuario),
  });
}

// Realiza login do usuário
export async function loginUsuario(dadosUsuario) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosUsuario),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.erro || errorData.msg || "Erro no login");
  }

  return res.json(); // retorna { token: "..."} se login OK
}

// Lista todos os agendamentos de exames
export function listarTodosExames(token) {
  return fetchAutenticado("/agendamentos", token);
}

// Lista os tipos de exame disponíveis para agendamento
export function listarTiposExame(token) {
  return fetchAutenticado("/tipos-exame", token);
}

// Agenda um novo exame
export function agendarExame(dadosExame, token) {
  return fetchAutenticado("/agendamentos", token, {
    method: "POST",
    body: JSON.stringify(dadosExame),
  });
}

// Lista os colaboradores
export function listarColaboradores(token) {
  return fetchAutenticado("/colaboradores", token);
}
