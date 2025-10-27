import { useEffect, useState } from 'react';
// axios removido - ahora usamos fetch nativo
import { alanubeCreateInvoice } from '../alanubeApi';
import { API_ENDPOINTS } from '../config/apiConfig';

export default function Invoices() {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [alanubeResult, setAlanubeResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Obtener clientes con fetch
    fetch(API_ENDPOINTS.CLIENTS, { headers })
      .then(r => r.json())
      .then(data => setClients(data));
    
    // Obtener facturas con fetch
    fetch(API_ENDPOINTS.INVOICES, { headers })
      .then(r => r.json())
      .then(data => setInvoices(data))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('No autorizado');
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    try {
      // Crear factura con fetch
      const createResponse = await fetch(API_ENDPOINTS.INVOICES, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          client_id: Number(clientId),
          description,
          amount: Number(amount)
        })
      });
      
      if (!createResponse.ok) {
        throw new Error(`HTTP ${createResponse.status}: ${createResponse.statusText}`);
      }
      
      setClientId('');
      setDescription('');
      setAmount('');
      
      // Actualizar lista de facturas con fetch
      const refreshResponse = await fetch(API_ENDPOINTS.INVOICES, { headers });
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setInvoices(data);
      }
      
      alert('Factura creada y enviada');
    } catch (err) {
      console.error(err);
      alert('Error creando factura');
    }
  };

  const handleAlanubeTest = async (e) => {
    e.preventDefault();
    
    // Validar que hay datos del formulario
    if (!clientId || !description || !amount) {
      setAlanubeResult({ error: 'Por favor completa todos los campos antes de probar Alanube' });
      return;
    }
    
    try {
      // Formato exacto que usa el monitor (que sabemos que funciona)
      const invoiceData = {
        client_id: Number(clientId) || 1,
        description: description || 'Factura de prueba',
        amount: parseFloat(amount) || 100.00
      };
      
      console.log('🧪 Enviando a Alanube desde Invoices:', invoiceData);
      
      const res = await alanubeCreateInvoice(invoiceData);
      console.log('✅ Respuesta de Alanube:', res);
      setAlanubeResult(res);
    } catch (err) {
      console.error('Error completo:', err); // Debug log
      
      // Mejor manejo de errores
      let errorMessage = 'Error conectando con Alanube';
      
      if (err.response) {
        // Error de respuesta HTTP
        errorMessage = `Error ${err.response.status}: ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        // Error de red/conexión
        errorMessage = 'Error de conexión con Alanube. Verifica tu conexión a internet.';
      } else {
        // Error en configuración de la petición
        errorMessage = err.message || 'Error desconocido';
      }
      
      setAlanubeResult({ error: errorMessage });
    }
  };



  if (loading) return (
    <div className="content-section fade-in">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⏳</div>
        <p className="text-lg">Cargando facturas...</p>
      </div>
    </div>
  );

  return (
    <div className="content-section fade-in">
      <div className="section-header">
        <h1 className="title-main">📄 Gestión de Facturas</h1>
        <p className="subtitle">Crea facturas locales y envíalas a Alanube para facturación fiscal</p>
      </div>

      {/* Guía rápida */}
      <div className="card mb-6 bg-blue-50 border-l-4 border-blue-400">
        <div className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="font-bold text-blue-800 mb-2">¿Cómo usar FacturaPro?</h3>
            <ol className="text-blue-700 space-y-1 text-sm">
              <li><strong>1.</strong> Selecciona un cliente existente</li>
              <li><strong>2.</strong> Describe el producto/servicio</li>
              <li><strong>3.</strong> Ingresa el monto</li>
              <li><strong>4.</strong> Haz clic en "Crear factura" (guarda local)</li>
              <li><strong>5.</strong> Opcional: "Probar Alanube" (factura fiscal)</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="grid-layout grid-2">
        {/* Formulario de creación */}
        <div className="card">
          <h3 className="section-title">✨ Nueva Factura</h3>
          <p className="card-description mb-4">Completa los datos para crear una nueva factura</p>
          
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="form-label">Cliente *</label>
              <select 
                value={clientId} 
                onChange={e => setClientId(e.target.value)} 
                className="form-input" 
                required
              >
                <option value="" disabled>Selecciona un cliente</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} - RNC: {c.rnc || 'N/A'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Descripción del producto/servicio *</label>
              <textarea 
                className="form-input" 
                placeholder="Ej: Desarrollo de aplicación web, Consultoría IT, etc." 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows="3"
                required 
              />
            </div>

            <div>
              <label className="form-label">Monto (RD$) *</label>
              <input 
                className="form-input" 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                required 
              />
            </div>

            <div className="flex gap-3">
              <button className="btn-primary flex-1" type="submit">
                💾 Crear Factura Local
              </button>
              <button 
                className="btn-secondary flex-1" 
                type="button" 
                onClick={handleAlanubeTest}
              >
                🧾 Enviar a Alanube
              </button>
            </div>
          </form>
          {/* Resultado de Alanube */}
          {alanubeResult && (
            <div className={`p-4 rounded-lg border-l-4 ${
              alanubeResult.ncf 
                ? 'bg-green-50 border-green-400' 
                : 'bg-red-50 border-red-400'
            }`}>
              {alanubeResult.ncf ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">✅</span>
                    <h4 className="font-bold text-green-800">¡Factura Fiscal Creada!</h4>
                  </div>
                  <div className="text-green-700">
                    <strong>NCF:</strong> {alanubeResult.ncf}<br/>
                    <strong>Estado:</strong> {alanubeResult.status}<br/>
                    <strong>Fecha:</strong> {new Date().toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">❌</span>
                    <h4 className="font-bold text-red-800">Error en Alanube</h4>
                  </div>
                  <div className="text-red-700">{alanubeResult.error}</div>
                  <div className="text-sm text-red-600 mt-2">
                    💡 <strong>Tip:</strong> Ve al Monitor para ver logs detallados
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lista de facturas */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">📋 Facturas Creadas</h3>
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {invoices.length} facturas
            </span>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg text-muted mb-2">No hay facturas creadas</p>
              <p className="text-sm text-muted">Crea tu primera factura usando el formulario</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map(inv => {
                const client = clients.find(c => c.id === inv.client_id);
                return (
                  <div key={inv.id} className="card border-l-4 border-blue-400 bg-blue-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-blue-800">#{inv.id}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {client?.name || `Cliente ${inv.client_id}`}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{inv.description}</p>
                        <div className="text-sm text-gray-600">
                          <strong>Monto:</strong> RD$ {parseFloat(inv.amount).toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          inv.status === 'issued' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {inv.status === 'issued' ? '✅ Emitida' : '⏳ Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}