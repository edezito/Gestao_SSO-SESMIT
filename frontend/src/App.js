import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  const handleSetToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("authToken", newToken);
    } else {
      localStorage.removeItem("authToken");
    }
    setToken(newToken);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Autenticação */}
        <Route 
          path="/auth" 
          element={!token ? <AuthPage setToken={handleSetToken} /> : <Navigate to="/dashboard" />}
        />

        {/* Rota do Dashboard (Protegida) */}
        <Route 
          path="/dashboard" 
          element={token ? <DashboardPage token={token} onLogout={() => handleSetToken(null)} /> : <Navigate to="/auth" />}
        />

        {/* Rota Padrão: redireciona para o local correto */}
        <Route 
          path="*" 
          element={<Navigate to={token ? "/dashboard" : "/auth"} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
