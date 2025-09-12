// A variável API_URL agora é apenas o prefixo do nosso proxy
const API_URL = "/api";

export async function cadastroUsuario(data) {
  // A URL final será /api/cadastro
  const res = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function loginUsuario(data) {
  // A URL final será /api/login
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}