// Configuración de API según el ambiente
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('localhost');

const isProduction = window.location.hostname.includes('vercel.app') ||
                    window.location.hostname.includes('onrender.com') ||
                    window.location.hostname.includes('netlify.app') ||
                    process.env.NODE_ENV === 'production';

// URL del backend según el entorno
const getBackendURL = () => {
  // 1. Prioridad: Variable de entorno explícita
  if (process.env.REACT_APP_API_URL) {
    console.log('🔧 Usando REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // 2. Desarrollo local
  if (isDevelopment) {
    console.log('🏠 Modo desarrollo - usando localhost:8000');
    return 'http://localhost:8000';
  }
  
  // 3. Producción - URLs por plataforma
  if (window.location.hostname.includes('vercel.app')) {
    console.log('🚀 Vercel detectado - usando Railway backend');
    return 'https://facturapro-backend.railway.app';
  }
  
  if (window.location.hostname.includes('onrender.com')) {
    console.log('🎭 Render detectado - usando Render backend');
    return 'https://facturapro-backend.onrender.com';
  }
  
  // 4. Fallback por defecto
  console.log('🌐 Usando backend por defecto');
  return 'https://facturapro-backend.railway.app';
};

const backendURL = getBackendURL();

export const API_CONFIG = {
  BASE_URL: backendURL,
  TIMEOUT: 30000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Información del entorno
  ENVIRONMENT: {
    isDevelopment,
    isProduction,
    hostname: window.location.hostname,
    protocol: window.location.protocol
  }
};

// URLs completas para las APIs
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: `${API_CONFIG.BASE_URL}/auth/login`,
  REGISTER: `${API_CONFIG.BASE_URL}/auth/register`,
  VERIFY: `${API_CONFIG.BASE_URL}/auth/verify`,
  
  // Clientes
  CLIENTS: `${API_CONFIG.BASE_URL}/clients`,
  CLIENTS_CREATE: `${API_CONFIG.BASE_URL}/clients/`,
  
  // Facturas
  INVOICES: `${API_CONFIG.BASE_URL}/invoices`,
  
  // Usuarios
  USERS: `${API_CONFIG.BASE_URL}/users`,
  
  // Dashboard y rutas adicionales
  DASHBOARD: `${API_CONFIG.BASE_URL}/`,
  DOCS: `${API_CONFIG.BASE_URL}/docs`,
  HEALTH: `${API_CONFIG.BASE_URL}/health`,
  
  // Alanube integration (via backend)
  ALANUBE_VALIDATE: `${API_CONFIG.BASE_URL}/alanube/validate`,
  ALANUBE_COMPANY: `${API_CONFIG.BASE_URL}/alanube/company`,
  ALANUBE_INVOICE: `${API_CONFIG.BASE_URL}/alanube/invoice`
};

// Función para probar la conectividad
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: API_CONFIG.DEFAULT_HEADERS
    });
    return response.ok;
  } catch (error) {
    console.error('❌ No se puede conectar al backend:', error);
    return false;
  }
};

// Log de configuración
console.log('🔧 Configuración API FacturaPro:', {
  environment: isDevelopment ? 'development' : 'production',
  baseURL: API_CONFIG.BASE_URL,
  hostname: window.location.hostname,
  protocol: window.location.protocol,
  endpoints: Object.keys(API_ENDPOINTS).length + ' endpoints configurados'
});