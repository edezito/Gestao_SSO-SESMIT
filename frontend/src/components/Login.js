import { useState } from "react";
import { loginUsuario } from "../services/api";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await loginUsuario({ email, senha });
    if (res.token) {
      setToken(res.token);
    } else {
      setMsg(res.erro);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {msg && <p style={{ color: "red" }}>{msg}</p>}
      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
