# 🚀 Guía Paso a Paso - Deploy en Render

## 📋 **Pasos para Deploy Automático**

### **Paso 1: Crear Cuenta en Render**
1. Ir a [render.com](https://render.com)
2. Click **"Get Started"**
3. **Conectar con GitHub** (recomendado)
4. Autorizar acceso a tus repositorios

### **Paso 2: Crear Blueprint Service**
1. En Render Dashboard → Click **"New +"**
2. Seleccionar **"Blueprint"**
3. Conectar repositorio: `juanscasado/FacturaPro`
4. Render detectará automáticamente el archivo `render.yaml`
5. Click **"Apply"**

### **Paso 3: Configurar Variables de Entorno**

⚠️ **IMPORTANTE:** Configurar estas variables en el panel de Render:

**Para el servicio Backend:**
```
ALANUBE_USERNAME = tu-usuario@alanube.com
ALANUBE_PASSWORD = tu-password-real
ALANUBE_RNC = tu-rnc-empresarial
ALANUBE_COMPANY_ID = tu-company-id-real
JWT_SECRET_KEY = [generar secret único]
```

**Generar JWT Secret:**
```bash
# Ejecutar en terminal local para generar secret seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **Paso 4: Monitorear Deployment**

**Build Process esperado:**
- ⏳ Cloning repository...
- ⏳ Installing dependencies...
- ⏳ Building frontend...
- ⏳ Setting up backend...
- ✅ Deployment successful!

**Tiempos aproximados:**
- Frontend: ~3-5 minutos
- Backend: ~2-3 minutos
- Total: ~8-10 minutos

### **Paso 5: URLs de Producción**

**Una vez completado el deployment:**
```
Frontend: https://facturapro-frontend-[hash].onrender.com
Backend:  https://facturapro-backend-[hash].onrender.com
API Docs: https://facturapro-backend-[hash].onrender.com/docs
```

### **Paso 6: Verificación Post-Deploy**

**Checklist de verificación:**
- [ ] Frontend carga correctamente
- [ ] Login/Register funcionan
- [ ] Dashboard se muestra
- [ ] Backend API responde
- [ ] Documentación accesible en /docs
- [ ] Variables de entorno configuradas

## ⚠️ **Notas Importantes**

### **Primer Deploy (Free Tier)**
- Los servicios gratuitos pueden tomar 15-30 segundos en "despertar"
- Las bases de datos PostgreSQL pueden tomar ~1-2 minutos extra
- Es normal si la primera carga es lenta

### **Variables de Entorno Críticas**
```bash
# OBLIGATORIAS para producción:
JWT_SECRET_KEY = [64 caracteres hexadecimales únicos]
DATABASE_URL = [PostgreSQL URL - Render lo configura automáticamente]

# OPCIONALES (para Alanube real):
ALANUBE_USERNAME = [tu usuario real]
ALANUBE_PASSWORD = [tu password real]
ALANUBE_RNC = [tu RNC empresarial]
ALANUBE_COMPANY_ID = [tu company ID real]
```

### **Troubleshooting Común**
- **Build Fail:** Verificar que render.yaml esté correcto
- **500 Errors:** Revisar variables de entorno
- **CORS Issues:** Verificar configuración en main.py
- **DB Errors:** Esperar a que PostgreSQL esté listo

---

## 🎯 **¡Tu FacturaPro estará live en internet en ~10 minutos!**