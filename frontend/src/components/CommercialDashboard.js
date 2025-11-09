import React, { useState, useEffect } from 'react';
import api from '../api';

const CommercialDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [reportGroupBy, setReportGroupBy] = useState('day');

  useEffect(() => {
    loadDashboardData();
    loadSalesReport();
  }, [period, reportGroupBy]);

  const loadDashboardData = async () => {
    try {
      const response = await api.get(`/commercial/dashboard?period=${period}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    }
  };

  const loadSalesReport = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      if (period === 'month') {
        startDate.setDate(startDate.getDate() - 30);
      } else if (period === 'quarter') {
        startDate.setDate(startDate.getDate() - 90);
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      const response = await api.get('/commercial/reports/sales', {
        params: {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          group_by: reportGroupBy
        }
      });
      
      setSalesReport(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando reporte de ventas:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="dashboard-error">Error cargando los datos</div>;
  }

  const { summary, top_products, plan_usage } = dashboardData;

  return (
    <div className="commercial-dashboard">
      <div className="dashboard-header">
        <h2>📊 Dashboard Comercial</h2>
        <div className="period-selector">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="month">Último Mes</option>
            <option value="quarter">Último Trimestre</option>
            <option value="year">Último Año</option>
          </select>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="kpi-cards">
        <div className="kpi-card revenue">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <h3>Ingresos Totales</h3>
            <div className="kpi-value">RD${summary.total_amount?.toFixed(2) || '0.00'}</div>
            <div className="kpi-subtitle">{summary.total_invoices} facturas</div>
          </div>
        </div>

        <div className="kpi-card collection">
          <div className="kpi-icon">📈</div>
          <div className="kpi-content">
            <h3>Tasa de Cobro</h3>
            <div className="kpi-value">{summary.payment_rate?.toFixed(1) || '0.0'}%</div>
            <div className="kpi-subtitle">{summary.paid_invoices} facturas pagadas</div>
          </div>
        </div>

        <div className="kpi-card clients">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <h3>Clientes Únicos</h3>
            <div className="kpi-value">{summary.unique_clients || 0}</div>
            <div className="kpi-subtitle">clientes activos</div>
          </div>
        </div>

        <div className="kpi-card invoices">
          <div className="kpi-icon">📄</div>
          <div className="kpi-content">
            <h3>Facturas Creadas</h3>
            <div className="kpi-value">{summary.total_invoices || 0}</div>
            <div className="kpi-subtitle">en el período</div>
          </div>
        </div>
      </div>

      {/* Plan y Límites */}
      <div className="plan-usage-section">
        <div className="plan-card">
          <div className="plan-header">
            <h3>📋 Plan Actual: {plan_usage.current_plan?.toUpperCase() || 'STARTER'}</h3>
            <button className="btn-upgrade">
              🚀 Actualizar Plan
            </button>
          </div>
          
          <div className="usage-meter">
            <div className="usage-info">
              <span>Facturas este mes:</span>
              <span>{plan_usage.monthly_invoices}/{plan_usage.invoice_limit === -1 ? '∞' : plan_usage.invoice_limit}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${Math.min(plan_usage.usage_percentage || 0, 100)}%`,
                  backgroundColor: plan_usage.usage_percentage > 90 ? '#ef4444' : plan_usage.usage_percentage > 70 ? '#f59e0b' : '#10b981'
                }}
              ></div>
            </div>
            <div className="usage-percentage">
              {plan_usage.usage_percentage?.toFixed(1) || '0.0'}% utilizado
            </div>
          </div>

          {plan_usage.usage_percentage > 80 && (
            <div className="usage-warning">
              ⚠️ Te estás acercando al límite de tu plan. Considera actualizar para evitar interrupciones.
            </div>
          )}
        </div>
      </div>

      {/* Productos Más Vendidos */}
      <div className="top-products-section">
        <h3>🏆 Productos/Servicios Más Vendidos</h3>
        <div className="top-products-list">
          {top_products && top_products.length > 0 ? (
            top_products.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-rank">#{index + 1}</div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-quantity">Vendido: {product.quantity} veces</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              📦 No hay datos de productos vendidos en este período
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de Ventas */}
      <div className="sales-chart-section">
        <div className="chart-header">
          <h3>📈 Tendencia de Ventas</h3>
          <div className="chart-controls">
            <select 
              value={reportGroupBy} 
              onChange={(e) => setReportGroupBy(e.target.value)}
            >
              <option value="day">Por Día</option>
              <option value="week">Por Semana</option>
              <option value="month">Por Mes</option>
            </select>
          </div>
        </div>

        {salesReport && salesReport.data ? (
          <div className="sales-table">
            <table>
              <thead>
                <tr>
                  <th>Período</th>
                  <th>Facturas</th>
                  <th>Monto Total</th>
                  <th>Monto Cobrado</th>
                  <th>Tasa de Cobro</th>
                </tr>
              </thead>
              <tbody>
                {salesReport.data.slice(-10).map((row, index) => (
                  <tr key={index}>
                    <td>{row.period}</td>
                    <td>{row.invoice_count}</td>
                    <td>RD${row.total_amount?.toFixed(2) || '0.00'}</td>
                    <td>RD${row.paid_amount?.toFixed(2) || '0.00'}</td>
                    <td>
                      <span className={`collection-rate ${row.collection_rate > 80 ? 'good' : row.collection_rate > 50 ? 'medium' : 'low'}`}>
                        {row.collection_rate?.toFixed(1) || '0.0'}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-chart-data">
            📊 No hay suficientes datos para mostrar el gráfico de tendencias
          </div>
        )}
      </div>

      {/* Acciones Rápidas */}
      <div className="quick-actions">
        <h3>⚡ Acciones Rápidas</h3>
        <div className="actions-grid">
          <button className="action-card" onClick={() => window.location.href = '#/invoices'}>
            <div className="action-icon">📄</div>
            <div className="action-text">
              <div>Nueva Factura</div>
              <small>Crear factura con múltiples items</small>
            </div>
          </button>

          <button className="action-card" onClick={() => window.location.href = '#/products'}>
            <div className="action-icon">📦</div>
            <div className="action-text">
              <div>Gestionar Productos</div>
              <small>Agregar productos/servicios</small>
            </div>
          </button>

          <button className="action-card" onClick={() => window.location.href = '#/clients'}>
            <div className="action-icon">👥</div>
            <div className="action-text">
              <div>Gestionar Clientes</div>
              <small>Administrar base de clientes</small>
            </div>
          </button>

          <button className="action-card" onClick={() => window.location.href = '#/settings'}>
            <div className="action-icon">⚙️</div>
            <div className="action-text">
              <div>Configuración</div>
              <small>Personalizar campos y plantillas</small>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommercialDashboard;