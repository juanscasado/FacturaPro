import React, { useState } from 'react';
import './PricingPage.css';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = {
    starter: {
      name: 'Starter',
      description: 'Perfecto para freelancers y pequeños negocios que están comenzando',
      monthlyPrice: 2999,
      yearlyPrice: 29990, // 2 meses gratis
      features: [
        '50 facturas por mes',
        '1 usuario',
        'Integración con Alanube',
        'Plantillas básicas',
        'Soporte por email',
        'Campos básicos de clientes',
        'Reportes simples'
      ],
      limitations: [
        'Sin campos personalizados',
        'Sin multi-usuario',
        'Sin API access'
      ],
      popular: false,
      color: 'blue'
    },
    professional: {
      name: 'Professional',
      description: 'Ideal para PYMES que necesitan funcionalidades avanzadas',
      monthlyPrice: 5999,
      yearlyPrice: 59990,
      features: [
        '200 facturas por mes',
        'Hasta 3 usuarios',
        'Todo en Starter',
        'Campos personalizados',
        'Plantillas avanzadas',
        'Reportes detallados',
        'Dashboard analítico',
        'Gestión de productos/servicios',
        'API básica',
        'Soporte prioritario'
      ],
      limitations: [
        'Sin multi-empresa',
        'Sin integraciones avanzadas'
      ],
      popular: true,
      color: 'green'
    },
    business: {
      name: 'Business',
      description: 'Para empresas medianas con necesidades complejas',
      monthlyPrice: 12999,
      yearlyPrice: 129990,
      features: [
        'Facturas ilimitadas',
        'Usuarios ilimitados',
        'Todo en Professional',
        'Multi-empresa',
        'Integraciones avanzadas',
        'Webhooks',
        'API completa',
        'Reportes personalizados',
        'Branding personalizado',
        'Soporte telefónico',
        'Capacitación incluida'
      ],
      limitations: [],
      popular: false,
      color: 'purple'
    },
    enterprise: {
      name: 'Enterprise',
      description: 'Solución personalizada para grandes corporaciones',
      monthlyPrice: 'Personalizado',
      yearlyPrice: 'Personalizado',
      features: [
        'Todo en Business',
        'Implementación personalizada',
        'Integraciones a medida',
        'SLA garantizado',
        'Soporte 24/7',
        'Gerente de cuenta dedicado',
        'Capacitación on-site',
        'Compliance avanzado',
        'Auditorías de seguridad'
      ],
      limitations: [],
      popular: false,
      color: 'gold'
    }
  };

  const getPrice = (plan) => {
    if (plan.monthlyPrice === 'Personalizado') return 'Cotización';
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    return `RD$${price.toLocaleString()}`;
  };

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 'Personalizado') return null;
    if (billingCycle === 'yearly') {
      const monthlyCost = plan.monthlyPrice * 12;
      const savings = monthlyCost - plan.yearlyPrice;
      const percentage = Math.round((savings / monthlyCost) * 100);
      return `Ahorra ${percentage}%`;
    }
    return null;
  };

  return (
    <div className="pricing-page">
      {/* Header */}
      <div className="pricing-header">
        <div className="container">
          <h1>Planes y Precios</h1>
          <p className="subtitle">
            Elige el plan perfecto para tu negocio. Todos incluyen integración completa con Alanube
            y cumplimiento fiscal dominicano.
          </p>
          
          {/* Billing Toggle */}
          <div className="billing-toggle">
            <span className={billingCycle === 'monthly' ? 'active' : ''}>Mensual</span>
            <button 
              className="toggle-switch"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            >
              <div className={`toggle-slider ${billingCycle}`}></div>
            </button>
            <span className={billingCycle === 'yearly' ? 'active' : ''}>
              Anual <span className="savings-badge">¡Ahorra hasta 20%!</span>
            </span>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="plans-container">
        <div className="container">
          <div className="plans-grid">
            {Object.entries(plans).map(([key, plan]) => (
              <div 
                key={key} 
                className={`plan-card ${plan.popular ? 'popular' : ''} ${plan.color}`}
                onClick={() => setSelectedPlan(key)}
              >
                {plan.popular && <div className="popular-badge">Más Popular</div>}
                
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <p className="plan-description">{plan.description}</p>
                  
                  <div className="price-section">
                    <div className="price">
                      {getPrice(plan)}
                      {plan.monthlyPrice !== 'Personalizado' && (
                        <span className="price-period">
                          /{billingCycle === 'monthly' ? 'mes' : 'año'}
                        </span>
                      )}
                    </div>
                    {getSavings(plan) && (
                      <div className="savings">{getSavings(plan)}</div>
                    )}
                  </div>
                </div>

                <div className="plan-features">
                  <h4>✅ Incluye:</h4>
                  <ul>
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <span className="check-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <>
                      <h4>❌ No incluye:</h4>
                      <ul className="limitations">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index}>
                            <span className="x-icon">✗</span>
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <div className="plan-action">
                  <button className={`btn-plan ${plan.popular ? 'primary' : 'secondary'}`}>
                    {plan.monthlyPrice === 'Personalizado' ? 'Contactar Ventas' : 'Comenzar Ahora'}
                  </button>
                  <p className="trial-text">
                    {plan.monthlyPrice === 'Personalizado' 
                      ? 'Demo personalizada gratis' 
                      : '14 días de prueba gratis'
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="features-comparison">
        <div className="container">
          <h2>Comparación Detallada de Características</h2>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Características</th>
                  <th>Starter</th>
                  <th>Professional</th>
                  <th>Business</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Facturas por mes</td>
                  <td>50</td>
                  <td>200</td>
                  <td>Ilimitadas</td>
                  <td>Ilimitadas</td>
                </tr>
                <tr>
                  <td>Usuarios</td>
                  <td>1</td>
                  <td>3</td>
                  <td>Ilimitados</td>
                  <td>Ilimitados</td>
                </tr>
                <tr>
                  <td>Integración Alanube</td>
                  <td>✓</td>
                  <td>✓</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>Campos personalizados</td>
                  <td>✗</td>
                  <td>✓</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>API Access</td>
                  <td>✗</td>
                  <td>Básica</td>
                  <td>Completa</td>
                  <td>Completa + Webhooks</td>
                </tr>
                <tr>
                  <td>Multi-empresa</td>
                  <td>✗</td>
                  <td>✗</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>Soporte</td>
                  <td>Email</td>
                  <td>Email + Chat</td>
                  <td>Teléfono</td>
                  <td>24/7 Dedicado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="container">
          <h2>Preguntas Frecuentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>¿Puedo cambiar de plan en cualquier momento?</h3>
              <p>Sí, puedes actualizar o reducir tu plan en cualquier momento. Los cambios se reflejan en tu próximo ciclo de facturación.</p>
            </div>
            <div className="faq-item">
              <h3>¿Qué incluye la prueba gratuita?</h3>
              <p>14 días de acceso completo a todas las funciones del plan Professional, sin necesidad de tarjeta de crédito.</p>
            </div>
            <div className="faq-item">
              <h3>¿Los precios incluyen ITBIS?</h3>
              <p>Todos los precios mostrados incluyen ITBIS (18%). Recibirás tu factura oficial con NCF automáticamente.</p>
            </div>
            <div className="faq-item">
              <h3>¿Ofrecen capacitación?</h3>
              <p>Sí, incluimos capacitación online en todos los planes. Business y Enterprise incluyen capacitación personalizada.</p>
            </div>
            <div className="faq-item">
              <h3>¿Hay costo de setup?</h3>
              <p>No hay costo de configuración inicial en ningún plan. Te ayudamos a migrar tus datos sin costo adicional.</p>
            </div>
            <div className="faq-item">
              <h3>¿Qué métodos de pago aceptan?</h3>
              <p>Aceptamos tarjetas de crédito/débito, transferencias bancarias y pagos recurrentes automáticos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <h2>¿Listo para comenzar?</h2>
          <p>Únete a más de 1,000 empresas dominicanas que ya confían en FacturaPro</p>
          <div className="cta-buttons">
            <button className="btn-primary large">Comenzar Prueba Gratuita</button>
            <button className="btn-secondary large">Solicitar Demo</button>
          </div>
          <p className="cta-note">
            💳 Sin tarjeta de crédito • ⚡ Setup en 5 minutos • 📞 Soporte en español
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;