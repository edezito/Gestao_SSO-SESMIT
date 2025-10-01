import React, { useState } from 'react';
import ListaColaboradoresExames from '../../components/dashboard/ListaColaboradoresExames';
import AgendarExame from '../../components/dashboard/AgendarExame';
import styles from './DashboardPage.module.css';

export default function DashboardPage({ token, onLogout }) {
  const [telaAtiva, setTelaAtiva] = useState('lista');

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Sistema de Gestão SSO</h1>
        <button className={styles.logoutButton} onClick={onLogout}>
          Sair
        </button>
      </header>

      <div className={styles.dashboardContainer}>
        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${telaAtiva === 'lista' ? styles.navButtonActive : ''}`}
            onClick={() => setTelaAtiva('lista')}
          >
            Colaboradores e Exames
          </button>
          <button
            className={`${styles.navButton} ${telaAtiva === 'agendar' ? styles.navButtonActive : ''}`}
            onClick={() => setTelaAtiva('agendar')}
          >
            Agendar Novo Exame
          </button>
        </nav>

        <main className={styles.mainContent}>
          {telaAtiva === 'lista' && <ListaColaboradoresExames token={token} />}
          {telaAtiva === 'agendar' && <AgendarExame token={token} />}
        </main>
      </div>
    </div>
  );
}