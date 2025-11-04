import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/apiConfig';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetch(`${API_ENDPOINTS.USERS}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => setEmail(data.email))
    .catch(() => {});
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('No autorizado');
    try {
      const response = await fetch(`${API_ENDPOINTS.USERS}/me/password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          current_password: currentPassword, 
          new_password: newPassword 
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      alert('Contraseña actualizada');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      alert(err?.response?.data?.detail || 'Error al actualizar contraseña');
    }
  };

  return (
    <div className="content-section fade-in">
      <div className="section-header">
        <h1 className="title-main">Perfil de Usuario</h1>
        <p className="subtitle">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="grid-layout grid-1 max-w-2xl mx-auto">
        <div className="card">
          <h3 className="section-title">Información de Cuenta</h3>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted mb-1">Email registrado</p>
            <p className="text-lg font-semibold text-primary">{email || 'Cargando...'}</p>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Cambiar Contraseña</h3>
          <p className="card-description mb-4">
            Por seguridad, cambia tu contraseña periódicamente y usa una contraseña fuerte.
          </p>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="form-label">Contraseña Actual</label>
              <input 
                type="password" 
                placeholder="Ingresa tu contraseña actual" 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
                className="form-input"
                required 
              />
            </div>
            
            <div>
              <label className="form-label">Nueva Contraseña</label>
              <input 
                type="password" 
                placeholder="Ingresa una nueva contraseña" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                className="form-input"
                required 
              />
              <p className="text-xs text-muted mt-1">
                Usa al menos 8 caracteres con letras, números y símbolos
              </p>
            </div>
            
            <button type="submit" className="btn-primary">
              Actualizar Contraseña
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="section-title">Configuración de Empresa</h3>
          <p className="card-description mb-4">
            La configuración de Alanube se maneja desde el Dashboard para mayor seguridad.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>💡 Tip:</strong> Para configurar o modificar la integración con Alanube, 
              ve al Dashboard principal donde encontrarás las opciones de conexión segura.
            </p>
            <Link to="/dashboard" className="text-blue-600 hover:underline font-semibold">
              Ir al Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}