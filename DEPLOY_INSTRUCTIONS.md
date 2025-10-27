# 🚀 Instrucciones de Deployment - GitHub + Render

## 📋 Pasos para Subir a GitHub

### 1. Crear Repositorio en GitHub

1. Ir a [GitHub.com](https://github.com) y hacer login
2. Click en **"New repository"** (botón verde)
3. Nombre: `FacturaPro` o `facturapro-sistema-facturacion`
4. Descripción: `Sistema de Facturación Electrónica para República Dominicana - DGII Compliant`
5. **Marcar como "Public"** ✅
6. **NO inicializar con README** (ya tenemos archivos)
7. Click **"Create repository"**

### 2. Conectar Repositorio Local con GitHub

```powershell
# En el directorio del proyecto
cd "C:\Users\WinFree\Desktop\repo\FacturaPro"

# Agregar remote origin (reemplazar TU_USUARIO con tu username)
git remote add origin https://github.com/TU_USUARIO/FacturaPro.git

# Cambiar a branch main
git branch -M main

# Subir por primera vez
git push -u origin main
```

### 3. Verificar Upload

Ir a tu repositorio en GitHub y verificar que todos los archivos se subieron:

- ✅ README.md con badges e información
- ✅ Carpetas `frontend/` y `backend/`
- ✅ Archivo `render.yaml` para deployment
- ✅ Archivos de documentación (.md files)
- ✅ Scripts de deployment (build.sh, start.sh)

## 🌐 Deploy Automático en Render

### 1. Crear Cuenta en Render

1. Ir a [Render.com](https://render.com)
2. Sign up con GitHub (recomendado)
3. Autorizar conexión con GitHub

### 2. Deploy con Blueprint

1. En Render Dashboard, click **"New +"**
2. Seleccionar **"Blueprint"**
3. Conectar tu repositorio GitHub `FacturaPro`
4. Render detectará automáticamente `render.yaml`
5. Click **"Apply"** para iniciar deployment

### 3. Configurar Variables de Entorno

En Render Dashboard → tu servicio backend:

```
ALANUBE_USERNAME = tu-usuario@empresa.com
ALANUBE_PASSWORD = tu-password-real
ALANUBE_RNC = tu-rnc-empresarial
ALANUBE_COMPANY_ID = tu-company-id-real
JWT_SECRET_KEY = [generar secret único]
DATABASE_URL = [PostgreSQL automático de Render]
```

### 4. URLs de Producción

Después del deployment exitoso:

```
Frontend: https://facturapro-frontend.onrender.com
Backend:  https://facturapro-backend.onrender.com
API Docs: https://facturapro-backend.onrender.com/docs
```

## ⚠️ IMPORTANTE: Credenciales

### Antes del Deploy Público

1. **Verificar que todas las credenciales reales fueron removidas** ✅
2. **Confirmar que solo hay placeholders demo** ✅
3. **Revisar archivos de configuración** ✅

### Archivos Seguros para Público

- ✅ `alanubeConfig.js` - Solo valores DEMO
- ✅ `AlanubeMonitor.js` - Solo valores DEMO
- ✅ `README.md` - Sin credenciales reales
- ✅ `TUTORIAL.md` - Referencias demo
- ✅ Variables de entorno - Solo en Render panel

## 🔧 Comandos Git para Deploy

```powershell
# Verificar estado
git status

# Ver commits
git log --oneline

# Push a GitHub (después de agregar remote)
git push origin main

# Para updates futuros
git add .
git commit -m "🚀 Update: descripción del cambio"
git push origin main
```

## 📊 Verificación Post-Deploy

### 1. Verificar Frontend
- ✅ Página carga correctamente
- ✅ Login funciona (con credenciales demo)
- ✅ Dashboard se muestra
- ✅ Navegación entre páginas

### 2. Verificar Backend
- ✅ API responde en `/docs`
- ✅ Health check en `/`
- ✅ Endpoints de autenticación
- ✅ Base de datos conectada

### 3. Verificar Integración
- ⚠️ Alanube requerirá credenciales reales
- ✅ JWT authentication funciona
- ✅ CRUD de usuarios/clientes
- ✅ Sistema de monitoreo

## 🎯 Checklist Final

- [ ] Repositorio GitHub creado y público
- [ ] Código subido con `git push`
- [ ] Render Blueprint aplicado
- [ ] Variables de entorno configuradas
- [ ] Frontend desplegado y funcionando
- [ ] Backend desplegado y funcionando
- [ ] API documentación accesible
- [ ] Credenciales demo verificadas (sin datos reales)

## 🚀 ¡Listo para Mostrar!

Una vez completados estos pasos, tendrás:

1. **Repositorio público en GitHub** - Código profesional visible
2. **Aplicación live en Render** - URLs públicas funcionando
3. **Sistema completamente funcional** - Todas las features disponibles
4. **Seguridad garantizada** - Sin credenciales reales expuestas

**¡Tu FacturaPro estará públicamente disponible y listo para demostrar! 🎉**