import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';

export default function CompanySettings() {
  const [settings, setSettings] = useState({
    // Información de empresa
    company_name: '',
    company_rnc: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    
    // Configuración de facturación
    default_currency: 'DOP',
    tax_percentage: 18.00,
    invoice_prefix: 'FACT-',
    
    // Campos dinámicos para clientes
    required_client_fields: ['phone', 'address'],
    optional_client_fields: ['contact_person', 'email'],
    
    // Campos personalizados para facturas
    invoice_custom_fields: [],
    
    // Configuración de Alanube
    alanube_environment: 'sandbox'
  });
  
  const [customField, setCustomField] = useState({
    name: '',
    type: 'text',
    required: false,
    label: ''
  });

  // Opciones de campos disponibles
  const availableClientFields = [
    { key: 'phone', label: 'Teléfono', type: 'tel' },
    { key: 'email', label: 'Correo Electrónico', type: 'email' },
    { key: 'address', label: 'Dirección', type: 'textarea' },
    { key: 'contact_person', label: 'Persona de Contacto', type: 'text' },
    { key: 'tax_id', label: 'Cédula/Pasaporte', type: 'text' },
    { key: 'client_type', label: 'Tipo de Cliente', type: 'select', options: ['individual', 'business'] }
  ];

  const fieldTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Teléfono' },
    { value: 'date', label: 'Fecha' },
    { value: 'textarea', label: 'Área de Texto' },
    { value: 'select', label: 'Selección' },
    { value: 'checkbox', label: 'Casilla' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.BASE}/company/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...settings, ...data });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.BASE}/company/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        alert('✅ Configuración guardada exitosamente');
      } else {
        throw new Error('Error guardando configuración');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Error guardando configuración');
    }
  };

  const addCustomField = () => {
    if (!customField.name || !customField.label) {
      alert('Por favor completa el nombre y etiqueta del campo');
      return;
    }
    
    const newField = { ...customField, id: Date.now() };
    setSettings({
      ...settings,
      invoice_custom_fields: [...settings.invoice_custom_fields, newField]
    });
    
    setCustomField({ name: '', type: 'text', required: false, label: '' });
  };

  const removeCustomField = (fieldId) => {
    setSettings({
      ...settings,
      invoice_custom_fields: settings.invoice_custom_fields.filter(f => f.id !== fieldId)
    });
  };

  const toggleClientField = (fieldKey, isRequired) => {
    const currentRequired = settings.required_client_fields || [];
    const currentOptional = settings.optional_client_fields || [];
    
    if (isRequired) {
      // Mover a requeridos
      setSettings({
        ...settings,
        required_client_fields: [...currentRequired.filter(f => f !== fieldKey), fieldKey],
        optional_client_fields: currentOptional.filter(f => f !== fieldKey)
      });
    } else {
      // Mover a opcionales
      setSettings({
        ...settings,
        optional_client_fields: [...currentOptional.filter(f => f !== fieldKey), fieldKey],
        required_client_fields: currentRequired.filter(f => f !== fieldKey)
      });
    }
  };

  const removeClientField = (fieldKey) => {
    setSettings({
      ...settings,
      required_client_fields: (settings.required_client_fields || []).filter(f => f !== fieldKey),
      optional_client_fields: (settings.optional_client_fields || []).filter(f => f !== fieldKey)
    });
  };

  return (
    <div className="content-section fade-in">
      <div className="section-header">
        <h1 className="title-main">⚙️ Configuración de Empresa</h1>
        <p className="subtitle">Personaliza FacturaPro para tu negocio</p>
      </div>

      <div className="grid-layout grid-2">
        {/* Información de Empresa */}
        <div className="card">
          <h3 className="section-title">🏢 Información de Empresa</h3>
          
          <div className="space-y-4">
            <div>
              <label className="form-label">Nombre de la Empresa *</label>
              <input
                className="form-input"
                value={settings.company_name}
                onChange={(e) => setSettings({...settings, company_name: e.target.value})}
                placeholder="Mi Empresa SRL"
              />
            </div>
            
            <div>
              <label className="form-label">RNC *</label>
              <input
                className="form-input"
                value={settings.company_rnc}
                onChange={(e) => setSettings({...settings, company_rnc: e.target.value})}
                placeholder="101234567"
              />
            </div>
            
            <div>
              <label className="form-label">Dirección</label>
              <textarea
                className="form-input"
                value={settings.company_address}
                onChange={(e) => setSettings({...settings, company_address: e.target.value})}
                placeholder="Calle, Ciudad, República Dominicana"
                rows="3"
              />
            </div>
            
            <div className="grid-2">
              <div>
                <label className="form-label">Teléfono</label>
                <input
                  className="form-input"
                  value={settings.company_phone}
                  onChange={(e) => setSettings({...settings, company_phone: e.target.value})}
                  placeholder="(809) 123-4567"
                />
              </div>
              
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={settings.company_email}
                  onChange={(e) => setSettings({...settings, company_email: e.target.value})}
                  placeholder="info@miempresa.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configuración de Facturación */}
        <div className="card">
          <h3 className="section-title">📋 Configuración de Facturación</h3>
          
          <div className="space-y-4">
            <div className="grid-2">
              <div>
                <label className="form-label">Moneda por Defecto</label>
                <select
                  className="form-input"
                  value={settings.default_currency}
                  onChange={(e) => setSettings({...settings, default_currency: e.target.value})}
                >
                  <option value="DOP">Peso Dominicano (DOP)</option>
                  <option value="USD">Dólar Americano (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">ITBIS (%)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={settings.tax_percentage}
                  onChange={(e) => setSettings({...settings, tax_percentage: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            
            <div>
              <label className="form-label">Prefijo de Facturas</label>
              <input
                className="form-input"
                value={settings.invoice_prefix}
                onChange={(e) => setSettings({...settings, invoice_prefix: e.target.value})}
                placeholder="FACT-"
              />
              <p className="text-sm text-gray-600 mt-1">
                Las facturas se numerarán como: {settings.invoice_prefix}001, {settings.invoice_prefix}002, etc.
              </p>
            </div>

            <div>
              <label className="form-label">Entorno de Alanube</label>
              <select
                className="form-input"
                value={settings.alanube_environment}
                onChange={(e) => setSettings({...settings, alanube_environment: e.target.value})}
              >
                <option value="sandbox">Sandbox (Pruebas)</option>
                <option value="production">Producción</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Campos Dinámicos para Clientes */}
      <div className="card mt-6">
        <h3 className="section-title">👥 Campos de Clientes</h3>
        <p className="card-description">Configura qué información necesitas capturar de tus clientes</p>
        
        <div className="grid-2 mt-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Campos Requeridos</h4>
            <div className="space-y-2">
              {(settings.required_client_fields || []).map(fieldKey => {
                const field = availableClientFields.find(f => f.key === fieldKey);
                return field ? (
                  <div key={fieldKey} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span>{field.label}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleClientField(fieldKey, false)}
                        className="text-blue-600 text-sm"
                      >
                        Opcional
                      </button>
                      <button
                        onClick={() => removeClientField(fieldKey)}
                        className="text-red-600 text-sm"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Campos Opcionales</h4>
            <div className="space-y-2">
              {(settings.optional_client_fields || []).map(fieldKey => {
                const field = availableClientFields.find(f => f.key === fieldKey);
                return field ? (
                  <div key={fieldKey} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span>{field.label}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleClientField(fieldKey, true)}
                        className="text-red-600 text-sm"
                      >
                        Requerido
                      </button>
                      <button
                        onClick={() => removeClientField(fieldKey)}
                        className="text-gray-600 text-sm"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold text-gray-800 mb-3">Agregar Campo</h4>
          <div className="flex gap-2 items-end">
            <select
              className="form-input flex-1"
              onChange={(e) => {
                const field = availableClientFields.find(f => f.key === e.target.value);
                if (field) {
                  toggleClientField(field.key, true);
                }
              }}
              value=""
            >
              <option value="">Seleccionar campo...</option>
              {availableClientFields
                .filter(field => 
                  ![...(settings.required_client_fields || []), ...(settings.optional_client_fields || [])].includes(field.key)
                )
                .map(field => (
                  <option key={field.key} value={field.key}>
                    {field.label}
                  </option>
                ))
              }
            </select>
          </div>
        </div>
      </div>

      {/* Campos Personalizados para Facturas */}
      <div className="card mt-6">
        <h3 className="section-title">📝 Campos Personalizados de Facturas</h3>
        <p className="card-description">Agrega campos adicionales específicos para tu negocio</p>
        
        {/* Lista de campos existentes */}
        <div className="space-y-2 mt-4">
          {(settings.invoice_custom_fields || []).map(field => (
            <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{field.label}</span>
                <span className="text-sm text-gray-600 ml-2">({field.type})</span>
                {field.required && <span className="text-xs text-red-600 ml-2">Requerido</span>}
              </div>
              <button
                onClick={() => removeCustomField(field.id)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
        
        {/* Formulario para agregar nuevo campo */}
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold text-gray-800 mb-3">Nuevo Campo Personalizado</h4>
          <div className="grid-4 gap-4">
            <div>
              <label className="form-label">Nombre del Campo</label>
              <input
                className="form-input"
                value={customField.name}
                onChange={(e) => setCustomField({...customField, name: e.target.value})}
                placeholder="campo_personalizado"
              />
            </div>
            
            <div>
              <label className="form-label">Etiqueta</label>
              <input
                className="form-input"
                value={customField.label}
                onChange={(e) => setCustomField({...customField, label: e.target.value})}
                placeholder="Campo Personalizado"
              />
            </div>
            
            <div>
              <label className="form-label">Tipo</label>
              <select
                className="form-input"
                value={customField.type}
                onChange={(e) => setCustomField({...customField, type: e.target.value})}
              >
                {fieldTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={customField.required}
                onChange={(e) => setCustomField({...customField, required: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="required" className="text-sm">Requerido</label>
            </div>
          </div>
          
          <button
            onClick={addCustomField}
            className="btn-secondary mt-3"
          >
            Agregar Campo
          </button>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => window.location.reload()}
          className="btn-secondary"
        >
          Cancelar
        </button>
        <button
          onClick={saveSettings}
          className="btn-primary"
        >
          💾 Guardar Configuración
        </button>
      </div>
    </div>
  );
}