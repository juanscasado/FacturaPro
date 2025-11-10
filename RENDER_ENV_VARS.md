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

# Alanube API (SANDBOX - token válido)
ALANUBE_API_URL=https://sandbox.alanube.co
ALANUBE_TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1ZTEzYzFiLTJiYTgtNGYzOC1hNWMxLTQ5NWEzMjk3ZjE4ZiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNmI2Nzc0My04ODZkLTQxNWItYWJlMC03MmU3ZGIxNjUwNTEiLCJlbWFpbCI6Imp1YW5jYXNhZG9AYWxhbnViZS5jbyIsInNjb3BlIjoiYy5yLnU6YXBpZG9tX2Z1bGxfYWNjZXNzIGdlbmVyaWMiLCJsYXN0VXBkYXRlZFBhc3N3b3JkIjoiMjAyNS0xMC0yMiAxNTo1OToxNCIsImlzcyI6InNhbmQtYXV0aC1hcGkuYWxlZ3JhLmNvbSIsImlhdCI6MTc2MTE0ODc2MCwiZXhwIjoxMTcxNzM0MDIyLCJqdGkiOiIwN2U1NmVhYS02OWI0LTRiY2QtOTk5OS01MTlmZjFkOWUwYTMifQ.ZMpskvPmab3qJms2nSEtwFWMZWCnWHPxg4WZAQknnY5EY2PGo63ZbVi5x5ozPTRdSuKbZPGG2g6sEHJxph2rUFj65T10LAbxJEPLCHxLEk1vFr1W9No07RpX3_XzqbEexWq38WmDcZqAOirtr8tcOWMeEfxGsxEaermtDjE9KSB-Dsufb4qgzp-hH-HO7dt8QMeE1TQ4eLxysqYjhM7lhbw8lIM8fF3J7IJJPPGHXEOyLk0C8X-V2szBmshwdFRw2G4KHUtDEDdkGwLXO3P1jhh3tzAdfncXID49tQTGPonkUEW7WAOPOZLhdGOHHkmix45M5G6W6ELdIAASlJSC3g

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