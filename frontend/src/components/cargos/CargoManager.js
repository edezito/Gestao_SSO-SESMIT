// src/components/cargos/CargoManager.js
import React, { useState, useEffect } from 'react';
import CargoList from './CargoList';
import CargoForm from './CargoForm';
import CargoEdit from './CargoEdit';

const styles = {
  cargoManager: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #e9ecef',
  },
  title: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  primaryButton: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  primaryButtonHover: {
    backgroundColor: '#2980b9',
  },
  errorAlert: {
    background: '#fee',
    border: '1px solid #f5c6cb',
    color: '#721c24',
    padding: '1rem',
    margin: '0 2rem',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeError: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#721c24',
    padding: '0.25rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  closeErrorHover: {
    backgroundColor: '#f8d7da',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    color: '#6c757d',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  spinner: {
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  loadingText: {
    margin: 0,
    fontSize: '0.9rem',
  },
};

// CSS animation for spinner
const spinnerStyle = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Button = ({ children, style, hoverStyle, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        ...style,
        ...(isHovered ? hoverStyle : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
};

export default function CargoManager() {
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCargo, setEditingCargo] = useState(null);
  const [error, setError] = useState('');

  // Add spinner styles to document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = spinnerStyle;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const fetchCargos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // ✅ CORREÇÃO: Adicione /api/ na URL
      const response = await fetch('http://localhost:5000/api/cargos/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erro ao carregar cargos');
      
      const data = await response.json();
      setCargos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCargos();
  }, []);

  const handleCreateCargo = async (cargoData) => {
    try {
      const token = localStorage.getItem('token');
      
      // ✅ CORREÇÃO: Adicione /api/ na URL
      const response = await fetch('http://localhost:5000/api/cargos/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cargoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao criar cargo');
      }

      await fetchCargos();
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateCargo = async (cargoId, cargoData) => {
    try {
      const token = localStorage.getItem('token');
      
      // ✅ CORREÇÃO: Adicione /api/ na URL
      const response = await fetch(`http://localhost:5000/api/cargos/${cargoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cargoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao atualizar cargo');
      }

      await fetchCargos();
      setEditingCargo(null);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCargo = async (cargoId) => {
    if (!window.confirm('Tem certeza que deseja deletar este cargo?')) return;

    try {
      const token = localStorage.getItem('token');
      
      // ✅ CORREÇÃO: Adicione /api/ na URL
      const response = await fetch(`http://localhost:5000/api/cargos/${cargoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao deletar cargo');
      }

      await fetchCargos();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Carregando cargos...</p>
      </div>
    );
  }

  return (
    <div style={styles.cargoManager}>
      <div style={styles.header}>
        <h2 style={styles.title}>Gestão de Cargos</h2>
        <Button
          style={styles.primaryButton}
          hoverStyle={styles.primaryButtonHover}
          onClick={() => setShowForm(true)}
        >
          ➕ Novo Cargo
        </Button>
      </div>

      {error && (
        <div style={styles.errorAlert}>
          <span>❌ {error}</span>
          <Button
            style={styles.closeError}
            hoverStyle={styles.closeErrorHover}
            onClick={() => setError('')}
          >
            ×
          </Button>
        </div>
      )}

      {showForm && (
        <CargoForm
          onSubmit={handleCreateCargo}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingCargo && (
        <CargoEdit
          cargo={editingCargo}
          onSubmit={handleUpdateCargo}
          onCancel={() => setEditingCargo(null)}
        />
      )}

      <CargoList
        cargos={cargos}
        onEdit={setEditingCargo}
        onDelete={handleDeleteCargo}
      />
    </div>
  );
}