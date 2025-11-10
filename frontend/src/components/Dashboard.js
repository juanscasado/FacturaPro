import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { alanubeLogin, alanubeGetCompany } from '../alanubeApi';
import { ALANUBE_RNC, ALANUBE_COMPANY_ID, ALANUBE_INVOICE_RANGE } from '../alanubeConfig';
import { API_ENDPOINTS } from '../config/apiConfig';
import useNotifications from '../hooks/useNotifications';
import NotificationToast from './NotificationToast';

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alanubeInfo, setAlanubeInfo] = useState(null);
  const [alanubeStatus, setAlanubeStatus] = useState(null);
  const [alanubeLoading, setAlanubeLoading] = useState(false);
  const navigate = useNavigate();
  const { notifications, addNotification, removeNotification } = useNotifications();

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

  const handleAlanubeConnect = async (retryCount = 0) => {
    setAlanubeLoading(true);
    setAlanubeStatus(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAlanubeStatus({ 
          error: 'No hay sesión activa. Por favor, inicia sesión nuevamente.' 
        });
        addNotification({
          type: 'warning',
          title: 'Sesión Requerida',
          message: 'Debes iniciar sesión para conectar con Alanube',
          action: {
            label: 'Ir a Login',
            onClick: () => navigate('/login')
          }
        });
        setAlanubeLoading(false);
        return;
      }
      
      console.log('🔧 Debug - Conectando a Alanube...');
      
      // Primero probar el endpoint de test sin autenticación
      console.log('🧪 Probando conectividad básica con Alanube...');
      try {
        const testUrl = `${API_ENDPOINTS.ALANUBE_VALIDATE.replace('/validate', '/test-connection')}`;
        const testResponse = await fetch(testUrl);
        const testResult = await testResponse.json();
        
        console.log('🧪 Test result:', testResult);
        
        if (!testResult.success) {
          setAlanubeStatus({ 
            error: `Problema con configuración de Alanube: ${testResult.message}`,
            details: testResult.debug
          });
          addNotification({
            type: 'error',
            title: 'Error de Configuración',
            message: 'Problema con la configuración de Alanube en el servidor'
          });
          setAlanubeLoading(false);
          return;
        }
        
        console.log('✅ Test básico exitoso, procediendo con autenticación...');
      } catch (testError) {
        console.log('⚠️ No se pudo ejecutar test básico, continuando...');
      }
      
      // Intentar con autenticación
      const response = await fetch(API_ENDPOINTS.ALANUBE_COMPANY, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('🔧 Debug - Response status:', response.status);
      
      // Manejo específico de errores de autenticación
      if (response.status === 401) {
        console.log('❌ Token de usuario expirado');
        setAlanubeStatus({ 
          error: 'Tu sesión ha expirado. Serás redirigido al login en 3 segundos...',
          action: 'logout'
        });
        
        addNotification({
          type: 'warning',
          title: 'Sesión Expirada',
          message: 'Tu sesión ha expirado. Redirigiendo al login...'
        });
        
        setAlanubeLoading(false);
        
        // Auto-logout después de 3 segundos
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('alanube_token');
          localStorage.removeItem('alanube_info');
          localStorage.removeItem('alanube_connected');
          navigate('/login');
        }, 3000);
        return;
      }
      
      const result = await response.json();
      console.log('🔧 Debug - Response data:', result);
      
      if (!response.ok) {
        throw new Error(result.detail || result.message || `Error ${response.status}`);
      }
      
      if (result.success) {
        const companyInfo = result.data;
        setAlanubeInfo(companyInfo);
        
        // Guardar información de la empresa para persistencia
        localStorage.setItem('alanube_info', JSON.stringify(companyInfo));
        localStorage.setItem('alanube_connected', 'true');
        
        setAlanubeStatus({ 
          success: `✅ Conectado a Alanube exitosamente. Empresa: ${companyInfo.name || companyInfo.companyName || 'N/A'}`,
          companyName: companyInfo.name || companyInfo.companyName
        });
        
        // Notificación de éxito
        addNotification({
          type: 'success',
          title: 'Conexión Exitosa',
          message: `Conectado a Alanube como ${companyInfo.name || companyInfo.companyName || 'N/A'}`
        });
        
        console.log('✅ Conexión Alanube establecida vía backend');
      } else {
        throw new Error(result.message || 'Error en respuesta de Alanube');
      }
    } catch (err) {
      console.error('❌ Error en conexión Alanube:', err);
      
      // Mensajes de error más amigables
      let errorMessage = 'Error conectando a Alanube';
      let shouldRetry = false;
      
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'No se puede conectar al servidor. Verifica tu conexión a internet.';
        shouldRetry = true;
      } else if (err.message.includes('Network')) {
        errorMessage = 'Error de red. Por favor, intenta nuevamente.';
        shouldRetry = true;
      } else if (err.message.includes('timeout')) {
        errorMessage = 'La conexión tardó demasiado. Intenta nuevamente.';
        shouldRetry = true;
      } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        errorMessage = 'Error de autenticación. Tu sesión puede haber expirado.';
      } else if (err.message.includes('500')) {
        errorMessage = 'Error del servidor. Nuestro equipo ha sido notificado.';
        shouldRetry = true;
      } else {
        errorMessage = err.message || 'Error desconocido al conectar con Alanube';
      }
      
      setAlanubeStatus({ 
        error: errorMessage,
        technical: err.message
      });
      
      // Auto-retry lógica
      if (shouldRetry && retryCount < 2) {
        addNotification({
          type: 'warning',
          title: 'Reintentando...',
          message: `Intento ${retryCount + 2} de 3. ${errorMessage}`
        });
        
        setTimeout(() => {
          handleAlanubeConnect(retryCount + 1);
        }, 2000);
        return;
      }
      
      // Notificación de error final
      addNotification({
        type: 'error',
        title: 'Error de Conexión',
        message: errorMessage,
        action: errorMessage.includes('sesión') ? {
          label: 'Ir a Login',
          onClick: () => navigate('/login')
        } : shouldRetry ? {
          label: 'Reintentar',
          onClick: () => handleAlanubeConnect(0)
        } : null
      });
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
                  <div className={`p-4 rounded-lg border-l-4 ${
                    alanubeStatus.success ? 
                      'bg-green-50 border-green-400 text-green-800' : 
                      'bg-red-50 border-red-400 text-red-800'
                  }`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {alanubeStatus.success ? (
                          <span className="text-green-500 text-xl">✅</span>
                        ) : (
                          <span className="text-red-500 text-xl">❌</span>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className={`text-sm font-medium ${
                          alanubeStatus.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {alanubeStatus.success ? 'Conexión Exitosa' : 'Error de Conexión'}
                        </h3>
                        <div className={`mt-1 text-sm ${
                          alanubeStatus.success ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {alanubeStatus.success || alanubeStatus.error}
                        </div>
                        {alanubeStatus.technical && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-xs opacity-75">
                              Detalles técnicos
                            </summary>
                            <div className="mt-1 text-xs opacity-60 font-mono">
                              {alanubeStatus.technical}
                            </div>
                          </details>
                        )}
                        {alanubeStatus.action === 'logout' && (
                          <div className="mt-2">
                            <div className="animate-pulse text-xs">
                              Redirigiendo al login...
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {alanubeInfo && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-500 text-lg mr-2">🏢</span>
                      <h3 className="text-blue-800 font-semibold">Información de la Empresa</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                      <p><strong>Empresa:</strong> {alanubeInfo.name || alanubeInfo.companyName || 'N/A'}</p>
                      <p><strong>Nombre comercial:</strong> {alanubeInfo.tradeName || 'N/A'}</p>
                      <p><strong>RNC:</strong> {alanubeInfo.identification || 'N/A'}</p>
                      <p><strong>Ambiente:</strong> <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">Sandbox (Pruebas)</span></p>
                    </div>
                    <div className="mt-3 text-xs text-blue-600">
                      ✅ Sistema fiscal configurado y listo para generar facturas electrónicas
                    </div>
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
      
      {/* Notificaciones Toast */}
      <NotificationToast 
        notifications={notifications} 
        onRemove={removeNotification}
      />
    </div>
  );
}