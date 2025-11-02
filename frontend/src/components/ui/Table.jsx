import React from 'react';
import { theme } from '../../styles/theme';

export function Table({ columns = [], data = [] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderBottom: `1px solid ${theme.colors.border}`,
                color: theme.colors.muted,
                fontSize: 13,
                fontWeight: 700
              }}>{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: 28, textAlign: 'center', color: theme.colors.muted }}>
                Nenhum registro encontrado
              </td>
            </tr>
          )}
          {data.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : '#fbfdff' }}>
              {columns.map((c) => (
                <td key={c.key} style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.text }}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
