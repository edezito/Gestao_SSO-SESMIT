import { useState } from "react";
import { cadastroUsuario } from "../services/api";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("COLABORADOR");
  const [msg, setMsg] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();
    const res = await cadastroUsuario({ nome, email, senha, perfil });
    if (res.id) {
      setMsg("Usuário cadastrado com sucesso!");
    } else {
      setMsg(res.erro);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cadastro de Usuário</h2>

      {msg && (
        <p style={{ ...styles.message, color: msg.includes("sucesso") ? "green" : "red" }}>
          {msg}
        </p>
      )}

      <form onSubmit={handleCadastro} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          style={styles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <select
          style={styles.select}
          value={perfil}
          onChange={(e) => setPerfil(e.target.value)}
        >
          <option value="COLABORADOR">Colaborador</option>
          <option value="SESMIT">SESMIT</option>
          <option value="GESTOR">Gestor</option>
          <option value="CIPA">CIPA</option>
        </select>
        <button type="submit" style={styles.button}>Cadastrar</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  select: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  message: {
    textAlign: "center",
    marginBottom: "10px",
    fontWeight: "bold",
  },
};
