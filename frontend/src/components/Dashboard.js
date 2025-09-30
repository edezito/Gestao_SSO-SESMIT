import React, { useState } from 'react';
import ListaColaboradoresExames from './ListaColaboradoresExames';
import AgendarExame from './AgendarExame';

function Dashboard({ token, onLogout }) {
  const [telaAtiva, setTelaAtiva] = useState('lista');

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>Painel de Gestão SSO</h1>
        <div style={styles.nav}>
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
        </div>
        <button style={styles.logoutButton} onClick={onLogout}>
          Sair
        </button>
      </header>

      <main style={styles.mainContent}>
        {telaAtiva === 'lista' && <ListaColaboradoresExames token={token} />}
        {telaAtiva === 'agendar' && <AgendarExame token={token} />}
      </main>
    </div>
  );
}

const styles = {
    dashboardContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.07)',
        padding: '25px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #ddd',
        paddingBottom: '20px',
        marginBottom: '20px',
    },
    title: {
        color: '#333',
        margin: 0,
    },
    nav: {
        display: 'flex',
        gap: '15px',
    },
    navButton: {
        padding: '10px 15px',
        fontSize: '15px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    navButtonActive: {
        padding: '10px 15px',
        fontSize: '15px',
        border: '1px solid #007bff',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    logoutButton: {
        padding: '10px 15px',
        fontSize: '15px',
        border: 'none',
        backgroundColor: '#dc3545',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    mainContent: {
        padding: '10px 0',
    },
};

export default Dashboard;
