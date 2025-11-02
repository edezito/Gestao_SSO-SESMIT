import React from 'react';
import { useForm } from '../../hooks/useForm';

const ExameForm = ({ 
    colaboradores, 
    tiposExame, 
    currentUser, 
    isColaborador, 
    onSubmit,
    submitStatus 
}) => {
    const { formData, handleChange, handleSubmit, resetForm } = useForm({
        colaborador_id: isColaborador ? currentUser?.id : '',
        exame_id: '',
        tipo_exame: 'ADMISSIONAL',
        data_agendamento: '',
        observacoes: ''
    }, onSubmit);

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            {/* Campo colaborador condicional */}
            {!isColaborador ? (
                <div style={styles.formGroup}>
                    <label htmlFor="colaborador_id" style={styles.label}>
                        Colaborador *
                    </label>
                    <select
                        id="colaborador_id"
                        name="colaborador_id"
                        value={formData.colaborador_id}
                        onChange={handleChange}
                        required
                        style={styles.select}
                    >
                        <option value="">Selecione um colaborador</option>
                        {colaboradores.map(colab => (
                            <option key={colab.id} value={colab.id}>
                                {colab.nome} - {colab.cargo || 'Sem cargo'}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <div style={styles.formGroup}>
                    <label style={styles.label}>Colaborador</label>
                    <div style={styles.readonlyField}>
                        <strong>{currentUser?.nome}</strong>
                        <span style={styles.readonlyText}>(Seu agendamento)</span>
                    </div>
                </div>
            )}

            <div style={styles.formGroup}>
                <label htmlFor="exame_id" style={styles.label}>
                    Exame *
                </label>
                <select
                    id="exame_id"
                    name="exame_id"
                    value={formData.exame_id}
                    onChange={handleChange}
                    required
                    style={styles.select}
                >
                    <option value="">Selecione um exame</option>
                    {tiposExame.map(exame => (
                        <option key={exame.id} value={exame.id}>
                            {exame.nome}
                        </option>
                    ))}
                </select>
            </div>

            <div style={styles.formGroup}>
                <label htmlFor="tipo_exame" style={styles.label}>
                    Tipo do Exame *
                </label>
                <select
                    id="tipo_exame"
                    name="tipo_exame"
                    value={formData.tipo_exame}
                    onChange={handleChange}
                    required
                    style={styles.select}
                >
                    <option value="ADMISSIONAL">Admissional</option>
                    <option value="PERIODICO">Periódico</option>
                    <option value="DEMISSIONAL">Demissional</option>
                    <option value="RETORNO_TRABALHO">Retorno ao Trabalho</option>
                    <option value="MUDANCA_FUNCAO">Mudança de Função</option>
                </select>
            </div>

            <div style={styles.formGroup}>
                <label htmlFor="data_agendamento" style={styles.label}>
                    Data de Agendamento *
                </label>
                <input
                    type="datetime-local"
                    id="data_agendamento"
                    name="data_agendamento"
                    value={formData.data_agendamento}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label htmlFor="observacoes" style={styles.label}>
                    Observações
                </label>
                <textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    rows="3"
                    style={styles.textarea}
                    placeholder="Observações adicionais (opcional)"
                />
            </div>

            {/* Mensagens de status */}
            {submitStatus.error && (
                <div style={styles.errorMessage}>
                    {submitStatus.error}
                </div>
            )}
            {submitStatus.success && (
                <div style={styles.successMessage}>
                    {submitStatus.success}
                </div>
            )}

            {/* Botões de ação */}
            <div style={styles.actions}>
                <button 
                    type="button" 
                    onClick={resetForm}
                    disabled={submitStatus.loading}
                    style={styles.secondaryButton}
                >
                    Limpar
                </button>
                <button 
                    type="submit" 
                    disabled={submitStatus.loading}
                    style={styles.primaryButton}
                >
                    {submitStatus.loading ? 'Agendando...' : 'Agendar Exame'}
                </button>
            </div>
        </form>
    );
};

// Estilos inline para evitar arquivo CSS adicional
const styles = {
    form: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#333',
    },
    select: {
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
    },
    textarea: {
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        resize: 'vertical',
    },
    readonlyField: {
        padding: '8px 12px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    readonlyText: {
        color: '#666',
        fontSize: '12px',
        marginLeft: '10px',
    },
    errorMessage: {
        padding: '10px',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        color: '#c33',
        borderRadius: '4px',
        marginBottom: '20px',
    },
    successMessage: {
        padding: '10px',
        backgroundColor: '#efe',
        border: '1px solid #cfc',
        color: '#363',
        borderRadius: '4px',
        marginBottom: '20px',
    },
    actions: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
    },
    primaryButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    secondaryButton: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default ExameForm;