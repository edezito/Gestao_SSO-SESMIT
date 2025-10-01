import { useState } from "react";
import { cadastroUsuario } from "../../services/api";
import formStyles from '../../styles/Form.module.css';

export default function CadastroForm() { 
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("COLABORADOR");
  const [msg, setMsg] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();
    setMsg(""); 
    try {
      const res = await cadastroUsuario({ nome, email, senha, perfil });
      if (res.id) {
        setMsg("Usuário cadastrado com sucesso!");
      } else {
        setMsg(res.erro || "Ocorreu um erro desconhecido.");
      }
    } catch (error) {
      setMsg("Falha na comunicação com o servidor.");
    }
  };

  const messageClassName = msg.includes("sucesso")
    ? formStyles.messageSuccess
    : formStyles.messageError;

  return (
    <div className={formStyles.container}>
      <h2 className={formStyles.title}>Cadastro de Usuário</h2>

      {msg && (
        <p className={`${formStyles.message} ${messageClassName}`}>
          {msg}
        </p>
      )}

      <form onSubmit={handleCadastro} className={formStyles.form}>
        <input
          className={formStyles.input}
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
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
        <select
          className={formStyles.select}
          value={perfil}
          onChange={(e) => setPerfil(e.target.value)}
        >
          <option value="COLABORADOR">Colaborador</option>
          <option value="SESMIT">SESMIT</option>
          <option value="GESTOR">Gestor</option>
          <option value="CIPA">CIPA</option>
        </select>
        <button
          type="submit"
          className={formStyles.buttonBase}
          style={{ '--button-bg-color': '#28a745' }}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}