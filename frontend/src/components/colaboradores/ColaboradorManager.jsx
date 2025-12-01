// src/components/colaboradores/ColaboradorManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  listarColaboradores, 
  criarColaborador, 
  atualizarColaborador, 
  deletarColaborador,
  listarCargos
} from '../../services/api';
import Button from '../ui/Button';
import ColaboradorList from './ColaboradorList';
import ColaboradorFormModal from './ColaboradorModal';
import { COLORS, SPACING, TYPOGRAPHY } from '../../styles/theme';
import Spinner from '../ui/Spinner'; // Importação adicionada

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  error: {
    ...TYPOGRAPHY.small,
    color: COLORS.danger,
    padding: SPACING.md,
    backgroundColor: '#f8d7da',
    borderRadius: '4px',
    marginBottom: SPACING.md,
  },
  success: {
    ...TYPOGRAPHY.small,
    color: '#155724',
    padding: SPACING.md,
    backgroundColor: '#d4edda',
    borderRadius: '4px',
    marginBottom: SPACING.md,
  }
};

export default function ColaboradorManager({ canEdit }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentColaborador, setCurrentColaborador] = useState(null); // Colaborador para edição
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchCargos = useCallback(async () => {
    try {
      const data = await listarCargos();
      setCargos(data);
    } catch (e) {
      console.error("Erro ao carregar cargos:", e);
      // O erro do cargo não deve bloquear o carregamento principal
    }
  }, []);

  const fetchColaboradores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarColaboradores();
      setColaboradores(data);
    } catch (e) {
      setError(`Erro ao carregar colaboradores: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColaboradores();
    fetchCargos();
  }, [fetchColaboradores, fetchCargos]);

  const handleCreateOrUpdate = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      let result;
      const id = currentColaborador?.id;

      if (id) {
        // EDIÇÃO (PUT)
        result = await atualizarColaborador(id, formData);
        setSuccessMessage(`Colaborador ${result.nome} atualizado com sucesso!`);
      } else {
        // CRIAÇÃO (POST)
        result = await criarColaborador(formData);
        setSuccessMessage(`Colaborador ${result.nome} criado com sucesso!`);
      }

      // Recarrega a lista e fecha o modal
      await fetchColaboradores();
      setModalOpen(false);
      setCurrentColaborador(null);
      
    } catch (e) {
      setError(`Falha na operação: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja inativar este colaborador?")) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await deletarColaborador(id);
      setSuccessMessage("Colaborador inativado com sucesso!");
      await fetchColaboradores();
    } catch (e) {
      setError(`Falha ao inativar: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setCurrentColaborador(null);
    setModalOpen(true);
  };

  const openEditModal = (colaborador) => {
    setCurrentColaborador(colaborador);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentColaborador(null);
  };

  return (
    <div>
      <div style={styles.header}>
        {canEdit && (
          <Button variant="success" onClick={openCreateModal} disabled={loading}>
            ➕ Novo Colaborador
          </Button>
        )}
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {successMessage && <div style={styles.success}>🎉 {successMessage}</div>}

      {loading && colaboradores.length === 0 ? (
        <div style={styles.loadingContainer}>
          <Spinner size={50} label="Carregando colaboradores..." />
        </div>
      ) : (
        <ColaboradorList 
          colaboradores={colaboradores}
          onEdit={openEditModal}
          onDelete={handleDelete}
          canEdit={canEdit}
          loading={loading}
        />
      )}

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      <ColaboradorFormModal
        isOpen={modalOpen}
        colaborador={currentColaborador}
        cargos={cargos}
        onSubmit={handleCreateOrUpdate}
        onClose={closeModal}
        loading={loading}
      />
    </div>
  );
}