import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Importe o AuthProvider e o hook
import Login from "./components/auth/Login";
import Cadastro from "./components/auth/Cadastro";
import Dashboard from "./components/dashboard/Dashboard";
import { responsiveStyles } from "./styles/responsive";

// Este componente interno agora lê o estado do contexto
function AppContent() {
  const { token, login, logout } = useAuth(); // Pega o estado e as funções do contexto
  const [telaAuth, setTelaAuth] = useState("login");

  const isLoggedIn = !!token;

  return (
    <div style={isLoggedIn ? responsiveStyles.wrapper : responsiveStyles.authWrapper}>
      {!isLoggedIn ? (
        <div style={responsiveStyles.authContainer}>
          <h1 style={styles.logo}>Gestão SSO</h1>
          <div style={responsiveStyles.toggleContainer}>
            <button
              onClick={() => setTelaAuth("login")}
              disabled={telaAuth === "login"}
              style={{
                ...responsiveStyles.toggleButton,
                ...(telaAuth === "login" ? responsiveStyles.activeButton : {}),
              }}
            >
              Login
            </button>
            <button
              onClick={() => setTelaAuth("cadastro")}
              disabled={telaAuth === "cadastro"}
              style={{
                ...responsiveStyles.toggleButton,
                ...(telaAuth === "cadastro" ? responsiveStyles.activeButton : {}),
              }}
            >
              Cadastrar
            </button>
          </div>

          {/* Passa a função 'login' do contexto para o componente Login */}
          {telaAuth === "login" ? (
            <Login onLogin={login} /> 
          ) : (
            <Cadastro />
          )}
        </div>
      ) : (
        // Passa a função 'logout' do contexto para o Dashboard
        <Dashboard onLogout={logout} />
      )}
    </div>
  );
}

// O componente App raiz agora apenas provê o contexto
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = {
  logo: {
    marginBottom: '25px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
  },
};

export default App;