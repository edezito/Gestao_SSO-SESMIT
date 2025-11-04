// src/pages/CATsPage/CATsPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCATs } from '../../hooks/useCATs';
import Layout from '../../components/Layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import ListaCATs from '../../components/cats/ListaCATs';
import FormCAT from '../../components/cats/FormCAT';
import ModalDetalhesCAT from '../../components/cats/ModalDetalhesCAT';
import { useNavigate, useLocation } from 'react-router-dom';

const styles = {
  pageWrapper: { minHeight: '100vh', background: '#f8f9fa' },
  header: { 
    background: 'white', 
    padding: '1rem 2rem', 
    borderBottom: '1px solid #e9ecef', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  title: { margin: 0, color: '#333', fontSize: '1.25rem' },
  userInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  container: { maxWidth: 1200, margin: '0 auto', padding: '2rem' },
  nav: { 
    display: 'flex', 
    gap: 8, 
    marginBottom: 20, 
    borderBottom: '1px solid #dee2e6', 
    paddingBottom: 12 
  },
  navButton: (active) => ({
    padding: '0.6rem 1rem',
    borderRadius: 8,
    border: active ? '1px solid #007bff' : '1px solid #dee2e6',
    background: active ? '#007bff' : '#fff',
    color: active ? '#fff' : '#495057',
    cursor: 'pointer',
    fontWeight: 700
  }),
  mainContent: { 
    background: '#fff', 
    borderRadius: 8, 
    padding: 20, 
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)' 
  },
  accessMessage: { 
    padding: 20, 
    background: '#fff3f3', 
    borderRadius: 8, 
    color: '#c53030' 
  }
};

export default function CATsPage() {
  const { user, isGestor, isSesmit, isColaborador } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState('lista');
  const [catSelecionada, setCatSelecionada] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { criar, atualizar, gerarPDF } = useCATs();

  const temAcessoCompleto = isGestor || isSesmit;

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: '🏠', active: location.pathname === '/dashboard' },
    { key: 'exames', label: 'Exames', to: '/exames', icon: '📋', active: location.pathname === '/exames' },
    { key: 'cats', label: 'CATs', to: '/cats', icon: '🚨', active: location.pathname === '/cats' },
    { key: 'colaboradores', label: 'Colaboradores', to: '/colaboradores', icon: '👥', active: location.pathname === '/colaboradores' },
  ];

  const handleSubmit = async (formData) => {
    try {
      if (modoEdicao && catSelecionada) {
        await atualizar(catSelecionada.id, formData);
      } else {
        await criar(formData);
      }
      
      setAbaAtiva('lista');
      setModoEdicao(false);
      setCatSelecionada(null);
    } catch (err) {
      alert('Erro ao salvar CAT: ' + err.message);
    }
  };

  const handleEditar = (cat) => {
    setCatSelecionada(cat);
    setModoEdicao(true);
    setAbaAtiva('formulario');
  };

  const handleVerDetalhes = (cat) => {
    setCatSelecionada(cat);
    setMostrarDetalhes(true);
  };

  const handleGerarPDF = async (cat) => {
    try {
      await gerarPDF(cat.id);
    } catch (err) {
      alert('Erro ao gerar PDF: ' + err.message);
    }
  };

  const handleNovo = () => {
    setCatSelecionada(null);
    setModoEdicao(false);
    setAbaAtiva('formulario');
  };

  const handleCancelar = () => {
    setAbaAtiva('lista');
    setCatSelecionada(null);
    setModoEdicao(false);
  };

  return (
    <Layout user={user} navItems={navItems} onNavigate={(to) => navigate(to)}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <header style={styles.header}>
          <h1 style={styles.title}>Comunicações de Acidente de Trabalho (CATs)</h1>
          <div style={styles.userInfo}>
            <span>Olá, <strong>{user?.nome}</strong></span>
            <span style={{ background: '#e9ecef', padding: '4px 8px', borderRadius: 8 }}>
              {user?.perfil}
            </span>
          </div>
        </header>

        <div style={styles.container}>
          <nav style={styles.nav}>
            <button 
              style={styles.navButton(abaAtiva === 'lista')} 
              onClick={() => setAbaAtiva('lista')}
            >
              Lista de CATs
            </button>

            {temAcessoCompleto && (
              <button 
                style={styles.navButton(abaAtiva === 'formulario')} 
                onClick={handleNovo}
              >
                {modoEdicao ? 'Editar CAT' : 'Nova CAT'}
              </button>
            )}
          </nav>

          <main style={styles.mainContent}>
            {abaAtiva === 'lista' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h2>Lista de CATs</h2>
                  {temAcessoCompleto && (
                    <Button variant="primary" onClick={handleNovo}>
                      + Nova CAT
                    </Button>
                  )}
                </div>
                <ListaCATs 
                  onEditar={handleEditar}
                  onVerDetalhes={handleVerDetalhes}
                />
              </div>
            )}

            {abaAtiva === 'formulario' && temAcessoCompleto && (
              <div>
                <h2>{modoEdicao ? 'Editar CAT' : 'Nova Comunicação de Acidente'}</h2>
                <FormCAT
                  cat={catSelecionada}
                  onSubmit={handleSubmit}
                  onCancel={handleCancelar}
                />
              </div>
            )}

            {isColaborador && abaAtiva !== 'lista' && (
              <div style={styles.accessMessage}>
                <h3>❌ Acesso Restrito</h3>
                <p>Esta funcionalidade está disponível apenas para SESMIT e Gestores.</p>
              </div>
            )}
          </main>
        </div>

        {mostrarDetalhes && (
          <ModalDetalhesCAT
            cat={catSelecionada}
            onClose={() => setMostrarDetalhes(false)}
            onEditar={() => {
              setMostrarDetalhes(false);
              handleEditar(catSelecionada);
            }}
            onGerarPDF={() => handleGerarPDF(catSelecionada)}
          />
        )}
      </div>
    </Layout>
  );
}