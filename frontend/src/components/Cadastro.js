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
    <div>
      <h2>Cadastro</h2>
      {msg && <p style={{ color: msg.includes("sucesso") ? "green" : "red" }}>{msg}</p>}
      <form onSubmit={handleCadastro}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
          <option value="COLABORADOR">Colaborador</option>
          <option value="SESMIT">SESMIT</option>
          <option value="GESTOR">Gestor</option>
          <option value="CIPA">CIPA</option>
        </select>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
