export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  large: '1200px'
};

export const responsiveStyles = {
  // Layout principal
  wrapper: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#f4f4f4',
    fontFamily: "'Segoe UI', sans-serif",
  },

  authWrapper: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: '20px',
    boxSizing: 'border-box',
  },

  authContainer: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
    [`@media (max-width: ${breakpoints.tablet})`]: {
      padding: '30px 20px',
      margin: '10px',
    },
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '20px 15px',
    },
  },

  // Header
  header: {
    width: '100%',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    boxSizing: 'border-box',
    [`@media (max-width: ${breakpoints.tablet})`]: {
      padding: '15px 20px',
      flexDirection: 'column',
      gap: '15px',
    },
  },

  headerTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 'bold',
    [`@media (max-width: ${breakpoints.mobile})`]: {
      fontSize: '18px',
      textAlign: 'center',
    },
  },

  // Botão de logout
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#c82333',
    },
    [`@media (max-width: ${breakpoints.tablet})`]: {
      padding: '8px 16px',
      fontSize: '13px',
    },
  },

  // Container principal
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '30px 20px',
    backgroundColor: '#fdfdfd',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    [`@media (max-width: ${breakpoints.tablet})`]: {
      margin: '20px auto',
      padding: '20px 15px',
    },
    [`@media (max-width: ${breakpoints.mobile})`]: {
      margin: '10px auto',
      padding: '15px 10px',
    },
  },

  // Conteúdo principal
  mainContent: {
    padding: '10px',
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '5px',
    },
  },

  // Navegação
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    [`@media (max-width: ${breakpoints.tablet})`]: {
      gap: '10px',
      marginBottom: '20px',
    },
  },

  navButton: {
    padding: '12px 24px',
    fontSize: '15px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '140px',
    fontWeight: '500',
    '&:hover:not(:disabled)': {
      backgroundColor: '#f8f9fa',
      borderColor: '#007bff',
    },
    [`@media (max-width: ${breakpoints.tablet})`]: {
      padding: '10px 16px',
      minWidth: '120px',
      fontSize: '14px',
    },
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '8px 12px',
      minWidth: '100px',
      fontSize: '13px',
    },
  },

  navButtonActive: {
    padding: '12px 24px',
    fontSize: '15px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    minWidth: '140px',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: '#0056b3',
      borderColor: '#0056b3',
    },
    [`@media (max-width: ${breakpoints.tablet})`]: {
      padding: '10px 16px',
      minWidth: '120px',
      fontSize: '14px',
    },
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '8px 12px',
      minWidth: '100px',
      fontSize: '13px',
    },
  },

  // Título
  title: {
    textAlign: 'center',
    color: '#007bff',
    fontSize: '24px',
    marginBottom: '25px',
    fontWeight: '600',
    [`@media (max-width: ${breakpoints.tablet})`]: {
      fontSize: '20px',
      marginBottom: '20px',
    },
  },

  // Container de formulário
  formContainer: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08)',
    maxWidth: '600px',
    margin: '0 auto',
    [`@media (max-width: ${breakpoints.tablet})`]: {
      padding: '20px',
      margin: '0 10px',
    },
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '15px',
    },
  },

  // Formulários
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },

  label: {
    marginBottom: '6px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
  },

  input: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: '#fefefe',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    '&:focus': {
      outline: 'none',
      borderColor: '#007bff',
      boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)',
    },
    '&:disabled': {
      backgroundColor: '#e9ecef',
      cursor: 'not-allowed',
    },
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '10px',
      fontSize: '14px',
    },
  },

  select: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: '#fefefe',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    '&:focus': {
      outline: 'none',
      borderColor: '#007bff',
      boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)',
    },
    '&:disabled': {
      backgroundColor: '#e9ecef',
      cursor: 'not-allowed',
    },
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '10px',
      fontSize: '14px',
    },
  },

  button: {
    padding: '14px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    fontWeight: 'bold',
    '&:hover:not(:disabled)': {
      backgroundColor: '#45a049',
      transform: 'translateY(-1px)',
    },
    '&:active:not(:disabled)': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      backgroundColor: '#6c757d',
      cursor: 'not-allowed',
      opacity: 0.6,
      transform: 'none',
    },
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '12px',
      fontSize: '14px',
    },
  },

  // Tabelas
  tableContainer: {
    overflowX: 'auto',
    marginTop: '20px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
    backgroundColor: '#fff',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },

  th: {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #dee2e6',
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057',
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '8px',
      fontSize: '12px',
    },
  },

  td: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #dee2e6',
    fontSize: '14px',
    color: '#212529',
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '8px',
      fontSize: '12px',
    },
  },

  // Toggle buttons para login/cadastro
  toggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '25px',
    gap: '10px',
    [`@media (max-width: ${breakpoints.mobile})`]: {
      marginBottom: '20px',
    },
  },

  toggleButton: {
    padding: '12px 24px',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flex: 1,
    fontWeight: '500',
    '&:hover:not(:disabled)': {
      backgroundColor: '#e0e0e0',
    },
    '&:disabled': {
      cursor: 'default',
    },
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '10px 16px',
      fontSize: '14px',
    },
  },

  activeButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderColor: '#007bff',
    cursor: 'default',
    '&:hover': {
      backgroundColor: '#007bff',
    },
  },

  // Mensagens
  messageSuccess: {
    marginTop: '20px',
    color: '#155724',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '12px 15px',
    borderRadius: '5px',
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    fontSize: '14px',
    [`@media (max-width: ${breakpoints.mobile})`]: {
      marginTop: '15px',
      padding: '10px 12px',
      fontSize: '13px',
    },
  },

  messageError: {
    marginTop: '20px',
    color: '#721c24',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '12px 15px',
    borderRadius: '5px',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    fontSize: '14px',
    [`@media (max-width: ${breakpoints.mobile})`]: {
      marginTop: '15px',
      padding: '10px 12px',
      fontSize: '13px',
    },
  },

  // Textarea (para o CargoForm)
  textarea: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: '#fefefe',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: "'Segoe UI', sans-serif",
    transition: 'border-color 0.3s, box-shadow 0.3s',
    '&:focus': {
      outline: 'none',
      borderColor: '#007bff',
      boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)',
    },
    '&:disabled': {
      backgroundColor: '#e9ecef',
      cursor: 'not-allowed',
    },
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '10px',
      fontSize: '14px',
      minHeight: '80px',
    },
  },

  // Estados de loading
  loadingContainer: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    margin: '20px 0',
  },

  loadingText: {
    fontStyle: 'italic',
    color: '#6c757d',
    fontSize: '16px',
    margin: 0,
  },

  // Estados vazios
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    color: '#6c757d',
    margin: '20px 0',
    fontSize: '16px',
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: '30px 15px',
      fontSize: '14px',
    },
  },

  // Badges e tags
  badge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase',
  },

  badgeSuccess: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },

  badgeWarning: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },

  badgeDanger: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },

  badgeInfo: {
    backgroundColor: '#cce7ff',
    color: '#004085',
  },
};

// Funções auxiliares para estilos dinâmicos
export const getStatusBadgeStyle = (status) => {
  const baseStyle = responsiveStyles.badge;
  
  switch (status?.toUpperCase()) {
    case 'REALIZADO':
    case 'SUCESSO':
    case 'ATIVO':
      return { ...baseStyle, ...responsiveStyles.badgeSuccess };
    case 'PENDENTE':
    case 'EM_ANDAMENTO':
      return { ...baseStyle, ...responsiveStyles.badgeWarning };
    case 'VENCIDO':
    case 'CANCELADO':
    case 'INATIVO':
      return { ...baseStyle, ...responsiveStyles.badgeDanger };
    default:
      return { ...baseStyle, ...responsiveStyles.badgeInfo };
  }
};