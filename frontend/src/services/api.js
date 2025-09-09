const API_URL = "http://localhost:5000";

export async function cadastroUsuario(dados) {
  const res = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return res.json();
}