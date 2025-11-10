import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { API_CONFIG, testBackendConnection } from '../config/apiConfig';

// Context para autenticación
const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [backendConnected, setBackendConnected] = React.useState(null);

  React.useEffect(() => {
    // Verificar conexión al backend
    const checkBackend = async () => {
      const connected = await testBackendConnection();
      setBackendConnected(connected);
      if (!connected) {
        console.warn('⚠️ Backend no disponible. Modo offline.');
      }
    };
    
    checkBackend();
    
    // Verificar token en localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar validez del token
      fetch(`${API_CONFIG.BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Token inválido');
      })
      .then(userData => {
        setUser(userData.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Intentando login con:', { email });
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Respuesta del servidor:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login exitoso, datos recibidos:', data);
        localStorage.setItem('token', data.access_token);
        setUser(data.user);
        console.log('👤 Usuario establecido en estado:', data.user);
        return { success: true, user: data.user };
      } else {
        const error = await response.json();
        console.error('❌ Error en login:', error);
        return { success: false, error: error.detail || error.message };
      }
    } catch (error) {
      console.error('💥 Error de conexión:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      console.log('🔄 Intentando registro con:', userData);
      console.log('🌐 URL del backend:', `${API_CONFIG.BASE_URL}/auth/register`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setUser(data.user);
        console.log('✅ Registro exitoso:', data.user);
        return { success: true, user: data.user };
      } else {
        const error = await response.json();
        console.error('❌ Error del servidor:', error);
        return { success: false, error: error.detail || error.message };
      }
    } catch (error) {
      console.error('💥 Error de conexión completo:', error);
      const errorMessage = error.name === 'TypeError' && error.message.includes('fetch') 
        ? 'No se puede conectar al servidor. ¿Está el backend ejecutándose en http://localhost:8000?' 
        : 'Error de conexión';
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Componente para proteger rutas privadas
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Guardar la ruta intentada para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Componente para rutas públicas (redirige si ya está autenticado)
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};

export default AuthContext;