import { useState } from "react";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import Dashboard from "./components/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [tela, setTela] = useState("login");

  const handleSetToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("authToken", newToken);
    } else {
      localStorage.removeItem("authToken");
    }
    setToken(newToken);
  };

  // Use estilos diferentes para o wrapper dependendo do login
  const isLoggedIn = !!token;

  return (
    <div style={isLoggedIn ? styles.loggedInWrapper : styles.authWrapper}>
      {!isLoggedIn ? (
        <div style={styles.authContainer}>
          <h1 style={styles.logo}>Gestão SSO</h1>

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
        <Dashboard token={token} onLogout={() => handleSetToken(null)} />
      )}
    </div>
  );
}

const styles = {
  authWrapper: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    fontFamily: "'Segoe UI', sans-serif",
  },

  loggedInWrapper: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#f4f4f4",
    fontFamily: "'Segoe UI', sans-serif",
  },

  authContainer: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
  },

  logo: {
    marginBottom: "25px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#007bff",
  },

  toggleContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "25px",
    gap: "10px",
  },

  toggleButton: {
    padding: "10px 20px",
    fontSize: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
    transition: "all 0.3s ease",
    flex: 1,
  },

  activeButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    borderColor: "#007bff",
    cursor: "default",
  },
};

export default App;
