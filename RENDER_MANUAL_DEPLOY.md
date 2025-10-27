# 🚀 Render Deploy - Método Manual (Más Confiable)

Ya que Render está teniendo problemas con el Blueprint, vamos a hacer el deploy **manualmente** - es más directo y siempre funciona.

## 📋 Pasos para Deploy Manual en Render

### **Paso 1: Deploy del Backend (FastAPI)**

1. **En Render Dashboard**, click **"New +" → "Web Service"**
2. **Conecta GitHub**: Selecciona `juanscasado/FacturaPro`
3. **Configuración Backend**:
   ```
   Name: facturapro-backend
   Root Directory: backend
   Environment: Python
   Build Command: pip install -r requirements.txt
   Start Command: python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
   Plan: Free (Starter)
   ```

4. **Variables de Entorno (Environment Variables)**:
   ```
   PYTHON_VERSION = 3.12.4
   DATABASE_URL = sqlite:///./app.db
   JWT_SECRET_KEY = tu-jwt-secret-super-seguro-aqui
   ```

### **Paso 2: Deploy del Frontend (React)**

1. **Nuevamente**, click **"New +" → "Static Site"**
2. **Conecta GitHub**: Selecciona `juanscasado/FacturaPro`
3. **Configuración Frontend**:
   ```
   Name: facturapro-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

4. **Variables de Entorno**:
   ```
   NODE_VERSION = 18
   REACT_APP_API_URL = https://facturapro-backend.onrender.com
   ```

### **Paso 3: Actualizar URLs del Frontend**

Una vez que tengas la URL del backend, necesitarás actualizar el frontend para que apunte correctamente.

## ⚡ Ventajas del Método Manual

- ✅ **Más Control**: Configuras cada servicio individualmente
- ✅ **Menos Errores**: No depende de parsing de YAML
- ✅ **Debugging Fácil**: Puedes ver logs de cada servicio por separado
- ✅ **100% Gratuito**: Ambos servicios en plan gratuito

## 🎯 URLs Finales

Después del deploy exitoso:
```
Backend:  https://facturapro-backend.onrender.com
Frontend: https://facturapro-frontend.onrender.com
API Docs: https://facturapro-backend.onrender.com/docs
```

---

**¿Quieres proceder con el método manual? Es más directo y confiable que Blueprint.**