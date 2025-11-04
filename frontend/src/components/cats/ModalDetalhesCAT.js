// src/components/cats/ModalDetalhesCAT.js
import React from 'react';
import { Button } from '../ui/Button';
import modalStyles from '../../styles/Modal.module.css';

export default function ModalDetalhesCAT({ cat, onClose, onEditar, onGerarPDF }) {
  if (!cat) return null;

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modal} style={{ maxWidth: 800 }}>
        <div className={modalStyles.header}>
          <h2 className={modalStyles.title}>
            CAT #{cat.id} - Detalhes do Acidente
          </h2>
          <button className={modalStyles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={modalStyles.content}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Informações Gerais</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <strong>Colaborador:</strong> {cat.colaborador?.nome || 'N/A'}
                </div>
                <div>
                  <strong>Cargo:</strong> {cat.cargo?.nome || 'N/A'}
                </div>
                <div>
                  <strong>Data do Acidente:</strong> {cat.data_acidente ? 
                    new Date(cat.data_acidente).toLocaleString('pt-BR') : '---'
                  }
                </div>
                <div>
                  <strong>Local:</strong> {cat.local_acidente}
                </div>
                <div>
                  <strong>Tipo:</strong> {cat.tipo_acidente || 'Não especificado'}
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Outras Informações</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <strong>Status:</strong> 
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: 4, 
                    marginLeft: 8,
                    background: cat.status === 'FINALIZADA' ? '#d1fae5' : 
                               cat.status === 'CANCELADA' ? '#fee2e2' : '#fef3c7',
                    color: cat.status === 'FINALIZADA' ? '#065f46' : 
                          cat.status === 'CANCELADA' ? '#991b1b' : '#92400e'
                  }}>
                    {cat.status}
                  </span>
                </div>
                <div>
                  <strong>Comunicante:</strong> {cat.comunicante || 'Não informado'}
                </div>
                <div>
                  <strong>Criado em:</strong> {cat.criado_em ? 
                    new Date(cat.criado_em).toLocaleString('pt-BR') : '---'
                  }
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Descrição do Acidente</h3>
            <div style={{ 
              background: '#f8f9fa', 
              padding: 16, 
              borderRadius: 6,
              whiteSpace: 'pre-wrap',
              lineHeight: 1.5
            }}>
              {cat.descricao || 'Nenhuma descrição fornecida.'}
            </div>
          </div>

          {cat.testemunhas && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Testemunhas</h3>
              <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 6 }}>
                {cat.testemunhas}
              </div>
            </div>
          )}
        </div>

        <div className={modalStyles.footer}>
          <Button variant="outline" onClick={onGerarPDF}>
            📄 Gerar PDF
          </Button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            {onEditar && (
              <Button variant="primary" onClick={onEditar}>
                ✏️ Editar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}