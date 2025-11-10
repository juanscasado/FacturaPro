// Configuración de API según el ambiente
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';

// URL del backend según el entorno
const getBackendURL = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  if (isDevelopment) {
    return 'http://127.0.0.1:8000';
  }
  
  // Producción - URL por defecto
  return 'https://facturapro-backend.railway.app';
};

export const API_CONFIG = {
  BASE_URL: getBackendURL(),
  TIMEOUT: 30000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// URLs completas para las APIs
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: `${API_CONFIG.BASE_URL}/auth/login`,
  REGISTER: `${API_CONFIG.BASE_URL}/auth/register`,
  
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
  
  // Alanube integration (via backend)
  ALANUBE_VALIDATE: `${API_CONFIG.BASE_URL}/alanube/validate`,
  ALANUBE_COMPANY: `${API_CONFIG.BASE_URL}/alanube/company`,
  ALANUBE_INVOICE: `${API_CONFIG.BASE_URL}/alanube/invoice`
};

console.log('🔧 Configuración API:', {
  environment: isDevelopment ? 'development' : 'production',
  baseURL: API_CONFIG.BASE_URL,
  hostname: window.location.hostname
});