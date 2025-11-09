import React, { useState, useEffect } from 'react';
import api from '../api';

const EnhancedInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para nueva factura con múltiples items
  const [newInvoice, setNewInvoice] = useState({
    client_name: '',
    client_rnc: '',
    client_address: '',
    client_email: '',
    items: [{
      description: '',
      quantity: 1,
      unit_price: 0,
      tax_rate: 18
    }],
    notes: '',
    status: 'draft'
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadInvoices();
    loadProducts();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await api.get('/commercial/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error cargando facturas:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get('/commercial/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  // Agregar item a la factura
  const addInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 18
      }]
    }));
  };

  // Remover item de la factura
  const removeInvoiceItem = (index) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Actualizar item específico
  const updateInvoiceItem = (index, field, value) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Seleccionar producto predefinido
  const selectProduct = (index, productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      updateInvoiceItem(index, 'description', product.name);
      updateInvoiceItem(index, 'unit_price', product.price);
      updateInvoiceItem(index, 'tax_rate', product.tax_rate || 18);
    }
  };

  // Calcular totales de la factura
  const calculateTotals = () => {
    const subtotal = newInvoice.items.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price), 0
    );
    const taxAmount = newInvoice.items.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price * item.tax_rate / 100), 0
    );
    const total = subtotal + taxAmount;
    
    return { subtotal, taxAmount, total };
  };

  // Crear nueva factura
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear factura con items
      const response = await api.post('/commercial/invoices/with-items', newInvoice);
      
      if (response.status === 200) {
        alert(`✅ Factura ${response.data.number} creada exitosamente!`);
        setShowInvoiceForm(false);
        setNewInvoice({
          client_name: '',
          client_rnc: '',
          client_address: '',
          client_email: '',
          items: [{
            description: '',
            quantity: 1,
            unit_price: 0,
            tax_rate: 18
          }],
          notes: '',
          status: 'draft'
        });
        loadInvoices();
      }
    } catch (error) {
      console.error('Error creando factura:', error);
      
      if (error.response?.status === 403) {
        alert('❌ Límite de facturas alcanzado para su plan. Considere actualizar su suscripción.');
      } else {
        alert('Error creando la factura. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Enviar a Alanube
  const handleSendToAlanube = async (invoiceId) => {
    setLoading(true);
    try {
      const response = await api.post(`/invoices/${invoiceId}/send-alanube`);
      
      if (response.status === 200 && response.data.alanube_result) {
        const ncf = response.data.alanube_result.data?.ncf;
        if (ncf) {
          alert(`✅ Factura enviada exitosamente a Alanube!\n🧾 NCF generado: ${ncf}`);
          loadInvoices(); // Recargar para mostrar el NCF actualizado
        } else {
          alert('✅ Factura enviada a Alanube, pero no se recibió NCF');
        }
      }
    } catch (error) {
      console.error('Error enviando a Alanube:', error);
      alert('❌ Error enviando la factura a Alanube');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <div className="invoices-container">
      <div className="invoices-header">
        <h2>📄 Gestión de Facturas</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowInvoiceForm(true)}
        >
          ➕ Nueva Factura
        </button>
      </div>

      {/* Formulario de Nueva Factura Mejorado */}
      {showInvoiceForm && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>📝 Crear Nueva Factura</h3>
              <button 
                className="btn-close"
                onClick={() => setShowInvoiceForm(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateInvoice}>
              {/* Datos del Cliente */}
              <div className="form-section">
                <h4>👤 Información del Cliente</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre/Razón Social:</label>
                    <input
                      type="text"
                      value={newInvoice.client_name}
                      onChange={(e) => setNewInvoice(prev => ({
                        ...prev, client_name: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>RNC/Cédula:</label>
                    <input
                      type="text"
                      value={newInvoice.client_rnc}
                      onChange={(e) => setNewInvoice(prev => ({
                        ...prev, client_rnc: e.target.value
                      }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Dirección:</label>
                    <input
                      type="text"
                      value={newInvoice.client_address}
                      onChange={(e) => setNewInvoice(prev => ({
                        ...prev, client_address: e.target.value
                      }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={newInvoice.client_email}
                      onChange={(e) => setNewInvoice(prev => ({
                        ...prev, client_email: e.target.value
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Items de la Factura */}
              <div className="form-section">
                <div className="section-header">
                  <h4>📦 Items de la Factura</h4>
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={addInvoiceItem}
                  >
                    ➕ Agregar Item
                  </button>
                </div>

                <div className="invoice-items">
                  {newInvoice.items.map((item, index) => (
                    <div key={index} className="invoice-item">
                      <div className="item-header">
                        <span>Item #{index + 1}</span>
                        {newInvoice.items.length > 1 && (
                          <button
                            type="button"
                            className="btn-danger-small"
                            onClick={() => removeInvoiceItem(index)}
                          >
                            🗑️
                          </button>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group flex-2">
                          <label>Producto/Servicio:</label>
                          <select
                            onChange={(e) => selectProduct(index, e.target.value)}
                            className="product-select"
                          >
                            <option value="">Seleccionar producto...</option>
                            {products.map(product => (
                              <option key={product.id} value={product.id}>
                                {product.name} - RD${product.price.toFixed(2)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group flex-3">
                          <label>Descripción:</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                            placeholder="Descripción del producto/servicio"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Cantidad:</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateInvoiceItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Precio Unitario:</label>
                          <input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) => updateInvoiceItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>ITBIS (%):</label>
                          <input
                            type="number"
                            value={item.tax_rate}
                            onChange={(e) => updateInvoiceItem(index, 'tax_rate', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </div>
                        <div className="form-group">
                          <label>Total:</label>
                          <div className="calculated-value">
                            RD${(item.quantity * item.unit_price * (1 + item.tax_rate / 100)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="form-section">
                <div className="invoice-totals">
                  <div className="totals-row">
                    <span>Subtotal:</span>
                    <span>RD${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="totals-row">
                    <span>ITBIS:</span>
                    <span>RD${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="totals-row total">
                    <span>Total:</span>
                    <span>RD${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div className="form-section">
                <div className="form-group">
                  <label>Notas adicionales:</label>
                  <textarea
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice(prev => ({
                      ...prev, notes: e.target.value
                    }))}
                    rows="3"
                    placeholder="Condiciones de pago, garantías, etc."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowInvoiceForm(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear Factura'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Facturas Mejorada */}
      <div className="invoices-list">
        {invoices.map(invoice => (
          <div key={invoice.id} className="invoice-card enhanced">
            <div className="invoice-header">
              <div className="invoice-info">
                <h3>#{invoice.number}</h3>
                <span className={`status-badge ${invoice.status}`}>
                  {invoice.status === 'draft' && '📝 Borrador'}
                  {invoice.status === 'sent' && '📤 Enviada'}
                  {invoice.status === 'paid' && '✅ Pagada'}
                </span>
              </div>
              <div className="invoice-amount">
                RD${parseFloat(invoice.total).toFixed(2)}
              </div>
            </div>
            
            <div className="invoice-details">
              <div className="client-info">
                <strong>{invoice.client_name}</strong>
                <span>{invoice.client_rnc}</span>
              </div>
              <div className="invoice-meta">
                <span>📅 {new Date(invoice.created_at).toLocaleDateString()}</span>
                {invoice.ncf && <span>🧾 NCF: {invoice.ncf}</span>}
              </div>
            </div>

            {/* Mostrar items de la factura */}
            {invoice.items && invoice.items.length > 0 && (
              <div className="invoice-items-preview">
                <strong>Items:</strong>
                <ul>
                  {invoice.items.map(item => (
                    <li key={item.id}>
                      {item.description} - Cant: {item.quantity} - RD${parseFloat(item.unit_price).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="invoice-actions">
              <button
                className="btn-primary"
                onClick={() => handleSendToAlanube(invoice.id)}
                disabled={loading || invoice.ncf}
              >
                {invoice.ncf ? '✅ Enviada a Alanube' : '📤 Enviar a Alanube'}
              </button>
              
              <button className="btn-secondary">
                📄 Ver Detalles
              </button>
              
              <button className="btn-secondary">
                🖨️ Imprimir
              </button>
            </div>
          </div>
        ))}
        
        {invoices.length === 0 && (
          <div className="empty-state">
            <p>📄 No hay facturas creadas aún</p>
            <button 
              className="btn-primary"
              onClick={() => setShowInvoiceForm(true)}
            >
              Crear primera factura
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedInvoices;