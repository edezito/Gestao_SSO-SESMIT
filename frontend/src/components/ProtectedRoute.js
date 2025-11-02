import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/Loading';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading message="Verificando autenticação..." />;
    }

    if (!user) {
        window.location.href = '/login';
        return <Loading message="Redirecionando para login..." />;
    }

    return children;
};

export default ProtectedRoute;