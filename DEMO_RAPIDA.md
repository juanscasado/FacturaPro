# 🧪 Demo Rápida de FacturaPro - Prueba en 5 Minutos

## ⚡ Inicio Rápido

### 1. **Arrancar Servidores** (30 segundos)
```bash
# En VSCode, presiona Ctrl+Shift+P
# Escribe: "Tasks: Run Task"
# Selecciona: "Start Both Servers"
```

O manualmente:
```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 2. **Verificar que funciona** (30 segundos)
- ✅ Backend: http://localhost:8000 (debe mostrar página de bienvenida)
- ✅ Frontend: http://localhost:3000 (debe mostrar FacturaPro)

---

## 🎯 Prueba Completa (4 minutos)

### **Paso 1: Crear un Cliente** (1 minuto)
1. Ve a: http://localhost:3000/clients
2. Completa:
   - **Nombre**: "Empresa Demo S.A."
   - **Email**: "demo@empresa.com" 
   - **RNC**: "123456789"
3. Click **"Crear Cliente"**
4. ✅ **Resultado esperado**: Cliente aparece en la lista

### **Paso 2: Crear Factura Local** (1 minuto)
1. Ve a: http://localhost:3000/invoices
2. Completa:
   - **Cliente**: Selecciona "Empresa Demo S.A."
   - **Descripción**: "Desarrollo de sistema de facturación"
   - **Monto**: "25000"
3. Click **"💾 Crear Factura Local"**
4. ✅ **Resultado esperado**: Factura aparece abajo con estado "Emitida"

### **Paso 3: Probar Alanube** (1 minuto)
1. En la misma página de facturas
2. Completa otro formulario:
   - **Cliente**: Mismo cliente
   - **Descripción**: "Prueba de integración Alanube"
   - **Monto**: "1000"
3. Click **"🧾 Enviar a Alanube"**
4. ✅ **Resultado esperado**: 
   - ✅ **Éxito**: Aparece NCF y mensaje verde
   - ❌ **Error**: Mensaje de error específico

### **Paso 4: Monitor en Tiempo Real** (1 minuto)
1. Ve a: http://localhost:3000/monitor
2. Click **"🌐 Test Básico"** 
3. Click **"🔗 Validar Token"**
4. Click **"📄 Factura de Prueba"**
5. ✅ **Resultado esperado**: Logs aparecen en tiempo real mostrando peticiones y respuestas

---

## 🎬 Escenarios de Prueba

### **✅ Todo Funciona Perfectamente**
```
✓ Clientes se crean y listan
✓ Facturas locales se guardan
✓ Alanube responde con NCF
✓ Monitor muestra logs verdes
```

### **⚠️ Alanube no Responde (Normal en desarrollo)**
```
✓ Clientes y facturas locales funcionan
✗ Alanube da error (token, red, etc.)
✓ Monitor muestra error detallado
✓ Sistema sigue funcionando localmente
```

### **❌ Servidores no Arrancan**
```bash
# Backend no arranca
pip install -r requirements.txt
# Verificar puerto 8000 disponible

# Frontend no arranca  
npm install
# Verificar puerto 3000 disponible
```

---

## 📊 Datos de Prueba Rápida

### **Clientes de Prueba**
```
Cliente 1:
- Nombre: "TechCorp RD"
- Email: "admin@techcorp.do"
- RNC: "101234567"

Cliente 2:
- Nombre: "Consultora Digital"
- Email: "info@consultora.com.do"
- RNC: "987654321"
```

### **Facturas de Prueba**
```
Factura 1:
- Descripción: "Desarrollo de aplicación móvil"
- Monto: 45000

Factura 2:
- Descripción: "Mantenimiento servidor por 3 meses"  
- Monto: 18000

Factura 3:
- Descripción: "Consultoría en transformación digital"
- Monto: 75000
```

---

## 🔍 Qué Observar Durante la Demo

### **🎨 Interfaz de Usuario**
- [ ] Navegación fluida entre páginas
- [ ] Guías visuales claras en cada sección  
- [ ] Formularios intuitivos con validaciones
- [ ] Mensajes de éxito/error bien visibles
- [ ] Diseño profesional y cohesivo

### **⚙️ Funcionalidad Backend**
- [ ] Base de datos SQLite funciona
- [ ] APIs REST responden correctamente
- [ ] Tokens JWT se validan bien
- [ ] Logs del servidor son claros

### **🔌 Integración Alanube**
- [ ] Sin errores de CORS o Network
- [ ] Logs en tiempo real funcionan
- [ ] Manejo de errores es robusto
- [ ] Tokens y configuración correctos

### **📱 Experiencia General**
- [ ] Usuario puede completar flujo sin ayuda
- [ ] Errores se explican claramente
- [ ] Performance es buena
- [ ] Sistema es estable

---

## 🚀 Después de la Demo

### **Si todo funciona:**
1. 📖 Entrega la **GUIA_IMPLEMENTACION.md** al cliente
2. 🔧 Personaliza colores/logos según su marca
3. 🔑 Configura sus credenciales reales de Alanube
4. 🚀 Despliega en su servidor de producción

### **Si hay problemas:**
1. 📋 Documenta errores específicos
2. 🔍 Revisa logs del Monitor para detalles
3. 🛠️ Ajusta configuración según el error
4. 🔄 Repite la demo hasta que funcione

---

## 💡 Tips para la Demo

1. **🎯 Enfoque en valor**: Muestra cómo ahorra tiempo vs. proceso manual
2. **📊 Usa datos reales**: Nombres de empresa y montos realistas
3. **🔍 Transparencia**: Muestra el Monitor para que vean "la magia"
4. **⚡ Velocidad**: Demuestra que es más rápido que métodos tradicionales
5. **🛡️ Confiabilidad**: Explica cómo maneja errores y da visibilidad

¡FacturaPro está listo para impresionar! 🎉