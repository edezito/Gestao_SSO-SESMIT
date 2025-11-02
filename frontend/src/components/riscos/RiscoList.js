import React from 'react';

const styles = {
  container: {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  title: {
    marginBottom: '20px',
    color: '#333',
    borderBottom: '2px solid #28a745',
    paddingBottom: '10px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#6c757d'
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    marginBottom: '15px',
    transition: 'all 0.3s'
  },
  listItemHover: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderColor: '#007bff'
  },
  itemInfo: {
    flex: 1
  },
  itemTitle: {
    margin: '0 0 8px 0',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600'
  },
  badgeInactive: {
    background: '#6c757d',
    color: 'white'
  },
  itemDescription: {
    margin: '0 0 10px 0',
    color: '#6c757d',
    lineHeight: '1.4'
  },
  itemMeta: {
    display: 'flex',
    gap: '15px',
    fontSize: '12px',
    color: '#868e96'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  itemActions: {
    display: 'flex',
    gap: '8px'
  },
  button: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s'
  },
  buttonOutline: {
    background: 'transparent',
    border: '1px solid #007bff',
    color: '#007bff'
  },
  buttonDanger: {
    background: '#dc3545',
    color: 'white'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  }
};

const RiscoList = ({ riscos, onEdit, onDelete, loading }) => {
  if (loading && riscos.length === 0) {
    return <div style={styles.loading}>Carregando riscos...</div>;
  }

  if (riscos.length === 0) {
    return (
      <div style={styles.emptyState}>
        <h3>Nenhum risco cadastrado</h3>
        <p>Clique em "Novo Risco" para começar.</p>
      </div>
    );
  }

  const getButtonStyle = (type = 'outline') => {
    const baseStyle = {
      ...styles.button,
      ...(loading ? styles.buttonDisabled : {})
    };

    if (type === 'danger') {
      return { ...baseStyle, ...styles.buttonDanger };
    }
    return { ...baseStyle, ...styles.buttonOutline };
  };

  const getListItemStyle = () => {
    return {
      ...styles.listItem,
      ...(!loading ? { ':hover': styles.listItemHover } : {})
    };
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Riscos Cadastrados</h3>
      
      <div>
        {riscos.map((risco) => (
          <div 
            key={risco.id} 
            style={getListItemStyle()}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = styles.listItemHover.boxShadow;
                e.currentTarget.style.borderColor = styles.listItemHover.borderColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e9ecef';
              }
            }}
          >
            <div style={styles.itemInfo}>
              <h4 style={styles.itemTitle}>
                {risco.nome}
                {!risco.ativo && (
                  <span style={{...styles.badge, ...styles.badgeInactive}}>Inativo</span>
                )}
              </h4>
              {risco.descricao && (
                <p style={styles.itemDescription}>{risco.descricao}</p>
              )}
              <div style={styles.itemMeta}>
                <span style={styles.metaItem}>
                  Exames obrigatórios: {risco.exames_obrigatorios?.length || 0}
                </span>
              </div>
            </div>
            
            <div style={styles.itemActions}>
              <button
                onClick={() => onEdit(risco)}
                style={getButtonStyle('outline')}
                disabled={loading}
                title="Editar risco"
              >
                ✏️
              </button>
              
              {risco.ativo && (
                <button
                  onClick={() => onDelete(risco.id)}
                  style={getButtonStyle('danger')}
                  disabled={loading}
                  title="Inativar risco"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiscoList;