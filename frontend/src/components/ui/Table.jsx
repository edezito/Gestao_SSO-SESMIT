import React from 'react';
import { theme } from '../../styles/theme';

export function Table({ 
  columns = [], 
  data = [], 
  loading = false,
  emptyMessage = "Nenhum registro encontrado",
  ...props 
}) {
  return (
    <div style={{ 
      overflowX: 'auto',
      borderRadius: theme.radii.md,
      border: `1px solid ${theme.colors.border}`,
      background: theme.colors.white
    }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        minWidth: 600 
      }}>
        <thead>
          <tr style={{
            backgroundColor: theme.colors.bg
          }}>
            {columns.map((column) => (
              <th 
                key={column.key || column.dataIndex} 
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  borderBottom: `2px solid ${theme.colors.border}`,
                  color: theme.colors.muted,
                  fontSize: '13px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: theme.colors.muted 
              }}>
                Carregando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: theme.colors.muted 
              }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex}
                style={{ 
                  borderBottom: `1px solid ${theme.colors.border}`,
                  backgroundColor: rowIndex % 2 === 0 ? theme.colors.white : theme.colors.bg,
                  '&:hover': {
                    backgroundColor: `${theme.colors.primary}08`
                  }
                }}
              >
                {columns.map((column) => (
                  <td 
                    key={column.key || column.dataIndex} 
                    style={{ 
                      padding: '12px 16px', 
                      borderBottom: `1px solid ${theme.colors.border}`, 
                      color: theme.colors.text,
                      fontSize: '14px'
                    }}
                  >
                    {column.render ? column.render(row[column.dataIndex], row, rowIndex) : row[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;