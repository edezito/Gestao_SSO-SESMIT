import { useState } from "react";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";

function App() {
  const [token, setToken] = useState(null);
  const [tela, setTela] = useState("login");

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      {!token ? (
        <div>
          <div style={{ marginBottom: 20 }}>
            <button onClick={() => setTela("login")} disabled={tela === "login"}>
              Login
            </button>
            <button onClick={() => setTela("cadastro")} disabled={tela === "cadastro"}>
              Cadastro
            </button>
          </div>

          {tela === "login" ? (
            <Login setToken={setToken} />
          ) : (
            <Cadastro />
          )}
        </div>
      ) : (
        <div>
          <h1>Bem-vindo!</h1>
          <p>Usuário logado com token: {token}</p>
        </div>
      )}
    </div>
  );
}

export default App;
