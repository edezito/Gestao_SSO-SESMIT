import { useState } from "react";
import { cadastroUsuario } from "../../services/api";
import { responsiveStyles } from "../../styles/responsive";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("COLABORADOR");
  const [msg, setMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await cadastroUsuario({ nome, email, senha, perfil });
      if (res.id) {
        setMsg("✅ Usuário cadastrado com sucesso!");
        setIsSuccess(true);
        setNome('');
        setEmail('');
        setSenha('');
        setPerfil('COLABORADOR');
        setTimeout(() => setMsg(''), 5000);
      }
    } catch (error) {
      setMsg(`❌ ${error.response?.data?.erro || "Ocorreu um erro no cadastro."}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setPerfil('COLABORADOR');
    setMsg('');
  };

  return (
    <div style={responsiveStyles.authContainer}>
      <h2 style={styles.title}>Cadastro de Usuário</h2>

      {msg && (
        <div style={isSuccess ? responsiveStyles.messageSuccess : responsiveStyles.messageError}>
          {msg}
        </div>
      )}

      <form onSubmit={handleCadastro} style={responsiveStyles.form}>
        <div style={responsiveStyles.formGroup}>
          <label style={responsiveStyles.label}>Nome Completo *</label>
          <input
            style={responsiveStyles.input}
            placeholder="Seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div style={responsiveStyles.formGroup}>
          <label style={responsiveStyles.label}>Email *</label>
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
          <label style={responsiveStyles.label}>Senha *</label>
          <input
            style={responsiveStyles.input}
            placeholder="Crie uma senha segura"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <div style={responsiveStyles.formGroup}>
          <label style={responsiveStyles.label}>Perfil *</label>
          <select
            style={responsiveStyles.select}
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            disabled={loading}
          >
            <option value="COLABORADOR">Colaborador</option>
            <option value="SESMIT">SESMIT</option>
            <option value="GESTOR">Gestor</option>
            <option value="CIPA">CIPA</option>
          </select>
        </div>

        <div style={styles.buttonContainer}>
          <button
            type="button"
            onClick={handleReset}
            style={styles.resetButton}
            disabled={loading}
          >
            Limpar
          </button>
          <button 
            type="submit" 
            style={{
              ...responsiveStyles.button,
              ...styles.registerButton,
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </form>

      <div style={styles.helpText}>
        <p><strong>Observação:</strong> Todos os campos marcados com * são obrigatórios.</p>
        <p><small>A senha deve ter pelo menos 6 caracteres.</small></p>
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
    [`@media (max-width: 768px)`]: {
      fontSize: "20px",
      marginBottom: "20px",
    },
  },

  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
    [`@media (max-width: 480px)`]: {
      flexDirection: 'column',
    },
  },

  registerButton: {
    backgroundColor: "#4CAF50",
    flex: 2,
    '&:hover:not(:disabled)': {
      backgroundColor: "#45a049",
    },
  },

  resetButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontWeight: 'bold',
    '&:hover:not(:disabled)': {
      backgroundColor: '#5a6268',
    },
    [`@media (max-width: 480px)`]: {
      padding: '12px',
    },
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
    lineHeight: "1.5",
  },
};