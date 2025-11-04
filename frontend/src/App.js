import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage/AuthPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ExamesPage from './pages/ExamesPage/ExamesPage';
import ColaboradoresPage from './pages/ColaboradoresPage/ColaboradoresPage';
import RiscosPage from './pages/RiscosPage/RiscosPage';
import CargoRiscoPage from './pages/CargoRiscoPage/CargoRiscoPage'; // ✅ NOVA PÁGINA
import { Loading } from './components/ui/Loading';
import CATsPage from './pages/CATsPage/CATsPage';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Carregando..." />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Autenticação (Login + Cadastro) */}
        <Route 
          path="/auth" 
          element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />}
        />

        {/* Rota do Dashboard (Protegida) */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/auth" replace />}
        />

        {/* Rota: Gestão de Exames (Protegida) */}
        <Route 
          path="/exames" 
          element={isAuthenticated ? <ExamesPage /> : <Navigate to="/auth" replace />}
        />

        {/* Rota: Gestão de Colaboradores (Protegida) */}
        <Route 
          path="/colaboradores" 
          element={isAuthenticated ? <ColaboradoresPage /> : <Navigate to="/auth" replace />}
        />

        {/* Rota: Gestão de Riscos (Protegida) */}
        <Route 
          path="/riscos" 
          element={isAuthenticated ? <RiscosPage /> : <Navigate to="/auth" replace />}
        />

        {/* ✅ NOVA ROTA: Vínculos Cargo×Risco (Protegida - apenas SESMIT) */}
        <Route 
          path="/vinculos" 
          element={isAuthenticated ? <CargoRiscoPage /> : <Navigate to="/auth" replace />}
        />

        {/* Rota de Login (redireciona para auth) */}
        <Route 
          path="/login" 
          element={<Navigate to="/auth" replace />}
        />

        {/* Rota Padrão */}
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} 
        />

        <Route path="/cats" element={<CATsPage />} />

        {/* Rota de fallback */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;