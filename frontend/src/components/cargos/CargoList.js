// src/components/cargos/CargoList.js
import React, { useState } from 'react';

const styles = {
  cargoList: {
    padding: 0,
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#495057',
    borderBottom: '2px solid #dee2e6',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableCell: {
    padding: '1rem',
    borderBottom: '1px solid #e9ecef',
    verticalAlign: 'top',
  },
  tableRow: {
    transition: 'background-color 0.2s ease',
  },
  tableRowHover: {
    backgroundColor: '#f8f9fa',
  },
  cargoName: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  noDescription: {
    color: '#6c757d',
    fontStyle: 'italic',
    fontSize: '0.9rem',
  },
  badge: {
    background: '#e9ecef',
    color: '#495057',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
    display: 'inline-block',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
    fontSize: '1rem',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
    fontSize: '1rem',
  },
  editButtonHover: {
    backgroundColor: '#d4edda',
  },
  deleteButtonHover: {
    backgroundColor: '#f8d7da',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6c757d',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    opacity: 0.5,
  },
  emptyTitle: {
    margin: '0 0 0.5rem 0',
    color: '#495057',
  },
  emptyText: {
    margin: 0,
    fontSize: '0.9rem',
  },
};

const ActionButton = ({ children, style, hoverStyle, title, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        ...style,
        ...(isHovered ? hoverStyle : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
};

const TableRow = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <tr
      style={{
        ...styles.tableRow,
        ...(isHovered ? styles.tableRowHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </tr>
  );
};

export default function CargoList({ cargos, onEdit, onDelete }) {
  if (cargos.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>🏢</div>
        <h3 style={styles.emptyTitle}>Nenhum cargo cadastrado</h3>
        <p style={styles.emptyText}>Comece criando o primeiro cargo da sua organização.</p>
      </div>
    );
  }

  return (
    <div style={styles.cargoList}>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Nome</th>
              <th style={styles.tableHeader}>Descrição</th>
              <th style={styles.tableHeader}>Riscos Associados</th>
              <th style={styles.tableHeader}>Exames Exigidos</th>
              <th style={styles.tableHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cargos.map((cargo) => (
              <TableRow key={cargo.id}>
                <td style={styles.tableCell}>
                  <strong style={styles.cargoName}>{cargo.nome}</strong>
                </td>
                <td style={styles.tableCell}>
                  {cargo.descricao || (
                    <span style={styles.noDescription}>Sem descrição</span>
                  )}
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.badge}>
                    {cargo.riscos_associados?.length || 0} riscos
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.badge}>
                    {cargo.exames_exigidos?.length || 0} exames
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.actions}>
                    <ActionButton
                      style={styles.editButton}
                      hoverStyle={styles.editButtonHover}
                      title="Editar cargo"
                      onClick={() => onEdit(cargo)}
                    >
                      ✏️
                    </ActionButton>
                    <ActionButton
                      style={styles.deleteButton}
                      hoverStyle={styles.deleteButtonHover}
                      title="Deletar cargo"
                      onClick={() => onDelete(cargo.id)}
                    >
                      🗑️
                    </ActionButton>
                  </div>
                </td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}