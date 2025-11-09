from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from .routes import auth, clients, invoices, users, alanube, commercial
from fastapi.middleware.cors import CORSMiddleware
from . import models
from . import models_extensions
from .database import engine
import os

# 🔹 Crea las tablas si no existen
models.Base.metadata.create_all(bind=engine)
models_extensions.Base.metadata.create_all(bind=engine)

# 🔹 Detectar ambiente y configurar URLs del frontend
def get_frontend_url():
    # Si estamos en Render (producción)
    if os.getenv("RENDER"):
        return "https://facturapro-frontend.onrender.com"
    # Si estamos en desarrollo local
    else:
        return "http://localhost:3000"

# 🔹 Configurar origins dinámicamente
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://facturapro-frontend.onrender.com",
    "https://*.onrender.com",
    get_frontend_url()  # URL dinámica según ambiente
]

app = FastAPI(title="FacturaPro RD MVP")

# 🔹 Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # usa la lista de arriba
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Rutas principales
app.include_router(auth.router)
app.include_router(clients.router)
app.include_router(invoices.router)
app.include_router(users.router)
app.include_router(alanube.router)
app.include_router(commercial.router)  # 🆕 Rutas comerciales

@app.get("/", response_class=HTMLResponse)
def root():
    frontend_url = get_frontend_url()
    html_content = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FacturaPro RD - API Backend</title>
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
                min-height: 100vh;
                color: #1e293b;
            }}
            
            .container {{
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }}
            
            .header {{
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 3rem;
                text-align: center;
                margin-bottom: 2rem;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }}
            
            .logo {{
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #1e40af, #3b82f6);
                border-radius: 16px;
                margin: 0 auto 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                color: white;
                font-weight: bold;
            }}
            
            .title {{
                font-size: 3rem;
                font-weight: 800;
                color: #1e40af;
                margin-bottom: 0.5rem;
                letter-spacing: -0.025em;
            }}
            
            .subtitle {{
                font-size: 1.25rem;
                color: #64748b;
                margin-bottom: 1rem;
            }}
            
            .description {{
                font-size: 1.125rem;
                color: #475569;
                line-height: 1.7;
                max-width: 600px;
                margin: 0 auto;
            }}
            
            .content {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-bottom: 2rem;
            }}
            
            .card {{
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }}
            
            .card:hover {{
                transform: translateY(-5px);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }}
            
            .card-icon {{
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #059669, #10b981);
                border-radius: 12px;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: white;
            }}
            
            .card-title {{
                font-size: 1.5rem;
                font-weight: 700;
                color: #1e40af;
                margin-bottom: 0.5rem;
            }}
            
            .card-description {{
                color: #64748b;
                line-height: 1.6;
                margin-bottom: 1rem;
            }}
            
            .feature-list {{
                list-style: none;
                padding: 0;
            }}
            
            .feature-list li {{
                padding: 0.5rem 0;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }}
            
            .feature-list li:last-child {{
                border-bottom: none;
            }}
            
            .check-icon {{
                width: 20px;
                height: 20px;
                background: #059669;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 0.75rem;
                flex-shrink: 0;
            }}
            
            .endpoints {{
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }}
            
            .endpoint-group {{
                margin-bottom: 2rem;
            }}
            
            .endpoint-group h3 {{
                color: #1e40af;
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #e2e8f0;
            }}
            
            .endpoint {{
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.75rem 0;
                border-bottom: 1px solid #f1f5f9;
            }}
            
            .endpoint:last-child {{
                border-bottom: none;
            }}
            
            .method {{
                padding: 0.25rem 0.75rem;
                border-radius: 6px;
                font-weight: 600;
                font-size: 0.75rem;
                text-transform: uppercase;
                min-width: 60px;
                text-align: center;
            }}
            
            .method.get {{ background: #dcfce7; color: #166534; }}
            .method.post {{ background: #dbeafe; color: #1d4ed8; }}
            .method.put {{ background: #fef3c7; color: #d97706; }}
            .method.delete {{ background: #fef2f2; color: #dc2626; }}
            
            .endpoint-path {{
                font-family: 'Courier New', monospace;
                color: #475569;
                font-weight: 500;
            }}
            
            .endpoint-description {{
                color: #64748b;
                font-size: 0.875rem;
            }}
            
            .status {{
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 2rem;
                text-align: center;
                margin-top: 2rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }}
            
            .status-indicator {{
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #059669, #10b981);
                border-radius: 50%;
                margin: 0 auto 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
                animation: pulse 2s infinite;
            }}
            
            @keyframes pulse {{
                0%, 100% {{ transform: scale(1); }}
                50% {{ transform: scale(1.05); }}
            }}
            
            .btn {{
                display: inline-block;
                padding: 12px 24px;
                background: linear-gradient(135deg, #1e40af, #3b82f6);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 0.5rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }}
            
            .btn:hover {{
                transform: translateY(-2px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }}
            
            .footer {{
                text-align: center;
                padding: 2rem;
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.875rem;
            }}
            
            @media (max-width: 768px) {{
                .container {{ padding: 1rem; }}
                .title {{ font-size: 2rem; }}
                .content {{ grid-template-columns: 1fr; }}
                .endpoint {{ flex-direction: column; align-items: flex-start; gap: 0.5rem; }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">FP</div>
                <h1 class="title">FacturaPro RD</h1>
                <p class="subtitle">Sistema de Facturación Profesional para República Dominicana</p>
                <p class="description">
                    API REST completa para la gestión de facturas electrónicas, integrada con Alanube 
                    y diseñada específicamente para cumplir con las regulaciones fiscales dominicanas.
                </p>
            </div>
            
            <div class="content">
                <div class="card">
                    <div class="card-icon">🔐</div>
                    <h2 class="card-title">Seguridad Avanzada</h2>
                    <p class="card-description">
                        Sistema de autenticación robusto con JWT tokens y encriptación de datos sensibles.
                    </p>
                    <ul class="feature-list">
                        <li><span class="check-icon">✓</span> Autenticación JWT</li>
                        <li><span class="check-icon">✓</span> Encriptación BCrypt</li>
                        <li><span class="check-icon">✓</span> Validación de sesiones</li>
                        <li><span class="check-icon">✓</span> Protección CORS</li>
                    </ul>
                </div>
                
                <div class="card">
                    <div class="card-icon">📊</div>
                    <h2 class="card-title">Gestión Integral</h2>
                    <p class="card-description">
                        Administración completa de clientes, facturas y reportes con interfaz moderna.
                    </p>
                    <ul class="feature-list">
                        <li><span class="check-icon">✓</span> Gestión de Clientes</li>
                        <li><span class="check-icon">✓</span> Facturación Electrónica</li>
                        <li><span class="check-icon">✓</span> Reportes Detallados</li>
                        <li><span class="check-icon">✓</span> Dashboard Analítico</li>
                    </ul>
                </div>
                
                <div class="card">
                    <div class="card-icon">🌐</div>
                    <h2 class="card-title">Integración Alanube</h2>
                    <p class="card-description">
                        Conectado directamente con la plataforma oficial de facturación de República Dominicana.
                    </p>
                    <ul class="feature-list">
                        <li><span class="check-icon">✓</span> Envío Automático</li>
                        <li><span class="check-icon">✓</span> Validación DGII</li>
                        <li><span class="check-icon">✓</span> NCF Automáticos</li>
                        <li><span class="check-icon">✓</span> Ambiente Sandbox</li>
                    </ul>
                </div>
            </div>
            
            <div class="endpoints">
                <h2 style="text-align: center; color: #1e40af; margin-bottom: 2rem; font-size: 2rem;">
                    Endpoints Disponibles
                </h2>
                
                <div class="endpoint-group">
                    <h3>🔐 Autenticación</h3>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/auth/register</span>
                        <span class="endpoint-description">Registro de nuevos usuarios</span>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/auth/login</span>
                        <span class="endpoint-description">Inicio de sesión</span>
                    </div>
                </div>
                
                <div class="endpoint-group">
                    <h3>👥 Gestión de Clientes</h3>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/clients</span>
                        <span class="endpoint-description">Listar todos los clientes</span>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/clients</span>
                        <span class="endpoint-description">Crear nuevo cliente</span>
                    </div>
                    <div class="endpoint">
                        <span class="method put">PUT</span>
                        <span class="endpoint-path">/clients/{{id}}</span>
                        <span class="endpoint-description">Actualizar cliente existente</span>
                    </div>
                    <div class="endpoint">
                        <span class="method delete">DELETE</span>
                        <span class="endpoint-path">/clients/{{id}}</span>
                        <span class="endpoint-description">Eliminar cliente</span>
                    </div>
                </div>
                
                <div class="endpoint-group">
                    <h3>📄 Facturación</h3>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/invoices</span>
                        <span class="endpoint-description">Listar todas las facturas</span>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/invoices</span>
                        <span class="endpoint-description">Crear nueva factura</span>
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/invoices/{{id}}</span>
                        <span class="endpoint-description">Obtener factura específica</span>
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span>
                        <span class="endpoint-path">/invoices/{{id}}/send-alanube</span>
                        <span class="endpoint-description">Enviar factura a Alanube</span>
                    </div>
                </div>
                
                <div class="endpoint-group">
                    <h3>👤 Usuarios</h3>
                    <div class="endpoint">
                        <span class="method get">GET</span>
                        <span class="endpoint-path">/users/me</span>
                        <span class="endpoint-description">Obtener perfil del usuario actual</span>
                    </div>
                    <div class="endpoint">
                        <span class="method put">PUT</span>
                        <span class="endpoint-path">/users/me</span>
                        <span class="endpoint-description">Actualizar perfil del usuario</span>
                    </div>
                </div>
            </div>
            
            <div class="status">
                <div class="status-indicator">✓</div>
                <h3 style="color: #059669; margin-bottom: 0.5rem;">Sistema Operativo</h3>
                <p style="color: #64748b; margin-bottom: 1.5rem;">
                    La API está funcionando correctamente y lista para recibir peticiones.
                </p>
                <a href="/docs" class="btn">📖 Documentación Swagger</a>
                <a href="/redoc" class="btn">📋 Documentación ReDoc</a>
                <a href="{frontend_url}" class="btn">🖥️ Aplicación Frontend</a>
            </div>
            
            <div class="footer">
                <p>© 2025 FacturaPro RD - Sistema de Facturación Profesional</p>
                <p>Desarrollado con FastAPI, SQLAlchemy y tecnologías modernas</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html_content

