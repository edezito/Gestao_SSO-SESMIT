import React from 'react';
import { responsiveStyles } from '../../styles/responsive';

/**
 * Container responsivo para envolver o conteúdo das páginas
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Conteúdo a ser renderizado dentro do container
 * @param {string} props.className - Classes CSS adicionais
 * @param {Object} props.style - Estilos inline adicionais
 * @param {boolean} props.fluid - Se true, o container ocupa 100% da largura
 * @param {string} props.maxWidth - Largura máxima personalizada
 */
function Container({ 
  children, 
  className = '', 
  style = {}, 
  fluid = false,
  maxWidth 
}) {
  const containerStyles = fluid 
    ? { 
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box'
      }
    : {
        ...responsiveStyles.container,
        ...(maxWidth && { maxWidth }),
        ...style
      };

  return (
    <div 
      style={containerStyles}
      className={className}
    >
      {children}
    </div>
  );
}

export default Container;