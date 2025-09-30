import React, { useState } from 'react';
import ListaColaboradoresExames from './ListaColaboradoresExames';
import AgendarExame from './AgendarExame';

function Dashboard({ token, onLogout }) {
  const [telaAtiva, setTelaAtiva] = useState('lista');

  return (
    <div>
      <header style={styles.header}>
        <h1 style={styles.title}>Sistema de Gestão SSO</h1>
        <button style={styles.logoutButton} onClick={onLogout}>
          Sair
        </button>
      </header>

      {/* CONTEÚDO CENTRALIZADO */}
      <div style={styles.dashboardContainer}>
        {/* NAVEGAÇÃO ENTRE TELAS */}
        <nav style={styles.nav}>
          <button
            style={telaAtiva === 'lista' ? styles.navButtonActive : styles.navButton}
            onClick={() => setTelaAtiva('lista')}
          >
            Colaboradores e Exames
          </button>
          <button
            style={telaAtiva === 'agendar' ? styles.navButtonActive : styles.navButton}
            onClick={() => setTelaAtiva('agendar')}
          >
            Agendar Novo Exame
          </button>
        </nav>

        {/* CONTEÚDO PRINCIPAL */}
        <main style={styles.mainContent}>
          {telaAtiva === 'lista' && <ListaColaboradoresExames token={token} />}
          {telaAtiva === 'agendar' && <AgendarExame token={token} />}
        </main>
      </div>
    </div>
  );
}

const styles = {
  header: {
    width: '100vw',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    boxSizing: 'border-box',
  },

  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 'bold',
  },

  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },

  dashboardContainer: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '30px 20px',
    backgroundColor: '#fdfdfd',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },

  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
  },

  navButton: {
    padding: '10px 20px',
    fontSize: '15px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  navButtonActive: {
    padding: '10px 20px',
    fontSize: '15px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
  },

  mainContent: {
    padding: '10px',
  },
};

export default Dashboard;
