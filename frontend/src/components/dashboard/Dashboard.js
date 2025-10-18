import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // 1. Importe o hook
import Header from '../layout/Header';
import Navigation from '../layout/Navigation';
import Container from '../layout/Container';
import ListaColaboradoresExames from './ListaColaboradoresExames';
import AgendarExame from './AgendarExame';
import CargoForm from '../gestao/CargoForm';
import CargoList from '../gestao/CargoList';
import { responsiveStyles } from '../../styles/responsive';

function Dashboard({ onLogout }) {
  const [telaAtiva, setTelaAtiva] = useState('lista');
  const { perfil } = useAuth(); // 2. Obtenha o perfil diretamente do contexto

  // 3. REMOVA o useState de 'perfilUsuario' e o useEffect. Não são mais necessários.

  const renderTelaConteudo = () => {
    switch (telaAtiva) {
      case 'lista':
        return <ListaColaboradoresExames />;
      case 'agendar':
        return <AgendarExame />;
      case 'cargos':
        return (
          <div style={styles.gestaoContainer}>
            <CargoForm />
            <CargoList />
          </div>
        );
      default:
        return <ListaColaboradoresExames />;
    }
  };

  return (
    <div>
      {/* 4. Passe o perfil do contexto diretamente para o Header */}
      <Header perfilUsuario={perfil} onLogout={onLogout} />
      
      <Container>
        {/* 5. O Navigation agora também usará o contexto internamente */}
        <Navigation 
          telaAtiva={telaAtiva} 
          setTelaAtiva={setTelaAtiva}
        />
        
        <main style={responsiveStyles.mainContent}>
          {renderTelaConteudo()}
        </main>
      </Container>
    </div>
  );
}

const styles = {
  gestaoContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    [`@media (max-width: 768px)`]: {
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
  },
};

export default Dashboard;