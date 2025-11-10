"""
Configuración de entorno para FacturaPro Backend
Detecta automáticamente si estamos en desarrollo o producción
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Cargar variables de entorno según el entorno
def load_environment():
    """Carga las variables de entorno apropiadas"""
    base_dir = Path(__file__).parent.parent
    
    if is_development():
        # En desarrollo, cargar .env.development
        env_file = base_dir / ".env.development"
        if env_file.exists():
            load_dotenv(env_file)
            print(f"📄 Cargado archivo de entorno: {env_file}")
        else:
            print("⚠️ Archivo .env.development no encontrado")
    else:
        # En producción, usar variables del sistema
        print("🌐 Usando variables de entorno del sistema (producción)")

# Detectar el entorno
def is_production():
    """Detecta si estamos en producción"""
    return bool(
        os.getenv("RAILWAY_ENVIRONMENT") or 
        os.getenv("RENDER") or 
        os.getenv("VERCEL") or
        os.getenv("PRODUCTION") or
        os.getenv("NODE_ENV") == "production"
    )

def is_development():
    """Detecta si estamos en desarrollo local"""
    return not is_production()

# Cargar configuración
load_environment()

# URLs según el entorno
def get_frontend_urls():
    """Obtiene las URLs del frontend según el entorno"""
    if is_production():
        return [
            "https://facturapro-frontend.vercel.app",
            "https://facturapro-frontend.onrender.com",
            "https://facturapro.vercel.app",
            "https://factura-pro.vercel.app"
        ]
    else:
        return [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3001"
        ]

def get_database_url():
    """Obtiene la URL de la base de datos según el entorno"""
    if is_production():
        # En producción, usar PostgreSQL
        return os.getenv(
            "DATABASE_URL", 
            os.getenv("POSTGRES_URL", "sqlite:///./production.db")
        )
    else:
        # En desarrollo, usar SQLite
        return "sqlite:///./invoices.db"

# Configuración de CORS
CORS_ORIGINS = get_frontend_urls()

# Configuración de la base de datos
DATABASE_URL = get_database_url()

# Variables de entorno con valores por defecto
SECRET_KEY = os.getenv("SECRET_KEY", "desarrollo_clave_secreta_local")
DEBUG = is_development()

# Configuración de Alanube
ALANUBE_API_URL = os.getenv("ALANUBE_API_URL", "https://api.alanube.co")
ALANUBE_TOKEN = os.getenv("ALANUBE_TOKEN")

if not ALANUBE_TOKEN and is_development():
    print("⚠️ ALANUBE_TOKEN no configurado - algunas funciones de facturación no estarán disponibles")
elif ALANUBE_TOKEN:
    print("✅ Token de Alanube configurado correctamente")

print(f"🌍 Entorno: {'Producción' if is_production() else 'Desarrollo'}")
print(f"🗄️ Base de datos: {DATABASE_URL}")
print(f"🌐 CORS origins: {CORS_ORIGINS}")
print(f"🧾 Alanube API: {ALANUBE_API_URL}")
print(f"🔑 Token Alanube: {'✅ Configurado' if ALANUBE_TOKEN else '❌ No configurado'}")