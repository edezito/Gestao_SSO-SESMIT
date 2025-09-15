import { useState } from "react";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";

function App() {
  const [token, setToken] = useState(null);
  const [tela, setTela] = useState("login");

  return (
    <div style={styles.appContainer}>
      {!token ? (
        <div>
          <div style={styles.toggleContainer}>
            <button
              onClick={() => setTela("login")}
              disabled={tela === "login"}
              style={{
                ...styles.toggleButton,
                ...(tela === "login" ? styles.activeButton : {})
              }}
            >
              Login
            </button>
            <button
              onClick={() => setTela("cadastro")}
              disabled={tela === "cadastro"}
              style={{
                ...styles.toggleButton,
                ...(tela === "cadastro" ? styles.activeButton : {})
              }}
            >
              Cadastrar
            </button>
          </div>

          {tela === "login" ? (
            <Login setToken={setToken} />
          ) : (
            <Cadastro />
          )}
        </div>
      ) : (
        <div style={styles.welcomeBox}>
          <h1 style={styles.welcomeTitle}>Bem-vindo!</h1>
          <p style={styles.tokenInfo}>
            Usuário logado com token: <code>{token}</code>
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    maxWidth: "450px",
    margin: "50px auto",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 12px rgba(0, 0, 0, 0.05)",
  },
  toggleContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "25px",
  },
  toggleButton: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#eee",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  activeButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    borderColor: "#4CAF50",
    cursor: "default",
  },
  welcomeBox: {
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  welcomeTitle: {
    color: "#333",
    marginBottom: "10px",
  },
  tokenInfo: {
    fontSize: "14px",
    color: "#555",
    wordBreak: "break-all",
  },
};

export default App;
