import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { loginUsuario } from "../../services/api";
import formStyles from '../../styles/Form.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    
    try {
      console.log('🔄 Iniciando login...', { email });
      const res = await loginUsuario({ email, senha });
      console.log('✅ Resposta do login:', res);
      
      if (res.token) {
        const userData = res.user || { 
          email: email, 
          nome: email.split('@')[0],
          perfil: res.user?.perfil || 'COLABORADOR'
        };
        
        console.log('👤 Dados do usuário para login:', userData);
        login(res.token, userData);
        
        setMsg("Login realizado com sucesso! Redirecionando...");
        
        setTimeout(() => {
          console.log('🚀 Redirecionando para dashboard...');
          window.location.href = '/dashboard';
        }, 1000);
        
      } else {
        setMsg(res.erro || "Credenciais inválidas."); 
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      
      // ✅ CORREÇÃO: Exibe a mensagem de erro específica
      if (error.message.includes('Credenciais inválidas')) {
        setMsg('Credenciais inválidas. Verifique seu email e senha.');
      } else if (error.message.includes('Erro de conexão')) {
        setMsg('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        setMsg(error.message || 'Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={formStyles.container}>
      <h2 className={formStyles.title}>Login</h2>
      {msg && (
        <p className={`${formStyles.message} ${
          msg.includes('sucesso') ? formStyles.messageSuccess : formStyles.messageError
        }`}>
          {msg}
        </p>
      )}
      <form onSubmit={handleLogin} className={formStyles.form}>
        <input
          className={formStyles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          className={formStyles.input}
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className={formStyles.buttonBase}
          style={{ '--button-bg-color': '#007bff' }}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}