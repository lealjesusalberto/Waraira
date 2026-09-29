import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: '#fff',
          fontFamily: 'sans-serif',
          background: '#040d07',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h2 style={{ color: '#f87171', marginBottom: '12px' }}>Ocurrió un error al cargar la aplicación</h2>
          <p style={{ color: '#94a3b8', maxWidth: '400px', marginBottom: '20px', fontSize: '14px' }}>
            {this.state.error?.message || 'Error inesperado al inicializar'}
          </p>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              background: '#22c55e',
              border: 'none',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Limpiar caché y reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
