# 🔐 Configuración de Credenciales - FacturaPro

## ⚠️ IMPORTANTE: Configurar Credenciales Propias

Este proyecto viene con credenciales de demostración que **DEBEN ser reemplazadas** con tus propias credenciales de Alanube antes de usar en producción.

## 📝 Archivos a Configurar

### 1. Frontend - `frontend/src/alanubeConfig.js`

```javascript
// ❌ NO USAR en producción
export const ALANUBE_USERNAME = 'demo@empresa.com';
export const ALANUBE_PASSWORD = 'DEMO_PASSWORD';
export const ALANUBE_RNC = 'DEMO_RNC';
export const ALANUBE_COMPANY_ID = 'DEMO_COMPANY_ID';

// ✅ Reemplazar con tus credenciales reales
export const ALANUBE_USERNAME = 'tu-usuario@empresa.com';
export const ALANUBE_PASSWORD = 'tu-password-real';
export const ALANUBE_RNC = 'tu-rnc-real';
export const ALANUBE_COMPANY_ID = 'tu-company-id-real';
```

### 2. Backend - Variables de Entorno

Crear archivo `backend/.env`:

```bash
# Credenciales Alanube Reales
ALANUBE_USERNAME=tu-usuario@empresa.com
ALANUBE_PASSWORD=tu-password-real
ALANUBE_RNC=tu-rnc-real
ALANUBE_COMPANY_ID=tu-company-id-real

# Base de datos (usar PostgreSQL en producción)
DATABASE_URL=postgresql://usuario:password@localhost/facturapro

# JWT Secret (generar uno único)
JWT_SECRET_KEY=tu-jwt-secret-super-seguro-y-unico
```

### 3. Render Deployment - Variables de Entorno

En el panel de Render, configurar:

```
ALANUBE_USERNAME = tu-usuario@empresa.com
ALANUBE_PASSWORD = tu-password-real
ALANUBE_RNC = tu-rnc-real
ALANUBE_COMPANY_ID = tu-company-id-real
DATABASE_URL = postgresql://... (Render PostgreSQL)
JWT_SECRET_KEY = tu-jwt-secret-super-seguro
```

## 🔑 Obtener Credenciales Alanube

### Paso 1: Registro en Alanube
1. Ir a [Alanube.co](https://alanube.co/)
2. Solicitar cuenta de sandbox/producción
3. Completar proceso de certificación DGII

### Paso 2: Configuración Sandbox
1. Portal: `https://sandbox-reseller.alanube.co/login`
2. Obtener credenciales de tu cuenta
3. Configurar RNC de tu empresa
4. Generar Company ID único

### Paso 3: Configuración Producción
1. Completar certificación DGII
2. Migrar a ambiente productivo
3. Actualizar URLs a producción
4. Configurar NCF reales

## 🛡️ Seguridad

### Variables de Entorno
- ✅ Usar variables de entorno para credenciales
- ✅ Nunca commitear credenciales reales
- ✅ Usar .env para desarrollo local
- ✅ Configurar variables en Render panel

### JWT Secrets
```bash
# Generar JWT secret seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📋 Checklist Pre-Deployment

- [ ] Reemplazar credenciales demo en `alanubeConfig.js`
- [ ] Configurar variables de entorno en `.env`
- [ ] Verificar conexión con Alanube sandbox
- [ ] Configurar PostgreSQL para producción
- [ ] Generar JWT secret único
- [ ] Configurar variables en Render
- [ ] Probar autenticación completa
- [ ] Validar creación de facturas

## 🚨 NO HACER

❌ **Nunca subir credenciales reales a repositorio público**
❌ **No usar credenciales demo en producción**
❌ **No hardcodear passwords en código**
❌ **No compartir Company ID públicamente**

## ✅ HACER

✅ **Usar variables de entorno siempre**
✅ **Mantener credenciales en .env local**
✅ **Configurar secrets en Render panel**
✅ **Rotar passwords periódicamente**

---

**🔐 La seguridad de tus credenciales fiscales es crítica para el cumplimiento DGII.**