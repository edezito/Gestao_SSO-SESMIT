import React from 'react';

export const ErrorMessage = ({ message, onRetry, retryLabel = 'Tentar Novamente' }) => {
    const styles = {
        container: {
            padding: '1rem',
            margin: '1rem 0',
            border: '1px solid #f5c6cb',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            textAlign: 'center'
        },
        icon: {
            fontSize: '1.5rem',
            marginBottom: '0.5rem'
        },
        title: {
            margin: '0 0 0.5rem 0',
            fontSize: '1.1rem'
        },
        message: {
            margin: '0 0 1rem 0'
        },
        retryBtn: {
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.icon}>⚠️</div>
            <h3 style={styles.title}>Ocorreu um erro</h3>
            <p style={styles.message}>{message}</p>
            {onRetry && (
                <button style={styles.retryBtn} onClick={onRetry}>
                    {retryLabel}
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;