import { useState } from "react";
import { loginUsuario } from "../../services/api";
import { responsiveStyles } from "../../styles/responsive";

// 1. Altere a prop de 'setToken' para 'onLogin', que é a função do nosso contexto
export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await loginUsuario({ email, senha });
      if (res.access_token) {
        onLogin(res.access_token);
      }
    } catch (error) {
      // Usa a mensagem genérica do interceptor ou uma específica
      const errorMsg = error.response?.data?.msg || error.response?.data?.erro || "Email ou senha incorretos.";
      setMsg(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // O JSX (return) e os estilos permanecem os mesmos, pois já estão ótimos.
  return (
    <div style={responsiveStyles.authContainer}>
      <h2 style={styles.title}>Login</h2>

      {msg && (
        <div style={responsiveStyles.messageError}>
          {msg}
        </div>
      )}

      <form onSubmit={handleLogin} style={responsiveStyles.form}>
        <div style={responsiveStyles.formGroup}>
          <label style={responsiveStyles.label}>
            Email
          </label>
          <input
            style={responsiveStyles.input}
            placeholder="seu@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div style={responsiveStyles.formGroup}>
          <label style={responsiveStyles.label}>
            Senha
          </label>
          <input
            style={responsiveStyles.input}
            placeholder="Sua senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          style={{
            ...responsiveStyles.button,
            ...styles.loginButton,
            ...(loading ? styles.buttonDisabled : {})
          }}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div style={styles.helpText}>
        <p>Bem-vindo ao Sistema de Gestão SSO</p>
      </div>
    </div>
  );
}

const styles = {
  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#333",
    fontSize: "24px",
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    marginTop: "10px",
  },
  buttonDisabled: {
    backgroundColor: "#6c757d",
    cursor: "not-allowed",
    opacity: 0.6,
  },
  helpText: {
    marginTop: "25px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "14px",
    color: "#6c757d",
    border: "1px solid #e9ecef",
  },
};