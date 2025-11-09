import React, { useState } from 'react';
import './TutorialPage.css';

const TutorialPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const tutorials = [
    {
      id: 'setup',
      title: '🚀 Configuración Inicial',
      description: 'Configura tu empresa y personaliza FacturaPro',
      duration: '5 min',
      steps: [
        {
          title: 'Crear tu cuenta',
          content: 'Regístrate con tu email empresarial y verifica tu cuenta.',
          image: '/tutorial/signup.png',
          code: `// No se requiere código - proceso visual
1. Ir a "Registro" 
2. Completar datos empresariales
3. Verificar email
4. ¡Listo para comenzar!`
        },
        {
          title: 'Configurar información de empresa',
          content: 'Completa los datos de tu empresa para que aparezcan en las facturas.',
          image: '/tutorial/company-setup.png',
          code: `Datos requeridos:
• Nombre o Razón Social
• RNC de la empresa
• Dirección completa
• Teléfono de contacto
• Email empresarial
• Logo (opcional)`
        },
        {
          title: 'Conectar con Alanube',
          content: 'Configura la integración con Alanube para cumplimiento fiscal.',
          image: '/tutorial/alanube-setup.png',
          code: `Configuración Alanube:
1. Obtener Company ID de Alanube
2. Configurar credenciales API
3. Probar conexión
4. Activar envío automático`
        }
      ]
    },
    {
      id: 'clients',
      title: '👥 Gestión de Clientes',
      description: 'Aprende a crear y administrar tu base de clientes',
      duration: '7 min',
      steps: [
        {
          title: 'Crear un cliente',
          content: 'Agrega la información básica y campos personalizados de tus clientes.',
          image: '/tutorial/create-client.png',
          code: `Información del cliente:
• Nombre/Razón Social *
• RNC/Cédula *
• Email
• Teléfono
• Dirección
• Campos personalizados (Plan Pro+)`
        },
        {
          title: 'Importar clientes masivamente',
          content: 'Sube tu base de datos existente usando nuestro template Excel.',
          image: '/tutorial/import-clients.png',
          code: `Template Excel incluye:
- Nombre/Razón Social
- RNC/Cédula  
- Email
- Teléfono
- Dirección
- Tipo de cliente
- Notas

Máximo: 1000 clientes por importación`
        },
        {
          title: 'Configurar campos personalizados',
          content: 'Personaliza los campos según las necesidades de tu negocio.',
          image: '/tutorial/custom-fields.png',
          code: `Tipos de campos disponibles:
• Texto corto
• Texto largo
• Número
• Fecha
• Lista desplegable
• Casilla de verificación
• Campo monetario`
        }
      ]
    },
    {
      id: 'products',
      title: '📦 Catálogo de Productos',
      description: 'Configura tu catálogo de productos y servicios',
      duration: '6 min',
      steps: [
        {
          title: 'Agregar productos/servicios',
          content: 'Crea tu catálogo con precios y categorías organizadas.',
          image: '/tutorial/add-product.png',
          code: `Información del producto:
• Nombre del producto/servicio *
• Descripción detallada
• Precio base *
• Categoría
• SKU (código único)
• Tasa de ITBIS (0%, 18%, etc.)
• Estado (activo/inactivo)`
        },
        {
          title: 'Organizar por categorías',
          content: 'Agrupa tus productos para encontrarlos fácilmente.',
          image: '/tutorial/categories.png',
          code: `Categorías sugeridas:
• Servicios Profesionales
• Productos Físicos  
• Software y Licencias
• Consultoría
• Mantenimiento
• Marketing y Publicidad
• Capacitación`
        },
        {
          title: 'Configurar precios dinámicos',
          content: 'Establece precios que se actualicen automáticamente.',
          image: '/tutorial/dynamic-pricing.png',
          code: `Opciones de precios:
• Precio fijo
• Precio por horas
• Precio por proyecto
• Descuentos por volumen
• Precios por cliente tipo
• Promociones temporales`
        }
      ]
    },
    {
      id: 'invoicing',
      title: '📄 Creación de Facturas',
      description: 'Domina el proceso de facturación completo',
      duration: '10 min',
      steps: [
        {
          title: 'Crear tu primera factura',
          content: 'Proceso paso a paso para crear una factura profesional.',
          image: '/tutorial/create-invoice.png',
          code: `Pasos para facturar:
1. Seleccionar cliente
2. Agregar productos/servicios
3. Configurar cantidades y precios
4. Aplicar descuentos si aplica
5. Revisar totales
6. Guardar como borrador o enviar`
        },
        {
          title: 'Facturas con múltiples ítems',
          content: 'Crea facturas complejas con varios productos y servicios.',
          image: '/tutorial/multi-item-invoice.png',
          code: `Características avanzadas:
• Múltiples líneas de productos
• Diferentes tasas de ITBIS por ítem
• Descuentos por línea o totales
• Notas y condiciones especiales
• Archivos adjuntos
• Fecha de vencimiento personalizada`
        },
        {
          title: 'Envío automático a Alanube',
          content: 'Configura el envío automático para cumplimiento fiscal.',
          image: '/tutorial/alanube-send.png',
          code: `Proceso automático:
1. Factura creada ✓
2. Validación de datos ✓
3. Envío a Alanube ✓
4. Recepción de NCF ✓
5. Actualización de estado ✓
6. Notificación al cliente ✓`
        }
      ]
    },
    {
      id: 'reports',
      title: '📊 Reportes y Analytics',
      description: 'Analiza el rendimiento de tu negocio',
      duration: '8 min',
      steps: [
        {
          title: 'Dashboard principal',
          content: 'Entiende las métricas clave de tu negocio.',
          image: '/tutorial/dashboard.png',
          code: `Métricas principales:
• Ingresos totales del período
• Número de facturas emitidas
• Tasa de cobro (% pagadas)
• Clientes únicos
• Productos más vendidos
• Tendencia de ventas
• Estado del plan actual`
        },
        {
          title: 'Reportes de ventas',
          content: 'Genera reportes detallados por períodos y categorías.',
          image: '/tutorial/sales-reports.png',
          code: `Tipos de reportes:
• Por período (día, semana, mes, año)
• Por cliente o grupo de clientes
• Por producto/servicio
• Por método de pago
• Por estado de factura
• Comparativos año anterior
• Exportación a Excel/PDF`
        },
        {
          title: 'Analytics avanzados',
          content: 'Usa los datos para tomar mejores decisiones comerciales.',
          image: '/tutorial/analytics.png',
          code: `Insights disponibles:
• Estacionalidad de ventas
• Clientes más rentables
• Productos con mejor margen
• Tiempo promedio de cobro
• Predicciones de ingresos
• Análisis de crecimiento
• ROI por canal de venta`
        }
      ]
    }
  ];

  const currentTutorial = tutorials.find(t => t.id === currentStep) || tutorials[0];
  const currentStepIndex = Math.floor(currentStep % 1000);

  const markStepCompleted = (tutorialId, stepIndex) => {
    const stepId = `${tutorialId}-${stepIndex}`;
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const isStepCompleted = (tutorialId, stepIndex) => {
    return completedSteps.has(`${tutorialId}-${stepIndex}`);
  };

  const goToStep = (tutorialIndex, stepIndex = 0) => {
    setCurrentStep(tutorialIndex * 1000 + stepIndex);
  };

  const nextStep = () => {
    const tutorialIndex = Math.floor(currentStep / 1000);
    const stepIndex = currentStep % 1000;
    
    if (stepIndex < currentTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (tutorialIndex < tutorials.length - 1) {
      setCurrentStep((tutorialIndex + 1) * 1000);
    }
  };

  const prevStep = () => {
    const tutorialIndex = Math.floor(currentStep / 1000);
    const stepIndex = currentStep % 1000;
    
    if (stepIndex > 0) {
      setCurrentStep(currentStep - 1);
    } else if (tutorialIndex > 0) {
      const prevTutorial = tutorials[tutorialIndex - 1];
      setCurrentStep((tutorialIndex - 1) * 1000 + prevTutorial.steps.length - 1);
    }
  };

  return (
    <div className="tutorial-page">
      {/* Header */}
      <div className="tutorial-header">
        <div className="container">
          <h1>🎓 Tutorial Interactivo</h1>
          <p>Aprende a usar FacturaPro paso a paso y convierte tu negocio en un experto en facturación</p>
        </div>
      </div>

      {/* Tutorial Navigation */}
      <div className="tutorial-nav">
        <div className="container">
          <div className="nav-tabs">
            {tutorials.map((tutorial, index) => (
              <button
                key={tutorial.id}
                className={`nav-tab ${Math.floor(currentStep / 1000) === index ? 'active' : ''}`}
                onClick={() => goToStep(index)}
              >
                <div className="tab-icon">{tutorial.title.split(' ')[0]}</div>
                <div className="tab-info">
                  <div className="tab-title">{tutorial.title.substring(2)}</div>
                  <div className="tab-duration">{tutorial.duration}</div>
                </div>
                <div className="tab-progress">
                  {tutorial.steps.filter((_, stepIndex) => 
                    isStepCompleted(tutorial.id, stepIndex)
                  ).length}/{tutorial.steps.length}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="tutorial-content">
        <div className="container">
          <div className="content-layout">
            {/* Sidebar with steps */}
            <div className="tutorial-sidebar">
              <h3>{currentTutorial.title}</h3>
              <p className="tutorial-description">{currentTutorial.description}</p>
              
              <div className="steps-list">
                {currentTutorial.steps.map((step, index) => (
                  <button
                    key={index}
                    className={`step-item ${
                      currentStepIndex === index ? 'active' : ''
                    } ${isStepCompleted(currentTutorial.id, index) ? 'completed' : ''}`}
                    onClick={() => goToStep(Math.floor(currentStep / 1000), index)}
                  >
                    <div className="step-number">
                      {isStepCompleted(currentTutorial.id, index) ? '✓' : index + 1}
                    </div>
                    <div className="step-title">{step.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main content area */}
            <div className="tutorial-main">
              {currentTutorial.steps[currentStepIndex] && (
                <div className="step-content">
                  <div className="step-header">
                    <h2>{currentTutorial.steps[currentStepIndex].title}</h2>
                    <button
                      className={`complete-btn ${
                        isStepCompleted(currentTutorial.id, currentStepIndex) ? 'completed' : ''
                      }`}
                      onClick={() => markStepCompleted(currentTutorial.id, currentStepIndex)}
                    >
                      {isStepCompleted(currentTutorial.id, currentStepIndex) ? 
                        '✓ Completado' : 'Marcar como completado'
                      }
                    </button>
                  </div>
                  
                  <div className="step-body">
                    <div className="step-text">
                      <p>{currentTutorial.steps[currentStepIndex].content}</p>
                    </div>
                    
                    {/* Mock image placeholder */}
                    <div className="step-image">
                      <div className="image-placeholder">
                        <div className="placeholder-icon">🖼️</div>
                        <p>Captura de pantalla: {currentTutorial.steps[currentStepIndex].title}</p>
                      </div>
                    </div>
                    
                    <div className="step-code">
                      <h4>📋 Información clave:</h4>
                      <pre><code>{currentTutorial.steps[currentStepIndex].code}</code></pre>
                    </div>
                  </div>
                  
                  <div className="step-actions">
                    <button 
                      className="btn-secondary"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                    >
                      ← Anterior
                    </button>
                    
                    <div className="step-progress-bar">
                      <div className="progress-text">
                        Paso {currentStepIndex + 1} de {currentTutorial.steps.length}
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{
                            width: `${((currentStepIndex + 1) / currentTutorial.steps.length) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <button 
                      className="btn-primary"
                      onClick={nextStep}
                      disabled={currentStep >= (tutorials.length * 1000) - 1}
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="quick-start-section">
        <div className="container">
          <h2>🚀 Inicio Rápido</h2>
          <div className="quick-start-grid">
            <div className="quick-card">
              <div className="quick-icon">⚡</div>
              <h3>Setup en 5 minutos</h3>
              <p>Configura tu cuenta y envía tu primera factura en menos de 5 minutos</p>
              <button className="btn-quick">Comenzar ahora</button>
            </div>
            
            <div className="quick-card">
              <div className="quick-icon">📱</div>
              <h3>App móvil</h3>
              <p>Descarga nuestra app para crear facturas desde cualquier lugar</p>
              <button className="btn-quick">Descargar</button>
            </div>
            
            <div className="quick-card">
              <div className="quick-icon">🎯</div>
              <h3>Demo personalizada</h3>
              <p>Agenda una demo con nuestro equipo para tu caso específico</p>
              <button className="btn-quick">Agendar demo</button>
            </div>
            
            <div className="quick-card">
              <div className="quick-icon">💬</div>
              <h3>Soporte 24/7</h3>
              <p>Nuestro equipo está disponible para ayudarte cuando lo necesites</p>
              <button className="btn-quick">Contactar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="resources-section">
        <div className="container">
          <h2>📚 Recursos Adicionales</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <h3>📖 Documentación completa</h3>
              <p>Guías detalladas de todas las funcionalidades</p>
              <a href="#" className="resource-link">Ver documentación →</a>
            </div>
            
            <div className="resource-card">
              <h3>🎥 Video tutoriales</h3>
              <p>Aprende viendo: más de 50 videos explicativos</p>
              <a href="#" className="resource-link">Ver videos →</a>
            </div>
            
            <div className="resource-card">
              <h3>💡 Mejores prácticas</h3>
              <p>Tips y consejos de expertos en facturación</p>
              <a href="#" className="resource-link">Leer consejos →</a>
            </div>
            
            <div className="resource-card">
              <h3>🔗 Integraciones</h3>
              <p>Conecta con tus herramientas favoritas</p>
              <a href="#" className="resource-link">Ver integraciones →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;