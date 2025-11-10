# Variables de Entorno para Render

## Backend (facturapro-backend.onrender.com)

```bash
# Base de datos
DATABASE_URL=postgresql://usuario:password@host:puerto/database

# Configuración de aplicación
ENVIRONMENT=production
SECRET_KEY=tu_clave_secreta_aqui
ALLOWED_HOSTS=facturapro-backend.onrender.com

# CORS - Dominios permitidos
FRONTEND_URL=https://facturapro-frontend.onrender.com

# Alanube API
ALANUBE_TOKEN=tu_token_alanube_aqui
ALANUBE_BASE_URL=https://api.alanube.co

# Puerto (Render lo asigna automáticamente)
PORT=8000
```

## Frontend (facturapro-frontend.onrender.com)

```bash
# URL del backend
REACT_APP_API_URL=https://facturapro-backend.onrender.com

# Configuración de aplicación
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0

# Puerto (Render lo asigna automáticamente)
PORT=3000
```

## ⚠️ IMPORTANTE: Configurar en Panel de Render

1. Ve al dashboard de Render
2. Selecciona cada servicio (backend y frontend)
3. Ve a "Environment" 
4. Agrega estas variables según corresponda
5. Redeploya los servicios

## 🔍 Verificación

- Backend: https://facturapro-backend.onrender.com/health
- Frontend: https://facturapro-frontend.onrender.com
- Docs API: https://facturapro-backend.onrender.com/docs