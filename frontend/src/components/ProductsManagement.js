import React, { useState, useEffect } from 'react';
import api from '../api';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ type: 'all', category: 'all' });
  
  const [newProduct, setNewProduct] = useState({
    type: 'product',
    name: '',
    description: '',
    price: 0,
    category: '',
    sku: '',
    tax_rate: 18.0
  });

  const categories = [
    'Servicios', 'Software', 'Consultoría', 'Hardware', 
    'Marketing', 'Diseño', 'Desarrollo', 'Mantenimiento', 'Otros'
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/commercial/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProduct) {
        await api.put(`/commercial/products/${editingProduct.id}`, newProduct);
        alert('✅ Producto actualizado exitosamente!');
      } else {
        await api.post('/commercial/products', newProduct);
        alert('✅ Producto creado exitosamente!');
      }

      setShowProductForm(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error guardando producto:', error);
      
      if (error.response?.status === 403) {
        alert('❌ Límite de productos alcanzado para su plan. Considere actualizar su suscripción.');
      } else {
        alert('Error guardando el producto. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      type: product.type,
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      sku: product.sku || '',
      tax_rate: product.tax_rate || 18.0
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Está seguro de eliminar este producto/servicio?')) {
      return;
    }

    try {
      await api.delete(`/commercial/products/${productId}`);
      alert('✅ Producto eliminado exitosamente!');
      loadProducts();
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('Error eliminando el producto. Intente nuevamente.');
    }
  };

  const resetForm = () => {
    setNewProduct({
      type: 'product',
      name: '',
      description: '',
      price: 0,
      category: '',
      sku: '',
      tax_rate: 18.0
    });
  };

  const generateSKU = () => {
    const prefix = newProduct.type === 'service' ? 'SRV' : 'PRD';
    const category = newProduct.category ? newProduct.category.substring(0, 3).toUpperCase() : 'GEN';
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${category}-${timestamp}`;
  };

  const filteredProducts = products.filter(product => {
    const typeMatch = filter.type === 'all' || product.type === filter.type;
    const categoryMatch = filter.category === 'all' || product.category === filter.category;
    return typeMatch && categoryMatch;
  });

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>📦 Gestión de Productos y Servicios</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowProductForm(true)}
        >
          ➕ Nuevo Producto/Servicio
        </button>
      </div>

      {/* Filtros */}
      <div className="products-filters">
        <div className="filter-group">
          <label>Tipo:</label>
          <select 
            value={filter.type} 
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="all">Todos</option>
            <option value="product">Productos</option>
            <option value="service">Servicios</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Categoría:</label>
          <select 
            value={filter.category} 
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="all">Todas</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-results">
          📊 Mostrando {filteredProducts.length} de {products.length} elementos
        </div>
      </div>

      {/* Formulario de Producto */}
      {showProductForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProduct ? '✏️ Editar' : '📝 Crear'} Producto/Servicio</h3>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateProduct}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo:</label>
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev, type: e.target.value
                    }))}
                    required
                  >
                    <option value="product">📦 Producto</option>
                    <option value="service">🔧 Servicio</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Categoría:</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev, category: e.target.value
                    }))}
                  >
                    <option value="">Seleccionar categoría...</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({
                    ...prev, name: e.target.value
                  }))}
                  placeholder="Nombre del producto o servicio"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({
                    ...prev, description: e.target.value
                  }))}
                  placeholder="Descripción detallada"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio (RD$):</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev, price: parseFloat(e.target.value) || 0
                    }))}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ITBIS (%):</label>
                  <input
                    type="number"
                    value={newProduct.tax_rate}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev, tax_rate: parseFloat(e.target.value) || 0
                    }))}
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>SKU (Código):</label>
                <div className="sku-input-group">
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev, sku: e.target.value
                    }))}
                    placeholder="Código único del producto"
                  />
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={() => setNewProduct(prev => ({
                      ...prev, sku: generateSKU()
                    }))}
                  >
                    🎲 Generar
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Productos */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-header">
              <div className="product-type-badge">
                {product.type === 'product' ? '📦' : '🔧'} {product.type === 'product' ? 'Producto' : 'Servicio'}
              </div>
              {product.category && (
                <div className="product-category">
                  {product.category}
                </div>
              )}
            </div>
            
            <div className="product-content">
              <h3>{product.name}</h3>
              {product.description && (
                <p className="product-description">{product.description}</p>
              )}
              
              <div className="product-details">
                {product.sku && (
                  <div className="product-sku">
                    <strong>SKU:</strong> {product.sku}
                  </div>
                )}
                
                <div className="product-pricing">
                  <div className="price">RD${parseFloat(product.price).toFixed(2)}</div>
                  {product.tax_rate && (
                    <div className="tax-info">
                      + {product.tax_rate}% ITBIS
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="product-actions">
              <button
                className="btn-secondary"
                onClick={() => handleEditProduct(product)}
              >
                ✏️ Editar
              </button>
              
              <button
                className="btn-danger"
                onClick={() => handleDeleteProduct(product.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No hay productos o servicios que coincidan con los filtros</p>
            <button 
              className="btn-primary"
              onClick={() => setShowProductForm(true)}
            >
              Crear primer producto/servicio
            </button>
          </div>
        )}
      </div>

      {/* Resumen de Productos */}
      <div className="products-summary">
        <div className="summary-card">
          <h4>📊 Resumen</h4>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Total de productos:</span>
              <span className="stat-value">{products.filter(p => p.type === 'product').length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total de servicios:</span>
              <span className="stat-value">{products.filter(p => p.type === 'service').length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Precio promedio:</span>
              <span className="stat-value">
                RD${products.length > 0 
                  ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)
                  : '0.00'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsManagement;