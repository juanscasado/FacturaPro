import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('alanube_token');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/clients', label: 'Clientes', icon: '👥' },
    { path: '/invoices', label: 'Facturas', icon: '📄' },
    { path: '/monitor', label: 'Monitor', icon: '📡' },
    { path: '/profile', label: 'Perfil', icon: '👤' },
  ];

  // No mostrar header en login/register
  if (!token || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <header className="App-header">
      <div className="header-content">
        <div className="logo">
          <div className="App-logo">FP</div>
          <h1>FacturaPro RD</h1>
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