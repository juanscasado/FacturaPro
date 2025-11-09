import React from 'react';
import { Link } from 'react-router-dom';

const TestRoutes = () => {
  const routes = [
    { path: '/', name: 'Landing Page' },
    { path: '/pricing', name: 'Pricing Page' },
    { path: '/tutorial', name: 'Tutorial Page' },
    { path: '/login', name: 'Login Page' },
    { path: '/register', name: 'Register Page' },
    { path: '/app/dashboard', name: 'Dashboard (Protected)' },
    { path: '/app/clients', name: 'Clients (Protected)' },
    { path: '/app/invoices', name: 'Invoices (Protected)' }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Test de Rutas - FacturaPro</h1>
      <p>Usa esta página para probar todas las rutas de la aplicación:</p>
      
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {routes.map(route => (
          <Link 
            key={route.path}
            to={route.path}
            style={{
              padding: '1rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#2d3748',
              display: 'block',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#edf2f7';
              e.target.style.borderColor = '#cbd5e0';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#f8fafc';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            <strong>{route.name}</strong>
            <br />
            <code style={{ color: '#718096', fontSize: '0.875rem' }}>{route.path}</code>
          </Link>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '3rem', 
        padding: '1.5rem', 
        background: '#f7fafc', 
        borderRadius: '8px',
        border: '1px solid #bee3f8'
      }}>
        <h3>📋 Estado del Sistema:</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>✅ Router configurado con rutas públicas y privadas</li>
          <li>✅ AuthContext implementado</li>
          <li>✅ Protección de rutas activa</li>
          <li>✅ Componentes comerciales creados</li>
          <li>⚠️ Backend necesita estar corriendo para autenticación completa</li>
        </ul>
      </div>
    </div>
  );
};

export default TestRoutes;