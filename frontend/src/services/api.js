const API_URL = "/http://localhost:5000";

export async function cadastroUsuario(data) {
  const res = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function loginUsuario(data) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

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

export function listarTodosExames(token) {
  return fetchAutenticado("/exames", token);
}

export function listarColaboradores(token) {
    return fetchAutenticado("/colaboradores", token);
}

export function agendarExame(dadosExame, token) {
    return fetchAutenticado("/exames", token, {
        method: "POST",
        body: JSON.stringify(dadosExame),
    });
}

