import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Importe o hook para pegar o perfil
import { responsiveStyles } from '../../styles/responsive';

function Navigation({ telaAtiva, setTelaAtiva }) {
  // Pega o perfil do usuário logado diretamente do contexto
  const { perfil } = useAuth(); 

  // A lógica de permissão fica dentro do componente
  const podeGerenciar = perfil === 'SESMIT' || perfil === 'GESTOR';

  return (
    <nav style={responsiveStyles.nav}>
      {/* Este botão pode ser visível para todos */}
      <button
        style={ telaAtiva === "lista" ? responsiveStyles.navButtonActive : responsiveStyles.navButton }
        onClick={() => setTelaAtiva("lista")}
      >
        Lista de Exames
      </button>

      {/* ✅ ESTE BLOCO SÓ SERÁ RENDERIZADO SE 'podeGerenciar' for true */}
      {podeGerenciar && (
        <>
          <button
            style={ telaAtiva === "agendar" ? responsiveStyles.navButtonActive : responsiveStyles.navButton }
            onClick={() => setTelaAtiva("agendar")}
          >
            Agendar Exame
          </button>
          
          <button
            style={ telaAtiva === "cargos" ? responsiveStyles.navButtonActive : responsiveStyles.navButton }
            onClick={() => setTelaAtiva("cargos")}
          >
            Gerenciar Cargos
          </button>
        </>
      )}
    </nav>
  );
}

export default Navigation;