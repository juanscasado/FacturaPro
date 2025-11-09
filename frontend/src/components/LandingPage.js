import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "María González",
      company: "Consultora Legal González",
      avatar: "👩‍💼",
      text: "FacturaPro revolucionó mi práctica legal. La integración con Alanube es perfecta y ahora mis facturas cumplen automáticamente con la DGII. ¡Increíble!"
    },
    {
      name: "Carlos Méndez",
      company: "TechSolutions RD",
      avatar: "👨‍💻",
      text: "Como empresa de tecnología, necesitábamos una solución moderna. FacturaPro superó nuestras expectativas. El API es excelente para integraciones."
    },
    {
      name: "Ana Rodríguez",
      company: "Diseño Creativo Studio",
      avatar: "👩‍🎨",
      text: "Perfecto para mi estudio de diseño. Los campos personalizados me permiten facturar proyectos complejos. El soporte es excepcional."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="landing-page">
      {/* Header/Navigation */}
      <nav className={`main-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <span className="logo-icon">📄</span>
              <span className="logo-text">FacturaPro</span>
            </div>
            
            <div className="nav-links">
              <a href="#features">Características</a>
              <a href="#pricing">Precios</a>
              <a href="#testimonials">Testimonios</a>
              <Link to="/tutorial">Tutorial</Link>
              <Link to="/login" className="btn-nav-primary">Iniciar Sesión</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                La Facturación <span className="gradient-text">Más Inteligente</span> para República Dominicana
              </h1>
              <p className="hero-description">
                Crea, envía y gestiona facturas profesionales con integración automática a Alanube. 
                Cumple con la DGII sin complicaciones y haz crecer tu negocio.
              </p>
              
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Empresas Confían</div>
                </div>
                <div className="stat">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Facturas Enviadas</div>
                </div>
                <div className="stat">
                  <div className="stat-number">99.9%</div>
                  <div className="stat-label">Uptime</div>
                </div>
              </div>
              
              <div className="hero-actions">
                <Link to="/register" className="btn-hero-primary">
                  🚀 Comenzar Gratis
                </Link>
                <Link to="/tutorial" className="btn-hero-secondary">
                  🎥 Ver Demo
                </Link>
              </div>
              
              <div className="hero-note">
                ✅ Sin tarjeta de crédito • ⚡ Setup en 5 minutos • 📞 Soporte en español
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <div className="preview-title">FacturaPro Dashboard</div>
                </div>
                <div className="preview-content">
                  <div className="preview-card">
                    <div className="card-title">📊 Ingresos del Mes</div>
                    <div className="card-value">RD$1,245,890</div>
                    <div className="card-trend">+15.3% vs mes anterior</div>
                  </div>
                  <div className="preview-card">
                    <div className="card-title">📄 Facturas Enviadas</div>
                    <div className="card-value">127</div>
                    <div className="card-trend">✅ 98% aprobadas por Alanube</div>
                  </div>
                  <div className="preview-chart">
                    <div className="chart-bars">
                      <div className="bar" style={{height: '60%'}}></div>
                      <div className="bar" style={{height: '80%'}}></div>
                      <div className="bar" style={{height: '45%'}}></div>
                      <div className="bar" style={{height: '90%'}}></div>
                      <div className="bar" style={{height: '75%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>🌟 Características que Marcan la Diferencia</h2>
            <p>Todo lo que necesitas para profesionalizar tu facturación</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Integración Alanube</h3>
              <p>Envío automático a Alanube con generación de NCF. Cumplimiento fiscal garantizado con la DGII.</p>
              <ul>
                <li>✓ NCF automáticos</li>
                <li>✓ Validación DGII</li>
                <li>✓ Reportes fiscales</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Facturación Inteligente</h3>
              <p>Crea facturas profesionales en segundos con plantillas personalizables y cálculos automáticos.</p>
              <ul>
                <li>✓ Plantillas profesionales</li>
                <li>✓ Múltiples items por factura</li>
                <li>✓ Cálculo automático de ITBIS</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Gestión de Clientes</h3>
              <p>Administra tu base de clientes con campos personalizados y seguimiento de historial.</p>
              <ul>
                <li>✓ Campos personalizables</li>
                <li>✓ Historial completo</li>
                <li>✓ Importación masiva</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Reportes Avanzados</h3>
              <p>Analytics en tiempo real para tomar mejores decisiones comerciales basadas en datos.</p>
              <ul>
                <li>✓ Dashboard en tiempo real</li>
                <li>✓ Reportes personalizables</li>
                <li>✓ Exportación a Excel/PDF</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Seguridad Empresarial</h3>
              <p>Protección de datos con encriptación de nivel bancario y respaldos automáticos.</p>
              <ul>
                <li>✓ Encriptación SSL</li>
                <li>✓ Respaldos automáticos</li>
                <li>✓ Cumplimiento GDPR</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔌</div>
              <h3>API & Integraciones</h3>
              <p>Conecta con tus herramientas favoritas mediante nuestra API REST moderna.</p>
              <ul>
                <li>✓ API REST completa</li>
                <li>✓ Webhooks en tiempo real</li>
                <li>✓ Integraciones populares</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>¿Por qué elegir FacturaPro?</h2>
              <div className="benefit-item">
                <div className="benefit-icon">⏰</div>
                <div>
                  <h3>Ahorra 10+ horas semanales</h3>
                  <p>Automatiza procesos repetitivos y enfócate en hacer crecer tu negocio.</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">✅</div>
                <div>
                  <h3>100% Cumplimiento Fiscal</h3>
                  <p>Garantía de cumplimiento con todas las regulaciones de la DGII.</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">💰</div>
                <div>
                  <h3>Reduce costos operativos</h3>
                  <p>Elimina papel, reduce errores y acelera el proceso de cobro.</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">📈</div>
                <div>
                  <h3>Mejora el flujo de caja</h3>
                  <p>Facturación más rápida = cobros más rápidos = mejor liquidez.</p>
                </div>
              </div>
            </div>
            
            <div className="benefits-visual">
              <div className="before-after">
                <div className="comparison-card before">
                  <h4>❌ Antes (Proceso Manual)</h4>
                  <ul>
                    <li>⏱️ 2 horas por factura</li>
                    <li>📋 Errores frecuentes</li>
                    <li>📄 Papel y archivos físicos</li>
                    <li>😰 Estrés con la DGII</li>
                  </ul>
                </div>
                
                <div className="comparison-card after">
                  <h4>✅ Ahora (Con FacturaPro)</h4>
                  <ul>
                    <li>⚡ 2 minutos por factura</li>
                    <li>🎯 Precisión automática</li>
                    <li>☁️ Todo en la nube</li>
                    <li>😌 Tranquilidad total</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>🗣️ Lo que Dicen Nuestros Clientes</h2>
            <p>Más de 1,000 empresas dominicanas confían en FacturaPro</p>
          </div>
          
          <div className="testimonials-slider">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">"</div>
                <p>{testimonials[currentTestimonial].text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonials[currentTestimonial].avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonials[currentTestimonial].name}</div>
                    <div className="author-company">{testimonials[currentTestimonial].company}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="pricing-preview-section">
        <div className="container">
          <div className="section-header">
            <h2>💰 Planes para Cada Negocio</h2>
            <p>Comienza gratis y escala según crezcas</p>
          </div>
          
          <div className="pricing-preview-grid">
            <div className="price-card">
              <h3>Starter</h3>
              <div className="price">RD$2,999<span>/mes</span></div>
              <p>Perfecto para freelancers</p>
              <ul>
                <li>✓ 50 facturas/mes</li>
                <li>✓ 1 usuario</li>
                <li>✓ Integración Alanube</li>
              </ul>
              <Link to="/pricing" className="btn-price">Ver Detalles</Link>
            </div>
            
            <div className="price-card popular">
              <div className="popular-badge">Más Popular</div>
              <h3>Professional</h3>
              <div className="price">RD$5,999<span>/mes</span></div>
              <p>Ideal para PYMES</p>
              <ul>
                <li>✓ 200 facturas/mes</li>
                <li>✓ 3 usuarios</li>
                <li>✓ Campos personalizados</li>
                <li>✓ API básica</li>
              </ul>
              <Link to="/pricing" className="btn-price">Ver Detalles</Link>
            </div>
            
            <div className="price-card">
              <h3>Business</h3>
              <div className="price">RD$12,999<span>/mes</span></div>
              <p>Para empresas medianas</p>
              <ul>
                <li>✓ Facturas ilimitadas</li>
                <li>✓ Usuarios ilimitados</li>
                <li>✓ Multi-empresa</li>
                <li>✓ API completa</li>
              </ul>
              <Link to="/pricing" className="btn-price">Ver Detalles</Link>
            </div>
          </div>
          
          <div className="pricing-note">
            <p>🎁 <strong>14 días de prueba gratis</strong> en todos los planes • Sin tarjeta de crédito requerida</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para Revolucionar tu Facturación?</h2>
            <p>Únete a más de 1,000 empresas dominicanas que ya modernizaron sus procesos</p>
            
            <div className="cta-actions">
              <Link to="/register" className="btn-cta-primary">
                🚀 Comenzar Prueba Gratuita
              </Link>
              <Link to="/tutorial" className="btn-cta-secondary">
                📚 Ver Tutorial Completo
              </Link>
            </div>
            
            <div className="trust-indicators">
              <div className="trust-item">
                <span className="trust-icon">🏛️</span>
                <span>Cumple con DGII</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span>Datos Seguros</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">📞</span>
                <span>Soporte 24/7</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">⚡</span>
                <span>Setup Inmediato</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="logo-icon">📄</span>
                <span className="logo-text">FacturaPro</span>
              </div>
              <p>La solución de facturación más completa para República Dominicana</p>
            </div>
            
            <div className="footer-section">
              <h4>Producto</h4>
              <ul>
                <li><Link to="/features">Características</Link></li>
                <li><Link to="/pricing">Precios</Link></li>
                <li><Link to="/tutorial">Tutorial</Link></li>
                <li><a href="/api-docs">API</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Soporte</h4>
              <ul>
                <li><a href="/help">Centro de Ayuda</a></li>
                <li><a href="/contact">Contacto</a></li>
                <li><a href="/status">Estado del Sistema</a></li>
                <li><a href="/updates">Actualizaciones</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="/privacy">Privacidad</a></li>
                <li><a href="/terms">Términos</a></li>
                <li><a href="/security">Seguridad</a></li>
                <li><a href="/compliance">Cumplimiento</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2025 FacturaPro RD. Todos los derechos reservados.</p>
            <div className="footer-social">
              <span>🇩🇴 Orgullosamente dominicano</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;