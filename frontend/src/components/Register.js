import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    firstName: "",
    lastName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        company_name: formData.companyName,
        first_name: formData.firstName,
        last_name: formData.lastName
      });

      if (result.success) {
        console.log("Usuario registrado:", result.user);
        navigate("/app/dashboard", { replace: true });
      } else {
        setError(result.error || "Error al crear la cuenta");
      }
    } catch (err) {
      setError("Error de conexión. Inténtalo de nuevo.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
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
          <p className="text-lg text-gray-600">Crear Tu Cuenta Empresarial</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8 rounded-r-xl shadow-sm">
            <div className="flex items-start">
              <div className="text-3xl mr-4 mt-1">❌</div>
              <div className="flex-1">
                <h3 className="font-bold text-red-800 mb-2 text-lg">Error en el Registro</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Crear Cuenta</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👤 Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Tu nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👤 Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Tu apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Información de la Empresa */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🏢 Nombre de la Empresa
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Mi Empresa S.R.L."
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                placeholder="tu-email@empresa.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            {/* Contraseñas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Contraseña
              </label>
              <input
                type="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
                minLength="6"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? '🔄 Creando cuenta...' : '🚀 Crear Mi Cuenta'}
            </button>
          </form>

          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-5 text-lg">¿Ya tienes cuenta?</p>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors text-lg"
            >
              🔑 Iniciar sesión
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
          <p className="text-gray-500 text-sm leading-relaxed">
            🎁 <strong>14 días de prueba gratis</strong><br/>
            🔒 Datos protegidos con encriptación SSL<br/>
            📞 Soporte en español incluido
          </p>
        </div>
      </div>
    </div>
  );
}
