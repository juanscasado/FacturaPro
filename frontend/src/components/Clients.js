import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_ENDPOINTS } from '../config/apiConfig';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [rnc, setRnc] = useState("");
  const [editingClient, setEditingClient] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` 
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchClients();
    // eslint-disable-next-line
  }, [navigate]);

  const fetchClients = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CLIENTS, { 
        method: 'GET',
        headers 
      });
      
      if (response.status === 401) {
        console.log('❌ Token expirado al cargar clientes, redirigiendo a login');
        localStorage.removeItem('token');
        localStorage.removeItem('alanube_token');
        localStorage.removeItem('alanube_info');
        localStorage.removeItem('alanube_connected');
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingClient) {
        // Actualizar cliente
        response = await fetch(`${API_ENDPOINTS.CLIENTS}/${editingClient.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ name, rnc })
        });
        setEditingClient(null);
      } else {
        // Crear cliente
        response = await fetch(API_ENDPOINTS.CLIENTS_CREATE, {
          method: 'POST',
          headers,
          body: JSON.stringify({ name, rnc })
        });
      }
      
      if (response.status === 401) {
        console.log('❌ Token expirado al guardar cliente, redirigiendo a login');
        localStorage.removeItem('token');
        localStorage.removeItem('alanube_token');
        localStorage.removeItem('alanube_info');
        localStorage.removeItem('alanube_connected');
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setName("");
      setRnc("");
      fetchClients();
    } catch (err) {
      console.error('Error saving client:', err);
      alert("Error al guardar el cliente: " + err.message);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setName(client.name);
    setRnc(client.rnc);
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este cliente?")) return;
    try {
      const response = await fetch(`${API_ENDPOINTS.CLIENTS}/${clientId}`, {
        method: 'DELETE',
        headers
      });
      
      if (response.status === 401) {
        console.log('❌ Token expirado al eliminar cliente, redirigiendo a login');
        localStorage.removeItem('token');
        localStorage.removeItem('alanube_token');
        localStorage.removeItem('alanube_info');
        localStorage.removeItem('alanube_connected');
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      fetchClients();
    } catch (err) {
      console.error('Error deleting client:', err);
      alert("Error al eliminar el cliente: " + err.message);
    }
  };



  if (loading) return (
    <div className="min-h-screen bg-main flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="loading-spinner"></div>
        <span className="text-lg">Cargando clientes...</span>
      </div>
    </div>
  );

  return (
    <div className="content-section fade-in">
      <div className="section-header">
        <h1 className="title-main">Gestión de Clientes</h1>
        <p className="subtitle">Administra la información de tus clientes y su documentación fiscal</p>
      </div>

      <div className="grid-layout grid-1">
        <div className="card">
          <h3 className="section-title">
            {editingClient ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Nombre del Cliente</label>
              <input
                type="text"
                placeholder="Nombre completo o razón social"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="form-label">RNC / Cédula</label>
              <input
                type="text"
                placeholder="Número de identificación fiscal"
                value={rnc}
                onChange={(e) => setRnc(e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary">
                {editingClient ? "Actualizar Cliente" : "Agregar Cliente"}
              </button>
              
              {editingClient && (
                <button 
                  type="button" 
                  onClick={() => { 
                    setEditingClient(null); 
                    setName(""); 
                    setRnc(""); 
                  }} 
                  className="btn-outline"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title">Lista de Clientes</h3>
            <Link to="/dashboard" className="nav-link">
              ← Volver al Dashboard
            </Link>
          </div>
          
          {clients.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg mb-2">No hay clientes registrados</p>
              <p className="text-gray-400">Agrega tu primer cliente usando el formulario de arriba</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-primary">{client.name}</h4>
                    <p className="text-sm text-muted">RNC: {client.rnc}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="btn-secondary text-sm px-3 py-2"
                      title="Editar cliente"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-lg transition-colors"
                      title="Eliminar cliente"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
