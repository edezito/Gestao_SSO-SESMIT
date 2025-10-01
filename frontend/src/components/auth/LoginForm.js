import { useState } from "react";
import { loginUsuario } from "../../services/api";
import formStyles from '../../styles/Form.module.css';

export default function LoginForm({ setToken }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await loginUsuario({ email, senha });
      if (res.token) {
        setToken(res.token);
      } else {
        setMsg(res.erro || "Credenciais inválidas.");
      }
    } catch (error) {
      setMsg("Falha na comunicação com o servidor.");
    }
  };

  return (
    <div className={formStyles.container}>
      <h2 className={formStyles.title}>Login</h2>
      {msg && (
        <p className={`${formStyles.message} ${formStyles.messageError}`}>
          {msg}
        </p>
      )}
      <form onSubmit={handleLogin} className={formStyles.form}>
        <input
          className={formStyles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={formStyles.input}
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button
          type="submit"
          className={formStyles.buttonBase}
          style={{ '--button-bg-color': '#007bff' }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}