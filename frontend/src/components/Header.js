import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/app/clients', label: 'Clientes', icon: '👥' },
    { path: '/app/invoices', label: 'Facturas', icon: '📄' },
    { path: '/app/monitor', label: 'Monitor', icon: '📡' },
    { path: '/app/profile', label: 'Perfil', icon: '👤' },
  ];

  return (
    <header className="App-header">
      <div className="header-content">
        <div className="logo">
          <div className="App-logo">FP</div>
          <h1>FacturaPro RD</h1>
          {user && (
            <div className="user-info">
              <span className="welcome-text">Hola, {user.first_name || user.email}</span>
            </div>
          )}
        </div>
        
        <nav className="App-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="nav-item hover:bg-red-500/20 hover:text-red-100"
            style={{ border: 'none', background: 'transparent' }}
          >
            <span className="mr-2">🚪</span>
            Salir
          </button>
        </nav>
      </div>
    </header>
  );
}