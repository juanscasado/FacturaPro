import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { alanubeLogin, alanubeGetCompany } from '../alanubeApi';
import { ALANUBE_RNC, ALANUBE_COMPANY_ID, ALANUBE_INVOICE_RANGE } from '../alanubeConfig';
import { API_ENDPOINTS } from '../config/apiConfig';

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alanubeInfo, setAlanubeInfo] = useState(null);
  const [alanubeStatus, setAlanubeStatus] = useState(null);
  const [alanubeLoading, setAlanubeLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserEmail(decoded.email || 'Usuario');

      // Verificar si ya hay una conexión a Alanube guardada
      const alanubeConnected = localStorage.getItem('alanube_connected');
      const savedAlanubeInfo = localStorage.getItem('alanube_info');
      
      if (alanubeConnected === 'true' && savedAlanubeInfo) {
        try {
          const parsedInfo = JSON.parse(savedAlanubeInfo);
          setAlanubeInfo(parsedInfo);
          setAlanubeStatus({ success: 'Conectado a Alanube (sesión guardada)' });
          console.log('🔗 Conexión Alanube restaurada desde localStorage');
        } catch (err) {
          console.log('❌ Error al parsear info de Alanube guardada:', err);
          localStorage.removeItem('alanube_info');
          localStorage.removeItem('alanube_connected');
        }
      }

      // Cargar clientes desde API
      fetch(API_ENDPOINTS.CLIENTS, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(response => response.json())
        .then(data => {
          console.log('📊 Datos recibidos de clientes:', data);
          // Asegurarse de que data es un array
          setClients(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error('❌ Error cargando clientes:', err);
          setClients([]);
          setLoading(false);
        });

    } catch (err) {
      console.error('Token inválido');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('alanube_token');
    localStorage.removeItem('alanube_info');
    localStorage.removeItem('alanube_connected');
    navigate('/login');
  };

  const handleAlanubeDisconnect = () => {
    localStorage.removeItem('alanube_token');
    localStorage.removeItem('alanube_info');
    localStorage.removeItem('alanube_connected');
    setAlanubeInfo(null);
    setAlanubeStatus(null);
    console.log('🔌 Desconectado de Alanube');
  };

  const handleAlanubeConnect = async () => {
    setAlanubeLoading(true);
    setAlanubeStatus(null);
    try {
      const token = localStorage.getItem('token');
      
      // Usar endpoint del backend para validar y obtener info de la empresa
      const response = await fetch(API_ENDPOINTS.ALANUBE_COMPANY, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.detail || `Error ${response.status}`);
      }
      
      if (result.success) {
        const companyInfo = result.data;
        setAlanubeInfo(companyInfo);
        
        // Guardar información de la empresa para persistencia
        localStorage.setItem('alanube_info', JSON.stringify(companyInfo));
        localStorage.setItem('alanube_connected', 'true');
        
        setAlanubeStatus({ success: 'Conectado a Alanube exitosamente' });
        console.log('✅ Conexión Alanube establecida vía backend');
      } else {
        throw new Error(result.message || 'Error en respuesta de Alanube');
      }
    } catch (err) {
      setAlanubeStatus({ error: err.message || 'Error conectando a Alanube' });
      console.error('❌ Error en conexión Alanube:', err);
    } finally {
      setAlanubeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main">
      <div className="App-main">
        <div className="content-section fade-in">
          <div className="section-header">
            <h1 className="title-main">Dashboard</h1>
            <p className="subtitle">Bienvenido, <strong>{userEmail}</strong>!</p>
          </div>

          <div className="grid-layout grid-3">
            <div className="card">
              <Link to="/clients" className="block text-decoration-none">
                <div className="flex items-center gap-3 mb-3">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path fillRule="evenodd" d="M5.5 9a4.5 4.5 0 009 0v.25a5.5 5.5 0 013.5 5.157V15a2 2 0 01-2 2h-12a2 2 0 01-2-2v-.593A5.5 5.5 0 015.5 9.25V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="section-title">Clientes</h3>
                </div>
                <p className="card-description">Gestiona clientes y RNC de manera profesional</p>
              </Link>
            </div>

            <div className="card">
              <Link to="/invoices" className="block text-decoration-none">
                <div className="flex items-center gap-3 mb-3">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 012-2h6l4 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      <path d="M8 10h4M8 13h4M8 7h2" />
                    </svg>
                  </div>
                  <h3 className="section-title">Facturas</h3>
                </div>
                <p className="card-description">Crea y envía e-CF automáticamente</p>
              </Link>
            </div>

            <div className="card">
              <Link to="/profile" className="block text-decoration-none">
                <div className="flex items-center gap-3 mb-3">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1a4 4 0 108 0V6a4 4 0 00-4-4zm-7 14a7 7 0 0114 0v1H3v-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="section-title">Perfil</h3>
                </div>
                <p className="card-description">Datos de empresa y configuración NCF</p>
              </Link>
            </div>
          </div>

          <div className="grid-layout grid-2">
            <div className="card">
              <h3 className="section-title">Lista de Clientes</h3>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="loading-spinner"></div>
                  <span className="text-muted">Cargando...</span>
                </div>
              ) : clients.length === 0 ? (
                <p className="text-muted">No hay clientes registrados</p>
              ) : (
                <div className="space-y-3">
                  {clients.slice(0, 5).map(client => (
                    <div key={client.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-semibold text-primary">{client.name}</span>
                        <span className="text-sm text-muted block">RNC: {client.rnc}</span>
                      </div>
                    </div>
                  ))}
                  {clients.length > 5 && (
                    <Link to="/clients" className="text-primary hover:underline text-sm">
                      Ver todos ({clients.length} clientes)
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="section-title">Configuración Alanube</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-muted mb-1"><strong>RNC:</strong> {ALANUBE_RNC}</p>
                  <p className="text-sm text-muted mb-1"><strong>Company ID:</strong> {ALANUBE_COMPANY_ID}</p>
                  <p className="text-sm text-muted"><strong>Rango NCF:</strong> {ALANUBE_INVOICE_RANGE.from.toLocaleString()} - {ALANUBE_INVOICE_RANGE.to.toLocaleString()}</p>
                </div>
                
                {alanubeInfo ? (
                  <div className="space-y-2">
                    <button 
                      className="btn-outline w-full" 
                      onClick={handleAlanubeDisconnect}
                    >
                      🔌 Desconectar de Alanube
                    </button>
                    <button 
                      className="btn-secondary w-full" 
                      onClick={handleAlanubeConnect}
                      disabled={alanubeLoading}
                    >
                      {alanubeLoading ? 'Reconectando...' : '🔄 Reconectar'}
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn-secondary w-full" 
                    onClick={handleAlanubeConnect}
                    disabled={alanubeLoading}
                  >
                    {alanubeLoading ? 'Conectando...' : '🔗 Conectar a Alanube'}
                  </button>
                )}
                
                {alanubeStatus && (
                  <div className={`p-3 rounded-lg ${alanubeStatus.success ? 'status-success' : 'status-error'}`}>
                    {alanubeStatus.success || alanubeStatus.error}
                  </div>
                )}
                
                {alanubeInfo && (
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-800">
                    <p className="text-sm"><strong>Empresa:</strong> {alanubeInfo.name}</p>
                    <p className="text-sm"><strong>Nombre comercial:</strong> {alanubeInfo.tradeName}</p>
                    <p className="text-sm"><strong>Ambiente:</strong> Sandbox</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button onClick={handleLogout} className="btn-outline">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}