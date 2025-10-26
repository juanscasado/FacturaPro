# 🚀 FacturaPro - Guía de Implementación para Clientes

## 📋 ¿Qué es FacturaPro?

FacturaPro es un sistema completo de facturación que permite:
- ✅ **Gestionar clientes** y sus datos
- ✅ **Crear facturas locales** en tu base de datos
- ✅ **Enviar facturas fiscales** automáticamente a Alanube
- ✅ **Monitorear en tiempo real** las transacciones con la API

---

## 🎯 Para Usuarios Finales (Paso a Paso)

### 1️⃣ **Acceder al Sistema**
1. Abre tu navegador y ve a: `http://localhost:3000`
2. Usa las credenciales que te proporcionó tu administrador
3. Verás el dashboard principal con las opciones disponibles

### 2️⃣ **Gestionar Clientes** 
1. Click en **"👥 Clientes"** en el menú superior
2. Para agregar un cliente nuevo:
   - Completa: Nombre, Email, RNC (opcional)
   - Click **"Crear Cliente"**
3. Los clientes aparecerán en la lista automáticamente

### 3️⃣ **Crear Facturas**
1. Click en **"📄 Facturas"** en el menú superior
2. Verás una **guía visual** con 5 pasos claros
3. Completa el formulario:
   - **Cliente**: Selecciona de la lista desplegable
   - **Descripción**: Describe el producto/servicio
   - **Monto**: Ingresa el valor en pesos dominicanos
4. Tienes 2 opciones:
   - **💾 Crear Factura Local**: Solo guarda en tu sistema
   - **🧾 Enviar a Alanube**: Crea factura fiscal oficial

### 4️⃣ **Monitorear Alanube** (Opcional)
1. Click en **"📡 Monitor"** para ver logs en tiempo real
2. Usa los botones de prueba para verificar conectividad:
   - **🌐 Test Básico**: Verifica conexión
   - **🔗 Validar Token**: Confirma autenticación
   - **🏢 Obtener Empresa**: Ve datos de tu empresa
   - **📄 Factura de Prueba**: Crea factura de test

---

## 🔧 Para Desarrolladores/Administradores

### **Instalación Inicial**

```bash
# 1. Backend (FastAPI)
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 2. Frontend (React)
cd frontend
npm install
npm start
```

### **Configuración de Alanube**

Edita `frontend/src/alanubeConfig.js`:

```javascript
export const ALANUBE_JWT_TOKEN = 'tu_token_jwt_aqui';
export const ALANUBE_COMPANY_ID = 'tu_company_id_aqui';
export const ALANUBE_RNC = 'tu_rnc_aqui';
// El resto mantener igual para sandbox
```

### **Estructura del Proyecto**

```
FacturaPro/
├── backend/              # API FastAPI
│   ├── app/
│   │   ├── routes/       # Endpoints REST
│   │   ├── models.py     # Modelos de BD
│   │   └── main.py       # Servidor principal
├── frontend/             # App React
│   ├── src/
│   │   ├── components/   # Componentes UI
│   │   ├── alanubeApi.js # Integración Alanube
│   │   └── custom.css    # Estilos profesionales
└── .vscode/tasks.json    # Tareas automatizadas
```

---

## 🎨 Características Clave

### **✨ Interfaz Intuitiva**
- 🎯 **Guías visuales** en cada página
- 🎨 **Diseño profesional** con colores coherentes
- 📱 **Responsive** para móvil y desktop
- 💡 **Tips contextuales** para ayudar al usuario

### **🔌 Integración Alanube**
- 🚀 **Sin errores de CORS** (usa fetch nativo)
- 📡 **Monitoreo en tiempo real** de todas las peticiones
- 🔒 **Autenticación JWT** segura
- 📊 **Logs detallados** para debugging

### **⚡ Rendimiento**
- 🏃‍♂️ **Carga rápida** con componentes optimizados
- 💾 **Persistencia local** de facturas y clientes
- 🔄 **Sincronización automática** con Alanube
- 🛡️ **Manejo robusto de errores**

---

## 🚨 Solución de Problemas Comunes

### **❌ "Network Error" en Alanube**
- ✅ **Solución**: Ya resuelto usando fetch en lugar de axios
- 🔍 **Verificar**: Ve al Monitor para logs detallados

### **🔒 "No autorizado"**
- 🔑 **Causa**: Token JWT inválido o expirado
- 🔧 **Solución**: Actualiza el token en `alanubeConfig.js`

### **📊 "No aparecen facturas"**
- 🔄 **Causa**: Backend no conectado
- 🚀 **Solución**: Reinicia los servidores con las tareas de VSCode

### **🏢 "Error de empresa"**
- 📋 **Causa**: Company ID incorrecto
- ⚙️ **Solución**: Verifica ALANUBE_COMPANY_ID en configuración

---

## 📞 Soporte

### **Para Usuarios**
1. 📖 **Lee la guía integrada** en cada página de la app
2. 🔍 **Usa el Monitor** para entender qué está pasando
3. 📞 **Contacta a tu administrador** con capturas de pantalla

### **Para Administradores**
1. 🛠️ **Logs del servidor**: Revisa la consola de FastAPI
2. 📡 **Monitor de Alanube**: Ve logs en tiempo real
3. 🔧 **DevTools del navegador**: F12 para errores de frontend

---

## 🎯 Próximos Pasos

Una vez que tengas FacturaPro funcionando:

1. **👥 Capacita a tu equipo** usando esta guía
2. **🔧 Personaliza** colores y textos según tu empresa
3. **📊 Configura reportes** adicionales si los necesitas
4. **🔐 Implementa backup** de la base de datos
5. **🚀 Despliega en producción** cuando estés listo

---

## ✨ ¡Listo para Usar!

FacturaPro está diseñado para ser **intuitivo desde el primer momento**. Cada pantalla incluye guías visuales y tips para que cualquier persona pueda usarlo sin capacitación previa.

**¿Alguna pregunta?** 💬 Revisa los logs del Monitor o contacta al equipo de desarrollo.