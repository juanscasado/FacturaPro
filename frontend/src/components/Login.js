import React from 'react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta de destino después del login
  const from = location.state?.from?.pathname || '/app/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        console.log('Usuario logueado:', result.user);
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Error en el login');
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para llenar credenciales de demo
  const fillDemo = () => {
    setEmail('admin@facturapro.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Header con logo */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-4xl font-bold mb-6 shadow-xl hover:scale-105 transition-transform">
            📄
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">FacturaPro RD</h1>
          <p className="text-lg text-gray-600">Sistema de Facturación Profesional</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8 rounded-r-xl shadow-sm">
            <div className="flex items-start">
              <div className="text-3xl mr-4 mt-1">❌</div>
              <div className="flex-1">
                <h3 className="font-bold text-red-800 mb-2 text-lg">Error de Autenticación</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Credenciales de demo */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-xl shadow-sm">
          <div className="flex items-start">
            <div className="text-3xl mr-4 mt-1">💡</div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-800 mb-3 text-lg">¡Prueba el Sistema!</h3>
              <p className="text-blue-700 mb-4">
                Usa estas credenciales para acceder inmediatamente:
              </p>
              <div className="bg-white p-4 rounded-lg border text-sm font-mono shadow-inner mb-4">
                <div className="mb-2"><strong>Email:</strong> admin@facturapro.com</div>
                <div><strong>Password:</strong> admin123</div>
              </div>
              <button
                onClick={fillDemo}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                ✨ Llenar automáticamente
              </button>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                📧 Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="tu-email@empresa.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                🔒 Contraseña
              </label>
              <input
                type="password"
                placeholder="Tu contraseña segura"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? '🔄 Iniciando sesión...' : '🚀 Acceder al Sistema'}
            </button>
          </form>

          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-5 text-lg">¿No tienes cuenta?</p>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors text-lg"
            >
              📝 Crear cuenta nueva
            </Link>
            <div className="mt-6">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-700 font-medium hover:underline transition-colors"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Footer informativo */}
        <div className="text-center mt-10">
          <p className="text-gray-500 text-base leading-relaxed">
            🛡️ Sistema seguro con encriptación JWT<br/>
            🔗 Integración directa con Alanube<br/>
            ⚡ Desarrollado para República Dominicana
          </p>
        </div>
      </div>
    </div>
  );
}