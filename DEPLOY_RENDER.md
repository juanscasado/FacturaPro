# 🚀 Despliegue de FacturaPro en Render

## 📋 Preparación Previa

### 1. **Repository Setup**
```bash
# Asegúrate de que todo esté commiteado
git add .
git commit -m "Preparando para despliegue en Render"
git push origin main
```

### 2. **Archivos de Configuración**
✅ `render.yaml` - Configuración principal de Render  
✅ `build.sh` - Script de construcción del backend  
✅ `start.sh` - Script de inicio del servidor  
✅ `frontend/src/config/apiConfig.js` - URLs automáticas según ambiente  

---

## 🌐 Despliegue en Render

### **Opción 1: Despliegue Automático (Recomendado)**

1. **Conectar Repository**:
   - Ve a [Render.com](https://render.com)
   - Click **"New"** → **"Blueprint"**
   - Conecta tu repositorio GitHub
   - Selecciona el archivo `render.yaml`

2. **Configuración Automática**:
   - Render creará automáticamente 2 servicios:
     - `facturapro-backend` (FastAPI)
     - `facturapro-frontend` (React)

3. **Variables de Entorno** (se configuran automáticamente):
   ```
   PYTHON_VERSION=3.12.4
   NODE_VERSION=18
   DATABASE_URL=sqlite:///./app.db
   ```

### **Opción 2: Despliegue Manual**

#### **Backend (FastAPI)**
1. **New Web Service**:
   - Runtime: **Python**
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Environment Variables**:
   ```
   PYTHON_VERSION=3.12.4
   DATABASE_URL=sqlite:///./app.db
   ```

#### **Frontend (React)**
1. **New Static Site**:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

2. **Environment Variables**:
   ```
   NODE_VERSION=18
   REACT_APP_API_URL=https://TU-BACKEND-URL.onrender.com
   ```

---

## 🔧 URLs Finales

Una vez desplegado, tendrás:

- **Backend API**: `https://facturapro-backend.onrender.com`
- **Frontend App**: `https://facturapro-frontend.onrender.com`

### **Probar el Despliegue**:

1. **Backend Health Check**:
   ```
   GET https://facturapro-backend.onrender.com/
   ```
   Debe mostrar la página de bienvenida HTML.

2. **Frontend Application**:
   ```
   https://facturapro-frontend.onrender.com
   ```
   Debe cargar la aplicación React con login.

3. **API Test**:
   ```bash
   curl -X POST https://facturapro-backend.onrender.com/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@facturapro.com","password":"admin123"}'
   ```

---

## 🔍 Troubleshooting

### **Backend No Inicia**
```bash
# Ver logs en Render Dashboard
# Problemas comunes:
- Dependencias faltantes en requirements.txt
- Puerto incorrecto (usar $PORT variable)
- Python version incompatible
```

### **Frontend No Conecta al Backend**
```javascript
// Verificar config/apiConfig.js
// El archivo detecta automáticamente production vs development
console.log('API URL:', API_CONFIG.BASE_URL);
```

### **CORS Errors**
```python
# En backend/app/main.py ya están configurados los origins:
origins = [
    "https://facturapro-frontend.onrender.com",
    "https://*.onrender.com"
]
```

### **Database Issues**
```bash
# Render usa SQLite por defecto
# Para PostgreSQL, cambiar DATABASE_URL en environment
```

---

## 📊 Monitoreo

### **Logs en Tiempo Real**:
1. Ve a Render Dashboard
2. Selecciona tu servicio  
3. Click en **"Logs"** tab

### **Métricas de Performance**:
- CPU usage
- Memory usage  
- Request count
- Response times

### **Health Checks**:
Render verifica automáticamente:
- Backend: `GET /` (página HTML)
- Frontend: Static files serving

---

## 🚀 Post-Despliegue

### **Configurar Dominio Personalizado** (Opcional):
1. En Render Dashboard → Settings
2. **Custom Domains**
3. Agregar tu dominio: `facturapro.tuempresa.com`

### **Configurar HTTPS** (Automático):
✅ Render proporciona SSL/TLS automáticamente

### **Backup de Database**:
```bash
# Para SQLite en producción
# Considerar migrar a PostgreSQL para más robustez
```

### **Actualizar Credenciales Alanube**:
```javascript
// Editar frontend/src/alanubeConfig.js con datos reales
export const ALANUBE_JWT_TOKEN = 'token_produccion_aqui';
export const ALANUBE_COMPANY_ID = 'company_id_real';
```

---

## ✅ Checklist Final

Antes de ir a producción:

- [ ] Backend despliega sin errores
- [ ] Frontend carga correctamente  
- [ ] Login funciona con credenciales demo
- [ ] Clientes se pueden crear/listar
- [ ] Facturas se pueden crear
- [ ] Monitor de Alanube funciona
- [ ] No hay errores en console del navegador
- [ ] CORS configurado para dominio de producción
- [ ] URLs de API se detectan automáticamente
- [ ] Database se crea automáticamente

## 🎉 ¡Listo!

Tu aplicación FacturaPro estará disponible 24/7 en Render con:
- ✅ **Auto-scaling** según demanda
- ✅ **SSL/HTTPS** automático  
- ✅ **CDN global** para el frontend
- ✅ **Monitoring** integrado
- ✅ **Deploy automático** con git push

¡Render se encarga de toda la infraestructura! 🚀