// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage/AuthPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ExamesPage from './pages/ExamesPage/ExamesPage';
import ColaboradoresPage from './pages/ColaboradoresPage/ColaboradoresPage';
import RiscosPage from './pages/RiscosPage/RiscosPage';
import CargoRiscoPage from './pages/CargoRiscoPage/CargoRiscoPage';
import { Loading } from './components/ui/Loading';
import CATsPage from './pages/CATsPage/CATsPage';

function App() {
    // ✅ PUXAR OS PERFIS E CARREGAMENTO
    const { isAuthenticated, loading, isGestor, isSesmit } = useAuth();

    if (loading) {
        return <Loading message="Carregando..." />;
    }

    // ✅ COMPONENTE AUXILIAR PARA ROTAS PROTEGIDAS
    //    Isso garante que o usuário esteja logado para ver a página
    const ProtectedRoute = ({ element }) => {
        return isAuthenticated ? element : <Navigate to="/auth" replace />;
    };

    // ✅ COMPONENTE AUXILIAR PARA ROTAS DE ADMIN
    //    Usado para páginas que SÓ O GESTOR pode ver
    const GestorRoute = ({ element }) => {
        return isAuthenticated && isGestor ? element : <Navigate to="/dashboard" replace />;
    };

    // ✅ COMPONENTE AUXILIAR PARA ROTAS DO SESMIT/GESTOR
    //    Usado para páginas que GESTOR ou SESMIT podem ver
    const AdminRoute = ({ element }) => {
        return isAuthenticated && (isGestor || isSesmit) ? element : <Navigate to="/dashboard" replace />;
    };


    return (
        <BrowserRouter>
            <Routes>
                {/* Rota de Autenticação */}
                <Route
                    path="/auth"
                    element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />}
                />
                
                {/* --- ROTAS PROTEGIDAS --- */}

                {/* Dashboard (Todos logados) */}
                <Route
                    path="/dashboard"
                    element={<ProtectedRoute element={<DashboardPage />} />}
                />

                {/* Exames (Todos logados) */}
                <Route
                    path="/exames"
                    element={<ProtectedRoute element={<ExamesPage />} />}
                />

                {/* CATs (Todos logados) */}
                <Route
                    path="/cats"
                    element={<ProtectedRoute element={<CATsPage />} />}
                />

                {/* Colaboradores (Regra: Apenas GESTOR) */}
                <Route
                    path="/colaboradores"
                    element={<GestorRoute element={<ColaboradoresPage />} />}
                />

                {/* Riscos (Regra: GESTOR ou SESMIT) */}
                <Route
                    path="/riscos"
                    element={<AdminRoute element={<RiscosPage />} />}
                />

                {/* Vínculos/Cargos (Regra: GESTOR ou SESMIT) */}
                <Route
                    path="/vinculos"
                    element={<AdminRoute element={<CargoRiscoPage />} />}
                />

                {/* --- Redirecionamentos --- */}
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route
                    path="/"
                    element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;