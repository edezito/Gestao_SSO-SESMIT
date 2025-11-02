import React from 'react';

export const Loading = ({ message = 'Carregando...' }) => {
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            minHeight: '200px'
        },
        spinner: {
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'loading-spin 1s linear infinite'
        },
        message: {
            marginTop: '1rem',
            color: '#666',
            fontSize: '0.9rem'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.spinner}></div>
            <p style={styles.message}>{message}</p>
            <style>
                {`@keyframes loading-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }`}
            </style>
        </div>
    );
};

export default Loading;