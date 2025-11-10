import { API_CONFIG, testBackendConnection, API_ENDPOINTS } from '../config/apiConfig';

/**
 * Utilidades para diagnosticar problemas de conectividad
 */

export const diagnosticUtils = {
  // Verificar conectividad básica
  async checkBasicConnectivity() {
    console.log('🔍 Iniciando diagnóstico de conectividad...');
    
    const results = {
      backendAvailable: false,
      endpoints: {},
      configuration: API_CONFIG,
      errors: []
    };

    try {
      // Test básico de conectividad
      results.backendAvailable = await testBackendConnection();
      
      if (results.backendAvailable) {
        console.log('✅ Backend disponible');
        
        // Probar endpoints principales
        const endpointsToTest = ['HEALTH', 'LOGIN', 'REGISTER'];
        
        for (const endpoint of endpointsToTest) {
          if (API_ENDPOINTS[endpoint]) {
            try {
              const response = await fetch(API_ENDPOINTS[endpoint], {
                method: 'GET',
                headers: API_CONFIG.DEFAULT_HEADERS
              });
              
              results.endpoints[endpoint] = {
                url: API_ENDPOINTS[endpoint],
                status: response.status,
                available: response.status < 500
              };
              
              console.log(`✅ ${endpoint}: ${response.status}`);
            } catch (error) {
              results.endpoints[endpoint] = {
                url: API_ENDPOINTS[endpoint],
                error: error.message,
                available: false
              };
              console.log(`❌ ${endpoint}: ${error.message}`);
            }
          }
        }
      } else {
        console.log('❌ Backend no disponible');
        results.errors.push('No se puede conectar al backend');
      }
      
    } catch (error) {
      console.error('❌ Error en diagnóstico:', error);
      results.errors.push(error.message);
    }

    return results;
  },

  // Mostrar información de configuración
  showConfiguration() {
    console.group('🔧 Configuración FacturaPro');
    console.log('Backend URL:', API_CONFIG.BASE_URL);
    console.log('Entorno:', API_CONFIG.ENVIRONMENT);
    console.log('Hostname:', window.location.hostname);
    console.log('Protocol:', window.location.protocol);
    console.log('Endpoints disponibles:', Object.keys(API_ENDPOINTS).length);
    console.groupEnd();
  },

  // Diagnóstico completo
  async runFullDiagnostic() {
    this.showConfiguration();
    const connectivity = await this.checkBasicConnectivity();
    
    console.group('📊 Resultado del diagnóstico');
    console.log('Backend disponible:', connectivity.backendAvailable);
    console.log('Endpoints probados:', Object.keys(connectivity.endpoints).length);
    console.log('Errores encontrados:', connectivity.errors.length);
    
    if (connectivity.errors.length > 0) {
      console.log('Errores:', connectivity.errors);
    }
    
    console.groupEnd();
    
    return connectivity;
  }
};

// Componente de diagnóstico para usar en desarrollo
export const DiagnosticPanel = () => {
  const [diagnostic, setDiagnostic] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const result = await diagnosticUtils.runFullDiagnostic();
      setDiagnostic(result);
    } catch (error) {
      console.error('Error ejecutando diagnóstico:', error);
    } finally {
      setLoading(false);
    }
  };

  if (API_CONFIG.ENVIRONMENT.isProduction) {
    return null; // No mostrar en producción
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: '#f0f0f0', 
      padding: '10px', 
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '12px',
      zIndex: 9999 
    }}>
      <button onClick={runDiagnostic} disabled={loading}>
        {loading ? '🔄' : '🔍'} Diagnóstico
      </button>
      
      {diagnostic && (
        <div style={{ marginTop: '10px', maxWidth: '300px' }}>
          <div>
            Backend: {diagnostic.backendAvailable ? '✅' : '❌'}
          </div>
          <div>
            Endpoints: {Object.keys(diagnostic.endpoints).length}
          </div>
          {diagnostic.errors.length > 0 && (
            <div style={{ color: 'red' }}>
              Errores: {diagnostic.errors.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};