import React, { useState, useEffect } from 'react';

export default function AlanubeMonitor() {
  const [logs, setLogs] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [filter, setFilter] = useState('all'); // all, success, error

  useEffect(() => {
    // Escuchar eventos de log de Alanube
    const handleAlanubeLog = (event) => {
      const logData = event.detail;
      const logEntry = {
        id: Date.now() + Math.random(),
        ...logData
      };
      setLogs(prev => [logEntry, ...prev.slice(0, 49)]); // Mantener últimos 50
    };

    window.addEventListener('alanube-log', handleAlanubeLog);

    return () => {
      window.removeEventListener('alanube-log', handleAlanubeLog);
    };
  }, []);

  const clearLogs = () => setLogs([]);
  
  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'success') return log.status >= 200 && log.status < 300;
    if (filter === 'error') return log.status >= 400 || log.type === 'error';
    return true;
  });

  const getStatusColor = (status) => {
    if (typeof status === 'string') return 'text-red-500';
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 400) return 'text-red-500';
    return 'text-yellow-500';
  };

  const formatJson = (obj) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  // Importar las funciones de API
  const testAlanubeConnection = async () => {
    try {
      const { alanubeValidateToken } = await import('../alanubeApi');
      await alanubeValidateToken();
    } catch (error) {
      console.error('Error en test de conexión:', error);
    }
  };

  const testGetCompany = async () => {
    try {
      const { alanubeGetCompany } = await import('../alanubeApi');
      await alanubeGetCompany();
    } catch (error) {
      console.error('Error obteniendo empresa:', error);
    }
  };

  const testCreateInvoice = async () => {
    try {
      const { alanubeCreateInvoice } = await import('../alanubeApi');
      const testData = {
        client_id: 1,
        description: "Factura de prueba desde monitor - " + new Date().toISOString(),
        amount: 100.00
      };
      console.log('🧪 Enviando datos de prueba:', testData);
      const result = await alanubeCreateInvoice(testData);
      console.log('✅ Resultado:', result);
      alert('Factura creada exitosamente desde monitor!');
    } catch (error) {
      console.error('❌ Error creando factura de prueba:', error);
      alert('Error creando factura: ' + error.message);
    }
  };

  // Test de conectividad básica
  const testConnectivity = async () => {
    try {
      console.log('🌐 Probando conectividad básica...');
      
      const { ALANUBE_JWT_TOKEN } = await import('../alanubeConfig');
      
      // Test con fetch directo (sin axios)
      const response = await fetch('https://sandbox.alanube.co/dom/v1/company', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ALANUBE_JWT_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Conectividad OK:', data);
        alert('Conectividad exitosa!\n\nEmpresa: ' + (data.company_name || 'N/A'));
      } else {
        const errorText = await response.text();
        console.log('❌ Error HTTP:', response.status, errorText);
        alert(`Error HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error de conectividad:', error);
      alert('Error de conectividad: ' + error.message);
    }
  };

  return (
    <div className="content-section fade-in">
      <div className="section-header">
        <h1 className="title-main">Monitor de Alanube en Tiempo Real</h1>
        <p className="subtitle">Observa todas las peticiones HTTP a la API de Alanube</p>
      </div>

      <div className="grid-layout grid-1">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title">Controles de Monitoreo</h3>
            <div className="flex gap-3">
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="form-input w-auto"
              >
                <option value="all">Todos</option>
                <option value="success">Exitosos</option>
                <option value="error">Errores</option>
              </select>
              
              <button 
                onClick={clearLogs}
                className="btn-outline text-sm"
              >
                Limpiar Logs
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{logs.length}</div>
                <div className="text-sm text-muted">Total Logs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {logs.filter(l => l.status >= 200 && l.status < 300).length}
                </div>
                <div className="text-sm text-muted">Exitosos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {logs.filter(l => l.status >= 400 || l.type === 'error').length}
                </div>
                <div className="text-sm text-muted">Errores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {logs.filter(l => l.status === 'pending').length}
                </div>
                <div className="text-sm text-muted">Pendientes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Log de Peticiones en Tiempo Real</h3>
          
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📡</div>
              <p className="text-lg text-muted mb-2">No hay peticiones registradas</p>
              <p className="text-sm text-muted">
                Prueba hacer una petición a Alanube desde la página de Facturas
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${
                        log.type === 'request' ? 'text-blue-600' :
                        log.type === 'response' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {log.type.toUpperCase()}
                      </span>
                      <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
                        {log.method}
                      </span>
                      <span className={`font-bold ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    <span className="text-xs text-muted">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="text-sm font-semibold">URL:</span>
                    <div className="font-mono text-xs bg-white p-2 rounded border break-all">
                      {log.url}
                    </div>
                  </div>

                  {log.data && (
                    <div className="mb-2">
                      <span className="text-sm font-semibold">
                        {log.type === 'request' ? 'Request Body:' : 'Response Data:'}
                      </span>
                      <details className="mt-1">
                        <summary className="cursor-pointer text-sm text-blue-600 hover:underline">
                          Ver datos JSON
                        </summary>
                        <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-x-auto">
                          {formatJson(log.data)}
                        </pre>
                      </details>
                    </div>
                  )}

                  {log.headers && (
                    <div>
                      <span className="text-sm font-semibold">Headers:</span>
                      <details className="mt-1">
                        <summary className="cursor-pointer text-sm text-blue-600 hover:underline">
                          Ver headers
                        </summary>
                        <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-x-auto">
                          {formatJson(log.headers)}
                        </pre>
                      </details>
                    </div>
                  )}

                  {log.duration && (
                    <div className="mt-2 text-xs text-muted">
                      Duración: {log.duration}ms
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="section-title">Prueba Rápida de Alanube</h3>
          <p className="card-description mb-4">
            Haz una petición de prueba para ver el monitor en acción
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => testConnectivity()}
              className="btn-primary"
            >
              🌐 Test Básico
            </button>
            
            <button
              onClick={() => testAlanubeConnection()}
              className="btn-secondary"
            >
              🔗 Validar Token
            </button>
            
            <button
              onClick={() => testGetCompany()}
              className="btn-outline"
            >
              🏢 Obtener Empresa
            </button>
            
            <button
              onClick={() => testCreateInvoice()}
              className="btn-outline"
            >
              📄 Factura de Prueba
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Información de Configuración Actual</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Ambiente Alanube</h4>
              <p className="text-sm text-blue-700">Sandbox (Pruebas)</p>
              <p className="text-xs text-blue-600 font-mono">sandbox.alanube.co</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Autenticación</h4>
              <p className="text-sm text-green-700">JWT Token Activo</p>
              <p className="text-xs text-green-600">Token válido hasta 2026</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">RNC Empresa</h4>
              <p className="text-sm text-yellow-700">DEMO_RNC</p>
              <p className="text-xs text-yellow-600">República Dominicana</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Company ID</h4>
              <p className="text-sm text-purple-700 font-mono text-xs">DEMO_COMPANY_ID</p>
              <p className="text-xs text-purple-600">Identificador único</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}