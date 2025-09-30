import { useState } from "react";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import Dashboard from "./components/Dashboard"; // Importamos o novo componente

function App() {
  // Vamos usar o localStorage para persistir o login ao recarregar a página
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [tela, setTela] = useState("login");

  // Função para salvar o token no estado e no localStorage
  const handleSetToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("authToken", newToken);
    } else {
      localStorage.removeItem("authToken");
    }
    setToken(newToken);
  };

  return (
    <div style={styles.appContainer}>
      {!token ? (
        // --- ÁREA DE LOGIN E CADASTRO ---
        <div>
          <div style={styles.toggleContainer}>
            <button
              onClick={() => setTela("login")}
              disabled={tela === "login"}
              style={{
                ...styles.toggleButton,
                ...(tela === "login" ? styles.activeButton : {}),
              }}
            >
              Login
            </button>
            <button
              onClick={() => setTela("cadastro")}
              disabled={tela === "cadastro"}
              style={{
                ...styles.toggleButton,
                ...(tela === "cadastro" ? styles.activeButton : {}),
              }}
            >
              Cadastrar
            </button>
          </div>

          {tela === "login" ? (
            <Login setToken={handleSetToken} />
          ) : (
            <Cadastro />
          )}
        </div>
      ) : (
        // --- ÁREA LOGADA ---
        // Se o usuário tem um token, mostramos o Dashboard
        <Dashboard token={token} onLogout={() => handleSetToken(null)} />
      )}
    </div>
  );
}

// Estilos (mantidos, mas poderiam ir para um App.css)
const styles = {
  appContainer: {
    maxWidth: "900px",
    margin: "40px auto",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
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
    backgroundColor: "#007bff",
    color: "#fff",
    borderColor: "#007bff",
    cursor: "default",
  },
};

export default App;
