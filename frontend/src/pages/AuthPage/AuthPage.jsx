import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import LoginForm from '../../components/auth/LoginForm';
import CadastroForm from '../../components/auth/CadastroForm';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg,#f7fbff 0%, #eef2ff 100%)',
    padding: 20,
    fontFamily: theme.font.base
  },
  box: {
    width: '100%',
    maxWidth: 900,
    display: 'grid',
    gridTemplateColumns: '420px 1fr',
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(2,6,23,0.08)'
  },
  left: {
    background: theme.colors.primary,
    color: '#fff',
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    justifyContent: 'center'
  },
  right: {
    padding: 28,
    background: '#fff'
  },
  brandTitle: { fontSize: 20, fontWeight: 800 },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14 }
};

export default function AuthPageWrapper() {
  const [tab, setTab] = useState('login');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    // já autenticado -> dashboard
    navigate('/dashboard', { replace: true });
    return null;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.box}>
        <div style={styles.left}>
          <div style={styles.brandTitle}>SSO Gestão</div>
          <div style={styles.subtitle}>Gerencie exames, riscos e colaboradores com eficiência.</div>
          <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
            <strong>Seguro</strong> • <strong>Rápido</strong> • <strong>Responsivo</strong>
          </div>
        </div>

        <div style={styles.right}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            <button
              onClick={() => setTab('login')}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                border: 'none',
                background: tab === 'login' ? theme.colors.primary : '#f3f4f6',
                color: tab === 'login' ? '#fff' : theme.colors.text,
                fontWeight: 700,
                cursor: 'pointer'
              }}>Entrar</button>

            <button
              onClick={() => setTab('cadastro')}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                border: 'none',
                background: tab === 'cadastro' ? theme.colors.primary : '#f3f4f6',
                color: tab === 'cadastro' ? '#fff' : theme.colors.text,
                fontWeight: 700,
                cursor: 'pointer'
              }}>Cadastrar</button>
          </div>

          {tab === 'login' ? <LoginForm /> : <CadastroForm />}
        </div>
      </div>
    </div>
  );
}
