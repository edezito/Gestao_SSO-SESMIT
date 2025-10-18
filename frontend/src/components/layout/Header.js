import React from 'react';
import { responsiveStyles } from '../../styles/responsive';

function Header({ perfilUsuario, onLogout }) {
  return (
    <header style={responsiveStyles.header}>
      <h1 style={responsiveStyles.headerTitle}>
        Sistema de Gestão SSO (Perfil: {perfilUsuario})
      </h1>
      <button 
        style={responsiveStyles.logoutButton} 
        onClick={onLogout}
      >
        Sair
      </button>
    </header>
  );
}

export default Header;