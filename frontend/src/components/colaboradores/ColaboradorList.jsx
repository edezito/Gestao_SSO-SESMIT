// src/components/colaboradores/ColaboradorList.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';   
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../styles/theme';

// Fallback seguro para valores do tema
const getTypographyValue = (path, fallback) => {
  try {
    const keys = path.split('.');
    let value = TYPOGRAPHY;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return fallback;
    }
    return value;
  } catch {
    return fallback;
  }
};

const styles = {
  tableContainer: {
    overflowX: 'auto',
    borderRadius: BORDER_RADIUS?.md || '12px',
    border: `1px solid ${COLORS?.border || '#E6E9EE'}`,
    backgroundColor: COLORS?.card || '#FFFFFF',
    boxShadow: SHADOWS?.sm || '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: getTypographyValue('body.fontSize', '14px'),
    lineHeight: getTypographyValue('body.lineHeight', 1.5),
    fontFamily: getTypographyValue('fontFamily', "'Inter', sans-serif"),
  },
  tableHeader: {
    backgroundColor: COLORS?.bg || '#F7FAFC',
    padding: `${SPACING?.md || '16px'} ${SPACING?.lg || '24px'}`,
    textAlign: 'left',
    fontWeight: getTypographyValue('fontWeight.semibold', 600),
    color: COLORS?.textPrimary || COLORS?.text || '#0F172A',
    borderBottom: `2px solid ${COLORS?.border || '#E6E9EE'}`,
    fontSize: getTypographyValue('small.fontSize', '12px'),
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  tableCell: {
    padding: `${SPACING?.md || '16px'} ${SPACING?.lg || '24px'}`,
    borderBottom: `1px solid ${COLORS?.border || '#E6E9EE'}`,
    verticalAlign: 'middle',
  },
  tableRow: {
    transition: 'background-color 0.2s ease',
  },
  tableRowHover: {
    backgroundColor: COLORS?.bg || '#F7FAFC',
  },
  actions: {
    display: 'flex',
    gap: SPACING?.sm || '8px',
  },
  name: {
    fontWeight: getTypographyValue('heading.h3.fontWeight', getTypographyValue('fontWeight.semibold', 600)),
    color: COLORS?.textPrimary || COLORS?.text || '#0F172A',
  },
  emptyState: {
    textAlign: 'center',
    padding: SPACING?.xxl || '48px',
    color: COLORS?.textSecondary || '#64748B',
    backgroundColor: COLORS?.card || '#FFFFFF',
    borderRadius: BORDER_RADIUS?.md || '12px',
    border: `1px solid ${COLORS?.border || '#E6E9EE'}`,
    marginTop: SPACING?.lg || '24px',
    boxShadow: SHADOWS?.sm || '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  emptyStateIcon: {
    fontSize: '4rem',
    marginBottom: SPACING?.md || '16px',
    color: COLORS?.muted || '#6B7280',
  },
  emptyStateTitle: {
    fontSize: getTypographyValue('heading.h3.fontSize', '20px'),
    fontWeight: getTypographyValue('heading.h3.fontWeight', getTypographyValue('fontWeight.semibold', 600)),
    color: COLORS?.textPrimary || COLORS?.text || '#0F172A',
    marginBottom: SPACING?.sm || '8px',
    marginTop: 0,
  },
  emptyStateText: {
    fontSize: getTypographyValue('body.fontSize', '14px'),
    lineHeight: getTypographyValue('body.lineHeight', 1.5),
    color: COLORS?.textSecondary || '#64748B',
    margin: 0,
  },
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

const getProfileBadgeType = (perfil) => {
  switch (perfil?.toUpperCase()) {
    case 'GESTOR': return 'success';
    case 'SESMIT': return 'info';
    case 'COLABORADOR': return 'secondary';
    default: return 'secondary';
  }
};

export default function ColaboradorList({ colaboradores, onEdit, onDelete, canEdit, loading }) {
  
  // Se estiver carregando e não houver dados
  if (loading && colaboradores.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyStateIcon}>⏳</div>
        <h3 style={styles.emptyStateTitle}>
          Carregando colaboradores...
        </h3>
        <p style={styles.emptyStateText}>
          Aguarde enquanto buscamos as informações.
        </p>
      </div>
    );
  }
  
  // Se não estiver carregando e não houver dados
  if (colaboradores.length === 0 && !loading) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyStateIcon}>👥</div>
        <h3 style={styles.emptyStateTitle}>
          Nenhum colaborador cadastrado
        </h3>
        <p style={styles.emptyStateText}>
          {canEdit 
            ? 'Use o botão "Novo Colaborador" para começar o gerenciamento.'
            : 'Não há colaboradores cadastrados no sistema no momento.'
          }
        </p>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Nome</th>
            <th style={styles.tableHeader}>E-mail</th>
            <th style={styles.tableHeader}>Perfil</th>
            <th style={styles.tableHeader}>Cargo</th>
            <th style={styles.tableHeader}>Status</th>
            {canEdit && <th style={styles.tableHeader}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {colaboradores.map((colaborador) => (
            <TableRow key={colaborador.id || colaborador.cpf || Math.random()}>
              <td style={styles.tableCell}>
                <span style={styles.name}>{colaborador.nome || 'Nome não informado'}</span>
              </td>
              <td style={styles.tableCell}>{colaborador.email || 'Email não informado'}</td>
              <td style={styles.tableCell}>
                <Badge type={getProfileBadgeType(colaborador.perfil)}>
                  {colaborador.perfil || 'COLABORADOR'}
                </Badge>
              </td>
              <td style={styles.tableCell}>
                {colaborador.cargo || colaborador.cargo_nome || "Não Atribuído"}
              </td>
              <td style={styles.tableCell}>
                <Badge type={colaborador.ativo ? 'success' : 'danger'}>
                  {colaborador.ativo ? 'ATIVO' : 'INATIVO'}
                </Badge>
              </td>
              {canEdit && (
                <td style={styles.tableCell}>
                  <div style={styles.actions}>
                    <Button
                      variant="warning"
                      onClick={() => onEdit(colaborador)}
                      title="Editar colaborador"
                      disabled={loading}
                      style={{ padding: '8px 12px' }}
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => onDelete(colaborador.id)}
                      title="Inativar colaborador"
                      disabled={loading || !colaborador.ativo}
                      style={{ padding: '8px 12px' }}
                    >
                      🗑️
                    </Button>
                  </div>
                </td>
              )}
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}