// axios removido - ahora usamos fetch nativo
import { 
  ALANUBE_API_BASE, 
  ALANUBE_USERNAME, 
  ALANUBE_RNC,
  ALANUBE_COMPANY_ID,
  ALANUBE_JWT_TOKEN,
  ALANUBE_INVOICE_RANGE 
} from './alanubeConfig';

// Logger para el monitor
const logToMonitor = (type, data) => {
  const event = new CustomEvent('alanube-log', {
    detail: {
      type,
      timestamp: new Date().toISOString(),
      ...data
    }
  });
  window.dispatchEvent(event);
};

// Helper para autenticación Alanube - Usando JWT Token
export async function alanubeLogin() {
  try {
    // Retornamos la configuración con el token JWT real
    return { 
      token: ALANUBE_JWT_TOKEN,
      rnc: ALANUBE_RNC,
      invoiceRange: ALANUBE_INVOICE_RANGE,
      username: ALANUBE_USERNAME,
      environment: 'sandbox'
    };
  } catch (error) {
    console.error('Error en autenticación Alanube:', error);
    throw error;
  }
}

// Helper para validar el token JWT - USANDO FETCH
export async function alanubeValidateToken() {
  const startTime = Date.now();
  const url = `${ALANUBE_API_BASE}company`;
  
  logToMonitor('request', {
    method: 'GET',
    url: url,
    data: null,
    headers: {
      'Authorization': `Bearer ${ALANUBE_JWT_TOKEN.substring(0, 20)}...`,
      'Content-Type': 'application/json'
    }
  });

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${ALANUBE_JWT_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const duration = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      
      logToMonitor('response', {
        method: 'GET',
        url: url,
        status: response.status,
        statusText: response.statusText,
        data: data,
        duration: duration
      });
      
      return data;
    } else {
      const errorData = await response.text();
      const error = new Error(`HTTP ${response.status}: ${errorData}`);
      error.response = { status: response.status, statusText: response.statusText, data: errorData };
      throw error;
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logToMonitor('error', {
      method: 'GET',
      url: url,
      status: error.response?.status || 'Network Error',
      statusText: error.response?.statusText || error.message,
      data: error.response?.data || { error: error.message },
      duration: duration
    });
    
    console.error('Error validando token Alanube:', error);
    throw error;
  }
}

// Helper para obtener información de la empresa - USANDO FETCH
export async function alanubeGetCompany() {
  const startTime = Date.now();
  const url = `${ALANUBE_API_BASE}company`;
  
  logToMonitor('request', {
    method: 'GET',
    url: url,
    data: null,
    headers: {
      'Authorization': `Bearer ${ALANUBE_JWT_TOKEN.substring(0, 20)}...`,
      'Content-Type': 'application/json'
    }
  });

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${ALANUBE_JWT_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const duration = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      
      logToMonitor('response', {
        method: 'GET',
        url: url,
        status: response.status,
        statusText: response.statusText,
        data: data,
        duration: duration
      });
      
      return data;
    } else {
      const errorData = await response.text();
      const error = new Error(`HTTP ${response.status}: ${errorData}`);
      error.response = { status: response.status, statusText: response.statusText, data: errorData };
      throw error;
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logToMonitor('error', {
      method: 'GET',
      url: url,
      status: error.response?.status || 'Network Error',
      statusText: error.response?.statusText || error.message,
      data: error.response?.data || { error: error.message },
      duration: duration
    });
    
    console.error('Error obteniendo información de empresa:', error);
    throw error;
  }
}

// Helper para crear factura fiscal - USANDO FETCH (NO AXIOS)
export async function alanubeCreateInvoice(invoiceData) {
  const startTime = Date.now();
  const url = `${ALANUBE_API_BASE}invoice-fiscals/${ALANUBE_COMPANY_ID}`;
  
  // Validación de datos de entrada
  if (!invoiceData) {
    throw new Error('Datos de factura requeridos');
  }
  
  console.log('🔥 Preparando llamada a Alanube con FETCH:', {
    url: url,
    companyId: ALANUBE_COMPANY_ID,
    hasToken: !!ALANUBE_JWT_TOKEN,
    tokenLength: ALANUBE_JWT_TOKEN?.length,
    invoiceData: invoiceData
  });
  
  // Log de petición
  logToMonitor('request', {
    method: 'POST',
    url: url,
    data: invoiceData,
    headers: {
      'Authorization': `Bearer ${ALANUBE_JWT_TOKEN.substring(0, 20)}...`,
      'Content-Type': 'application/json'
    }
  });

  try {
    console.log('🚀 Enviando petición con FETCH (no axios)...');
    
    // Usar fetch en lugar de axios (como el test exitoso)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ALANUBE_JWT_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(invoiceData)
    });
    
    const duration = Date.now() - startTime;
    
    // Procesar respuesta de fetch
    if (response.ok) {
      const data = await response.json();
      
      console.log('✅ Respuesta exitosa de Alanube:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      // Log de respuesta exitosa
      logToMonitor('response', {
        method: 'POST',
        url: url,
        status: response.status,
        statusText: response.statusText,
        data: data,
        duration: duration
      });
      
      return data;
    } else {
      // Respuesta con error HTTP
      const errorData = await response.text();
      const error = new Error(`HTTP ${response.status}: ${errorData}`);
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      };
      throw error;
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error('❌ Error completo en Alanube:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      request: error.request,
      config: error.config
    });
    
    // Log de error
    logToMonitor('error', {
      method: 'POST',
      url: url,
      status: error.response?.status || 'Network Error',
      statusText: error.response?.statusText || error.message,
      data: error.response?.data || { error: error.message },
      duration: duration,
      headers: error.response?.headers,
      errorCode: error.code
    });
    
    // Mejorar el mensaje de error según el tipo
    if (error.code === 'ECONNREFUSED') {
      error.message = 'No se puede conectar con el servidor de Alanube';
    } else if (error.code === 'ENOTFOUND') {
      error.message = 'No se puede resolver el dominio de Alanube';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Tiempo de espera agotado conectando con Alanube';
    }
    
    console.error('Error creando factura:', error);
    throw error;
  }
}

// Helper para obtener listado de facturas - USANDO FETCH
export async function alanubeGetInvoices(params = {}) {
  try {
    // Construir URL con parámetros
    const url = new URL(`${ALANUBE_API_BASE}invoice-fiscals/${ALANUBE_COMPANY_ID}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${ALANUBE_JWT_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.text();
      const error = new Error(`HTTP ${response.status}: ${errorData}`);
      error.response = { status: response.status, statusText: response.statusText, data: errorData };
      throw error;
    }
  } catch (error) {
    console.error('Error obteniendo facturas:', error);
    throw error;
  }
}
